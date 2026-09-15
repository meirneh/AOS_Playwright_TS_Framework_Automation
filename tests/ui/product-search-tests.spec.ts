import { expect, test } from '../../fixtures/aos-fixture';
import { SEARCH_DATA } from '../../test-data/ui/search.data';

test.describe('Product Search', () => {
  test('TC-007: Search Box Can Be Opened From Header', async ({ homePage }) => {
    const searchTerm = SEARCH_DATA.validSearchTerm;

    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Verify the header search option is visible', async () => {
      await homePage.verifyHeaderIsVisible();
      await homePage.verifySearchOptionIsVisible();
    });

    await test.step('Open the search box from the header', async () => {
      await homePage.openSearchBoxFromHeader();
    });

    await test.step('Verify the search box is visible', async () => {
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Verify that text can be entered', async () => {
      await homePage.fillSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });
  });

  test('TC-008: Search Box Can Be Closed Without Affecting Current Page', async ({ homePage }) => {
    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Open the search box', async () => {
      await homePage.openSearchBoxFromHeader();
    });

    await test.step('Verify the search box is visible', async () => {
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Close the search box', async () => {
      await homePage.closeSearchBox();
    });

    await test.step('Verify the search box is not visible', async () => {
      await homePage.verifySearchBoxIsNotVisible();
    });

    await test.step('Verify the current page remains unchanged', async () => {
      await homePage.verifyUserRemainsOnHomePage();
    });

    await test.step('Verify no search results are displayed', async () => {
      await homePage.verifySearchResultsAreNotDisplayed();
    });
  });

  test('TC-009: Search Suggestions Are Displayed While Typing', async ({ homePage }) => {
    const searchTerm = SEARCH_DATA.validSearchTerm;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Search' },
      { type: 'story', description: 'Search suggestions while typing' },
      { type: 'tag', description: 'FR-013' },
      { type: 'tag', description: 'FR-014' },
      { type: 'tag', description: 'FR-015' },
    );

    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Open the search box', async () => {
      await homePage.openSearchBoxFromHeader();
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Type a valid search term', async () => {
      await homePage.typeSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });

    await test.step('Verify suggestions panel is visible', async () => {
      await homePage.verifySuggestionsPanelIsVisible(searchTerm);
    });

    await test.step('Verify related categories are displayed', async () => {
      await homePage.verifySuggestedCategoriesAreVisible();
    });

    await test.step('Verify top results title is visible', async () => {
      await homePage.verifyTopResultsTitleIsVisible(searchTerm);
    });

    await test.step('Verify at least one product suggestion is visible', async () => {
      await homePage.verifyProductSuggestionsAreVisible();
    });

    await test.step('Verify View All is visible', async () => {
      await homePage.verifyViewAllIsVisible();
    });
  });

  test('TC-010: Search Returns Matching Products', async ({ homePage, searchResultsPage }) => {
    const searchTerm = SEARCH_DATA.validSearchTerm;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Search' },
      { type: 'story', description: 'Search returns matching products' },
      { type: 'tag', description: 'FR-016' },
      { type: 'tag', description: 'FR-017' },
    );

    await test.step('Open the AOS application', async () => {
      await homePage.open();
    });

    await test.step('Open the Search Box', async () => {
      await homePage.openSearchBoxFromHeader();
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Enter a valid search term', async () => {
      await homePage.typeSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });

    await test.step('Verify matching suggestions are displayed', async () => {
      await homePage.verifySuggestionsPanelIsVisible(searchTerm);
      await homePage.verifyProductSuggestionsAreVisible();
    });

    await test.step('Submit the search', async () => {
      await homePage.submitSearch();
    });

    await test.step('Verify the Search Results page is opened', async () => {
      await searchResultsPage.verifySearchResultsPageIsDisplayed();
    });

    await test.step('Close the search overlay', async () => {
      await homePage.closeSearchBox();
    });

    await test.step('Verify the Search Results page remains displayed', async () => {
      await searchResultsPage.verifySearchResultsPageIsDisplayed();
    });

    await test.step('Verify matching products are displayed', async () => {
      await searchResultsPage.verifyAtLeastOneResultIsDisplayed();
      await searchResultsPage.verifyResultsMatchSearchTerm(searchTerm);
    });

    await test.step('Verify each result contains basic product information', async () => {
      await searchResultsPage.verifyEachResultContainsBasicProductInformation();
    });
  });

  test('TC-011: User Can Open Product Details From Search Results', async ({
    homePage,
    productDetailsPage,
    searchResultsPage,
  }) => {
    const searchTerm = SEARCH_DATA.validSearchTerm;
    let expectedProductName = '';

    test.info().annotations.push(
      { type: 'feature', description: 'Product Search' },
      { type: 'story', description: 'Open product details from search results' },
      { type: 'tag', description: 'FR-016' },
      { type: 'tag', description: 'FR-017' },
    );

    await test.step('Open the AOS application', async () => {
      await homePage.open();
    });

    await test.step('Open the Search Box', async () => {
      await homePage.openSearchBoxFromHeader();
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Enter a valid search term', async () => {
      await homePage.typeSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });

    await test.step('Verify matching suggestions are displayed', async () => {
      await homePage.verifySuggestionsPanelIsVisible(searchTerm);
      await homePage.verifyProductSuggestionsAreVisible();
    });

    await test.step('Submit the search', async () => {
      await homePage.submitSearch();
    });

    await test.step('Verify the Search Results page is opened', async () => {
      await searchResultsPage.verifySearchResultsPageIsDisplayed();
    });

    await test.step('Close the search overlay', async () => {
      await homePage.closeSearchBox();
    });

    await test.step('Capture the first product name from Search Results', async () => {
      await searchResultsPage.verifyAtLeastOneResultIsDisplayed();
      expectedProductName = await searchResultsPage.getProductName();
    });

    await test.step('Open the selected product details', async () => {
      await searchResultsPage.openProduct();
    });

    await test.step('Verify the Product Details page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify the selected product details are opened', async () => {
      const actualProductName = await productDetailsPage.getProductName();
      expect(actualProductName.trim().toLowerCase()).toBe(expectedProductName.trim().toLowerCase());
    });
  });

  test('TC-012: Search Results Can Be Filtered', async ({ homePage, searchResultsPage }) => {
    const searchTerm = SEARCH_DATA.filterSearchTerm;
    const categoryFilter = SEARCH_DATA.laptopCategory;
    let initialResultCount = 0;
    let filteredResultCount = 0;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Search' },
      { type: 'story', description: 'Filter search results by category' },
      { type: 'tag', description: 'FR-018' },
    );

    await test.step('Open the AOS application', async () => {
      await homePage.open();
    });

    await test.step('Open the Search Box', async () => {
      await homePage.openSearchBoxFromHeader();
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Enter a search term with mixed category results', async () => {
      await homePage.typeSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });

    await test.step('Submit the search', async () => {
      await homePage.submitSearch();
    });

    await test.step('Verify results exist before applying the filter', async () => {
      await searchResultsPage.verifySearchResultsPageIsDisplayed();
      await homePage.closeSearchBox();
      await searchResultsPage.verifyAtLeastOneResultIsDisplayed();
      initialResultCount = await searchResultsPage.getResultCount();
      expect(initialResultCount).toBeGreaterThan(0);
    });

    await test.step('Apply the LAPTOPS category filter', async () => {
      await searchResultsPage.applyCategoryFilter(categoryFilter);
    });

    await test.step('Verify the LAPTOPS category filter is selected', async () => {
      expect(await searchResultsPage.isCategoryFilterSelected(categoryFilter)).toBe(true);
    });

    await test.step('Verify the results are refined after applying the filter', async () => {
      filteredResultCount = await searchResultsPage.getResultCount();
      expect(filteredResultCount).toBeGreaterThan(0);
      expect(filteredResultCount).toBeLessThan(initialResultCount);
    });

  });

  test('TC-013: Search Text Can Be Cleared', async ({ homePage }) => {
    const searchTerm = SEARCH_DATA.filterSearchTerm;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Search' },
      { type: 'story', description: 'Clear search text' },
      { type: 'tag', description: 'FR-019' },
    );

    await test.step('Open the AOS application', async () => {
      await homePage.open();
    });

    await test.step('Open the Search Box', async () => {
      await homePage.openSearchBoxFromHeader();
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Enter a valid search term', async () => {
      await homePage.typeSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });

    await test.step('Verify suggestions are displayed', async () => {
      await homePage.verifySuggestionsPanelIsVisible(searchTerm);
      await homePage.verifyProductSuggestionsAreVisible();
    });

    await test.step('Clear the search text using Backspace', async () => {
      await homePage.clearSearchBoxWithBackspace();
    });

    await test.step('Verify suggestions are not visible', async () => {
      await homePage.verifySuggestionsPanelIsNotVisible();
    });

    await test.step('Verify the search input is empty', async () => {
      await homePage.verifySearchBoxValue('');
    });

    await test.step('Verify the Search Box remains open', async () => {
      await homePage.verifySearchBoxIsVisible();
    });
  });

  test('TC-014: No Results Message Is Displayed For Unknown Search Terms', async ({ homePage, searchResultsPage }) => {
    const searchTerm = SEARCH_DATA.unknownSearchTerm;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Search' },
      { type: 'story', description: 'No results for unknown search terms' },
      { type: 'tag', description: 'FR-020' },
    );

    await test.step('Open the AOS application', async () => {
      await homePage.open();
    });

    await test.step('Open the Search Box', async () => {
      await homePage.openSearchBoxFromHeader();
      await homePage.verifySearchBoxIsVisible();
    });

    await test.step('Enter an unknown search term', async () => {
      await homePage.typeSearchBox(searchTerm);
      await homePage.verifySearchBoxValue(searchTerm);
    });

    await test.step('Submit the search', async () => {
      await homePage.submitSearch();
    });

    await test.step('Verify the Search Results page is displayed', async () => {
      await searchResultsPage.verifySearchResultsPageIsDisplayed();
    });

    await test.step('Verify no products are displayed', async () => {
      expect(await searchResultsPage.getResultCount()).toBe(0);
    });

    await test.step('Verify the no results message is displayed', async () => {
      await searchResultsPage.verifyNoResultsMessageIsDisplayed(searchTerm);
    });
  });
});
