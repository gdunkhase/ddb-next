package de.ddb.next

import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*
import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.commons.GrailsApplication

class ItemService {
    private static final log = LogFactory.getLog(this)

    def transactional = false
    def grailsApplication


    private static final SOURCE_PLACEHOLDER = '{0}'
    private static final def THUMBNAIL = 'mvth'
    private static final def PREVIEW= 'mvpr'
    private static final def FULL = 'full'

    def binary = ['preview' : ['title':'', 'uri': ''],
        'thumbnail' :['title':'', 'uri': ''],
        'full' :['title':'', 'uri': ''],
    ]

    def findItemById(id) {
        def SERVER_URI = grailsApplication.config.ddb.wsbackend.toString()
        
        def http = new HTTPBuilder(SERVER_URI)

        /* TODO remove this hack, once the server deliver the right content
         type*/
        http.parser.'application/json' = http.parser.'application/xml'

        final def componentsPath = "/access/" + id + "/components/"
        final def viewPath = componentsPath + "view"

        def institution, item, fields, viewerUri
        http.request( GET) { req ->
            uri.path = viewPath

            response.success = { resp, xml ->
                institution= xml.institution
                item = xml.item
                fields = xml.item.fields.field.findAll()
                viewerUri = buildViewerUri(item, componentsPath)
                return ['uri': '', 'viewerUri': viewerUri, 'institution':
                    institution, 'item': item, 'fields': fields]
            }

            response.'404' = { return '404' }

            //TODO: handle other failure such as '500'
            response.failure = { resp -> log.warn """
                Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}
                """ }

        }
    }

    private def buildViewerUri(item, componentsPath) {
        def BINARY_SERVER_URI = grailsApplication.config.ddb.binary.toString()
        def viewerPrefix = item.viewers.viewer.uri.toString()
        if(viewerPrefix.contains(SOURCE_PLACEHOLDER)) {
            def withoutPlaceholder = viewerPrefix.toString() - SOURCE_PLACEHOLDER
            def sourceUri = BINARY_SERVER_URI + componentsPath + 'source'
            def encodedSourceUri= URLEncoder.encode sourceUri, 'UTF-8'
            return withoutPlaceholder + encodedSourceUri
        }
    }

    def findBinariesById() {
        Map prev = parse(fetchBinaryList())
        return prev
    }


    private def parse(list) {
        list.each { x ->
            String path = x.'@path'
            if(path.contains(PREVIEW)) {
                binary.'preview'.'title' = x.'@name'
                binary.'preview'.'uri' = BINARY_SERVER_URI + x.'@path'
            } else if (path.contains(THUMBNAIL)) {
                binary.'thumbnail'.'title' = x.'@name'
                binary.'thumbnail'.'uri' = BINARY_SERVER_URI + x.'@path'
            } else if (path.contains(FULL)) {
                binary.'full'.'title' = x.'@name'
                binary.'full'.'uri' = BINARY_SERVER_URI + x.'@path'
            }
        }
        return binary
    }



    private def fetchBinaryList(id) {
        def http = new HTTPBuilder(SERVER_URI)
        http.parser.'application/json' = http.parser.'application/xml'

        final def binariesPath= "/access/" + id + "/components/binaries"
        http.get( path : binariesPath) { resp, xml ->
            //log(resp, xml)
            def binaries = xml
            assert binaries instanceof groovy.util.slurpersupport.GPathResult
            return binaries.binary.list()
        }
    }

    private def log(list) {
        list.each { it ->
            log.debug "---"
            log.debug "name: ${it.'@name'}"
            log.debug "mime: ${it.'@mimetype'}"
            log.debug "path: ${it.'@path'}"
            log.debug "pos: ${it.'@position'}"
            log.debug "is primary?: ${it.'@primary'}"
        }
    }

    private def log(resp, xml) {
        // print response
        log.debug "response status: ${resp.statusLine}"
        log.debug 'Headers: -----------'

        resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }

        log.debug 'Response data: -----'
        System.out << xml
        log.debug '\n--------------------'

        // parse
        assert xml instanceof groovy.util.slurpersupport.GPathResult
    }
}
