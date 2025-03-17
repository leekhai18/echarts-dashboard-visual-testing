import { Browser } from 'puppeteer';

declare global {
  var browser: Browser;
  var angularServer: any;
}

export default async () => {
  // Close browser
  if (global.browser) {
    await global.browser.close();
  }
  
  // Kill Angular server
  if (global.angularServer) {
    global.angularServer.kill();
  }
}; 