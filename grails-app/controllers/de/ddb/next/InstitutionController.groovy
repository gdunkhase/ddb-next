package de.ddb.next

import org.apache.commons.logging.LogFactory

class InstitutionController {

	private static final log = LogFactory.getLog(this)
	
	def findById() {
		def id = params.id
		
		println "find insitution with the id: ${id}"
		
		// to cortext: give me an institution with hte id
		
		// http client
		
		// if successful, HTTP 200 OK then...
		// if not, if HTTP 404 Not Found
		// redirect(controller: 'error')
		// else if HTTP 500 Server Error then
		
		
		//render "find insitution with the id: ${id}"
		render view: 'institution' , model: [orgId: id]
	}
	
}
