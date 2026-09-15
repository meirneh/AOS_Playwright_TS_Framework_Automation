# AGENTS.md

## Purpose

This file defines the permanent working rules for Codex when operating inside the `AOS_Playwright_TS_Framework_Automation` repository.

These instructions apply to the entire repository unless the user explicitly overrides them for a specific task.

---

## 1. Project Scope

The automation target is **Advantage Online Shopping (AOS)**.

The framework covers:

- UI automation
- API automation

The reference project `AtidStorePlaywrightTS` may be used only as an architectural reference. It is not the automation target.

---

## 2. Technology Stack

Use the existing project stack:

- TypeScript
- Playwright
- Page Object Model (POM)
- Custom Playwright fixtures
- Helpers
- Externalized test data
- Allure reporting
- Git / GitHub
- GitHub Actions

Do not introduce a new framework, testing library, architectural pattern, or dependency unless the user explicitly approves it.

---

## 3. Sources of Truth

Use the project design documents as the authoritative references.

Priority for implementation decisions:

1. `STD.md` — official source of truth for test-case implementation.
2. `SRS` — functional requirement definitions and expected behavior.
3. `ArchitectureDecisions.md` — framework architecture and design rules.
4. Project Roadmap — implementation phases and project direction.
5. Existing implementation — current project conventions and reusable code.

Do not:

- invent new requirements;
- redesign existing requirements;
- create additional test cases unless explicitly requested;
- change the intended scope of an existing TC.

---

## 4. Mandatory Approval Workflow

### Analysis First

For implementation, refactoring, or troubleshooting tasks, the first step is analysis only unless the user explicitly asks for immediate implementation.

Before modifying any file:

1. Inspect the current relevant implementation.
2. Review the relevant spec, Page Objects, components, fixtures, helpers, and test data.
3. Reuse existing functionality whenever possible.
4. Identify every file that would need to be modified.
5. Explain the proposed implementation approach.
6. List new methods that would be added, if any.
7. List existing methods that would be changed, if any.
8. Explain why each proposed change is necessary.

Then stop.

### Do Not Modify Before Approval

Do not modify any file until the user gives explicit approval.

After approval:

- implement only the approved changes;
- do not broaden the scope;
- do not perform unrelated refactoring;
- do not modify additional files without explaining the need and receiving approval.

---

## 5. Test Execution

Do **not** execute tests unless the user explicitly asks Codex to do so.

The user runs Playwright tests locally and validates the results.

Do not run:

- individual tests;
- suites;
- Playwright UI mode;
- command-line test execution;
- retries for validation purposes.

Implementation output should clearly state that tests were not executed.

---

## 6. Language Rules

Communication between the user and Codex is in **Spanish**.

Inside the repository, keep everything in **English**, including:

- code;
- file names;
- class names;
- method names;
- variable names;
- comments;
- test titles;
- documentation.

Do not translate existing project code or documentation into Spanish.

---

## 7. Architecture Rules

Preserve the current architecture.

### Page Object Model

All Page Objects inherit from `BasePage` where applicable.

Page Objects should:

- encapsulate UI interactions;
- expose reusable business actions;
- contain locators and page-specific behavior.

Tests should:

- contain the main test flow;
- contain assertions;
- remain readable and concise.

Do not move test assertions into Page Objects unless the existing project convention already requires a specific verification method and the user approves that design.

### Fixtures

Use the existing custom Playwright fixtures.

Prefer fixture injection.

Do not instantiate Page Objects directly inside specs when the fixture already exposes them.

Avoid patterns such as:

```ts
new LoginPage(page)
```

inside tests when a fixture should be used.

### Components

Reuse existing components for shared UI behavior such as header, search, cart, or other reusable sections.

Do not duplicate component behavior inside individual Page Objects.

### Helpers

Helpers must remain stateless.

Reuse existing helpers before creating new ones.

Do not create a helper for logic that clearly belongs to a Page Object, component, fixture, or test.

### Test Data

Keep test data externalized.

Reuse existing test-data structures and constants.

Do not hardcode reusable test data directly into specs when the project already has an appropriate test-data location.

---

## 8. BasePage Rules

`BasePage` contains generic actions and waits used across Page Objects.

Do not modify `BasePage` unless it is strictly necessary and there is a clear cross-project reusable need.

Before proposing a `BasePage` change:

1. confirm the behavior is truly generic;
2. confirm it is needed by more than one page or represents a framework-level action;
3. explain why the functionality cannot remain in the specific Page Object or component.

Prefer local, minimal changes over expanding `BasePage`.

---

## 9. Reuse Before Creation

Before creating any:

- method;
- locator;
- helper;
- fixture;
- Page Object;
- component;
- test-data entry;

