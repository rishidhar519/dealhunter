import * as cheerio from 'cheerio';

async function findAjaxUrls() {
  const url = 'https://www.amazon.in/dp/B0GTZJVD3Y';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'en-IN,en;q=0.9',
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  // Search for ajax URLs containing offer or payment
  const links = [];
  $('a[href*="offer"], a[href*="payment"], a[href*="promo"], div[data-url], [data-ajax]').each((_, el) => {
    const dataUrl = $(el).attr('data-url');
    const href = $(el).attr('href');
    if (dataUrl) links.push({ type: 'data-url', url: dataUrl });
    if (href && (href.includes('offer') || href.includes('promo'))) links.push({ type: 'href', url: href });
  });

  console.log('Found Links / Endpoints:', links);

  // Check text containing "Save ₹16,250" or "16,250" in raw HTML
  const pos = html.indexOf('16,250');
  console.log('Position of 16,250 in raw HTML:', pos);
  if (pos !== -1) {
    console.log('Snippet around 16,250:', html.slice(pos - 200, pos + 200));
  } else {
    // Check if 16250 without comma is in HTML
    const pos2 = html.indexOf('16250');
    console.log('Position of 16250 in raw HTML:', pos2);
    if (pos2 !== -1) {
      console.log('Snippet around 16250:', html.slice(pos2 - 200, pos2 + 200));
    }
  }

  // Check what "See all offers" points to
  $('a:contains("See all offers")').each((_, el) => {
    console.log('See all offers tag:', $.html(el));
  });
}

findAjaxUrls().catch(console.error);
