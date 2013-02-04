package de.ddb.next

import de.ddb.frontend.Facets


/**
 * Controller for Advanced Search
 * 
 * @author mih
 *
 */
class AdvancedsearchController {

    /**
     * render advanced search form
     * 
     * @return
     */
    def fillValues() {
        render(view: "/search/advancedsearch")
    }

    /**
     * Take form-parameters from advanced-search-form, generate query and call search with query.
     * 
     * @throws IOException
     */
    def executeSearch() throws IOException {
        int searchGroupCount = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.searchGroupCount);
        int searchFieldCount = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.searchFieldCount);
        int offset = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.defaultOffset);
        int rows = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.defaultRows);
        def url = grailsApplication.config.ddb.backend.url;
        def facetSearchfields = new Facets(url:url).getExtendedFacets();

        AdvancedSearchFormToQueryConverter converter =
                new AdvancedSearchFormToQueryConverter(params, searchGroupCount, searchFieldCount, facetSearchfields);
        String query = converter.convertFormParameters();
        redirect(uri: "/search?query=" + query + "&offset=" + offset + "&rows=" + rows);
    }
}
