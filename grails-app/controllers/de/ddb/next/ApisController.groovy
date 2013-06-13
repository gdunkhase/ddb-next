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

import net.sf.json.JSONNull

import grails.converters.JSON
import java.text.SimpleDateFormat

class ApisController {

    def apisService
    def configurationService

    def search(){

        def resultList = [:]
        def facets = []
        def highlightedTerms = []
        def correctedQuery = ""
        def docs = []
        def query = apisService.getQueryParameters(params)
        def slurper = new XmlSlurper()

        slurper.setKeepWhitespace(true)

        def apiResponse = ApiConsumer.getJson(configurationService.getBackendUrl(),'/search', false, query)
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def jsonResp = apiResponse.getResponse()


        jsonResp.results["docs"].get(0).each{

            def tmpResult = [:]
            String title
            String subtitle
            def thumbnail
            def media = []

            title = (it.title instanceof JSONNull)?"":it.title
            subtitle = (it.subtitle instanceof JSONNull)?"":it.subtitle

            thumbnail = (it.thumbnail instanceof JSONNull)?"":it.thumbnail
            if(!(it.media instanceof JSONNull)){
                it.media.split (",").each{ media.add(it) }
            }

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
        if(jsonResp.results["docs"].get(0).size()>0){
            apisService.fetchItemsProperties(jsonResp.results["docs"].get(0)).eachWithIndex() { obj, i ->
                docs[i].properties = obj
            }
        }
        resultList["facets"] = jsonResp.facets
        resultList["highlightedTerms"] = jsonResp.highlightedTerms
        resultList["correctedQuery"] = jsonResp.correctedQuery
        resultList["results"] = [name:jsonResp.results.name,docs:docs,numberOfDocs:jsonResp.results.numberOfDocs]
        resultList["numberOfResults"] = jsonResp.numberOfResults
        resultList["randomSeed"] = jsonResp.randomSeed
        render (contentType:"text/json"){resultList}
    }

    def institutionsmap(){
        def apiResponse = ApiConsumer.getJson(configurationService.getBackendUrl(),'/institutions/map', false, params)
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def jsonResp = apiResponse.getResponse()
        render (contentType:"text/json"){jsonResp}
    }

    /**
     * This function should be obsolete once the
     * url : "http://backend.deutsche-digitale-bibliothek.de:9998/search/suggest/", would support JSONP and return the callback function
     * If that happens, the "myautocomplete.js" script should refer to the backend URL and not to this URL.
     * @return
     */
    def autocomplete (){
        def query = apisService.getQueryParameters(params)
        def callback = apisService.getQueryParameters(params)
        def apiResponse = ApiConsumer.getJson(configurationService.getBackendUrl(),'/search/suggest', false, query)
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def result = apiResponse.getResponse()
        if (callback) {
            render "${params.callback}(${result as JSON})"
        } else {
            render (contentType:"text/json"){result}
        }
    }

    /**
     * Wrapper to support streaming of files from the backend
     * @return OutPutStream
     */
    synchronized def binary(){
        def apiResponse = ApiConsumer.getBinaryStreaming(configurationService.getBackendUrl() + "/binary/", getFileNamePath(), response.outputStream)

        if(!apiResponse.isOk()){
            log.error "binary(): binary content was not found"
            apiResponse.throwException(request)
        }

        def responseObject = apiResponse.getResponse()

        def cacheExpiryInDays = 1
        response.setHeader("Cache-Control", "max-age="+cacheExpiryInDays * 24 * 60 *60)
        response.setHeader("Expires", formatDateForExpiresHeader(cacheExpiryInDays).toString())
        response.setHeader("Content-Disposition", "inline; filename=" + getFileNamePath().tokenize('/')[-1])
        response.setContentType(responseObject.get("Content-Type"))
        response.setContentLength(responseObject.get("Content-Length").toInteger())
    }

    def staticFiles() {
        def apiResponse = ApiConsumer.getBinaryStreaming(
                configurationService.getStaticUrl(),
                '/static/' + getFileNamePath(),
                response.outputStream)

        if(!apiResponse.isOk()){
            log.error "binary(): binary content was not found"
            apiResponse.throwException(request)
        }

        def responseObject = apiResponse.getResponse()

        def cacheExpiryInDays = 1
        response.setHeader("Cache-Control", "max-age="+cacheExpiryInDays * 24 * 60 *60)
        response.setHeader("Expires", formatDateForExpiresHeader(cacheExpiryInDays).toString())
        response.setHeader("Content-Disposition", "inline; filename=" + ('/static/' + getFileNamePath()).tokenize('/')[-1])
        response.setContentType(responseObject.get("Content-Type"))
        response.setContentLength(responseObject.get("Content-Length").toInteger())
    }

    /**
     *  Format RFC 2822 date
     *  @parameters daysfromtoday, how many days from today do you want the date to be shifted
     *  @return date
     */
    private def formatDateForExpiresHeader(daysfromtoday=4){
        def tomorrow= new Date()+daysfromtoday
        String pattern = "EEE, dd MMM yyyy HH:mm:ss Z";
        SimpleDateFormat format = new SimpleDateFormat(pattern, SupportedLocales.EN.getLocale());
        String tomorrowString = String.format(SupportedLocales.EN.getLocale(), '%ta, %<te %<tb %<tY %<tT CET', tomorrow)
        Date date = format.parse(tomorrowString);
        return date
    }

    private def getFileNamePath() {
        return cleanHtml(params.filename, 'none')
    }
}
