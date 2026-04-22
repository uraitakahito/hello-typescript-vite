## Development

Assumes the host is macOS with Docker Desktop.

### 1. Download the Dockerfile and entrypoint

```sh
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.5/Dockerfile.dev
curl -L -O https://raw.githubusercontent.com/uraitakahito/hello-javascript/refs/tags/1.2.5/docker-entrypoint.sh
chmod 755 docker-entrypoint.sh
```

### 2. Build the image

```sh
PROJECT=$(basename `pwd`) && docker image build -f Dockerfile.dev -t $PROJECT-image . --build-arg TZ=Asia/Tokyo --build-arg user_id=`id -u` --build-arg group_id=`id -g`
```

### 3. (First time only) Create a volume for shell history

```sh
docker volume create $PROJECT-zsh-history
```

### 4. Start the container

`-p 5173:5173` publishes the Vite dev server port so the page is reachable from the host. The `ssh-auth.sock` mount is the Docker Desktop for Mac virtual socket used to forward the host ssh-agent.

```sh
docker container run -d --rm --init -p 5173:5173 -v /run/host-services/ssh-auth.sock:/run/host-services/ssh-auth.sock -e SSH_AUTH_SOCK=/run/host-services/ssh-auth.sock -e GH_TOKEN=$(gh auth token) --mount type=bind,src=`pwd`,dst=/app --mount type=volume,source=$PROJECT-zsh-history,target=/zsh-volume --name $PROJECT-container $PROJECT-image
```

### 5. Attach to the container via VS Code

1. Open **Command Palette** (Shift + Command + P)
2. Select **Dev Containers: Attach to Running Container**
3. Open the `/app` directory

See the [VS Code documentation](https://code.visualstudio.com/docs/devcontainers/attach-container#_attach-to-a-docker-container) for details.

### 6. (First time only) Fix history volume ownership

Inside the container:

```sh
sudo chown -R $(id -u):$(id -g) /zsh-volume
```

### 7. Install dependencies and start the dev server

Inside the container:

```sh
npm ci
npm run dev
```

Open http://localhost:5173/ on the host to see the main page, and http://localhost:5173/src/hoge.html for the `hoge` entry.

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
