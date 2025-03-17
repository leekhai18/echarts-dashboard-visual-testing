import { Browser, Page } from 'puppeteer';

declare global {
  var browser: Browser;
  var angularServer: any;
  var pages: Page[];
}

export default async () => {
  // Clean up all pages
  if (global.pages) {
    for (const page of global.pages) {
      try {
        // Reset viewport to default
        await page.setViewport({ width: 1280, height: 800 });
        
        // Clear any custom page state
        await page.evaluate(() => {
          // Clear any custom window properties
          if ((window as any).customState) {
            delete (window as any).customState;
          }
          
          // Reset any custom styles
          const styleElements = document.querySelectorAll('style[data-test-style]');
          styleElements.forEach(el => el.remove());
        });

        // Close the page
        await page.close();
      } catch (error) {
        console.error('Error cleaning up page:', error);
      }
    }
    // Clear the pages array
    global.pages = [];
  }

  // Close browser
  if (global.browser) {
    await global.browser.close();
  }
  
  // Kill Angular server
  if (global.angularServer) {
    global.angularServer.kill();
  }
}; 