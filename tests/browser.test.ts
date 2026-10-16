import { test, expect } from '@mobilewright/test';
import { proverbial, type Platform } from '../src/proverbial';

test.describe('Browser tab', () => {
  test('loads a URL typed into the address bar', async ({ screen, platform }) => {
    const app = proverbial(screen, platform as Platform);

    await app.browserTab().tap();
    await expect(app.urlField()).toBeVisible();

    await app.urlField().fill('https://example.com');
    await expect(app.urlField()).toHaveValue(/example\.com/);
    await app.findButton().tap();

    // WebView content is part of the native view tree, so plain text locators reach it.
    await expect(screen.getByText('Example Domain').first()).toBeVisible({ timeout: 30_000 });
  });

  test('Home tab navigates back from the browser', async ({ screen, platform }) => {
    const app = proverbial(screen, platform as Platform);

    await app.browserTab().tap();
    await expect(app.findButton()).toBeVisible();

    await app.homeTab().tap();
    await expect(app.colorButton()).toBeVisible();
    await expect(app.findButton()).toBeHidden();
  });
});
