import puppeteer, { Browser } from 'puppeteer';
import { angularServer, waitForServer } from './scripts/start-angular-server';

declare global {
  var browser: Browser;
  var angularServer: any;
}

export default async () => {
  // Start Angular server
  global.angularServer = angularServer;
  
  // Wait for Angular server to be ready
  await waitForServer();
  
  // Launch browser
  global.browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}; 