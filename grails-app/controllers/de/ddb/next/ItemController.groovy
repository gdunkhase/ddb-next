package de.ddb.next
import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.ContentType.XML

class ItemController {

    // ddb-next/item/:id
    def findById() {
      log.error "init item controller"

/*
      def serverUri = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"

      http.setProxy('proxy.fiz-karlsruhe.de', 8888, 'http')

      def itemId = "3W53MBF4MJTYDBXZE7AIKJXWCOH6VTTB"
      def pathX = "/access/" + params.id + "/components/view"
      */

      def lang = "de"
      def url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"
//      def path = "/access/"+params.id+"/components/title"


      def http = new HTTPBuilder(url)
      def pathX = "/access/W6H3LQUK2X3HQPBQ2ED7GPTPX6FCVE6A/components/view"
      def query = [ client: "DDB-NEXT" ]

      try {
        http.get( path : pathX, contentType: JSON) { resp, xml ->

         setContentType(XML)
          println "response status: ${resp.statusLine}"
          println 'Headers: -----------'

          resp.headers.each { h ->
            println " ${h.name} : ${h.value}"
          }

          println 'Response data: -----'
          System.out << xml
          println '\n--------------------'
        }
      } catch (Exception e) {
          println "exception: " + e
      }


      log.error "finished"

      def msg = 'You are going to see the detail view of cultural item with the id ' + params.id
      render(view: "item", model: [content: msg])

    }

}