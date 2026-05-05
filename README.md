- Mapbox Studio で作成した地図タイルを Kepler.gl や Foursquare Studio で用いる
  - https://visualizing.jp/mapbox-studio-issue/


npm run dev: ローカル開発サーバーを起動します。
npm run build: /dist に本番用ファイルを生成します。Netlify は GitHub への push を契機にこのコマンドを実行してデプロイします。

Netlify 設定:
- Build command: `npm run build`
- Publish directory: `dist`
- Custom domain は Netlify 側で設定します。GitHub Pages 用の `CNAME` は使いません。

http://localhost:5179/?auth_debug
