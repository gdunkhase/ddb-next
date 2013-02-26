import groovy.xml.StreamingMarkupBuilder

eventWebXmlEnd = {String tmpfile ->
    def root = new XmlSlurper().parse(webXmlFile)
      
    System.out.println("| Dynamically adjusting web.xml in /scripts/_Events.groovy")
      
    System.out.println("| - Adding session listener (de.ddb.next.DDBSessionListener) to web.xml")
    root.appendNode {
        'listener' {
            'listener-class' (
            'de.ddb.next.DDBSessionListener'
            )
        }
    }
    
    webXmlFile.text = new StreamingMarkupBuilder().bind {
        mkp.declareNamespace("": "http://java.sun.com/xml/ns/javaee")
        mkp.yield(root)
    }
}
