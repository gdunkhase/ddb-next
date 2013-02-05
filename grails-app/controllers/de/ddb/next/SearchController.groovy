package de.ddb.next


class SearchController {

    static defaultAction = "results"

    def results() {
        def urlQuery = [ client: "DDB-NEXT" ]
        if (params.q!=null || params.query!=null){
            // FIXME remove q
            urlQuery = (params.q)?[ query: params.q ]:[query: params.query]
        }
        urlQuery["rows"] = 20
        def results = ItemResult.getAllItemsResult(urlQuery, grailsApplication.config.ddb.wsItemResults.toString())
        def pagesOverallIndex = message(code:"ddbnext.Page")+" 1 "+message(code:"ddbnext.Of")+" xxxxx"

        render(view: "results", model: [results: results, pagesOverallIndex: pagesOverallIndex])
    }
}
