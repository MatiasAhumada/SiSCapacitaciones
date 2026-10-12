#!/usr/bin/env bash
set -Eeuo pipefail

fail() { printf '%s\n' "$1" >&2; exit 1; }
required=(VPS_HOST VPS_USER VPS_PASSWORD VPS_KNOWN_HOSTS FRONTEND_URL VITE_APP_URL GIT_SHA)
for name in "${required[@]}"; do
  [[ -n "${!name:-}" ]] || fail "Missing required staging deployment value: ${name}. Configure it in GitHub Environment staging."
done
[[ "$VPS_HOST" =~ ^[a-zA-Z0-9.-]+$ ]] || fail 'VPS_HOST must be a hostname or IPv4 address without a port.'
[[ "$VPS_USER" =~ ^[a-zA-Z0-9._-]+$ ]] || fail 'VPS_USER contains unsupported characters.'
[[ "${GITHUB_REF_NAME:-}" == staging ]] || fail 'Frontend staging deployment is allowed only from the staging branch.'
[[ "$GIT_SHA" =~ ^[a-fA-F0-9]{40}$ ]] || fail 'GIT_SHA must be a full commit SHA.'
[[ -d front/dist && -f front/dist/index.html ]] || fail 'Build front/dist before deployment.'
[[ -f ops/nginx/siscapacitaciones-staging.conf ]] || fail 'Render the staging Nginx configuration before deployment.'

