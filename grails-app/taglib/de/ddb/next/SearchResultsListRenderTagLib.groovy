package de.ddb.next

class SearchResultsListRenderTagLib {
    /**
     * Renders the item results.
     *
     * @attr results REQUIRED organizations list
     */

    def itemResultsRender = { attrs, body ->
        out << render(template:"/search/resultsList", model:[results: attrs.results, urlParams: attrs.urlParams, confBinary: grailsApplication.config.ddb.binary.url])
    }

    def truncateItemTitle = { attrs, body ->
        out << SearchService.trimTitle(attrs.title.toString(), attrs.length)
    }
}
