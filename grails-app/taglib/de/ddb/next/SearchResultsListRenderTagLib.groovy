package de.ddb.next

class SearchResultsListRenderTagLib {
    /**
     * Renders the item results.
     *
     * @attr results REQUIRED organizations list
     */
    def searchService
    def itemResultsRender = { attrs, body ->
        out << render(template:"/search/resultsList", model:[results: attrs.results, urlParams: attrs.urlParams, confBinary: grailsApplication.config.ddb.binary.url])
    }

    def truncateItemTitle = { attrs, body ->
        out << searchService.trimTitle(attrs.title.toString(), attrs.length)
    }
    def truncateHovercardTitle = { attrs, body ->
        out << searchService.trimString(attrs.title.toString().replaceAll("<match>", "").replaceAll("</match>", ""), attrs.length)
    }
}
