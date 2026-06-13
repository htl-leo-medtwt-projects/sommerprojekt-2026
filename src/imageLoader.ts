const cache = new Map<string, HTMLImageElement>()
const pending = new Map<string, Promise<HTMLImageElement>>()

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = cache.get(src)
  if (cached) return Promise.resolve(cached)
  const existing = pending.get(src)
  if (existing) return existing

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      cache.set(src, img)
      pending.delete(src)
      resolve(img)
    }
    img.onerror = () => {
      pending.delete(src)
      reject(new Error(`Failed to load: ${src}`))
    }
    img.src = encodePath(src)
  })

  pending.set(src, promise)
  return promise
}

export function getImage(src: string): HTMLImageElement | null {
  return cache.get(src) ?? null
}

export async function preloadAll(srcs: string[]): Promise<void> {
  await Promise.allSettled(srcs.map(loadImage))
}

function encodePath(src: string): string {
  return src.split('/').map(s => encodeURIComponent(s)).join('/')
}
