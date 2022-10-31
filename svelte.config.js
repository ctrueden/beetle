import adapter from '@sveltejs/adapter-node'
import * as dotenv from 'dotenv'
dotenv.config()

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    env: {
      dir: process.cwd(),
      publicPrefix: 'BEETLE_'
    },
    paths: {
      base: process.env.BEETLE_BASE
    }
  }
}

export default config
