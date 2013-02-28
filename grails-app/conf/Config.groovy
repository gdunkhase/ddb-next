// locations to search for config files that get merged into the main config;
// config files can be ConfigSlurper scripts, Java properties files, or classes
// in the classpath in ConfigSlurper format

// grails.config.locations = [ "classpath:${appName}-config.properties",
//                             "classpath:${appName}-config.groovy",
//                             "file:${userHome}/.grails/${appName}-config.properties",
//                             "file:${userHome}/.grails/${appName}-config.groovy"]

// if (System.properties["${appName}.config.location"]) {
//    grails.config.locations << "file:" + System.properties["${appName}.config.location"]
// }

grails.project.groupId = appName // change this to alter the default package name and Maven publishing destination
grails.mime.file.extensions = true // enables the parsing of file extensions from URLs into the request format
grails.mime.use.accept.header = false
grails.mime.types = [
    all:           '*/*',
    atom:          'application/atom+xml',
    css:           'text/css',
    csv:           'text/csv',
    form:          'application/x-www-form-urlencoded',
    html:          [
        'text/html',
        'application/xhtml+xml'
    ],
    js:            'text/javascript',
    json:          [
        'application/json',
        'text/json'
    ],
    multipartForm: 'multipart/form-data',
    rss:           'application/rss+xml',
    text:          'text/plain',
    xml:           [
        'text/xml',
        'application/xml']
]

// URL Mapping Cache Max Size, defaults to 5000
//grails.urlmapping.cache.maxsize = 1000

// What URL patterns should be processed by the resources plugin
grails.resources.adhoc.patterns = [
    '/images/*',
    '/css/*',
    '/js/*',
    '/plugins/*'
]

// The default codec used to encode data with ${}
grails.views.default.codec = "none" // none, html, base64
grails.views.gsp.encoding = "UTF-8"
grails.converters.encoding = "UTF-8"
// enable Sitemesh preprocessing of GSP pages
grails.views.gsp.sitemesh.preprocess = true
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []
// whether to disable processing of multi part requests
grails.web.disable.multipart=false

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password']

// configure auto-caching of queries by default (if false you can cache individual queries with 'cache: true')
grails.hibernate.cache.queries = false

//DDB SPECIFIC Configuration variables
//The variables can be overwritten by defining local configurations, see below environments

ddb.binary.url="http://www.binary-p1.deutsche-digitale-bibliothek.de"
ddb.static.url="http://static-p1.deutsche-digitale-bibliothek.de"
ddb.apis.url="http://localhost:8080"
ddb.backend.url="http://backend-p1.deutsche-digitale-bibliothek.de:9998"
ddb.logging.folder="target/logs"
ddb.advancedSearch.searchGroupCount=3
ddb.advancedSearch.searchFieldCount=10
ddb.advancedSearch.defaultOffset=0
ddb.advancedSearch.defaultRows=20

environments {
    development {
        grails.logging.jul.usebridge = true
        grails.config.locations = [
            "file:${userHome}/.grails/${appName}.properties"
        ]


    }
    production {
        grails.logging.jul.usebridge = false
        grails.config.locations = [
            "file:"+ System.getProperty('catalina.base')+ "/grails/app-config/${appName}.properties"
        ]
        /*
         def needProxy = grailsApplication.config.client.proxy.needed
         if (needProxy) {
         System.properties.putAll([
         "http.proxyHost": grailsApplication.config.client.http.proxyHost,
         "http.proxyPort": grailsApplication.config.client.http.proxyPort
         ])
         }
         */
    }
}

// log4j configuration
log4j = {

    // The appenders define the output method of the loggings
    appenders {
        console name: "console", threshold: org.apache.log4j.Level.INFO, layout:pattern(conversionPattern: "%-5p: %d{dd:MM:yyyy HH:mm:ss,SSS} %c: %m%n")
        rollingFile name: "ddbnext-info", threshold: org.apache.log4j.Level.INFO, file: ddb.logging.folder+"/ddbnext-info.log", maxFileSize: 1024, layout:pattern(conversionPattern: "%-5p: %d{dd:MM:yyyy HH:mm:ss,SSS} %c: %m%n")
        rollingFile name: "ddbnext-warn", threshold: org.apache.log4j.Level.WARN, file: ddb.logging.folder+"/ddbnext-warn.log", maxFileSize: 1024, layout:pattern(conversionPattern: "%-5p: %d{dd:MM:yyyy HH:mm:ss,SSS} %c: %m%n")
        rollingFile name: "ddbnext-error", threshold: org.apache.log4j.Level.ERROR, file: ddb.logging.folder+"/ddbnext-error.log", maxFileSize: 1024, layout:pattern(conversionPattern: "%-5p: %d{dd:MM:yyyy HH:mm:ss,SSS} %c: %m%n")
        rollingFile name: "stacktrace", threshold: org.apache.log4j.Level.ERROR, file: ddb.logging.folder+"/ddbnext-stacktrace.log", maxFileSize: 1024, layout:pattern(conversionPattern: "%-5p: %d{dd:MM:yyyy HH:mm:ss,SSS} %c: %m%n")
    }

    // The root logger defines the basic log level and to which appenders the logging is going
    environments {
        development {
            root {  info "console", "ddbnext-info"  }
        }
        production {
            root { info "ddbnext-info", "ddbnext-warn", "ddbnext-error", "stacktrace" }
        }
    }

    // This part can be used to filter out all loggings that are not interesting
    environments {
        development {
            warn    "org.codehaus.groovy.grails.plugins",  // only warnings or errors from plugins
                    "org.grails.plugin",                   // only warnings or errors from plugins
                    "grails.plugin",                       // only warnings or errors from plugins
                    "org.codehaus.groovy.grails.commons"   // only warnings or errors from common grails classes
        }
        production {
            //Don't filter messages in production
        }
    }

}


grails.app.context = "/"
