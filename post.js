//AtpApi
import AtpApi from '@atproto/api'
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
const text = "https://github.com/retore404"
const rt = new RichText({ text });
await rt.detectFacets(agent);

// 書き込み
await agent.post({
  $type: "app.bsky.feed.post",
  text: rt.text,
  facets: rt.facets,
});
