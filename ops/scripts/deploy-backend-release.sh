#!/usr/bin/env bash
set -Eeuo pipefail

fail() { printf '%s\n' "$1" >&2; exit 1; }
environment="${DEPLOY_ENV:-}"
case "$environment" in
  staging) expected_branch=staging ;;
  production) expected_branch=master ;;
  *) fail 'DEPLOY_ENV must be staging or production.' ;;
esac
[[ "${GITHUB_REF_NAME:-}" == "$expected_branch" ]] || fail "Backend deployment is allowed only from $expected_branch."
[[ "${GIT_SHA:-}" =~ ^[a-fA-F0-9]{40}$ ]] || fail 'GIT_SHA must be a full commit SHA.'
[[ -n "${BACKUP_VERIFICATION_ID:-}" && "${BACKUP_RESTORABLE:-}" == true ]] || fail 'A verified, restorable database backup is required before migration.'
[[ "${SCHEMA_COMPATIBLE:-}" == true ]] || fail 'Schema compatibility must be confirmed before migration.'
[[ -n "${VPS_HOST:-}" && -n "${VPS_USER:-}" && -n "${VPS_SSH_KEY:-}" && -n "${VPS_KNOWN_HOSTS:-}" ]] || fail 'Configure VPS_HOST, VPS_USER, VPS_SSH_KEY, and VPS_KNOWN_HOSTS in the GitHub Environment.'
[[ "$VPS_HOST" =~ ^[a-zA-Z0-9.-]+$ && "$VPS_USER" =~ ^[a-zA-Z0-9._-]+$ ]] || fail 'VPS_HOST or VPS_USER contains unsupported characters.'

[[ -d back/dist && -f back/dist/main.js && -f back/package-lock.json ]] || fail 'Build back/dist before deployment.'
temporary="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/cod1381-${GIT_SHA}"
mkdir -m 700 -p "$temporary"
cleanup() { rm -rf "$temporary"; }
trap cleanup EXIT
umask 077
printf '%s\n' "$VPS_SSH_KEY" > "$temporary/id_ed25519"
printf '%s\n' "$VPS_KNOWN_HOSTS" > "$temporary/known_hosts"
chmod 600 "$temporary/id_ed25519" "$temporary/known_hosts"
ssh_opts=(-i "$temporary/id_ed25519" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$temporary/known_hosts")
target="${VPS_USER}@${VPS_HOST}"
release="/opt/siscapacitaciones/$environment/releases/$GIT_SHA"
archive="$temporary/backend.tar.gz"
tar -czf "$archive" --exclude=node_modules --exclude=.env -C back .
scp "${ssh_opts[@]}" "$archive" "$target:/tmp/cod1381-backend-${GIT_SHA}.tar.gz"

ssh "${ssh_opts[@]}" "$target" bash -s -- "$environment" "$GIT_SHA" <<'REMOTE_PREPARE'
set -Eeuo pipefail
environment="$1"; sha="$2"
[[ "$environment" =~ ^(staging|production)$ && "$sha" =~ ^[a-fA-F0-9]{40}$ ]] || { echo 'Invalid release identity.' >&2; exit 1; }
release="/opt/siscapacitaciones/$environment/releases/$sha"
[[ ! -e "$release" && ! -L "$release" ]] || { echo 'Backend release path already exists; refusing to replace it.' >&2; exit 1; }
sudo -n install -d -m 0755 "$release"
sudo -n tar -xzf "/tmp/cod1381-backend-${sha}.tar.gz" -C "$release"
sudo -n rm -f "/tmp/cod1381-backend-${sha}.tar.gz"
sudo -n chown -R "$(id -un):$(id -gn)" "$release"
REMOTE_PREPARE

ssh "${ssh_opts[@]}" "$target" "npm --prefix '$release' ci"

rendered="$temporary/runtime.env"
node ops/scripts/render-runtime-env.mjs "$environment" > "$rendered"
ssh "${ssh_opts[@]}" "$target" "cd '$release' && sudo -n env PATH=\"\$PATH\" npm run deploy:install-runtime -- '$environment'" < "$rendered"

ssh "${ssh_opts[@]}" "$target" bash -s -- "$environment" "$expected_branch" "$release" "$GIT_SHA" "$BACKUP_VERIFICATION_ID" <<'REMOTE_DEPLOY'
set -Eeuo pipefail
environment="$1"; branch="$2"; release="$3"; sha="$4"; backup_id="$5"
[[ "$release" == "/opt/siscapacitaciones/$environment/releases/$sha" ]] || { echo 'Invalid release path.' >&2; exit 1; }
sudo -n env PATH="$PATH" GIT_SHA="$sha" BACKUP_VERIFICATION_ID="$backup_id" BACKUP_RESTORABLE=true SCHEMA_COMPATIBLE=true npm --prefix "$release" run deploy:environment -- "$environment" "$branch" "$release"
sudo -n env PATH="$PATH" npm --prefix "$release" run deploy:health-check -- "$environment"
REMOTE_DEPLOY

echo "Published backend $environment release $GIT_SHA."
