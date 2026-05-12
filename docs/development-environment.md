# Development Environment

Assumes the host is macOS with Docker Desktop.

## Start the dev stack

```sh
GH_TOKEN=$(gh auth token) docker compose -f compose.dev.yaml up -d --build
```

## Attach to the container

Either attach VS Code via **Command Palette → "Dev Containers: Attach to Running Container"** → pick `hello-typescript-vite-container` → open `/app`, or use a shell:

```sh
docker exec -it hello-typescript-vite-container zsh
```

## (First time only) Fix history volume ownership

Inside the container:

```sh
sudo chown -R $(id -u):$(id -g) /zsh-volume
```

## Install dependencies and start the dev server

Inside the container:

```sh
npm ci
npm run dev
```

Open <http://localhost:5173/> on the host to see the main page, and <http://localhost:5173/src/hoge.html> for the `hoge` entry.

## Stop

```sh
docker compose -f compose.dev.yaml down
```
