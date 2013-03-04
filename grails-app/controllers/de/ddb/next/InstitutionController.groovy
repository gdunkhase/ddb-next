package de.ddb.next

import java.lang.reflect.Method;

import java.text.Normalizer.Form;

import org.apache.commons.logging.LogFactory

import groovy.json.JsonSlurper;
import groovyx.net.http.ContentType;
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class InstitutionController {

    private static final log = LogFactory.getLog(this)
    
    def readByItemId() {
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
            redirect(controller: 'error')
        }
        
    }
}
