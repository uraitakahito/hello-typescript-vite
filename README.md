```console
% vite build
% docker run -d --init --rm -p 8080:80 --mount type=bind,src=`pwd`/dist,dst=/usr/share/nginx/html --name nginx-container nginx
```

Go to http://localhost:8080 and you should see the app running.

## NOTE

### The process of generating files with `npm create vite@latest`

1. [lib/cli](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/cli/entry.js) is called
2. The `deref` method resolves that `create` is an alias for `init` [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/npm.js#L22)
3. [lib/commands/init.js](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/commands/init.js) is called [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/npm.js#L21-L30)
4. The `execCreate` method sets the `packageName` to `create-vite@latest` [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/lib/commands/init.js#L115)
5. A folder named `1415fee72ff6294b` is generated from `crypto.createHash('sha512').update('create-vite@latest').digest('hex').slice(0, 16)` [cf.](https://github.com/npm/cli/blob/6995303687ab59541b727bf611f73624d1829b6c/workspaces/libnpmexec/lib/index.js#L229-L242) You can check the installation location with `npm config set cache`
6. The execution environment is set with `@npmcli/run-script` [cf.](https://github.com/npm/run-script/blob/ee922731fca64b9d403f8912114d2f5821c21408/lib/make-spawn-args.js#L6-L38)
7. `create-vite` located in `~/.npm/_npx/1415fee72ff6294b/node_modules/.bin` is executed by [@npmcli/promiseSpawn](https://github.com/npm/promise-spawn/blob/81de91de507d73e69813a96091ce9fdcd64dece7/lib/index.js#L10)
