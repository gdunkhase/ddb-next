package de.ddb.next



/**
 * Controller for Advanced Search
 * 
 * @author mih
 *
 */
class AdvancedsearchController {

    private static final String enumSearchType = "ENUM"
    private static final String textSearchType = "TEXT"
    private static final String languageTagPrefix = "ddbnext.facet_"
    private static final String facetNameSuffix = "_fct"
    private static final String labelSortType = "ALPHA_LABEL"

    def messageSource

    /**
     * render advanced search form
     * 
     * @return
     */
    def fillValues() {
        int searchGroupCount = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.searchGroupCount)
        int searchFieldCount = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.searchFieldCount)
        String url = grailsApplication.config.ddb.backend.url
        List facetSearchfields = new Facets(url:url).getExtendedFacets()
        Map facetValuesMap = getFacetValues(facetSearchfields)

		render(view: "/search/advancedsearch", model: [searchGroupCount: searchGroupCount, 
														searchFieldCount: searchFieldCount,
														facetSearchfields: facetSearchfields, 
														facetValuesMap : facetValuesMap,
														textSearchType : textSearchType,
														languageTagPrefix : languageTagPrefix,
														facetNameSuffix : facetNameSuffix,
														labelSortType : labelSortType,
														enumSearchType : enumSearchType])
    }

    /**
     * Take form-parameters from advanced-search-form, generate query and call search with query.
     * 
     * @throws IOException
     */
    def executeSearch() throws IOException {
        int searchGroupCount = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.searchGroupCount)
        int searchFieldCount = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.searchFieldCount)
        int offset = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.defaultOffset)
        int rows = Integer.parseInt(grailsApplication.config.ddb.advancedSearch.defaultRows)
        def url = grailsApplication.config.ddb.backend.url
        def facetSearchfields = new Facets(url:url).getExtendedFacets()

        AdvancedSearchFormToQueryConverter converter =
                new AdvancedSearchFormToQueryConverter(params, searchGroupCount, searchFieldCount, facetSearchfields)
        String query = converter.convertFormParameters()
        redirect(uri: "/search?query=" + query + "&offset=" + offset + "&rows=" + rows)
    }

	/**
     * request facet-values (for select-box) for all facets that are searchable.
     * fill results in global variable facetValuesMap (key: name of facet, value: map with value, display-value, sorted)
     * 
     */
    private Map getFacetValues(facetSearchfields) {
		def facetValuesMap = [:]
        def url = grailsApplication.config.ddb.backend.url
        def facetsRequester = new Facets(url:url)
        for ( facetSearchfield in facetSearchfields ) {
            if (facetSearchfield.searchType.equals(enumSearchType)) {
                def facetValues = facetsRequester.getFacet(facetSearchfield.name + facetNameSuffix)
                def facetDisplayValuesMap = new TreeMap()
                for (facetValue in facetValues) {
					//translate because of sorting
                    facetDisplayValuesMap[facetValue] = getMessage("ddbnext." + facetSearchfield.name + facetNameSuffix + "_" + facetValue)
                }
                if (facetSearchfield.sortType != null && facetSearchfield.sortType.equals(labelSortType)) {
                    facetDisplayValuesMap = facetDisplayValuesMap.sort {it.value}
                }
                else {
                    facetDisplayValuesMap = facetDisplayValuesMap.sort {it.key}
                }

                facetValuesMap[facetSearchfield.name + facetNameSuffix] = facetDisplayValuesMap
            }
        }
		return facetValuesMap
    }

    /**
     * get display-value language-dependent.
     * 
     * @param name fieldname
     * @return String translated display-value
     */
    private String getMessage(name) {
        return messageSource.getMessage(name,null, request.getLocale())
    }
}
