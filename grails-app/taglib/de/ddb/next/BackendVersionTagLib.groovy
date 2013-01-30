package de.ddb.next

class BackendVersionTagLib {
	def backendVersion = {
		attrs, body ->
		out << ApiConsumer.getText("http://dev-backend.deutsche-digitale-bibliothek.de:9998", "/version", null)
	}
}