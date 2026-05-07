## Development

Assumes the host is macOS with Docker Desktop.

### 1. Run setup (first time / after `hello-javascript` tag bump)

```sh
./setup.sh
```

Fetches `Dockerfile.dev` and `docker-entrypoint.sh` from `uraitakahito/hello-javascript@1.2.9` and writes a local `.env` (`USER_ID` / `GROUP_ID` / `TZ`).

### 2. Start the dev stack

```sh
GH_TOKEN=$(gh auth token) docker compose -f compose.dev.yaml up -d --build
```

`GH_TOKEN` is intentionally not stored in `.env`; pass it via prefix every time. Omitting it just leaves `gh` / Claude Code unauthenticated inside the container.

### 3. Attach to the container

Either attach VS Code via **Command Palette → "Dev Containers: Attach to Running Container"** → pick `hello-typescript-vite-container` → open `/app`, or use a shell:

```sh
docker exec -it hello-typescript-vite-container zsh
```

### 4. (First time only) Fix history volume ownership

Inside the container:

```sh
sudo chown -R $(id -u):$(id -g) /zsh-volume
```

### 5. Install dependencies and start the dev server

Inside the container:

```sh
npm ci
npm run dev
```

Open http://localhost:5173/ on the host to see the main page, and http://localhost:5173/src/hoge.html for the `hoge` entry.

### Stop

```sh
docker compose -f compose.dev.yaml down
```

## Lint

```console
npm run lint       # ESLint (flat config)
npm run html:lint  # markuplint for HTML files
```

## Production (Docker)

Build and run the static site via nginx.

```console
PROJECT=$(basename `pwd`)
docker image build -f Dockerfile.prod -t ${PROJECT}-prod-image .
docker container run --rm -p 8080:80 --name ${PROJECT}-prod-container ${PROJECT}-prod-image
```

Open http://localhost:8080.

See `Dockerfile.prod` header for details.

## NOTE

### The process of generating files with `npm create vite@latest`

1. [lib/cli](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/cli/entry.js) is called
2. The `deref` method resolves that `create` is an alias for `init` [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/npm.js#L22)
3. [lib/commands/init.js](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/commands/init.js) is called [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/npm.js#L21-L30)
4. The `execCreate` method sets the `packageName` to `create-vite@latest` [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/commands/init.js#L115)
5. A folder named `1415fee72ff6294b` is generated from `crypto.createHash('sha512').update('create-vite@latest').digest('hex').slice(0, 16)` [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/workspaces/libnpmexec/lib/index.js#L229-L242) You can check the installation location with `npm config set cache`
6. The execution environment is set with `@npmcli/run-script` [cf.](https://github.com/npm/run-script/blob/ee922731fca64b9d403f8912114d2f5821c21408/lib/make-spawn-args.js#L6-L38)
7. `create-vite` located in `~/.npm/_npx/1415fee72ff6294b/node_modules/.bin` is executed by [@npmcli/promiseSpawn](https://github.com/npm/promise-spawn/blob/81de91de507d73e69813a96091ce9fdcd64dece7/lib/index.js#L10)
