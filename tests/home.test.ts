import { test, expect } from '@mobilewright/test';
import { proverbial, type Platform } from '../src/proverbial';

test.describe('Home screen', () => {
  test('shows every action button and the welcome label', async ({ screen, platform }) => {
    const app = proverbial(screen, platform as Platform);

    for (const button of [
      app.colorButton(), app.textButton(), app.toastButton(),
      app.notificationButton(), app.geoLocationButton(), app.speedTestButton(),
    ]) {
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
    await expect(app.textbox()).toContainText('Welcome');
  });

  test('Text button rewrites the label to "Proverbial"', async ({ screen, platform }) => {
    const app = proverbial(screen, platform as Platform);

    await expect(app.textbox()).not.toHaveText('Proverbial');
    await app.textButton().tap();
    await expect(app.textbox()).toHaveText('Proverbial');
  });

  test('Toast button shows a toast message', async ({ screen, platform }) => {
    // Android toasts appear in the view tree; iOS has no toast equivalent.
    test.skip(platform !== 'android', 'Android-only');
    const app = proverbial(screen, platform as Platform);

    await app.toastButton().tap();
    await expect(screen.getByText('Toast should be visible')).toBeVisible({ timeout: 3_000 });
  });

  test('Speed Test opens a web page and Back returns home', async ({ screen, platform }) => {
    const app = proverbial(screen, platform as Platform);

    await app.speedTestButton().tap();
    await expect(app.urlField()).toBeVisible();
    await expect(app.colorButton()).toBeHidden();

    await screen.goBack();
    await expect(app.colorButton()).toBeVisible();
  });
});
