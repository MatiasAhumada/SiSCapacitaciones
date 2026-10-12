#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <staging|production>" >&2
  exit 2
fi

target_environment="$1"
case "$target_environment" in
  staging)
    expected_environment=staging
    expected_port=4043
    other_environment=production
    other_port=4040
    ;;
  production)
    expected_environment=production
    expected_port=4040
    other_environment=staging
    other_port=4043
    ;;
  *)
    echo "Environment must be staging or production." >&2
    exit 2
    ;;
esac

check_health() {
  local environment="$1"
  local port="$2"
  local response

  response="$(curl --fail --silent --show-error --max-time 8 "http://127.0.0.1:${port}/health")" || {
    echo "${environment} health check failed on port ${port}." >&2
    return 1
  }

  printf '%s' "$response" | node -e '
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => input += chunk);
    process.stdin.on("end", () => {
      try {
        const health = JSON.parse(input);
        const expected = process.argv[1];
        if (health.status !== "ok" || health.environment !== expected || !health.commit) {
          throw new Error("unexpected health response");
        }
        process.stdout.write(`${health.environment} healthy (${health.commit})\n`);
      } catch {
        process.stderr.write(`${process.argv[1]} returned an invalid health response.\n`);
        process.exitCode = 1;
      }
    });
  ' "$environment"
}

check_health "$expected_environment" "$expected_port"
check_health "$other_environment" "$other_port"
