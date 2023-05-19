//AtpApi
import AtpApi from '@atproto/api'
import ogs from 'open-graph-scraper'
import sharp from 'sharp'
const { BskyAgent, RichText } = AtpApi

// require/dotenv
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// dotenv読み込み
require('dotenv').config();
const IDENTIFIER = process.env.IDENTIFIER
const PASSWORD = process.env.PASSWORD

// Bluesky Socialへのログイン
const agent = new BskyAgent({ service: "https://bsky.social" })
await agent.login({ identifier: IDENTIFIER, password: PASSWORD })

// 書き込む内容
const body = "Hello Bluesky"
const url = "https://photo.retore.jp/article/the-nekura-book-22/"
const text = body + "\n" + url
const rt = new RichText({ text });
await rt.detectFacets(agent);

// og:imageの取得
const ogsResult = await ogs({ url });
console.log(ogsResult.result);
const ogImageResponse = await fetch(ogsResult.result.ogImage[0].url);
const buffer = await ogImageResponse.arrayBuffer();
const compressedImage = await sharp(buffer)
  .resize(800, null, {
    fit: "inside",
    withoutEnlargement: true,
  })
  .jpeg({
    quality: 80,
    progressive: true,
  })
  .toBuffer();
//console.log(new Uint8Array(compressedImage));

// og:imageをBlueskyにアップロード
const encoding = "image/jpeg"
const uploadBlobResponse = await agent.uploadBlob(new Uint8Array(compressedImage),  {
  encoding,
});
//console.log(uploadBlobResponse);
console.log(uploadBlobResponse.data.blob.ref.toString())

// アップロードした情報からリンクカードに埋め込む情報を取得しpostに埋め込む
const embed= {
  $type: "app.bsky.embed.external",
  external: {
    uri: url,
    thumb: {
      $type: "blob",
      ref: {
        $link: uploadBlobResponse.data.blob.ref.toString(),
      },
      mimeType: uploadBlobResponse.data.blob.mimeType,
      size: uploadBlobResponse.data.blob.size,
    },
    title: ogsResult.result.ogTitle,
    description: ogsResult.result.ogDescription,
  }
};

 // 書き込み
 await agent.post({
   $type: "app.bsky.feed.post",
   text: rt.text,
   facets: rt.facets,
   embed: embed,
 });

