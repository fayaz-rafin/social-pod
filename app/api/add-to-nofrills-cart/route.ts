import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { groceries } = await request.json();

    const browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    for (const item of groceries) {
      try {
        await page.goto(`https://www.nofrills.ca/search?search-bar=${encodeURIComponent(item.name)}`, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(res => setTimeout(res, 2000)); // Wait for SPA to settle
        await page.waitForSelector('[data-testid="atc-button"]', { visible: true, timeout: 10000 });
        const buttons = await page.$$('[data-testid="atc-button"]');
        console.log('Found', buttons.length, 'add-to-cart buttons for', item.name);
        if (buttons.length > 0) {
          await buttons[0].click();
          console.log('Clicked the first add-to-cart button for', item.name);
          await new Promise(res => setTimeout(res, 1000)); // Wait for cart update
        }
      } catch (e) {
        console.log('Error for item', item.name, e);
        continue;
      }
    }

    await browser.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('No Frills Puppeteer error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 