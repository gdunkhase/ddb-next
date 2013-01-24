package de.ddb.next

/**
 * Dummy tester class that should not be deployed in production
 * @author arb
 *
 */
class TesterController {
	def index(){
		//We publish some information on plugins+controllers+grails
		
	}
	
	def externalconfig(){
		//assumes that you have an external configuration in: 
		//grails.config.locations = [ "file:${userHome}/.grails/${appName}.properties" ]
		//or for production
		//grails.config.locations = [ "file:/grails/app-config/${appName}.properties" ]
		//outputs the this.is.my.appname and should be ddb-next
		def myAppName = grailsApplication.config.my.appname
		render(view: "externalconfig", model: [myAppName: myAppName])
	}
	
}