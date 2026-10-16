import type { Screen, Locator } from '@mobilewright/core';

export type Platform = 'android' | 'ios';

/**
 * Proverbial sample-app locators, split per platform.
 * On Android, MobileWright's testId is the FULL resource-id
 * (com.lambdatest.proverbial:id/…); on iOS it is the short accessibility id.
 * (Same elements as the standard Proverbial sample app.)
 */
const IDS: Record<string, Record<Platform, string>> = {
  color:        { android: 'com.lambdatest.proverbial:id/color',        ios: 'color' },
  text:         { android: 'com.lambdatest.proverbial:id/Text',         ios: 'Text' },
  toast:        { android: 'com.lambdatest.proverbial:id/toast',        ios: 'toast' },
  notification: { android: 'com.lambdatest.proverbial:id/notification', ios: 'notification' },
  geoLocation:  { android: 'com.lambdatest.proverbial:id/geoLocation',  ios: 'geoLocation' },
  speedTest:    { android: 'com.lambdatest.proverbial:id/speedTest',    ios: 'speedTest' },
  textbox:      { android: 'com.lambdatest.proverbial:id/Textbox',      ios: 'Textbox' },
  // Bottom navigation tabs and the Browser screen.
  browserTab:   { android: 'com.lambdatest.proverbial:id/webview',      ios: 'Browser' },
  homeTab:      { android: 'com.lambdatest.proverbial:id/buttonPage',   ios: 'Home' },
  urlField:     { android: 'com.lambdatest.proverbial:id/url',          ios: 'url' },
  findButton:   { android: 'com.lambdatest.proverbial:id/find',         ios: 'find' },
  webBrowser:   { android: 'com.lambdatest.proverbial:id/webbrowser',   ios: 'webbrowser' },
};

export function proverbial(screen: Screen, platform: Platform) {
  const by = (key: keyof typeof IDS): Locator => screen.getByTestId(IDS[key][platform]);
  return {
    colorButton: () => by('color'),
    textButton: () => by('text'),
    toastButton: () => by('toast'),
    notificationButton: () => by('notification'),
    geoLocationButton: () => by('geoLocation'),
    speedTestButton: () => by('speedTest'),
    /** The label the Text button rewrites; starts as a welcome message. */
    textbox: () => by('textbox'),
    browserTab: () => by('browserTab'),
    homeTab: () => by('homeTab'),
    urlField: () => by('urlField'),
    findButton: () => by('findButton'),
    webBrowser: () => by('webBrowser'),
    /** The Text button changes the on-screen label to "Proverbial". */
    proverbialText: (): Locator => screen.getByText(/Proverbial/).first(),
  };
}
