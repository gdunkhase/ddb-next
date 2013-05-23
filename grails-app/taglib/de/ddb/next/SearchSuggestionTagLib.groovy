package de.ddb.next
//the search/searchSuggestion has been 
class SearchSuggestionTagLib {
    def searchSuggestion = { correctedQuery, body ->
        out << render(template:"/search/searchSuggestion", model:[correctedQuery])
    }
}
