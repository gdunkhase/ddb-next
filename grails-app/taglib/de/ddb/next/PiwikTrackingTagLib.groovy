package de.ddb.next


import grails.util.Environment;

/**
 * Taglib for automatic integration of the piwik tracking sourcecode. The taglib ensures that the correct version
 * of the trackingcode (DEV or PROD) is included.
 * 
 * @author hla
 */
class PiwikTrackingTagLib {

    def static trackingCodeCache = null

    /**
     * Tag closure <g:piwik />, this tag has no attributes. 
     */
    def piwik = { attrs, body ->

        //Only load the piwik tracking code one
        if(trackingCodeCache == null){
            def piwikFile = grailsApplication.config.ddb.tracking.piwikfile

            try {
                trackingCodeCache = grailsApplication.getParentContext().getResource("file:"+piwikFile).inputStream.text
                log.info "Loaded and cached the Piwik tracking file from: "+piwikFile
            } catch (Exception e){
                log.error "The PiwikTrackingTagLib could not find the piwikFile: "+piwikFile, e
                trackingCodeCache = "";
            }
        }

        out << trackingCodeCache
    }
}