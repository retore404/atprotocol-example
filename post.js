//AtpApi
import AtpApi from '@atproto/api'
const { BskyAgent } = AtpApi

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

// 書き込み
await agent.post({
  $type: "app.bsky.feed.post",
  text: "test",
});
