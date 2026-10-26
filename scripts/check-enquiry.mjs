import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const context = await browser.newContext();
  await context.route('**/*', route => {
    const request = route.request();
    if (request.method() !== 'GET' || request.url().includes('challenges.cloudflare.com')) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  const response = await page.goto('https://krelyvo.com/contact?service=ai-agents-automation&offering=custom-agents', { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.equal(response?.status(), 200);
  await page.locator('select[name="offering"]').waitFor();
  assert.equal(await page.getByLabel('What do you need?').inputValue(), 'AI Agents & Automation');
  assert.equal(await page.locator('select[name="offering"]').inputValue(), 'custom-agents');
  assert.equal(await page.getByRole('textbox', { name: 'Phone number' }).getAttribute('required'), '');
  console.log('PASS: public enquiry selects AI Agents & Automation and Custom Agents; phone stays required. No submission made.');
} finally { await browser.close(); }
