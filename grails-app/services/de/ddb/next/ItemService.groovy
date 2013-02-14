package de.ddb.next

import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*
import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.commons.GrailsApplication

class ItemService {
    private static final log = LogFactory.getLog(this)

    private static final SOURCE_PLACEHOLDER = '{0}'
    private static final def THUMBNAIL = 'mvth'
    private static final def PREVIEW= 'mvpr'
    private static final def FULL = 'full'
    private static final def ORIG= 'orig'
    private static final def IMAGE= 'image/jpeg'
    private static final def AUDIO = 'audio/mp3'
    private static final def VIDEOMP4 = 'video/mp4'
    private static final def VIDEOFLV = 'video/flv'

    def transactional = false
    def grailsApplication

    def findItemById(id) {
        def http = new HTTPBuilder(grailsApplication.config.ddb.wsbackend.toString())

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

    def findBinariesById(id) {
        def prev = parse(fetchBinaryList(id))
        return prev
    }

    private def fetchBinaryList(id) {
        def http = new HTTPBuilder(grailsApplication.config.ddb.wsbackend.toString())
        http.parser.'application/json' = http.parser.'application/xml'
        final def binariesPath= "/access/" + id + "/components/binaries"
        http.get( path : binariesPath) { resp, xml ->
            def binaries = xml
            assert binaries instanceof groovy.util.slurpersupport.GPathResult
            return binaries.binary.list()
        }
    }

    private def parse(binaries) {
        def BINARY_SERVER_URI = grailsApplication.config.ddb.binary.toString()
        def binaryList = []
        def bidimensionalList = []
        String position
        String path
        String type
        //creation of a bi-dimensional list containing the binaries separated for position
        binaries.each { x ->
            if(x.'@position'.toString() != position){
                def subList = []
                bidimensionalList[x.'@position'.toInteger()-1] = subList
                position = x.'@position'.toString()
            } 
            bidimensionalList[x.'@position'.toInteger()-1].add(x)
        }
        //creation of a list of binary maps from the bi-dimensional list
        bidimensionalList.each { y ->
            def binaryMap = ['orig' : ['title':'', 'uri': ['image':'','audio':'','video':'']],
                'preview' : ['title':'', 'uri':''],
                'thumbnail' : ['title':'', 'uri':''],
                'full' : ['title':'', 'uri':''],
            ]
            y.each { z ->
                path = z.'@path'
                type = z.'@mimetype'
                if(path.contains(ORIG)){
                    if(type.contains(IMAGE)){
                        binaryMap.'orig'.'uri'.'image' = BINARY_SERVER_URI + z.'@path'
                        if(!binaryMap.'orig'.'title') binaryMap.'orig'.'title' = z.'@name'
                    }
                    else if(type.contains(AUDIO)){
                        binaryMap.'orig'.'uri'.'audio' = BINARY_SERVER_URI + z.'@path'
                        binaryMap.'orig'.'title' = z.'@name'
                    }
                    else if(type.contains(VIDEOMP4)||type.contains(VIDEOFLV)){
                        binaryMap.'orig'.'uri'.'video' = BINARY_SERVER_URI + z.'@path'
                        binaryMap.'orig'.'title' = z.'@name'
                    }
                }
                  else if(path.contains(PREVIEW)) {
                      binaryMap.'preview'.'title' = z.'@name'
                      binaryMap.'preview'.'uri' = BINARY_SERVER_URI + z.'@path'
                } else if (path.contains(THUMBNAIL)) {
                      binaryMap.'thumbnail'.'title' = z.'@name'
                      binaryMap.'thumbnail'.'uri' = BINARY_SERVER_URI + z.'@path'
                } else if (path.contains(FULL)) {
                      binaryMap.'full'.'title' = z.'@name'
                      binaryMap.'full'.'uri' = BINARY_SERVER_URI + z.'@path'
                }
            }
            binaryList.add(binaryMap)
        }
        return binaryList
    }

    def binariesCounter(binaries){
        def images = 0
        def audios = 0
        def videos = 0
        binaries.each { i ->
            if(i.'orig'.'uri'.'audio' || i.'orig'.'uri'.'video'){
               if(i.'orig'.'uri'.'audio')
                   audios++
               if(i.'orig'.'uri'.'video')
                   videos++
            } else if (i.'orig'.'uri'.'image')
                  images++
        }
        return (['images':images,'audios':audios,'videos':videos])
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
