import * as cheerio from 'cheerio';

async function testScrape() {
  const url = 'https://www.amazon.in/dp/B0GTZJVD3Y';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('#productTitle').text().trim();
  const price = $('.a-price .a-offscreen').first().text().trim();
  const mrp = $('.a-text-price .a-offscreen').first().text().trim();

  console.log('--- LIVE AMAZON DATA ---');
  console.log('Title:', title);
  console.log('Price:', price);
  console.log('MRP:', mrp);

  // Look for offers and drawer content
  const offers = [];
  $('div[data-csa-c-slot-id*="offer"], .offers-items, #sopp-accordion-view, .sopp-content, #item_details, #payment_plans, #vsx-offers-content').each((_, el) => {
    offers.push($(el).text().replace(/\s+/g, ' ').trim());
  });

  // Also search for JSON scripts inside the page that contain the payment offers
  const scriptsWithOffers = [];
  $('script').each((_, el) => {
    const content = $(el).html() || '';
    if (content.includes('16,250') || content.includes('PAYMENT OFFERS') || content.includes('SBI Credit Card') || content.includes('paymentOffers')) {
      scriptsWithOffers.push(content.slice(0, 500));
    }
  });

  console.log('\n--- EXTRACTED OFFER BLOCKS ---');
  console.log('Offers count:', offers.length);
  offers.slice(0, 5).forEach((o, i) => console.log(`[${i}]:`, o.slice(0, 200)));

  console.log('\n--- SCRIPTS WITH OFFERS ---');
  console.log('Scripts count:', scriptsWithOffers.length);
  if (scriptsWithOffers.length > 0) {
    console.log('First script snippet:\n', scriptsWithOffers[0].slice(0, 300));
  }
}

testScrape().catch(console.error);
