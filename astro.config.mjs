import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

import site from './site.config.json' with { type: 'json' };

/**
 * A client site is static. Every page is the same for every visitor, so there
 * is nothing to run on request — and a page that is already HTML cannot fail at
 * request time, which matters more on a site nobody is watching at 2am than any
 * amount of cleverness.
 *
 * The Cloudflare adapter is here rather than a bare static build so that a site
 * which later needs one server route (a form, a webhook) can have it by
 * changing one line, instead of being rebuilt.
 */
export default defineConfig({
  site: site.site.domain ? `https://${site.site.domain}` : 'https://example.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [sitemap()],
  build: { format: 'directory' },
});
