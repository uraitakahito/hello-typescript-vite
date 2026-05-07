#!/bin/bash
set -euo pipefail

HELLO_JS_TAG="1.2.9"
BASE_URL="https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/${HELLO_JS_TAG}"

echo "==> Fetching Dockerfile.dev and docker-entrypoint.sh from hello-javascript@${HELLO_JS_TAG}"
curl -LfsS -o Dockerfile.dev "${BASE_URL}/Dockerfile.dev"
curl -LfsS -o docker-entrypoint.sh "${BASE_URL}/docker-entrypoint.sh"
chmod 755 docker-entrypoint.sh

echo "==> Generating .env"
cat > .env <<EOF
USER_ID=$(id -u)
GROUP_ID=$(id -g)
TZ=Asia/Tokyo
EOF

cat <<'EOF'

==> Done.

Next:
  GH_TOKEN=$(gh auth token) docker compose -f compose.dev.yaml up -d --build

Then attach VSCode to "hello-typescript-vite-container", or:
  docker exec -it hello-typescript-vite-container zsh
EOF
