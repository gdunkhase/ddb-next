import org.apache.log4j.Logger;

import groovy.util.logging.Log4j;
import groovy.xml.StreamingMarkupBuilder

eventWebXmlEnd = {String tmpfile ->
    def log = Logger.getLogger(this.getClass());
    log.info "Dynamically adjusting web.xml in /scripts/_Events.groovy"
    
    def root = new XmlSlurper().parse(webXmlFile)
    
    log.info "Adding session listener (de.ddb.next.DdbSessionListener) to web.xml"
    
    root.appendNode {
        'filter' {
            'filter-name' ('DdbSecurityFilter')
            'filter-class' ('de.ddb.next.DdbSecurityFilter')
        }
    }
    root.appendNode {
        'filter-mapping' {
            'filter-name' ('DdbSecurityFilter')
            'url-pattern' ('/*')
        }
    }
    
    
    root.appendNode {
        'listener' {
            'listener-class' (
            'de.ddb.next.DdbSessionListener'
            )
        }
    }
    
    log.info "Adding mime-mapping (woff -> application/x-font-woff) to web.xml"
    
    root.appendNode {
        'mime-mapping' {
            'extension' (
                'woff'
            )
            'mime-type' (
                'application/x-font-woff'
            )
        }
    }
        
    webXmlFile.text = new StreamingMarkupBuilder().bind {
        mkp.declareNamespace("": "http://java.sun.com/xml/ns/javaee")
        mkp.yield(root)
    }
}
