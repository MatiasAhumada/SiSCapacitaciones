#!/usr/bin/env bash
set -Eeuo pipefail
fail() { printf '%s\n' "$1" >&2; exit 1; }
[[ "$GITHUB_REF_NAME" == master ]] || fail 'Production static deployment is allowed only from master.'
[[ "$GIT_SHA" =~ ^[a-fA-F0-9]{40}$ ]] || fail 'GIT_SHA must be a full commit SHA.'
[[ -n "$VPS_HOST" && -n "$VPS_USER" && -n "$VPS_SSH_KEY" && -n "$VPS_KNOWN_HOSTS" ]] || fail 'Configure VPS_HOST, VPS_USER, VPS_SSH_KEY, and VPS_KNOWN_HOSTS in GitHub Environment production.'
[[ "$FRONTEND_URL" == https://siscapacitaciones.net && "$TITULOS_URL" == https://certificacionnacional.org ]] || fail 'Production URLs do not match the approved contract.'
[[ -f front/dist/index.html && -f titulos/dist/index.html ]] || fail 'Build both production static applications before deployment.'
tmp="$RUNNER_TEMP/cod1381-static-$GIT_SHA"
mkdir -m 700 -p "$tmp/package/frontend" "$tmp/package/titles"
cleanup() { rm -rf "$tmp"; }
trap cleanup EXIT
umask 077
printf '%s\n' "$VPS_SSH_KEY" > "$tmp/id_ed25519"
printf '%s\n' "$VPS_KNOWN_HOSTS" > "$tmp/known_hosts"
chmod 600 "$tmp/id_ed25519" "$tmp/known_hosts"
ssh_opts=(-i "$tmp/id_ed25519" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$tmp/known_hosts")
target="$VPS_USER@$VPS_HOST"
cp -a front/dist/. "$tmp/package/frontend/"
cp -a titulos/dist/. "$tmp/package/titles/"
printf '{"environment":"production","commit":"%s"}\n' "$GIT_SHA" > "$tmp/package/frontend/deployment.json"
printf '{"environment":"production","commit":"%s"}\n' "$GIT_SHA" > "$tmp/package/titles/deployment.json"
tar -czf "$tmp/frontend.tar.gz" -C "$tmp/package/frontend" .
tar -czf "$tmp/titles.tar.gz" -C "$tmp/package/titles" .
scp "${ssh_opts[@]}" "$tmp/frontend.tar.gz" "$target:/tmp/cod1381-frontend-$GIT_SHA.tar.gz"
scp "${ssh_opts[@]}" "$tmp/titles.tar.gz" "$target:/tmp/cod1381-titles-$GIT_SHA.tar.gz"
ssh "${ssh_opts[@]}" "$target" bash -s -- "$GIT_SHA" <<'REMOTE'
set -Eeuo pipefail
sha="$1"
frontend=/var/www/siscapacitaciones
titles=/var/www/titulos
frontend_release=/var/www/siscapacitaciones-releases/$sha
titles_release=/var/www/titulos-releases/$sha
frontend_archive=/tmp/cod1381-frontend-$sha.tar.gz
titles_archive=/tmp/cod1381-titles-$sha.tar.gz
[[ ! -e "$frontend_release" && ! -L "$frontend_release" && ! -e "$titles_release" && ! -L "$titles_release" ]] || { echo 'Production static release already exists; refusing to replace it.' >&2; exit 1; }
sudo -n install -d -m 0755 "$frontend_release" "$titles_release"
sudo -n tar -xzf "$frontend_archive" -C "$frontend_release"
sudo -n tar -xzf "$titles_archive" -C "$titles_release"
sudo -n rm -f "$frontend_archive" "$titles_archive"
sudo -n chown -R root:root "$frontend_release" "$titles_release"
[[ -f "$frontend_release/index.html" && -f "$titles_release/index.html" ]] || { echo 'Static release is incomplete.' >&2; exit 1; }
frontend_backup=$frontend.rollback-$sha
titles_backup=$titles.rollback-$sha
[[ ! -e "$frontend_backup" && ! -L "$frontend_backup" && ! -e "$titles_backup" && ! -L "$titles_backup" ]] || { echo 'Rollback path already exists.' >&2; exit 1; }
[[ -e "$frontend" || -L "$frontend" ]] || { echo 'Previous production frontend root is required for rollback.' >&2; exit 1; }
[[ -e "$titles" || -L "$titles" ]] || { echo 'Previous production titles root is required for rollback.' >&2; exit 1; }
frontend_moved=0
titles_moved=0
rollback() {
  status=$?
  if [[ "$status" -ne 0 ]]; then
    sudo -n rm -f "$frontend.next-$sha" "$titles.next-$sha"
    if [[ "$frontend_moved" == 1 ]]; then sudo -n rm -f "$frontend"; sudo -n mv -Tf "$frontend_backup" "$frontend"; fi
    if [[ "$titles_moved" == 1 ]]; then sudo -n rm -f "$titles"; sudo -n mv -Tf "$titles_backup" "$titles"; fi
    echo 'Static deploy failed; previous roots restored.' >&2
  fi
  exit "$status"
}
trap rollback EXIT
sudo -n mv -T "$frontend" "$frontend_backup"
frontend_moved=1
sudo -n mv -T "$titles" "$titles_backup"
titles_moved=1
sudo -n ln -s "$frontend_release" "$frontend.next-$sha"
sudo -n ln -s "$titles_release" "$titles.next-$sha"
sudo -n mv -Tf "$frontend.next-$sha" "$frontend"
sudo -n mv -Tf "$titles.next-$sha" "$titles"
curl --fail --silent --show-error --max-time 12 --resolve siscapacitaciones.net:443:127.0.0.1 https://siscapacitaciones.net/deployment.json | grep -F "$sha" >/dev/null
curl --fail --silent --show-error --max-time 12 --resolve certificacionnacional.org:443:127.0.0.1 https://certificacionnacional.org/deployment.json | grep -F "$sha" >/dev/null
curl --fail --silent --show-error --max-time 12 --resolve siscapacitaciones.net:443:127.0.0.1 https://siscapacitaciones.net/admin/alumnos | grep -F '<div id="root">' >/dev/null
curl --fail --silent --show-error --max-time 12 --resolve siscapacitaciones.net:443:127.0.0.1 https://siscapacitaciones.net/vendedor/inscripciones | grep -F '<div id="root">' >/dev/null
trap - EXIT
REMOTE
verify_public() { curl --fail --silent --show-error --max-time 20 "$1/deployment.json" | grep -F "$GIT_SHA" >/dev/null; }
if ! verify_public "$FRONTEND_URL" || ! verify_public "$TITULOS_URL"; then
  ssh "${ssh_opts[@]}" "$target" bash -s -- "$GIT_SHA" <<'ROLLBACK'
set -Eeuo pipefail
sha="$1"
for root in /var/www/siscapacitaciones /var/www/titulos; do
  backup=$root.rollback-$sha
  sudo -n rm -f "$root"
  if [[ -e "$backup" || -L "$backup" ]]; then sudo -n mv -Tf "$backup" "$root"; fi
done
ROLLBACK
  fail 'Public production static checks failed; previous roots were restored.'
fi
echo "Published production frontend and titles $GIT_SHA."
