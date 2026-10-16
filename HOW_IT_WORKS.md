# How MobileWright Works (and How to Write Your Own Tests)

This guide explains the basic idea behind MobileWright and how this sample runs on TestMu AI (Formerly LambdaTest). It also shows you how to add your own test cases. For setup and credentials, see the [README](README.md).

## The basic idea

MobileWright takes the [Playwright](https://playwright.dev) way of writing tests and applies it to native mobile apps. If you have written a Playwright test before, this will feel familiar:

```ts
import { test, expect } from '@mobilewright/test';

test('tapping Text shows "Proverbial"', async ({ screen }) => {
  await screen.getByTestId('com.lambdatest.proverbial:id/Text').tap();
  await expect(screen.getByTestId('com.lambdatest.proverbial:id/Textbox')).toHaveText('Proverbial');
});
```

- **`test` and `expect`** come from `@mobilewright/test`. They are the Playwright Test runner, so you get `test.describe`, `test.skip`, retries, reporters and parallel workers.
- **`screen`** is the app's current screen. You find elements on it with locators and act on them.
- **`expect`** retries assertions automatically until they pass or time out, so you don't need sleeps or manual waits.

## What happens when you run a test

```
npx mobilewright test
      │
      ▼
mobilewright.config.ts ── are cloud credentials set?
      │                         │
      │ no                      │ yes
      ▼                         ▼
local device / emulator    TestMu AI real-device cloud
(mobilecli driver)         (@testmuai/mobilewright driver)
      │                         │
      └────────────┬────────────┘
                   ▼
   a device is allocated and the app is (re)launched
                   ▼
           your test steps run
                   ▼
   pass/fail, video and logs are reported
```

1. **Pick a driver.** [mobilewright.config.ts](mobilewright.config.ts) checks for `LT_USERNAME` / `TESTMU_USERNAME`. If they are set, the test runs on the TestMu AI cloud. Otherwise it runs on a device connected to your machine. **Your test code never changes**, only the driver does.
2. **Get a device.** On the cloud, the driver opens a session on a real device with the app you uploaded (`lt://APP…`). If all matching devices are busy, it waits in a queue instead of failing.
3. **Start fresh.** Before each test the app is closed and reopened, so every test starts on the app's first screen.
4. **Run the steps.** Each locator reads the app's UI tree, finds the matching element and taps or types on it.
5. **Report.** Results show in your terminal and on the TestMu AI dashboard, with video, network logs and device logs.

## How locators find elements

MobileWright reads the app's **view tree**, the list of everything on screen with its type, id, text and position. It matches your locator against that tree. It re-reads the tree about every 100 ms until the element appears and stops moving, then acts on it. That is why tests stay stable without explicit waits.

| Locator | Finds an element by | Example |
|---|---|---|
| `getByTestId(id)` | Android resource-id / iOS accessibility id | `getByTestId('com.lambdatest.proverbial:id/color')` |
| `getByText(text)` | Visible text (string or regex) | `getByText('Toast should be visible')` |
| `getByLabel(label)` | Accessibility label / content description | `getByLabel('Browser')` |
| `getByRole(role)` | Role such as button or textbox | `getByRole('button', { name: 'FIND' })` |
| `getByType(type)` | Native class name | `getByType('android.widget.EditText')` |
| `getByPlaceholder(text)` | Input hint text | `getByPlaceholder('Search')` |

When more than one element matches, narrow it down with `.first()`, `.last()`, `.nth(i)` or `.filter(...)`.

> **Prefer `getByTestId`.** It doesn't change when text is translated or reworded. On Android the test id is the **full** resource-id, including the package name (`com.yourapp:id/button`). On iOS it is the accessibility identifier.

Text inside a WebView is part of the same tree, so `getByText` can find web content too. The Browser test in this repo relies on that.

## Actions and assertions

**Actions** on a locator:

```ts
await locator.tap();
await locator.doubleTap();
await locator.longPress();
await locator.fill('hello');      // type into an input
await locator.clear();
await locator.scrollIntoViewIfNeeded();
```

**Actions** on the screen:

```ts
await screen.goBack();            // Android back
await screen.swipe('up');
await screen.tap(x, y);           // raw coordinates (last resort)
const png = await screen.screenshot();
```

**Assertions.** These retry until they pass or time out:

```ts
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toHaveText('Proverbial');
await expect(locator).toContainText('Welcome');
await expect(locator).toHaveValue(/example\.com/);
await expect(locator).toHaveCount(3);
await expect(locator).not.toBeVisible();   // any assertion can be negated
```

The default assertion timeout is 20 seconds (`expect.timeout` in the config). To change it for one step, pass `{ timeout }`:

```ts
await expect(screen.getByText('Example Domain')).toBeVisible({ timeout: 30_000 });
```

## How this repo is organised

```
mobilewright.config.ts   → chooses local vs cloud, timeouts, app, platform
src/proverbial.ts        → page object: every element id the tests use, in one place
tests/
  proverbial.test.ts     → smoke test: color, text, toast, notification
  home.test.ts           → home screen buttons, label text, toast, speed test
  browser.test.ts        → browser tab: load a URL, switch tabs
```

`src/proverbial.ts` is a **page object**. The tests call `app.colorButton()` instead of repeating the raw id everywhere. If an id changes, you fix it in one place. The file also keeps separate Android and iOS ids, so one test works on both platforms.

## Writing your own test

### 1. Find the element ids

Add a temporary test that prints what is on screen:

```ts
// tests/zz-inspect.test.ts  (delete when done)
import { test } from '@mobilewright/test';
import { writeFileSync } from 'node:fs';

test('inspect screen', async ({ screen }) => {
  writeFileSync('screen.png', await screen.screenshot());
  writeFileSync('screen.json', JSON.stringify(await screen.viewTree(), null, 1));
});
```

Run it with `npx mobilewright test zz-inspect`. Open `screen.png` to see the screen. Search `screen.json` for `resourceId`, `text` or `label` to find the ids you need. Tap your way to a deeper screen first if that's the one you want to inspect.

### 2. Add the ids to the page object

```ts
// src/proverbial.ts
const IDS = {
  // ...
  findButton: { android: 'com.lambdatest.proverbial:id/find', ios: 'find' },
};

export function proverbial(screen, platform) {
  return {
    // ...
    findButton: () => by('findButton'),
  };
}
```

### 3. Write the test

Create a file in `tests/` ending in `.test.ts`:

```ts
import { test, expect } from '@mobilewright/test';
import { proverbial, type Platform } from '../src/proverbial';

test.describe('Browser tab', () => {
  test('loads a URL typed into the address bar', async ({ screen, platform }) => {
    const app = proverbial(screen, platform as Platform);

    await app.browserTab().tap();                         // act
    await app.urlField().fill('https://example.com');
    await app.findButton().tap();

    await expect(screen.getByText('Example Domain').first())  // assert
      .toBeVisible({ timeout: 30_000 });
  });
});
```

The pattern for each test is **arrange → act → assert**. Get the page object, perform the user's steps, then assert what the user should see.

### 4. Run it

```bash
npx mobilewright test                      # every test
npx mobilewright test browser              # one file (matches the file name)
npx mobilewright test -g "loads a URL"     # tests whose title matches
PLATFORM=ios npx mobilewright test         # the iOS project
```

## Tips for reliable tests

- **One behaviour per test.** Small tests fail with clearer messages and can run in parallel.
- **Assert on outcomes, not just on taps.** A tap that "didn't crash" proves little. Check that the label changed or that the new screen appeared.
- **Don't add sleeps.** Assertions already wait. If something is slow, raise that assertion's `timeout`.
- **Don't depend on test order.** Each test starts from a freshly launched app, so set up what you need inside the test.
- **Skip what doesn't apply.** Use `test.skip(platform !== 'android', 'Android-only')` for platform-specific behaviour, such as Android toasts.
- **Check the failure output.** When a test fails, open `test-results/<test-name>/error-context.md` to see what was on screen. Watch the video on the TestMu AI dashboard.

## Using your own app

1. Upload your `.apk` / `.ipa` to TestMu AI once to get an `lt://APP…` id (see the README).
2. Set `LT_APP_ANDROID` / `LT_APP_IOS` (or `TESTMU_APP`) to that id.
3. Set `bundleId` in [mobilewright.config.ts](mobilewright.config.ts) to your app's package name, so the app is relaunched before every test.
4. Create a page object for your app in `src/`, using the inspection steps above to find ids.
