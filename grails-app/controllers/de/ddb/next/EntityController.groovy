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

class EntityController {

    def cultureGraphService
    def configurationService

    def show() {

        def entityId = params.id

        if(!entityId){
            entityId = "118540238"
        }

        def jsonGraph = cultureGraphService.getCultureGraph(entityId)
        def xmlDnb = cultureGraphService.getDNBInformation(entityId)

        def entity = [:]

        println "########################### 1 " + jsonGraph
        println "########################### 2 " + xmlDnb

        //------------------------- External links -------------------------------

        entity["externalLinks"] = jsonGraph.seeAlso

        println "########################### 3 " + entity["externalLinks"]

        //------------------------- Thumbnail information -------------------------------

        entity["thumbnail"] = jsonGraph.thumbnail

        println "########################### 4 " + entity["thumbnail"]

        //------------------------- Entity type (person, etc) -------------------------------

        def entityType = jsonGraph.type

        println "########################### 5 " + entityType

        //------------------------- Titel (Name of entity) -------------------------------

        entity["title"] = jsonGraph[entityType].name

        println "########################### 6 " + entity["title"]

        //------------------------- Birth/Death date -------------------------------

        entity["dateOfBirth"] = xmlDnb.breadthFirst().find {
            it.name() == "dateOfBirth"
        }[0].text()
        entity["dateOfDeath"] = xmlDnb.breadthFirst().find {
            it.name() == "dateOfDeath"
        }[0].text()

        //------------------------- Birth/Death place -------------------------------

        def dnbPlaceOfBirthUrl = xmlDnb.breadthFirst().find {it.name() == "placeOfBirth"}?."@rdf:resource"?.text()
        if(dnbPlaceOfBirthUrl){
            def dnbPlaceOfBirthId = dnbPlaceOfBirthUrl.substring(dnbPlaceOfBirthUrl.lastIndexOf("/")+1)
            def xmlDnbPlaceOfBirth = cultureGraphService.getDNBInformation(dnbPlaceOfBirthId)
            entity["placeOfBirth"] = xmlDnbPlaceOfBirth.breadthFirst().find {
                it.name() == "preferredNameForThePlaceOrGeographicName"
            }[0].text()
        }

        def dnbPlaceOfDeathUrl = xmlDnb.breadthFirst().find {it.name() == "placeOfDeath"}?."@rdf:resource"?.text()
        if(dnbPlaceOfDeathUrl){
            def dnbPlaceOfDeathId = dnbPlaceOfDeathUrl.substring(dnbPlaceOfDeathUrl.lastIndexOf("/")+1)
            def xmlDnbPlaceOfDeath = cultureGraphService.getDNBInformation(dnbPlaceOfDeathId)
            entity["placeOfDeath"] = xmlDnbPlaceOfDeath.breadthFirst().find {
                it.name() == "preferredNameForThePlaceOrGeographicName"
            }[0].text()
        }

        println "########################### 11 " + entity["placeOfBirth"]
        println "########################### 12 " + entity["placeOfDeath"]

        //------------------------- Professions -------------------------------

        def dnbProfessionUrls = xmlDnb.breadthFirst().findAll {it.name() == "professionOrOccupation"}."@rdf:resource".collect {it.text()}
        def dnbProfessionIds = dnbProfessionUrls.collect {it.substring(it.lastIndexOf("/")+1)}

        def professions = []
        dnbProfessionIds.each {
            def xmlProfession = cultureGraphService.getDNBInformation(it)
            def professionName = xmlProfession.breadthFirst().find {it.name() == "preferredNameForTheSubjectHeading"}[0].text()
            professions.add(professionName)
        }

        entity["professions"] = professions.join(', ')

        println "########################### 13 " + dnbProfessionUrls
        println "########################### 14 " + dnbProfessionIds
        println "########################### 15 " + entity["professions"]

        //------------------------- Search preview -------------------------------

        def searchPreview = [:]

        def searchQuery = ["query": entity["title"], "rows": 4, "offset": 0, "sort": "RELEVANCE", "facet": "type_fct", "type_fct": "mediatype_002"]
        ApiResponse apiResponseSearch = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, searchQuery)
        if(!apiResponseSearch.isOk()){
            log.error "show(): Search response contained error"
            apiResponseSearch.throwException(request)
        }
        def jsonSearchResult = apiResponseSearch.getResponse()

        println "########################### 16 " + jsonSearchResult

        searchPreview["items"] = jsonSearchResult.results.docs
        searchPreview["resultCount"] = jsonSearchResult.numberOfResults

        println "########################### 17 " + entity["searchPreviews"]
        println "########################### 18 " + entity["searchPreviewCount"]

        //------------------------- Search preview media type count -------------------------------

        searchPreview["pictureCount"] = getResultCountsForFacetType(entity["title"], "mediatype_002")

        println "########################### 19 " + searchPreview["pictureCount"]

        searchPreview["videoCount"] = getResultCountsForFacetType(entity["title"], "mediatype_005")

        println "########################### 20 " + searchPreview["videoCount"]

        searchPreview["audioCount"] = getResultCountsForFacetType(entity["title"], "mediatype_001")

        println "########################### 21 " + searchPreview["audioCount"]

        entity["searchPreview"] = searchPreview

        render(view: 'entity', model: ["entity": entity])
    }

    public def getAjaxSearchResultsAsJson() {

        def query = params.query
        def offset = params.offset
        def rows = params.rows

        println "###################### 1b "+query+" / "+offset+" / "+rows

        def searchQuery = ["query": query, "rows": rows, "offset": offset, "sort": "RELEVANCE"]
        ApiResponse apiResponseSearch = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, searchQuery)
        if(!apiResponseSearch.isOk()){
            log.error "getAjaxSearchResultsAsJson(): Search response contained error"
            apiResponseSearch.throwException(request)
        }

        def results = []

        def backendResult = apiResponseSearch.getResponse()
        backendResult.results.docs.each {
            def item = [:]
            item["thumbnail"] = it.preview.thumbnail
            item["label"] = it.label
            item["id"] = it.id

            results.add(item)
        }

        println "###################### 2b "+results


        render (contentType:"text/json"){results}
    }

    private def getResultCountsForFacetType(def searchString, def facetType) {

        def searchQuery = ["query": searchString, "rows": 0, "offset": 0, "sort": "RELEVANCE", "facet": "type_fct", "type_fct": facetType]
        ApiResponse apiResponse = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, searchQuery)
        if(!apiResponse.isOk()){
            log.error "getResultCountsForFacetType(): Search response contained error"
            apiResponse.throwException(request)
        }

        return apiResponse.getResponse().numberOfResults

    }

}
