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
        
    def showInstitutionsTreeByItemId() { // ToDo: rename to showInstitutionsTreeByItemId
        def id = params.id;
        def itemId = id;
        def vApiInstitution = new ApiInstitution();
        log.debug("read insitution by item id: ${id}");
        def selectedOrgXML = vApiInstitution.getInstitutionViewByItemId(id, grailsApplication.config.ddb.backend.url.toString());
        if (selectedOrgXML) {
            def jsonOrgParentHierarchy = vApiInstitution.getParentsOfInstitutionByItemId(id, grailsApplication.config.ddb.backend.url.toString())
            log.debug("jsonOrgParentHierarchy: ${jsonOrgParentHierarchy}");
            if (jsonOrgParentHierarchy.size() == 1) {
                if (jsonOrgParentHierarchy[0].id != id) {
                    log.error("ERROR: id:${id} != OrgParent.id:${jsonOrgParentHierarchy[0].id}");
                    forward controller: 'error', action: "ERROR: id:${id} != OrgParent.id:${jsonOrgParentHierarchy[0].id}"
                }
            }
            else if (jsonOrgParentHierarchy.size() > 1) {
                itemId = jsonOrgParentHierarchy[jsonOrgParentHierarchy.size() - 1].id;
            }
            log.debug("root itemId = ${itemId}");
            def jsonOrgSubHierarchy = vApiInstitution.getChildrenOfInstitutionByItemId(itemId, grailsApplication.config.ddb.backend.url.toString())
            log.debug("jsonOrgSubHierarchy: ${jsonOrgSubHierarchy}")
            def jsonFacets = vApiInstitution.getFacetValues(selectedOrgXML.name.text(), grailsApplication.config.ddb.backend.url.toString())
            int countObjectsForProv = 0;
            if ((jsonFacets != null)&&(jsonFacets.facetValues != null)&&(jsonFacets.facetValues.count != null)&&(jsonFacets.facetValues.count[0] != null)) {
                try {
                    countObjectsForProv = jsonFacets.facetValues.count[0].intValue()
                } 
                catch (NumberFormatException ex) {
                    countObjectsForProv = -1;
                }
            }
            render(view: "institution", model: [itemId: itemId, selectedItemId: id, selectedOrgXML: selectedOrgXML, subOrg: jsonOrgSubHierarchy, parentOrg: jsonOrgParentHierarchy, countObjcs: countObjectsForProv, vApiInst: vApiInstitution])
        } 
        else {
           forward controller: 'error', action: "notfound"
        }
        
    }

}
