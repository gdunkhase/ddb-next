package de.ddb.next


class SearchController {

    static defaultAction = "results"

    def results() {
        def urlQuery = SearchService.convertQueryParametersToSearchParameters(params)
        def firstLastQuery = SearchService.convertQueryParametersToSearchParameters(params)
        def mainFacetsUrl = SearchService.buildMainFacetsUrl(params, urlQuery, request)

        def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)

        if (resultsItems != null && resultsItems["numberOfResults"] != null && (Integer)resultsItems["numberOfResults"] > 0) {
            //check for lastHit and firstHit
            //firstHit
            firstLastQuery["rows"] = 1
            firstLastQuery["offset"] = 0
            def firstHit = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', firstLastQuery)
            if (firstHit != null && firstHit["numberOfResults"] != null && (Integer)firstHit["numberOfResults"] > 0) {
                params["firstHit"] = firstHit["results"]["docs"][0].id
            }
            
            //lastHit
            firstLastQuery["offset"] = resultsItems["numberOfResults"] - 1
            def lastHit = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', firstLastQuery)
            if (lastHit != null && lastHit["numberOfResults"] != null && (Integer)lastHit["numberOfResults"] > 0) {
                params["lastHit"] = lastHit["results"]["docs"][0].id
            }
        }

        //Calculating results details info (number of results in page, total results number)
        def resultsOverallIndex = (urlQuery["offset"].toInteger()+1)+' - ' +
                ((urlQuery["offset"].toInteger()+
                urlQuery["rows"].toInteger()>resultsItems.numberOfResults)? resultsItems.numberOfResults:urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger())

        //Calculating results pagination (previous page, next page, first page, and last page)
        def pagesOverallIndex = message(code:"ddbnext.Page")+" "+
        ((urlQuery["offset"].toInteger()/urlQuery["rows"].toInteger())+1).toString()+" "+
        message(code:"ddbnext.Of")+" "+
        (Math.ceil(resultsItems.numberOfResults/urlQuery["rows"].toInteger()).toInteger())

        def resultsPaginatorOptions = SearchService.buildPaginatorOptions(urlQuery)
        def numberOfResultsFormatted = String.format("%,d", resultsItems.numberOfResults.toInteger())
        
        if(params.reqType=="ajax"){
            def resultsHTML = g.render(template:"/search/resultsList",model:[results: resultsItems.results["docs"], viewType:  urlQuery["viewType"],confBinary: grailsApplication.config.ddb.binary.url,
                    itemDetailGetParams: SearchService.getItemDetailGetParameters(params)]).replaceAll("\r\n", '')
            def jsonReturn = [results: resultsHTML,
                resultsPaginatorOptions: resultsPaginatorOptions,
                resultsOverallIndex:resultsOverallIndex,
                pagesOverallIndex: pagesOverallIndex,
                paginationURL: SearchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+request.getQueryString().replaceAll("&reqType=ajax","")),
                numberOfResults: numberOfResultsFormatted,
                itemDetailGetParams: SearchService.getItemDetailGetParameters(params)
            ]
            render (contentType:"text/json"){jsonReturn}
        }
        else{
            //We want to build the subfacets urls only if a main facet has been selected
            def subFacetsUrl = [:]
            if(urlQuery["facet"]){
                subFacetsUrl = SearchService.buildSubFacetsUrl(resultsItems.facets, mainFacetsUrl, urlQuery)
            }
            render(view: "results", model: [
                results: resultsItems,
                isThumbnailFiltered: params.isThumbnailFiltered,
                clearFilters: SearchService.buildClearFilter(urlQuery, request.forwardURI),
                viewType:  urlQuery["viewType"],
                facets: [mainFacetsUrl: mainFacetsUrl, subFacetsUrl: subFacetsUrl],
                resultsPaginatorOptions: resultsPaginatorOptions,
                resultsOverallIndex:resultsOverallIndex,
                pagesOverallIndex: pagesOverallIndex,
                paginationURL: SearchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+request.getQueryString()),
                numberOfResultsFormatted: numberOfResultsFormatted,
                itemDetailGetParams: SearchService.getItemDetailGetParameters(params)
            ])
        }
    }
    
}
