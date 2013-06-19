package de.ddb.next

import org.codehaus.groovy.grails.web.util.WebUtils;

class CultureGraphService {

    def configurationService

    def transactional=false

    def getCultureGraph(String gndId) {
        ApiResponse apiResponse = ApiConsumer.getJson(configurationService.getCulturegraphUrl(), "/entityfacts/" + gndId)
        if(!apiResponse.isOk()){
            log.error "getCultureGraph(): Could not access culturegraph api under: "+configurationService.getCulturegraphUrl() + "/entityfacts/" + gndId
            apiResponse.throwException(WebUtils.retrieveGrailsWebRequest().getCurrentRequest())
        }
        def jsonResp = apiResponse.getResponse()

        return jsonResp
    }

    def getDNBInformation(String gndId) {
        ApiResponse apiResponse = ApiConsumer.getXml(configurationService.getDnbUrl(), "/gnd/" + gndId + "/about/rdf")
        if(!apiResponse.isOk()){
            log.error "getDNBInformation(): Could not access culturegraph api under: "+configurationService.getDnbUrl() + "/gnd/" + gndId + "/about/rdf"
            apiResponse.throwException(WebUtils.retrieveGrailsWebRequest().getCurrentRequest())
        }
        def xmlResp = apiResponse.getResponse()

        return xmlResp
    }
}
