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

import groovy.json.JsonSlurper

import org.springframework.web.servlet.support.RequestContextUtils


class SearchController {

    static defaultAction = "results"

    def searchService

    def results() {

        def searchParametersMap = searchService.getSearchCookieAsMap(request, request.cookies)
        def additionalParams = [:]
        if (searchService.checkPersistentFacets(searchParametersMap, params, additionalParams)) {
            redirect(controller: "search", action: "results", params: params)
        }
        def urlQuery = searchService.convertQueryParametersToSearchParameters(params)
        def firstLastQuery = searchService.convertQueryParametersToSearchParameters(params)
        def mainFacetsUrl = searchService.buildMainFacetsUrl(params, urlQuery, request)

        def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)

        if(resultsItems["randomSeed"]){
            urlQuery["randomSeed"] = resultsItems["randomSeed"]
            firstLastQuery["sort"] = resultsItems["randomSeed"]
            if (!params.sort) {
                params.sort = urlQuery["randomSeed"]
            }
        }

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
            //Workaround, find id of last hit when calling last hit.
            //Set id to "lasthit" to signal ItemController to find id of lasthit.
            params["lastHit"] = "lasthit"

            //                firstLastQuery["offset"] = resultsItems["numberOfResults"] - 1
            //                def lastHit = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', firstLastQuery)
            //                if (lastHit != null && lastHit["numberOfResults"] != null && (Integer)lastHit["numberOfResults"] > 0) {
            //                    params["lastHit"] = lastHit["results"]["docs"][0].id
            //                }
        }

        //create cookie with search parameters
        response.addCookie(searchService.createSearchCookie(request, params, additionalParams))

        //Calculating results details info (number of results in page, total results number)
        def resultsOverallIndex = (urlQuery["offset"].toInteger()+1)+' - ' +
                ((urlQuery["offset"].toInteger()+
                urlQuery["rows"].toInteger()>resultsItems.numberOfResults)? resultsItems.numberOfResults:urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger())

        //Calculating results pagination (previous page, next page, first page, and last page)
        def page = ((urlQuery["offset"].toInteger()/urlQuery["rows"].toInteger())+1).toString()
        def totalPages = (Math.ceil(resultsItems.numberOfResults/urlQuery["rows"].toInteger()).toInteger())

        def resultsPaginatorOptions = searchService.buildPaginatorOptions(urlQuery)
        def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
        def numberOfResultsFormatted = String.format(locale, "%,d", resultsItems.numberOfResults.toInteger())

        def queryString = request.getQueryString()

        if(!queryString?.contains("sort=random") && urlQuery["randomSeed"])
            queryString = queryString+"&sort="+urlQuery["randomSeed"]

        if(params.reqType=="ajax"){
            def resultsHTML = ""
            resultsHTML = g.render(template:"/search/resultsList",model:[results: resultsItems.results["docs"], viewType:  urlQuery["viewType"],confBinary: request.getContextPath(),
                offset: params["offset"]]).replaceAll("\r\n", '')
            def jsonReturn = [results: resultsHTML,
                resultsPaginatorOptions: resultsPaginatorOptions,
                resultsOverallIndex:resultsOverallIndex,
                page: page,
                totalPages: totalPages,
                paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString.replaceAll("&reqType=ajax","")),
                numberOfResults: numberOfResultsFormatted,
                offset: params["offset"]
            ]
            render (contentType:"text/json"){jsonReturn}
        }
        else{
            //We want to build the subfacets urls only if a main facet has been selected
            def keepFiltersChecked = ""
            if (searchParametersMap["keepFilters"] && searchParametersMap["keepFilters"] == "true") {
                keepFiltersChecked = "checked=\"checked\""
            }
            def subFacetsUrl = [:]
            def selectedFacets = searchService.buildSubFacets(urlQuery)
            if(urlQuery["facet"]){
                subFacetsUrl = searchService.buildSubFacetsUrl(selectedFacets, mainFacetsUrl, urlQuery)
            }
            render(view: "results", model: [
                title: urlQuery["query"],
                results: resultsItems,
                isThumbnailFiltered: params.isThumbnailFiltered,
                clearFilters: searchService.buildClearFilter(urlQuery, request.forwardURI),
                correctedQuery:resultsItems["correctedQuery"],
                viewType:  urlQuery["viewType"],
                facets: [selectedFacets: selectedFacets, mainFacetsUrl: mainFacetsUrl, subFacetsUrl: subFacetsUrl],
                resultsPaginatorOptions: resultsPaginatorOptions,
                resultsOverallIndex:resultsOverallIndex,
                page: page,
                totalPages: totalPages,
                paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString),
                numberOfResultsFormatted: numberOfResultsFormatted,
                offset: params["offset"],
                keepFiltersChecked: keepFiltersChecked
            ])
        }


    }

    def informationItem(){
        def informationItem = ApiConsumer.getTextAsXml(grailsApplication.config.ddb.backend.url ,'/access/'+params.id+'/components/indexing-profile',null)

        def jsonSubresp = new JsonSlurper().parseText(informationItem.toString())

        def properties = [:]

        if(jsonSubresp.properties.time_fct){
            properties['time_fct']=[]
            jsonSubresp.properties.time_fct.each(){
                properties['time_fct'].add(message(code:"ddbnext.time_fct_"+it))
            }
        }
        if(jsonSubresp.properties.place_fct){
            properties['place_fct']=[]
            jsonSubresp.properties.place_fct.each(){
                properties['place_fct'].add(it)
            }
        }
        if(jsonSubresp.properties.affiliate_fct){
            properties['affiliate_fct']=[]
            jsonSubresp.properties.affiliate_fct.each(){
                properties['affiliate_fct'].add(it)
            }
        }
        if(jsonSubresp.properties.keywords_fct){
            properties['keywords_fct']=[]
            jsonSubresp.properties.keywords_fct.each(){
                properties['keywords_fct'].add(it)
            }
        }
        if(jsonSubresp.properties.type_fct){
            properties['type_fct']=[]
            jsonSubresp.properties.type_fct.each(){
                properties['type_fct'].add(message(code:"ddbnext.type_fct_"+it))
            }
        }
        if(jsonSubresp.properties.sector_fct){
            properties['sector_fct']=[]
            jsonSubresp.properties.sector_fct.each(){
                properties['sector_fct'].add(message(code:"ddbnext.sector_fct_"+it))
            }
        }
        if(jsonSubresp.properties.provider_fct){
            properties['provider_fct']=[]
            jsonSubresp.properties.provider_fct.each(){
                properties['provider_fct'].add(it)
            }
        }
        if(jsonSubresp.properties.language_fct){
            properties['language_fct']=[]
            jsonSubresp.properties.language_fct.each(){
                properties['language_fct'].add(message(code:"ddbnext.language_fct_"+it))
            }
        }
        render (contentType:"text/json"){properties}
    }


}
