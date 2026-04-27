import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createReadStream, existsSync, statSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectAssetsDir = path.resolve(__dirname, '../project/assets')

export default defineConfig({
  plugins: [
    {
      name: 'project-assets',
      configureServer(server) {
        server.middlewares.use('/assets', (req: any, res: any, next: any) => {
          const rawPath = decodeURIComponent(req.url ?? '/')
          const relPath = rawPath.replace(/^\//, '')
          const filePath = path.join(projectAssetsDir, relPath)
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            const mime =
              ext === '.png' ? 'image/png' :
              ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
              'application/octet-stream'
            res.setHeader('Content-Type', mime)
            res.setHeader('Cache-Control', 'public, max-age=3600')
            createReadStream(filePath).pipe(res)
          } else {
            next()
          }
        })
      },
    },
  ],
})
