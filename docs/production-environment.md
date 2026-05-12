# Production Environment

`compose.prod.yaml` builds the Vite app via a multi-stage Docker build and serves the static output through `nginx:alpine`. The container runs read-only (with `tmpfs` mounts for `/var/cache/nginx` and `/var/run`), is health-probed via `wget --spider`, and uses `restart: unless-stopped`.

```sh
docker compose -f compose.prod.yaml up -d --build

# verify
curl -fsSI http://localhost:8080/
```

Open <http://localhost:8080/> for the main entry and <http://localhost:8080/src/hoge.html> for the `hoge` entry.

Stop with:

```sh
docker compose -f compose.prod.yaml down
```

To build the production image standalone (e.g. to push to a registry):

```sh
docker build -f Dockerfile.prod -t hello-typescript-vite:<version> .
```
