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

import java.util.regex.Pattern;

import net.sf.json.JSONNull

import groovy.json.JsonSlurper

class ApisController {
    
    def apisService
    
    def search(){

        def resultList = [:]
        def facets = []
        def highlightedTerms = []
        def docs = []
        def query = apisService.getQueryParameters(params)

        def jsonResp = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(),'/search', query)
        jsonResp.results["docs"].get(0).each{

            def tmpResult = [:]
            def title
            def subtitle
            def thumbnail
            def media = []

            def titleMatch = it.preview.toString() =~ /(?m)<div class="title">(.*?)<\/div>$/
            if (titleMatch)
                title= titleMatch[0][1]

            def subtitleMatch = it.preview.toString() =~ /(?m)<div class="subtitle">(.*?)<\/div>$/
            subtitle= (subtitleMatch)?subtitleMatch[0][1]:""

            def thumbnailMatch = it.preview.toString() =~ /(?m)<img src="(.*?)" \/>$/
            if (thumbnailMatch)
                thumbnail= thumbnailMatch[0][1]

            def mediaMatch = it.preview.toString() =~ /(?m)<div data-media="(.*?)"/
            if (mediaMatch)
                mediaMatch[0][1].split (",").each{ media.add(it) }

            tmpResult["id"] = it.id

            tmpResult["view"] = (it.view instanceof JSONNull)?"":it.view
            tmpResult["label"] = (it.label instanceof JSONNull)?"":it.label
            tmpResult["latitude"] = (it.latitude instanceof JSONNull)?"":it.latitude
            tmpResult["longitude"] = (it.longitude instanceof JSONNull)?"":it.longitude
            tmpResult["category"] = (it.category instanceof JSONNull)?"":it.category
            
            def properties = [:]

            tmpResult["preview"] = [title:title, subtitle: subtitle, media: media, thumbnail: thumbnail]
            tmpResult["properties"] = properties
            docs.add(tmpResult)
        }
        apisService.fetchItemsProperties(jsonResp.results["docs"].get(0)).eachWithIndex() {
          obj, i ->
          docs[i].properties = obj
        }
        resultList["facets"] = jsonResp.facets
        resultList["highlightedTerms"] = jsonResp.highlightedTerms
        resultList["results"] = [name:jsonResp.results.name,docs:docs,numberOfDocs:jsonResp.results.numberOfDocs]
        resultList["numberOfResults"] = jsonResp.numberOfResults
        resultList["randomSeed"] = jsonResp.randomSeed

        render (contentType:"text/json"){resultList}
    }
}
