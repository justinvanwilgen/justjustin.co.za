const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

function contentTypeFor(filePath) {
  switch (path.extname(filePath)) {
    case '.css':
      return 'text/css; charset=utf-8';
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

function resolveAssetPath(requestUrl) {
  const url = new URL(requestUrl, 'http://localhost');
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath.replace(/^\/frontpage\/?/, '').replace(/^\//, '') || 'index.html';
  const filePath = path.normalize(path.join(DIST_DIR, relativePath));

  if (!filePath.startsWith(DIST_DIR + path.sep)) {
    return null;
  }

  return filePath;
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const filePath = resolveAssetPath(request.url || '/');

    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentTypeFor(filePath) });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((closeResolve) => server.close(closeResolve))
      });
    });
  });
}

async function scrollThroughPage(page) {
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(200, Math.floor(viewportHeight / 2));

  for (let scrollY = 0; scrollY <= pageHeight; scrollY += step) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(50);
  }

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForLoadState('networkidle');
}

test.describe('built site smoke test', () => {
  let server;

  test.beforeAll(async () => {
    server = await startStaticServer();
  });

  test.afterAll(async () => {
    await server.close();
  });

  test('loads without JavaScript errors or missing resources', async ({ page }) => {
    const pageErrors = [];
    const consoleErrors = [];
    const notFoundResponses = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('response', (response) => {
      if (response.status() === 404) {
        notFoundResponses.push(response.url());
      }
    });

    await page.goto(`${server.origin}/frontpage/`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('#typed-text')).toBeAttached();
    await scrollThroughPage(page);

    expect(pageErrors, 'page JavaScript errors').toEqual([]);
    expect(consoleErrors, 'console errors').toEqual([]);
    expect(notFoundResponses, '404 responses').toEqual([]);
  });
});
