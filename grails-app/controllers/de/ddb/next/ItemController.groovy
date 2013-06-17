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

import javax.servlet.http.HttpSession;
import de.ddb.next.beans.User;

import de.ddb.next.exception.ItemNotFoundException

class ItemController {
    
    private static final def HTTP ='http://'
    private static final def HTTPS ='https://'
    static defaultAction = "findById"

    def itemService
    def searchService
    def grailsLinkGenerator
    def configurationService

    def setFavorit(aid) {
        
    }

    def children() {
        def apiResponse = ApiConsumer.getJson(configurationService.getBackendUrl(),
                "/hierarchy/" + params.id + "/children", false,
                ["rows":501])
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def jsonResp = apiResponse.getResponse()

        render(contentType:"application/json", text: jsonResp)
    }

    def findById() {
        try {
            //Check if Item-Detail was called from search-result and fill parameters
            def searchResultParameters = handleSearchResultParameters(params, request)
            def id = params.id
            def item = itemService.findItemById(id)

            if("404".equals(item)){
                throw new ItemNotFoundException()
            }

            def binaryList = itemService.findBinariesById(id)
            def binariesCounter = itemService.binariesCounter(binaryList)

            def flashInformation = [:]
            flashInformation.all = [binaryList.size]
            flashInformation.images = [binariesCounter.images]
            flashInformation.audios = [binariesCounter.audios]
            flashInformation.videos = [binariesCounter.videos]

            if (item.pageLabel?.isEmpty()) {
                item.pageLabel= itemService.getItemTitle(id)
            }

            // TODO: handle 404 and failure separately. HTTP Status Code 404, should
            // to `not found` page _and_ Internal Error should go to `internal server
            // error` page. We should send also the HTTP Status Code 404 or 500 to the
            // Client.
            if(item == '404' || item?.failure) {
                redirect(controller: 'error')
            } else {
                def itemUri = request.forwardURI
                def fields = translate(item.fields, convertToHtmlLink)

                if(params.print){
                    renderPdf(template: "itemPdf", model: [itemUri: itemUri, viewerUri: item.viewerUri,
                        'title': item.title, item: item.item, itemId: id, institution : item.institution, fields: fields,
                        binaryList: binaryList, pageLabel: item.pageLabel,
                        firstHit: searchResultParameters["searchParametersMap"]["firstHit"], lastHit: searchResultParameters["searchParametersMap"]["lastHit"],
                        hitNumber: params["hitNumber"], results: searchResultParameters["resultsItems"], searchResultUri: searchResultParameters["searchResultUri"], 'flashInformation': flashInformation],
                    filename: "Item-Detail.pdf")
                }else{
                    render(view: "item", model: [itemUri: itemUri, viewerUri: item.viewerUri,
                        'title': item.title, item: item.item, itemId: id, institution : item.institution, fields: fields,
                        binaryList: binaryList, pageLabel: item.pageLabel,
                        firstHit: searchResultParameters["searchParametersMap"]["firstHit"], lastHit: searchResultParameters["searchParametersMap"]["lastHit"],
                        hitNumber: params["hitNumber"], results: searchResultParameters["resultsItems"], searchResultUri: searchResultParameters["searchResultUri"], 'flashInformation': flashInformation])

                }
            }
        } catch(ItemNotFoundException infe){
            log.error "findById(): Request for nonexisting item with id: '" + params?.id + "'. Going 404..."
            forward controller: "error", action: "notFound"
        }
    }

    def translate(fields, convertToHtmlLink) {
        fields.each {
            it = convertToHtmlLink(it)

            def messageKey = 'ddbnext.' + it.'@id'
            def translated = message(code: messageKey)
            if(translated != messageKey) {
                it.name = translated
            } else {
                it.name = it.name.toString().capitalize()
                log.warn 'can not find message property: ' + messageKey + ' use ' + it.name + ' instead.'
            }
        }
    }

