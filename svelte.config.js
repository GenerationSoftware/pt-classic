import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import reactPreprocess from 'svelte-preprocess-react/preprocessReact'
import adapter from 'sveltejs-adapter-ipfs'
// import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess(), reactPreprocess()],
  kit: {
    adapter: adapter({
      ipfsFixDisabled: false
    })
  }
}

export default config
