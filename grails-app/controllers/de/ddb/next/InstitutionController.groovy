package de.ddb.next
import grails.converters.JSON

import org.apache.commons.logging.LogFactory

import groovy.json.JsonSlurper;
import groovyx.net.http.ContentType;
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class InstitutionController {

    private static final log = LogFactory.getLog(this)
    
    def institutionService

    def show() {
        def allInstitution = institutionService.findAll()
        def institutionByFirstLetter = allInstitution.data

        // TODO: make this more idiomatic Groovy
        def all = []
        institutionByFirstLetter?.each { all.addAll(it.value) }

        // no institutions
        institutionByFirstLetter.each { k,v ->
            if(institutionByFirstLetter[k]?.size() == 0) {
                institutionByFirstLetter[k] = true
            } else {
                institutionByFirstLetter[k] = false
            }
        }

        // TODO: move to service
        def index = []
        institutionByFirstLetter.each {
            index.add(it)
        }

        render (view: 'institutionList',  model: [index: index, all: all, total: allInstitution?.total])
    }

    def getJson() {
        render institutionService.findAll() as JSON
    }
        
    def readByItemId() { // ToDo: rename to showInstitutionsTreeByItemId
        def id = params.id
        def vApiInstitution = new ApiInstitution();
        log.println("read insitution by item id: ${id}")
        def dataViewXML = vApiInstitution.getInstitutionViewByItemId(id, grailsApplication.config.ddb.backend.url.toString())
        if (dataViewXML != null) {
            def jsonOrgHierarchy = vApiInstitution.getChildrenOfInstitutionByItemId(id, grailsApplication.config.ddb.backend.url.toString())
            def jsonFacets = vApiInstitution.getFacetValues(dataViewXML.name.text(), grailsApplication.config.ddb.backend.url.toString())
            int countObjectsForProv = 0;
            if ((jsonFacets != null)&&(jsonFacets.facetValues != null)&&(jsonFacets.facetValues.count != null)&&(jsonFacets.facetValues.count[0] != null)) {
                try {
                    countObjectsForProv = jsonFacets.facetValues.count[0].intValue()
                } 
                catch (NumberFormatException ex) {
                    countObjectsForProv = -1;
                }
            }
            render(view: "institution", model: [itemId: id, results: dataViewXML, subOrg: jsonOrgHierarchy, countObjcs: countObjectsForProv, vApiInst: vApiInstitution])
        } 
        else {
           forward controller: 'error', action: "notfound"
        }
        
    }

}
