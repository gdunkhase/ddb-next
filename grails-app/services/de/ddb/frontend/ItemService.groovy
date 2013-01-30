package de.ddb.frontend

import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*
import org.apache.commons.logging.LogFactory

class ItemService {
    private static final log = LogFactory.getLog(this)

    def transactional = false
    final def SERVER_URI = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"
    //    final def ITEM_ID = "4ENCM6MNZE35G3CYCYSMH7BETSABFYK2"
    final def BINARY_SERVER_URI = "http://www.binary-p2.deutsche-digitale-bibliothek.de"
    final def SOURCE_PLACEHOLDER = '{0}'

    def binary = ['preview' : ['title':'', 'uri': ''],
        'thumbnail' :['title':'', 'uri': ''],
        'full' :['title':'', 'uri': ''],
    ]

    final def THUMBNAIL = 'mvth'
    final def PREVIEW= 'mvpr'
    final def FULL = 'full'

    def findItemById(id) {
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

            // handler for any failure status code:
            response.failure = { resp -> println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}" }

        }
    }

    private def buildViewerUri(item, componentsPath) {
        def viewerPrefix = item.viewers.viewer.uri.toString()
        if(viewerPrefix.contains(SOURCE_PLACEHOLDER)) {
            def withoutPlaceholder = viewerPrefix.toString() - SOURCE_PLACEHOLDER
            def sourceUri = BINARY_SERVER_URI + componentsPath + "source"
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
            println "---"
            println "name: ${it.'@name'}"
            println "mime: ${it.'@mimetype'}"
            println "path: ${it.'@path'}"
            println "pos: ${it.'@position'}"
            println "is primary?: ${it.'@primary'}"
        }
    }

    private def log(resp, xml) {
        // print response
        println "response status: ${resp.statusLine}"
        println 'Headers: -----------'

        resp.headers.each { h -> println " ${h.name} : ${h.value}" }

        println 'Response data: -----'
        System.out << xml
        println '\n--------------------'

        // parse
        assert xml instanceof groovy.util.slurpersupport.GPathResult
    }
}