frontend_host="$(node -p 'new URL(process.argv[1]).hostname' "$FRONTEND_URL")" || fail 'FRONTEND_URL must be an absolute URL.'
api_host="$(node -p 'new URL(process.argv[1]).hostname' "$VITE_APP_URL")" || fail 'VITE_APP_URL must be an absolute URL.'
[[ "$FRONTEND_URL" == https://* && "$VITE_APP_URL" == https://* ]] || fail 'Staging URLs must use HTTPS.'
[[ "$frontend_host" != "$api_host" ]] || fail 'Staging frontend and API must use separate hostnames.'
case "$frontend_host $api_host" in
    *siscapacitaciones.net*|*certificacionnacional.org*)
    [[ "$frontend_host" != siscapacitaciones.net && "$frontend_host" != www.siscapacitaciones.net && "$frontend_host" != certificacionnacional.org && "$frontend_host" != www.certificacionnacional.org && "$api_host" != siscapacitaciones.net && "$api_host" != www.siscapacitaciones.net && "$api_host" != certificacionnacional.org && "$api_host" != www.certificacionnacional.org ]] || fail 'Staging URLs cannot use a production hostname.'
    ;;
esac

ssh_dir="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/cod1380-ssh"
mkdir -p "$ssh_dir"
chmod 700 "$ssh_dir"
cleanup() { rm -rf "$ssh_dir"; unset SSHPASS; }
trap cleanup EXIT
printf '%s\n' "$VPS_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
chmod 600 "$ssh_dir/known_hosts"
command -v sshpass >/dev/null || fail 'sshpass is required for password-based SSH deployment.'
export SSHPASS="$VPS_PASSWORD"
ssh_opts=(-o BatchMode=no -o PreferredAuthentications=password,keyboard-interactive -o PubkeyAuthentication=no -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$ssh_dir/known_hosts")
ssh_run() { sshpass -e ssh "${ssh_opts[@]}" "$@"; }
target="${VPS_USER}@${VPS_HOST}"
release="/var/www/siscapacitaciones-staging/releases/${GIT_SHA}"
remote_config="/tmp/siscapacitaciones-staging-${GIT_SHA}.conf"

ssh_run "$target" bash -s -- "$release" <<'REMOTE_PREPARE'
set -Eeuo pipefail
release="$1"
[[ "$release" =~ ^/var/www/siscapacitaciones-staging/releases/[a-fA-F0-9]{40}$ ]] || { echo 'Invalid staging release path.' >&2; exit 1; }
if [[ -L /var/www/siscapacitaciones-staging/current ]] && [[ "$(readlink -f /var/www/siscapacitaciones-staging/current)" == "$release" ]]; then
  echo 'This staging commit is already active; create a new commit to publish changed files.' >&2
  exit 1
fi
sudo -n install -d -m 0755 "$release"
sudo -n chown "$(id -un):$(id -gn)" "$release"
REMOTE_PREPARE

rsync_ssh="sshpass -e ssh -o BatchMode=no -o PreferredAuthentications=password,keyboard-interactive -o PubkeyAuthentication=no -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$ssh_dir/known_hosts"
RSYNC_RSH="$rsync_ssh" rsync -az --delete --safe-links front/dist/ "$target:$release/"
ssh_run "$target" chmod -R a+rX "$release"
sshpass -e scp "${ssh_opts[@]}" ops/nginx/siscapacitaciones-staging.conf "$target:$remote_config"

ssh_run "$target" bash -s -- "$GIT_SHA" "$frontend_host" "$api_host" "$release" "$remote_config" <<'REMOTE_DEPLOY'
set -Eeuo pipefail
sha="$1"; frontend_host="$2"; api_host="$3"; release="$4"; candidate="$5"
[[ "$sha" =~ ^[a-fA-F0-9]{40}$ ]] || { echo 'Invalid deployment SHA.' >&2; exit 1; }
[[ "$frontend_host" =~ ^[a-zA-Z0-9.-]+$ && "$api_host" =~ ^[a-zA-Z0-9.-]+$ ]] || { echo 'Invalid staging hostname.' >&2; exit 1; }
[[ "$release" == "/var/www/siscapacitaciones-staging/releases/$sha" && -f "$release/index.html" ]] || { echo 'Staging release is incomplete.' >&2; exit 1; }
[[ -f "$candidate" ]] || { echo 'Staging Nginx candidate is missing.' >&2; exit 1; }
sudo -n nginx -v >/dev/null 2>&1 || { echo 'Nginx is not installed or unavailable to VPS_USER through sudo.' >&2; exit 1; }
command -v curl >/dev/null || { echo 'curl is required on the VPS for staging checks.' >&2; exit 1; }
sudo -n test -r "/etc/letsencrypt/live/$frontend_host/fullchain.pem" && sudo -n test -r "/etc/letsencrypt/live/$frontend_host/privkey.pem" || { echo "TLS certificate for $frontend_host is missing or unreadable; production was not changed." >&2; exit 1; }
sudo -n test -r "/etc/letsencrypt/live/$api_host/fullchain.pem" && sudo -n test -r "/etc/letsencrypt/live/$api_host/privkey.pem" || { echo "TLS certificate for $api_host is missing or unreadable; production was not changed." >&2; exit 1; }

site=/etc/nginx/sites-available/siscapacitaciones-staging.conf
enabled=/etc/nginx/sites-enabled/siscapacitaciones-staging.conf
root=/var/www/siscapacitaciones-staging
current="$root/current"
candidate_site="$site.candidate-$sha"
old_site="$site.rollback-$sha"
old_pointer="$root/current.before-$sha"
old_target=''
old_config=0
[[ -L "$current" ]] && old_target="$(readlink -f "$current")"
[[ -f "$site" ]] && old_config=1

sudo -n rm -f "$old_site" "$old_pointer"
if [[ -n "$old_target" ]]; then sudo -n ln -sfn "$old_target" "$old_pointer"; fi
if [[ "$old_config" == 1 ]]; then sudo -n cp -p "$site" "$old_site"; fi
rollback() {
  status=$?
  if [[ "$status" -ne 0 ]]; then
    if [[ -n "$old_target" ]]; then sudo -n ln -sfn "$old_target" "$root/current.rollback-$sha" && sudo -n mv -Tf "$root/current.rollback-$sha" "$current"; else sudo -n rm -f "$current"; fi
    if [[ "$old_config" == 1 ]]; then sudo -n mv -f "$old_site" "$site"; else sudo -n rm -f "$site" "$enabled"; fi
    sudo -n nginx -t && sudo -n systemctl reload nginx || true
    echo 'Staging publish failed; the previous staging release/configuration was restored. Production paths were not touched.' >&2
  fi
  if [[ "$status" -ne 0 ]]; then sudo -n rm -f "$old_pointer"; fi
  rm -f "$candidate" "$root/current.next-$sha" "$root/current.rollback-$sha"
  exit "$status"
}
trap rollback EXIT
sudo -n install -o root -g root -m 0644 "$candidate" "$candidate_site"
sudo -n mv -f "$candidate_site" "$site"
sudo -n ln -sfn "$site" "$enabled"
sudo -n nginx -t

next="$root/current.next-$sha"
sudo -n ln -s "$release" "$next"
sudo -n mv -Tf "$next" "$current"
sudo -n systemctl reload nginx
curl --fail --silent --show-error --max-time 12 --resolve "$frontend_host:443:127.0.0.1" "https://$frontend_host/health" | grep -F "$sha" >/dev/null
curl --fail --silent --show-error --max-time 12 --resolve "$api_host:443:127.0.0.1" "https://$api_host/backend/health" | grep -F '"environment":"staging"' >/dev/null
index="$(curl --fail --silent --show-error --max-time 12 --resolve "$frontend_host:443:127.0.0.1" "https://$frontend_host/")"
grep -Eo 'src="[^"]+\.js"' <<<"$index" | head -1 | cut -d '"' -f2 | while IFS= read -r asset; do
  curl --fail --silent --show-error --max-time 12 --resolve "$frontend_host:443:127.0.0.1" "https://$frontend_host$asset" >/dev/null
done
trap - EXIT
rm -f "$candidate"
echo "Staging frontend $sha is live; frontend assets and API 4043 proxy responded over HTTPS."
REMOTE_DEPLOY

if ! node ops/scripts/verify-staging-frontend.mjs "$FRONTEND_URL" "$VITE_APP_URL" "$GIT_SHA"; then
  ssh_run "$target" bash -s -- "$GIT_SHA" <<'REMOTE_ROLLBACK'
set -Eeuo pipefail
sha="$1"
[[ "$sha" =~ ^[a-fA-F0-9]{40}$ ]] || { echo 'Invalid rollback SHA.' >&2; exit 1; }
root=/var/www/siscapacitaciones-staging
site=/etc/nginx/sites-available/siscapacitaciones-staging.conf
enabled=/etc/nginx/sites-enabled/siscapacitaciones-staging.conf
old_site="$site.rollback-$sha"
old_pointer="$root/current.before-$sha"
if [[ -L "$old_pointer" ]]; then
  sudo -n mv -Tf "$old_pointer" "$root/current"
else
  sudo -n rm -f "$root/current"
fi
if [[ -f "$old_site" ]]; then
  sudo -n mv -f "$old_site" "$site"
else
  sudo -n rm -f "$site" "$enabled"
fi
sudo -n nginx -t
sudo -n systemctl reload nginx
echo 'Previous staging release and Nginx configuration restored.'
REMOTE_ROLLBACK
  fail 'Public DNS/TLS/HTTP verification failed; the previous staging release and Nginx configuration were restored.'
fi

ssh_run "$target" bash -s -- "$GIT_SHA" <<'REMOTE_CONFIRM'
set -Eeuo pipefail
sha="$1"
root=/var/www/siscapacitaciones-staging
site=/etc/nginx/sites-available/siscapacitaciones-staging.conf
sudo -n rm -f "$root/current.before-$sha" "$site.rollback-$sha"
REMOTE_CONFIRM

echo "Published staging frontend $GIT_SHA ($frontend_host; API host $api_host)."
