import { defineConfig } from 'mobilewright';
import { testMuDriver } from '@testmuai/mobilewright';

/**
 * The @testmuai/mobilewright driver runs the test on testmuAI Cloud when
 * credentials are present; otherwise the default mobilecli driver runs it on a
 * local device. Only the driver changes by environment — the tests never do.
 *
 * The app under test is an app id you uploaded once (see "Upload the app" in the
 * README). Set it in TESTMU_APP, or per platform in LT_APP_ANDROID / LT_APP_IOS.
 */
const platform = (process.env.PLATFORM || 'android') as 'android' | 'ios';

// An lt://APP… id from a prior upload (or a local .apk/.ipa path for development).
const app = process.env.TESTMU_APP
  || (platform === 'ios' ? process.env.LT_APP_IOS : process.env.LT_APP_ANDROID);

const config: any = {
  testDir: './tests',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  // list → console; html → playwright-report/, picked up by HyperExecute
  // (see partialReports in hyperexecute.yaml).
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  projects: [{ name: platform, use: { platform } }],
};

if (process.env.TESTMU_USERNAME || process.env.LT_USERNAME) {
  // ---- CLOUD: testmuAI ----
  // Credentials are read from the environment by the driver (TESTMU_* preferred,
  // LT_* accepted) — nothing to hardcode.
  if (!app) {
    throw new Error(
      'Set the app to your uploaded id: TESTMU_APP, or LT_APP_ANDROID / LT_APP_IOS ' +
      '(an lt://APP… id). See "Upload the app" in the README.',
    );
  }
  if (platform === 'ios') {
    // Let the grid's initial launch stand so a permission alert can't block an
    // extra terminate/relaunch cycle.
    config.projects[0].use.autoAppLaunch = false;
  } else {
    // The pooled cloud session is reused across tests; with a bundleId the
    // fixture terminates and relaunches the app so each test starts on Home.
    config.projects[0].use.bundleId = 'com.lambdatest.proverbial';
  }
  config.driver = testMuDriver({
    app,
    build: 'testmuai-mobilewright-sample',
    project: 'mobilewright-sample',
    video: true,
    networkLog: true,
    deviceLog: true,
    autoGrantPermissions: true,
    autoAcceptAlerts: true,
  });
} else {
  // ---- LOCAL: mobilecli (the device on your machine) ----
  // Same workflow a customer uses before the cloud: point at a local build.
  const localApp = platform === 'ios' ? process.env.LOCAL_APP_IOS : process.env.LOCAL_APP_ANDROID;
  if (localApp) config.projects[0].use.installApps = localApp;
  config.projects[0].use.bundleId = 'com.lambdatest.proverbial';
}

export default defineConfig(config);
