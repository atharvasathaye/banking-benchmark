#!/usr/bin/env node

/**
 * Fetches current complaint counts from the CFPB public API for each bank
 * and regenerates the complaints section of data.js.
 *
 * Usage:
 *   node scripts/fetch-cfpb.js           # dry run, prints updated counts
 *   node scripts/fetch-cfpb.js --write   # writes changes to data.js
 *
 * No npm dependencies. Uses Node's built-in https module.
 * Requires Node >= 14.
 */

import https from 'https';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data.js');

// Bank entities as registered in the CFPB database.
// These are exact-match strings — a typo returns 0 results with no error.
const BANKS = [
  { id: 'bofa',   short: 'BofA',       entity: 'BANK OF AMERICA, NATIONAL ASSOCIATION' },
  { id: 'chase',  short: 'Chase',       entity: 'JPMORGAN CHASE & CO.' },
  { id: 'wells',  short: 'Wells Fargo', entity: 'WELLS FARGO & COMPANY' },
  { id: 'truist', short: 'Truist',      entity: 'TRUIST FINANCIAL CORPORATION' },
  { id: 'pnc',    short: 'PNC',         entity: 'PNC Bank N.A.' },
  { id: 'fifth',  short: 'Fifth Third', entity: 'FIFTH THIRD FINANCIAL CORPORATION' },
];

// Set to null to fetch all-time totals.
// Post-2020 filter isolates Truist's existence as a merged entity.
const DATE_FROM = '2020-01-01';

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'banking-benchmark/1.0 (github.com/atharvasathaye/banking-benchmark)',
        'Accept': 'application/json',
      },
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error('Request timed out after 15s'));
    });
  });
}

async function fetchCount(entity, dateFrom) {
  const params = new URLSearchParams({
    company: entity,
    size: '0',
    no_aggs: 'true',
  });

  if (dateFrom) params.set('date_received_min', dateFrom);

  const url = `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?${params}`;
  const json = await get(url);
  return json.hits.total.value;
}

async function run() {
  const writeMode = process.argv.includes('--write');
  const results = [];

  console.log(`Fetching CFPB complaint counts${DATE_FROM ? ` (${DATE_FROM} onward)` : ' (all-time)'}...\n`);

  for (const bank of BANKS) {
    process.stdout.write(`  ${bank.short.padEnd(14)}`);
    try {
      const count = await fetchCount(bank.entity, DATE_FROM);
      results.push({ ...bank, count });
      console.log(count.toLocaleString());
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      results.push({ ...bank, count: null, error: err.message });
    }
  }

  console.log('');

  const failed = results.filter(r => r.error);
  if (failed.length > 0) {
    console.error(`${failed.length} bank(s) failed. Aborting write.`);
    process.exit(1);
  }

  if (!writeMode) {
    console.log('Dry run. Pass --write to update data.js.');
    return;
  }

  // Patch data.js in-place. Regex targets the complaints field within each
  // bank's object block, identified by its id string. This preserves all
  // manually-maintained fields (deposits_billions, app store data, etc.).
  let source = readFileSync(DATA_FILE, 'utf8');
  let updated = 0;

  for (const { id, count } of results) {
    const pattern = new RegExp(
      `(id:\\s*'${id}'[\\s\\S]*?complaints:\\s*)(\\d+)`,
      'm'
    );
    const before = source;
    source = source.replace(pattern, `$1${count}`);
    if (source !== before) updated++;
    else console.warn(`  Warning: could not patch complaints for id="${id}"`);
  }

  // Update the date comment in the file header
  const today = new Date().toISOString().split('T')[0];
  source = source.replace(/pulled \d{4}-\d{2}-\d{2}/, `pulled ${today}`);

  writeFileSync(DATA_FILE, source, 'utf8');
  console.log(`Patched ${updated}/${BANKS.length} complaint counts in data.js.`);
  console.log(`Review with: git diff data.js`);
}

run().catch(err => {
  console.error(err.message);
  process.exit(1);
});
