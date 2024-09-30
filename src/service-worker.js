/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker'

const cacheId = `ptc-cache-${version}`
const assets = [...build, ...files.filter(f => !f.startsWith('/.'))]

self.addEventListener('install', (event) => {
  // create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(cacheId)
    await cache.addAll(assets)
  }

  event.waitUntil(addFilesToCache())
})

self.addEventListener('activate', (event) => {
  // remove previous cached data from disk
  const clearCache = async () => {
    for (const key of await caches.keys()) {
      if (key !== cacheId) await caches.delete(key)
    }
  }

  event.waitUntil(clearCache())
})

self.addEventListener('fetch', (event) => {
  // ignore POST requests, etc.
  if (event.request.method !== 'GET') return

  const response = async () => {
    const url = new URL(event.request.url)
    const cache = await caches.open(cacheId)

    // build/files can always be served from the cache
    if (assets.includes(url.pathname)) {
      const cachedResponse = await cache.match(url.pathname)

      if (cachedResponse) {
        return cachedResponse
      }
    }

    // fetch everything else normally
    return await fetch(event.request)
  }

  event.respondWith(response())
})
