# Run MobileWright Tests on TestMu AI (Formerly LambdaTest)

<p align="center">
  <a href="https://www.testmuai.com/"><img src="https://img.shields.io/badge/MADE%20BY%20TestMu%20AI-000000.svg?style=for-the-badge&labelColor=000" alt="Made by TestMu AI"></a>
  <a href="https://www.npmjs.com/package/@testmuai/mobilewright"><img src="https://img.shields.io/npm/v/@testmuai/mobilewright.svg?style=for-the-badge&labelColor=000000" alt="@testmuai/mobilewright version"></a>
  <a href="https://community.testmuai.com/"><img src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&labelColor=000000" alt="Community"></a>
</p>

## Getting Started

[TestMu AI](https://www.testmuai.com/) (Formerly LambdaTest) is the world's first full-stack AI Agentic Quality Engineering platform that empowers teams to test intelligently, smarter, and ship faster. Built for scale, it offers a full-stack testing cloud with 10K+ real devices and 3,000+ browsers. With AI-native test management, MCP servers, and agent-based automation, TestMu AI supports Selenium, Appium, Playwright, MobileWright, and all major frameworks.

With TestMu AI (Formerly LambdaTest), you can run [MobileWright](https://mobilewright.dev) tests on the device cloud using the [`@testmuai/mobilewright`](https://www.npmjs.com/package/@testmuai/mobilewright) driver. This sample shows how to run a MobileWright test on TestMu AI, using the Proverbial sample app.

- [Sign up on TestMu AI](https://www.testmuai.com/register/) (Formerly LambdaTest).
- Follow the [TestMu AI Documentation](https://www.testmuai.com/support/docs/) for the full setup walkthrough.

### Prerequisites

- Node.js 22.12.0+ and npm
- A TestMu AI (Formerly LambdaTest) account with your username and access key

### Setup

Clone and install dependencies:

```bash
git clone https://github.com/rishirajs123/testmuai-mobilewright-sample && cd testmuai-mobilewright-sample
npm install
```

Set your credentials as environment variables.

**macOS / Linux:**

```bash
export LT_USERNAME="YOUR_USERNAME"
export LT_ACCESS_KEY="YOUR_ACCESS_KEY"
```

**Windows:**

```bash
set LT_USERNAME="YOUR_USERNAME"
set LT_ACCESS_KEY="YOUR_ACCESS_KEY"
```

### Upload the app

The app under test is referenced by an `lt://APP…` id. [Upload your app](https://www.testmuai.com/support/docs/)
to TestMu AI once to get that id, then set it:

```bash
export LT_APP_ANDROID="lt://APP_ANDROID_ID"
export LT_APP_IOS="lt://APP_IOS_ID"
```

### Run tests

```bash
PLATFORM=android npx mobilewright test
PLATFORM=ios     npx mobilewright test
```

View results on your TestMu AI dashboard.

New to MobileWright? Read [HOW_IT_WORKS.md](HOW_IT_WORKS.md) for how it works and how to write your own tests.

### Local testing with TestMu AI Tunnel

To test apps hosted behind a private network, set up the TestMu AI tunnel. OS-specific guides:

- [Local Testing on Windows](https://www.testmuai.com/support/docs/local-testing-for-windows/)
- [Local Testing on macOS](https://www.testmuai.com/support/docs/local-testing-for-macos/)
- [Local Testing on Linux](https://www.testmuai.com/support/docs/local-testing-for-linux/)

Add the following to the driver options in `mobilewright.config.ts`:

```js
tunnel: true,
```

## Contributions

Contributions are welcome. Open an issue to discuss your idea before submitting a pull request. When reporting bugs, include your Node.js version, OS, and the `@testmuai/mobilewright` version.

## TestMu AI (Formerly LambdaTest) Community

Connect with testers and developers in the [TestMu AI Community](https://community.testmuai.com/). Ask questions, share what you are building, and discuss best practices in test automation and DevOps.

## TestMu AI (Formerly LambdaTest) Certifications

Earn free [TestMu AI Certifications](https://www.testmuai.com/certifications/) for testers, developers, and QA engineers. Validate your skills in Selenium, Cypress, Playwright, Appium, Espresso and more. Industry-recognized, shareable on LinkedIn, and built by practitioners, not marketers.

## Learning Resources by TestMu AI (Formerly LambdaTest)

Learn modern testing through tutorials, guides, videos, and weekly updates:

* [TestMu AI Blog](https://www.testmuai.com/blog/)
* [TestMu AI Learning Hub](https://www.testmuai.com/learning-hub/)
* [TestMu AI on YouTube](https://www.youtube.com/@TestMuAI)
* [TestMu AI Newsletter](https://www.testmuai.com/newsletter/)

## LambdaTest is Now TestMu AI

On **January 12, 2026**, [LambdaTest evolved to TestMu AI](https://www.testmuai.com/lambdatest-is-now-testmuai/), the world's first fully autonomous **Agentic AI Quality Engineering Platform**.

Same team. Same infrastructure. Same customer accounts. All existing LambdaTest logins, scripts, capabilities, and integrations continue to work without change.

👉 Find the new home for [LambdaTest](https://www.testmuai.com).
