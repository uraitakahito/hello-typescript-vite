import { defineConfig } from 'vite';

const config = defineConfig({
  // Docker コンテナ内で dev server を起動し、host 側ブラウザから
  // `http://localhost:5173/` で到達できるようにするための設定ブロック。
  // 3 つとも必要で、抜けると以下のように壊れる。
  //
  // - host: true
  //   Vite のデフォルトは 127.0.0.1 のみに bind する。コンテナ内の
  //   127.0.0.1 はコンテナ自身の loopback で、`docker run -p 5173:5173`
  //   の port publish が繋がる経路(外向きインターフェース)とは別物。
  //   0.0.0.0 に bind しないと host から Connection refused になる。必須。
  //
  // - strictPort: true
  //   Vite は port 占有時にデフォルトで 5174, 5175 … と黙って逃げる。
  //   `docker run -p 5173:5173` は host 5173 ← コンテナ 5173 の静的な
  //   紐付けなので、Vite が別 port に逃げると host 5173 は空を指す状態
  //   になり、エラーも出ずに「繋がらない」だけでハマる。占有時に
  //   即 fail させて検知できるようにする保険。
  //
  // - port: 5173
  //   Vite のデフォルトと同値なので挙動としては省略可能だが、README /
  //   `docker run -p` 側と port 番号の意図を一致させるために明示。
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        hoge: 'src/hoge.html',
      },
      // https://github.com/vitejs/vite/issues/378#issuecomment-789366197
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    minify: false,
  },
});

export default config;
