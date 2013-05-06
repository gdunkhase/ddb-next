package de.ddb.next

class SearchSuggestionTagLib {
    def searchSuggestion = { correctedQuery, body ->
        out << render(template:"/search/searchSuggestion", model:[correctedQuery])
    }
}
