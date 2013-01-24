package de.ddb.next

import groovyx.net.http.HTTPBuilder

class ItemController {

    final def SERVER_URI = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"
    final def ITEM_ID = "W6H3LQUK2X3HQPBQ2ED7GPTPX6FCVE6A"
    final def PATH = "/access/${ITEM_ID}/components/view"
    final def http = new HTTPBuilder(SERVER_URI)

    // the URI is {app-name}/item/:id
    def findById() {
        log.error "find item with the id: " + params.id

        /* TODO remove this hack, once the server deliver the right content
         type*/
        http.parser.'application/json' = http.parser.'application/xml'

        def ins = new Institution()

        // fetch item from the server
        http.get( path : PATH ) { resp, xml ->
            println "response status: ${resp.statusLine}"
            println 'Headers: -----------'

            resp.headers.each { h -> println " ${h.name} : ${h.value}" }

            println 'Response data: -----'
            assert xml.name() == "cortex-item"
            println '--- institution ---'
            println "name: " + xml.institution.name
            println "id: " + xml.institution.id

            println "uri: " + xml.institution.uri
            println "logo uri: " + xml.institution.logo.a
            println '\n--------------------'

            ins.id = xml.institution.id
            ins.name = xml.institution.name
            ins.uri = xml.institution.uri
            ins.logoUri = xml.institution.logo.a

            println "name: " + ins.name
            println "id: " + ins.id

            println "uri: " + ins.uri
            println "logo uri: " + ins.logoUri

        }

        // render item view
        log.error "render item view"
        def msg = """\
        You are going to see the detail view of cultural item with
        the id ${params.id}
        """

        render(view: "item", model: [content: msg, ins: ins])
    }

}

class Institution {
    def uri
    def name
    def id
    def logoUri

}