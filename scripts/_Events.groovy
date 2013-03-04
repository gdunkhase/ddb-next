import org.apache.log4j.Logger;

import groovy.util.logging.Log4j;
import groovy.xml.StreamingMarkupBuilder

eventWebXmlEnd = {String tmpfile ->
    def log = Logger.getLogger(this.getClass());
    log.info "Dynamically adjusting web.xml in /scripts/_Events.groovy"
    log.info "Adding session listener (de.ddb.next.DDBSessionListener) to web.xml"
    
    def root = new XmlSlurper().parse(webXmlFile)
    
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
