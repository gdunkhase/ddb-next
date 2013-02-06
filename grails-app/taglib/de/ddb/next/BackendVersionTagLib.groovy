package de.ddb.next

class BackendVersionTagLib {
	def backendVersion = {
		attrs, body ->
		out << ApiConsumer.getText(grailsApplication.config.ddb.backend.url, "/version", null)
	}
}