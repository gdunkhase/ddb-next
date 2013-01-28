package de.ddb.next

import groovyx.net.http.HTTPBuilder

class ItemService {

    // schiller denkmal
    final def SERVER_URI = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"
    final def ITEM_ID = "W6H3LQUK2X3HQPBQ2ED7GPTPX6FCVE6A"
    final def VIEW_PATH = "/access/" + ITEM_ID + "/components/view"
    final def BINARIES_PATH = "/access/" + ITEM_ID + "/components/binaries"

    final def BINARY_SERVER_URI = "http://www.binary-p2.deutsche-digitale-bibliothek.de"

    def binary = ['preview' : ['title':'', 'uri': ''],
        'thumbnail' :['title':'', 'uri': ''],
        'full' :['title':'', 'uri': ''],
    ]

    final def THUMBNAIL = 'mvth'
    final def PREVIEW= 'mvpr'
    final def FULL = 'full'

    def findBinariesById() {
        def binaryList = fetchBinaryList()
        // def binaryList = parseFromXml()
        // log(binaryList)

        Map prev = parse(binaryList)
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

    private def parseFromXml() {
        def xml = '''
      <binaries xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ddb="http://www.fhg.iais.de/cortex/1.0/ddb/" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ead="urn:isbn:1-931666-22-9">
        <binary mimetype="image/jpeg" name="Reichs- und Französischer Krieg von 1688-1697 bis zum Frieden von Ryswick: Schlachtordnung der Armee des Kurfürsten von Bayern bei Ternat, 30. Mai 1697" path="/binary/JTXPOFYDQNWRLLTMSMKZJNBAZBVIQOKA/orig/1.jpg" position="1" primary="true" />
        <binary mimetype="image/jpeg" name="Reichs- und Französischer Krieg von 1688-1697 bis zum Frieden von Ryswick: Schlachtordnung der Armee des Kurfürsten von Bayern bei Ternat, 30. Mai 1697" path="/binary/JTXPOFYDQNWRLLTMSMKZJNBAZBVIQOKA/full/1.jpg" position="1" primary="true" />
        <binary mimetype="image/jpeg" name="Reichs- und Französischer Krieg von 1688-1697 bis zum Frieden von Ryswick: Schlachtordnung der Armee des Kurfürsten von Bayern bei Ternat, 30. Mai 1697" path="/binary/JTXPOFYDQNWRLLTMSMKZJNBAZBVIQOKA/list/1.jpg" position="1" primary="true" />
        <binary mimetype="image/jpeg" name="Reichs- und Französischer Krieg von 1688-1697 bis zum Frieden von Ryswick: Schlachtordnung der Armee des Kurfürsten von Bayern bei Ternat, 30. Mai 1697" path="/binary/JTXPOFYDQNWRLLTMSMKZJNBAZBVIQOKA/grid/1.jpg" position="1" primary="true" />
        <binary mimetype="image/jpeg" name="Reichs- und Französischer Krieg von 1688-1697 bis zum Frieden von Ryswick: Schlachtordnung der Armee des Kurfürsten von Bayern bei Ternat, 30. Mai 1697" path="/binary/JTXPOFYDQNWRLLTMSMKZJNBAZBVIQOKA/mvth/1.jpg" position="1" primary="true" />
        <binary mimetype="image/jpeg" name="Reichs- und Französischer Krieg von 1688-1697 bis zum Frieden von Ryswick: Schlachtordnung der Armee des Kurfürsten von Bayern bei Ternat, 30. Mai 1697" path="/binary/JTXPOFYDQNWRLLTMSMKZJNBAZBVIQOKA/mvpr/1.jpg" position="1" primary="true" />
      </binaries>
      '''
        def binaries = new XmlSlurper().parseText(xml)
        assert binaries instanceof groovy.util.slurpersupport.GPathResult
        return binaries.binary.list()
    }

    private def fetchBinaryList() {
        def http = new HTTPBuilder(SERVER_URI)
        http.parser.'application/json' = http.parser.'application/xml'
        http.get( path : BINARIES_PATH) { resp, xml ->
            //log(resp, xml)
            def binaries = xml
            assert binaries instanceof groovy.util.slurpersupport.GPathResult
            return binaries.binary.list()
        }
    }

    def findItemById() {
        def http = new HTTPBuilder(SERVER_URI)

        /* TODO remove this hack, once the server deliver the right content
         type*/
        http.parser.'application/json' = http.parser.'application/xml'

        def institution, item, fields
        http.get( path : VIEW_PATH) { resp, xml ->
            institution= xml.institution
            item = xml.item
            fields = xml.item.fields.field.findAll()
            return ['uri': '','institution': institution, 'item': item, 'fields': fields]
        }

    }
}