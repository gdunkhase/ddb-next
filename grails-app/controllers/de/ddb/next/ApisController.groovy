package de.ddb.next

import groovy.json.JsonSlurper

import org.json.simple.JSONValue

class ApisController {

    def search(){
        def resultList = [:]
        def facets = []

        def highlightedTerms = []
        def docs = []
        def query = [ query: params.query ]

        if(params.offset) {
            query["offset"]= params.offset
        }

        if(params.rows) {
            query["rows"] = params.rows
        }

        if(params.facet) {
            query["facet"] = params.facet
        }

        if(params.minDocs) {
            query["minDocs"] = params.minDocs
        }

        if(params.sort) {
            query[sort] = params.sort
        }

        def jsonResp = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(),'/search', query)

        jsonResp.results["docs"].get(0).each{

            def tmpResult = [:]

            def subtitle
            def thumbnail
            def media

            def subtitleMatch = it.preview.toString() =~ /(?m)<div class="subtitle">(.*?)<\/div>$/
            if (subtitleMatch)
                subtitle= subtitleMatch[0][1]

            def thumbnailMatch = it.preview.toString() =~ /(?m)<img src="(.*?)" \/>$/
            if (thumbnailMatch)
                thumbnail= thumbnailMatch[0][1]

            def mediaMatch = it.preview.toString() =~ /(?m)<div data-media="(.*?)>$/
            if (mediaMatch)
                media= thumbnailMatch[0][1]

            tmpResult["id"] = it.id
            tmpResult["view"] = it.view
            tmpResult["label"] = it.label
            tmpResult["latitude"] = it.latitude
            tmpResult["longitude"] = it.longitude
            tmpResult["category"] = it.category

            def path = grailsApplication.config.ddb.wsbackend.toString()+'/access/'+it.id+'/components/indexing-profile'

            def xmlSubresp = ApiConsumer.getTextAsXml(grailsApplication.config.ddb.wsbackend.toString(),'/access/'+it.id+'/components/indexing-profile', [:])
            def jsonSubresp = new JsonSlurper().parseText(xmlSubresp.toString())
            def properties = [affiliate_fct:jsonSubresp.properties.affiliate_fct, keywords_fct:jsonSubresp.properties.keywords_fct, type_fct:jsonSubresp.properties.type_fct, sector_fct:jsonSubresp.properties.sector_fct, provider_fct:jsonSubresp.properties.provider_fct, last_update:jsonSubresp.properties.last_update ]

            tmpResult["preview"] = [title:it.label, subtitle: subtitle, media: media, thumbnail: thumbnail]
            tmpResult["properties"] = properties

            docs.add(tmpResult)
        }
        resultList["facets"] = jsonResp.facets
        resultList["highlightedTerms"] = jsonResp.highlightedTerms
        resultList["results"] = [name:jsonResp.results.name,docs:docs,numberOfDocs:jsonResp.results.numberOfDocs]
        resultList["numberOfResults"] = jsonResp.numberOfResults
        resultList["randomSeed"] = jsonResp.randomSeed

        render(view: "response", model: [res:JSONValue.toJSONString(resultList)])
    }
}