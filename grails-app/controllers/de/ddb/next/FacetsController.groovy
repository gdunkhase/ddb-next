/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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


    }
}