search the existing project for equivalent functionality.

Reuse or extend existing functionality when appropriate.

Do not create duplicate methods with different names that perform the same action.

Prefer small, focused methods with a single clear responsibility.

---

## 10. Scope Control

Implement only what is required by the current task or TC.

Do not:

- add validations belonging to later test cases;
- prepare unrelated future functionality;
- refactor unrelated files;
- rename unrelated methods;
- reorganize folders;
- change configuration;
- modify reporting;
- change test data outside the current need.

Previously implemented and validated test cases must not be modified unless:

- the current change causes a regression;
- an existing defect is confirmed;
- the user explicitly approves the modification.

---

## 11. Synchronization And Stability

Do not add fixed waits.

Do not use:

```ts
page.waitForTimeout(...)
```

or artificial delays as a normal synchronization strategy.

Prefer deterministic synchronization based on:

- locator visibility;
- locator state;
- URL/navigation state;
- network/application state when appropriate;
- existing framework synchronization utilities.

If the AOS demo environment shows instability, do not immediately change the framework.

First determine whether the issue is:

- application/environment flakiness;
- synchronization;
- locator instability;
- test logic;
- external connectivity.

Do not hide real failures with excessive retries or arbitrary waits.

---

## 12. AOS Environment Considerations

AOS is a public demo SPA and may occasionally behave inconsistently.

The execution baseline is:

- Chromium
- `workers = 1`

Do not change this baseline unless the user explicitly approves it.

If the site is temporarily unavailable or unreachable:

- do not modify tests merely because the environment is down;
- distinguish infrastructure/environment failures from automation regressions.

---

## 13. Test Design Rules

Tests must remain independent.

Avoid dependencies between test cases.

Use `test.step` when appropriate and follow the existing style of the suite.

Keep specs clean and readable.

Avoid repeating validations that are already covered by another TC unless they are required as minimal setup verification for the current flow.

The objective of each test must remain aligned with its STD definition.

---

## 14. Assertions

Assertions belong primarily in test specs.

Page Objects should expose the information or action required for the test.

Prefer precise assertions that validate the functional objective of the TC.

Do not add unrelated assertions simply because the information is available on the page.

When comparing UI text:

- prefer exact comparison when the application presents consistent text;
- use only the minimum normalization necessary when the application presents equivalent content with formatting differences;
- do not over-normalize values in a way that could hide a real defect.

---

## 15. Locator Rules

Prefer stable Playwright locators and CSS-based selectors consistent with the current project.

Reuse existing locators where possible.

Do not introduce XPath unless there is a strong, approved reason.

When interacting with a product or repeated list item, ensure that data capture and click actions refer to the same item.

Avoid fragile positional assumptions unless the TC intentionally uses a deterministic first item and the DOM structure supports it.

---

## 16. Refactoring Rules

Refactor only when:

- duplication is confirmed;
- the change is within the current task scope;
- the refactor improves maintainability without altering behavior;
- the user approves it.

Prefer the simplest solution first.

Do not perform speculative refactoring.

---

## 17. Troubleshooting Rules

When a failure appears:

1. inspect the exact error;
2. compare expected vs actual behavior;
3. reproduce only as needed;
4. distinguish application defects, environment issues, synchronization issues, and automation defects;
5. propose the smallest reasonable correction.

Do not change code if repeated executions show the implementation is stable and the failure cannot be reproduced, unless further evidence justifies a change.

Preserve existing RCA decisions and avoid repeating previously closed investigations without new evidence.

---

## 18. File Modification Discipline

Modify only files required for the approved solution.

Do not modify:

- configuration;
- documentation;
- unrelated specs;
- unrelated Page Objects;
- unrelated fixtures;
- unrelated helpers;

unless explicitly included in the approved scope.

At the end of an implementation, report:

- files modified;
- brief summary of each change;
- new methods added;
- existing methods modified;
- assumptions made;
- confirmation that tests were not executed.

---

## 19. General Development Philosophy

Prioritize:

- readability;
- maintainability;
- reusability;
- scalability;
- test independence;
- clean specifications;
- minimal changes;
- deterministic behavior.

Prefer simple solutions before complex ones.

Do not introduce complexity without a demonstrated need.

---

## 20. Default Codex Behavior For New Test Cases

When the user asks to continue with a new TC:

1. read the TC definition from the STD;
2. identify its exact objective and traceability;
3. inspect the current suite and reusable implementation;
4. determine the minimum setup needed;
5. avoid duplicating validations from already completed TCs;
6. propose the implementation;
7. wait for explicit approval;
8. after approval, implement only the approved scope;
9. do not execute tests.
