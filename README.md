# AOS Playwright TypeScript Automation Framework

## Project Overview

This repository contains a Playwright and TypeScript automation framework for [Advantage Online Shopping](https://www.advantageonlineshopping.com), a public e-commerce single-page application.

The project is designed as a QA Automation portfolio demonstrating structured UI and REST API testing rather than a collection of isolated scripts. It covers functional, regression, and end-to-end scenarios while keeping test flow, reusable automation code, data, reporting, and CI responsibilities clearly separated.

## Key Features

- UI automation using Playwright and TypeScript.
- REST API automation using Playwright `APIRequestContext`.
- Page Object Model with reusable page-specific actions and verifications.
- Shared UI behavior through `BasePage` and reusable components.
- Custom Playwright fixtures for Page Object injection.
- Externalized UI and API test data.
- Stateless text and price helpers.
- Independent tests with scenario-specific setup and cleanup where supported.
- Playwright HTML and Allure reporting.
- Consistent `feature`, `story`, and requirement `tag` metadata for traceability.
- Failure diagnostics with screenshots, videos, traces, error context, and `test.step()` context.
- GitHub Actions with separate API and diagnostic UI gates.
- Human-controlled, AI-assisted analysis, implementation, debugging, and documentation workflow.

## Technology Stack

| Area | Technology |
| --- | --- |
| Language | TypeScript |
| Test framework | Playwright Test |
| UI automation | Playwright with Chromium |
| API automation | Playwright `APIRequestContext` |
| Runtime and package management | Node.js and npm |
| Reporting | Playwright HTML Reporter and Allure |
| Version control | Git and GitHub |
| CI/CD | GitHub Actions |

The CI baseline uses Node.js 24 and Java 17. Java is required to generate and open Allure reports through the locally installed Allure CLI.

## Framework Architecture

### Page Object Model

Page Objects under `pages/` encapsulate locators, UI interactions, business-oriented actions, and reusable page-specific verifications. UI specs remain focused on scenario intent, test data, orchestration, and explicit validation steps.

Reusable page sections are represented as components. For example, search and mini-cart behavior are isolated under `pages/components/` instead of being duplicated across pages.

### BasePage

`pages/base/BasePage.ts` contains generic UI operations used across Page Objects, including navigation, visibility and clickability checks, text entry, checkbox and select actions, scrolling, and basic element value utilities. Feature-specific business behavior remains in the relevant Page Object.

### Custom Fixtures

`fixtures/aos-fixture.ts` extends Playwright Test and injects the Page Objects used by UI specs. Tests consume these fixtures rather than manually instantiating Page Objects.

### Helpers and Test Data

- `utils/helpers/` contains stateless text and price utilities.
- `test-data/ui/` contains reusable UI data for users, products, categories, search, and checkout.
- `api/test-data/` contains API-specific stable and generated user data.

Keeping UI and API data separate prevents accidental coupling between the two automation layers.

### UI and API Layer Separation

UI tests use custom fixtures, Page Objects, and components. API tests use the native Playwright `request` fixture and focused clients:

- `CatalogApiClient`
- `AccountApiClient`
- `OrderApiClient`

API clients encapsulate REST communication. API scenario flow, response parsing, assertions, authentication state, and cleanup decisions remain in the specs. Clients do not depend on each other, and API tests do not use Page Objects.

## Project Structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- playwright.yml
|-- api/
|   |-- clients/
|   |   |-- AccountApiClient.ts
|   |   |-- CatalogApiClient.ts
|   |   `-- OrderApiClient.ts
|   |-- models/                 # Reserved for API models; currently empty
|   `-- test-data/
|       `-- users.data.ts
|-- fixtures/
|   `-- aos-fixture.ts
|-- pages/
|   |-- base/
|   |   `-- BasePage.ts
|   |-- components/
|   |   |-- MiniCartComponent.ts
|   |   `-- SearchComponent.ts
|   `-- *.ts                    # Feature Page Objects
|-- test-data/
|   `-- ui/
|       `-- *.data.ts
|-- tests/
|   |-- api/
|   |   |-- account-api-tests.spec.ts
|   |   |-- catalog-api-tests.spec.ts
|   |   `-- order-api-tests.spec.ts
|   `-- ui/
|       `-- *.spec.ts
|-- utils/
|   `-- helpers/
|       |-- price-helpers.ts
|       `-- text-helpers.ts
|-- AGENTS.md
|-- package.json
|-- playwright.config.ts
`-- tsconfig.json
```

## Test Coverage

The specification defines 109 test cases. The final automation implementation contains 106 executable test cases.

| Layer | Specified | Automated | Exceptions |
| --- | ---: | ---: | --- |
| UI | 94 | 92 | TC-024: N/A; TC-092: Not Automated |
| API | 15 | 14 | TC-102: Blocked |
| **Total** | **109** | **106** | **1 N/A, 1 Not Automated, 1 Blocked** |

### UI Automation

The 92 automated UI scenarios cover:

- Home page and navigation.
- Search and product discovery.
- Product categories and product details.
- Shopping cart and mini-cart behavior.
- Checkout, shipping, payment, order confirmation, and cart reset.
- Registration, authentication, session behavior, and account deletion.
- My Account and My Orders workflows.
- Loading and final UI-state behavior.

### API Automation

The 14 automated API scenarios cover:

- Catalog retrieval, product details, search, and categories.
- User registration and valid/invalid authentication.
- Cart retrieval, add, update, remove, and clear operations.
- Order history retrieval.
- Shipping-cost calculation.

## Installation and Setup

### Prerequisites

- Git.
- Node.js with npm.
- Java 17 for Allure report generation and viewing.
- Network access to the public AOS application.

### Install From a Fresh Clone

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/meirneh/AOS_Playwright_TS_Framework_Automation.git
   cd AOS_Playwright_TS_Framework_Automation
   ```

2. Install the exact dependency versions recorded in `package-lock.json`:

   ```bash
   npm ci
   ```

3. Install the validated browser:

   ```bash
   npx playwright install chromium
   ```

   On a Linux environment that also needs browser system dependencies, use:

   ```bash
   npx playwright install --with-deps chromium
   ```

4. Run the required suite using one of the commands below.

## Running the Tests

### Complete Automated Suite

Run all 106 automated UI and API test cases:

```bash
npm test
```

### Complete UI Regression Suite

Run all 92 automated UI test cases:

```bash
npm run test:ui
```

The public AOS environment can become temporarily unavailable during longer consecutive UI execution. See [Known Limitations and Documented Constraints](#known-limitations-and-documented-constraints).

### API Suite

Run all 14 automated API test cases:

```bash
npm run test:api
```

### CI Stage Gate Sample

Run only the three diagnostic UI scenarios used by the CI Stage Gate: TC-001, TC-039, and TC-067.

```bash
npm run test:ui:stage
```

This is a critical representative sample, not the complete UI regression suite.

### Individual Spec

Run one real spec by path:

```bash
npx playwright test tests/ui/checkout-tests.spec.ts
```

For an API example:

```bash
npx playwright test tests/api/catalog-api-tests.spec.ts
```

### Individual Test Case

Use the TC ID or another unique part of the title:

```bash
npx playwright test tests/ui/checkout-tests.spec.ts --grep "TC-039"
```

### Validated Execution Baseline

- Browser: Chromium.
- Workers: 1.
- Parallel execution: disabled.

Using one worker is a deliberate stability decision for the public AOS environment. It is not a Playwright limitation. Cross-browser and parallel execution are not part of the currently validated baseline.

## Reporting

### Clean Previous Results

For a clean reporting cycle, remove previous Playwright and Allure output before running tests:

```bash
npm run report:clean
```

Run this command before the test command because it removes `reports/allure-results`, `reports/allure-report`, `reports/playwright-report`, and `test-results`.

### Playwright HTML Report

Playwright generates the HTML report in `reports/playwright-report` during test execution. Open the latest report with:

```bash
npm run report
```

### Allure Report

Test execution writes raw Allure results to `reports/allure-results`. Generate and open the HTML report in this order:

```bash
# 1. Run a suite
npm run test:api

# 2. Generate reports/allure-report
npm run allure:generate

# 3. Open the generated report
npm run allure:open
```

Java must be available for the Allure CLI commands.

### Failure Artifacts

For failed tests, the framework retains diagnostic output in `test-results`, including:

- Screenshot.
- Video.
- Playwright trace.
- Error context.
- Structured `test.step()` information in reports and traces.

Trace files can be inspected with:

```bash
npx playwright show-trace test-results/<test-output-directory>/trace.zip
```

## CI/CD

The GitHub Actions workflow is defined in `.github/workflows/playwright.yml` and runs on pull requests or through manual `workflow_dispatch` execution. Both jobs install dependencies with `npm ci`, install Chromium and its Linux dependencies, generate Playwright and Allure reports, and upload reporting and failure artifacts even when tests fail.

### API Gate

- Runs all 14 automated API test cases.
- Acts as the blocking PR gate.
- Is configured as the required status check in the `main` branch ruleset.

### Stage Gate (Diagnostic)

- Runs TC-001, TC-039, and TC-067 only.
- Provides an independent, representative UI health signal.
- Is intentionally non-blocking through `continue-on-error`.
- Does not replace the complete 92-test UI regression suite.

The reduced Stage Gate scope is based on observed stability constraints in the public AOS environment, not on a Playwright limitation.

### GitHub Actions Artifacts

Each gate uploads a separate artifact containing available output from:

- `reports/playwright-report`
- `reports/allure-results`
- `reports/allure-report`
- `test-results`

### Main Branch Protection

The pull-request trigger, manual trigger, artifact workflow, `main` branch ruleset, required API Gate, and successful merge flow have been validated through a real pull request.

## AI-Assisted Development Workflow

ChatGPT and Codex were used as engineering assistants for analysis, test design, implementation, debugging, documentation, and targeted framework improvements. AI tooling operated inside an approval-driven workflow rather than replacing engineering ownership.

```text
Architecture and test design
        -> AI-assisted analysis
        -> Human approval
        -> Codex implementation
        -> Human diff review
        -> Human test execution and validation
        -> Final acceptance
```

`AGENTS.md` provides repository-level guidance for source-of-truth priority, architecture, scope control, implementation conventions, approval requirements, and test execution policy. Architectural decisions, scope, approval, code review, execution, validation, and acceptance remained under human control.

## Known Limitations and Documented Constraints

### Public AOS Environment Stability

AOS is a public SPA with observable environment instability. Running more than approximately three or four UI test cases consecutively can cause temporary unresponsiveness or access blocking even with one worker. The complete UI regression suite remains available, but it is not used as a blocking CI gate.

### TC-024: N/A

The Product Details page displays unit price only. Changing quantity does not expose a quantity-dependent total on that page; the calculated total is observable at Shopping Cart level. TC-024, `Product Price Updates According To Selected Quantity`, is therefore classified as N/A and was intentionally not automated.

### TC-092: Not Automated

The expected loading spinner could not be reproduced during Add to Cart, Remove Product, Change Quantity, or Change Product Configuration flows. TC-092 was not automated because the expected behavior could not be truthfully observed.

### TC-102: Blocked

For normal `USER` accounts, the investigated REST operations:

- `DELETE /accountservice/accountrest/api/v1/delete`
- `POST /accountservice/accountrest/api/v1/deactivate`

return HTTP 403 with `Wrong account type (USER)`. The account type was not changed, and SOAP was not introduced as a workaround. TC-102 is Blocked, not Passed. Because no supported REST cleanup was confirmed for a normal user, TC-099 leaves its successfully registered account persisted.

### TC-008: Search Stabilization

TC-008 contains a validated 750 ms stabilization delay before closing Search. The locator is correct; investigation showed that the AOS Search component ignores an immediate close interaction. The implemented method records the RCA context inline and treats the delay as a documented stabilization workaround rather than an arbitrary sleep.

### My Orders and TC-085

The actual My Orders UI does not expose a status field. Automation therefore cannot truthfully classify an order as completed, processing, shipped, or delivered. TC-085 verifies that an existing order can be removed after confirmation; it does not assert a completed-order status despite the cancellation wording used by the confirmation modal.

### TC-108: API Contract Discrepancy

At runtime, `GET /order/api/v1/orders/history` does not expose `products` in each history entry although Swagger documents that field. The automation validates only fields confirmed in the real response.

### TC-109: API Contract Discrepancy

At runtime, `POST /order/api/v1/shippingcost` does not expose `currency` although Swagger documents that field. The automation validates the confirmed transaction type, numeric amount representation, and response code.

## Future Improvements

- Replace the TC-008 stabilization delay if AOS exposes a reliable deterministic state or event.
- Expand CI UI coverage if the public AOS environment becomes sufficiently stable for longer consecutive runs.
- Add optional cross-browser hardening after validating behavior beyond the current Chromium baseline.
