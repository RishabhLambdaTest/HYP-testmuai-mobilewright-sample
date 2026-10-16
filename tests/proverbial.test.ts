import { test, expect } from '@mobilewright/test';
import { proverbial, type Platform } from '../src/proverbial';

/** The driver is chosen by environment in mobilewright.config.ts (local ↔ testmuAI Cloud). */
test('Proverbial smoke — color, text, toast, notification', async ({ screen, platform }) => {
  const app = proverbial(screen, platform as Platform);

  // Change the app's color.
  await app.colorButton().tap();

  // Set the label to "Proverbial" and assert it rendered.
  await app.textButton().tap();
  await expect(app.proverbialText()).toBeVisible();

  // Fire a toast and a notification (no crash = pass).
  await app.toastButton().tap();
  await app.notificationButton().tap();
});
