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
        def urlQuery = [:]
        if (params.searchQuery == null)
            urlQuery["query"] = '*'
        else urlQuery["query"] = params.searchQuery
        
        if (params.rows == null)
            urlQuery["rows"] = 11
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
        
        def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)
        
        def facetValues = searchService.getSelectedFacetValues(resultsItems.facets, params.name, urlQuery["rows"].toInteger())
        
        render (contentType:"text/json"){facetValues}
    }
}