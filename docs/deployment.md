# Deployment

## Build for Production

```bash
pnpm build
```

This creates a production build in the `.output` directory.

## Node.js Server

The default output is a Node.js server:

```bash
# Start the production server
node .output/server/index.mjs
```

## Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm build

# Expose port
EXPOSE 5677

# Start
CMD ["node", ".output/server/index.mjs"]
```

Build and run:

```bash
docker build -t nitro-starter .
docker run -p 5677:5677 nitro-starter
```

## Environment Variables

Set environment variables in production:

```bash
export JWT_SECRET=your-production-secret
export API_KEY=your-production-key
node .output/server/index.mjs
```

## Cloud Platforms

### Vercel

Nitro can deploy to Vercel with the `vercel` preset:

```ts
// nitro.config.ts
export default defineConfig({
  preset: 'vercel',
})
```

### Netlify

```ts
export default defineConfig({
  preset: 'netlify',
})
```

### Cloudflare Workers

```ts
export default defineConfig({
  preset: 'cloudflare',
})
```

## Static Generation

For static site generation:

```ts
export default defineConfig({
  preset: 'static',
})
```

## Performance Tips

1. **Enable compression** - Use reverse proxy (nginx, Caddy)
2. **Cache responses** - Set appropriate `Cache-Control` headers
3. **Use CDN** - Deploy static assets to a CDN
4. **Monitor** - Add APM tools for production monitoring

## Health Check

Add a health check endpoint:

```ts
// server/api/health.ts
import { defineHandler } from 'nitro'

export default defineHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
})
```
