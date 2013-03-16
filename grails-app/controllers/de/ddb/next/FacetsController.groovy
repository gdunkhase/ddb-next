package de.ddb.next


/**
 * Invoked from ajax request during the selection of filters for the search results page
 * 
 * @author ema
 *
 */
class FacetsController {

    static defaultAction = "facets"

    def searchService


    def facetsList() {
        try {
            def urlQuery = [:]
            if (params.searchQuery == null)
                urlQuery["query"] = '*'
            else urlQuery["query"] = params.searchQuery

            if (params.rows == null || params.rows == -1)
              urlQuery["rows"] = 1
            else urlQuery["rows"] = params.rows

            if (params.offset == null)
                urlQuery["offset"] = 0
            else urlQuery["offset"] = params.offset

            //<--input query=rom&offset=0&rows=20&facetValues%5B%5D=time_fct%3Dtime_61800&facetValues%5B%5D=time_fct%3Dtime_60100&facetValues%5B%5D=place_fct%3DItalien
            //-->output query=rom&offset=0&rows=20&facet=time_fct&time_fct=time_61800&facet=time_fct&time_fct=time_60100&facet=place_fct&place_fct=Italien
            if(params["facetValues[]"]){
                urlQuery = searchService.getFacets(params, urlQuery,"facet", 0)
            }

            if(params.get("name")){
                urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
                if(!urlQuery["facet"].contains(params.get("name")))
                    urlQuery["facet"].add(params.get("name"))
            }
            
            //We ask for a maximum of 310 facets
            urlQuery["facet.limit"] = 310
            
            def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)

            def facetValues = searchService.getSelectedFacetValues(resultsItems.facets, params.name, urlQuery["rows"].toInteger())

            render (contentType:"text/json"){facetValues}

        } catch(MissingPropertyException mpe){
            log.error "facetsList(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "facetsList(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }

    }
}