    def convertToHtmlLink = { field ->
        def fieldValue = field.value?.toString()
        if(fieldValue.startsWith(HTTP) || fieldValue.startsWith(HTTPS)) {
            field.value = '<a href="' + fieldValue + '">' + fieldValue + '</a>'
        }
        return field
    }

    def parents() {
        def apiResponse = ApiConsumer.getJson(configurationService.getBackendUrl(), "/hierarchy/" + params.id + "/parent")
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def jsonResp = apiResponse.getResponse()
        render(contentType:"application/json", text: jsonResp)
    }

    /**
     * Get Data to build Search Result Navigation Bar for Item Detail View
     *
     * @param reqParameters requestParameters
     * @return Map with searchResult to build back + next links
     *  and searchResultUri for Link "Back to Search Result"
     */
    def handleSearchResultParameters(reqParameters, httpRequest) {
        def searchResultParameters = [:]
        searchResultParameters["searchParametersMap"] = [:]
        def searchParametersMap
        def resultsItems
        def searchResultUri
        searchParametersMap = searchService.getSearchCookieAsMap(httpRequest, httpRequest.cookies)
        if (!searchParametersMap || searchParametersMap.isEmpty()) {
            reqParameters["hitNumber"] = null
            return searchResultParameters
        }

        if (reqParameters["hitNumber"]) {
            def urlQuery = searchService.convertQueryParametersToSearchParameters(searchParametersMap)

            //Search and return 3 Hits: previous, current and last
            reqParameters["hitNumber"] = reqParameters["hitNumber"].toInteger()
            urlQuery["rows"] = 3
            if (reqParameters["hitNumber"] > 1) {
                urlQuery["offset"] = reqParameters["hitNumber"] - 2
            }
            else {
                urlQuery["offset"] = 0
            }
            def apiResponse = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, urlQuery)
            if(!apiResponse.isOk()){
                log.error "Json: Json file was not found"
                apiResponse.throwException(request)
            }
            resultsItems = apiResponse.getResponse()
    
            //Workaround for last-hit (Performance-issue)
            if (reqParameters.id && reqParameters.id.equals("lasthit")) {
                reqParameters.id = resultsItems.results["docs"][1].id
            }
            searchResultParameters["resultsItems"] = resultsItems
        }

        //generate link back to search-result. Calculate Offset.
        def searchGetParameters = searchService.getSearchGetParameters(searchParametersMap)
        def offset = 0
        if (reqParameters["hitNumber"] && searchParametersMap["rows"]) {
            offset = ((Integer)((reqParameters["hitNumber"]-1)/searchParametersMap["rows"]))*searchParametersMap["rows"]
        }
        searchGetParameters["offset"] = offset
        searchResultUri = grailsLinkGenerator.link(url: [controller: 'search', action: 'results', params: searchGetParameters ])
        searchResultParameters["searchResultUri"] = searchResultUri
        searchResultParameters["searchParametersMap"] = searchParametersMap

        return searchResultParameters
    }
    
    def changeItemState() {
        def itemId = params.id;
        HttpSession sessionObject = request.getSession(false)
        User vUser = null;
        if ((sessionObject != null) && ((vUser = sessionObject.getAttribute(User.SESSION_USER)) != null)) {
            log.info("Favorite: change itemState User-Email: " + vUser.getEmail() + ", item: " + itemId);
            FavoritesService vFavService = FavoritesService.getFevoritesService();
            if (vFavService != null) {
                if (vFavService.isFavorit(vUser.getEmail(), itemId)) {
                    log.info("add to favorits: ${itemId}");
                    vFavService.deleteFromFavoritesList(vUser.getEmail(), itemId);
                }
                else {
                    log.info("delete from favorits list: ${itemId}");
                    vFavService.addToFavorites(vUser.getEmail(), itemId);
                }
            }
            else {
                log.error("Favorites-Services not found");
            }
        }
        println "################## render - START"
        render (view: 'item', model: [id: itemId]);
        println "################## render - STOP"
        
    }
}
