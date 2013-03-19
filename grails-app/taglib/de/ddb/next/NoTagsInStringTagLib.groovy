package de.ddb.next

/**
 * Taglib that parses the body of the tag for further tags and removes them. 
 * This is particularly useful, if the body of the tag is dynamically rendered from backend data but you want to
 * ensure there is no html code contained. 
 * @author hla
 */
class NoTagsInStringTagLib {

    /**
     * Parses the body of the tag and removes any html tags and comments from it.
     */
    def removeTags = { attrs, body ->
        def inputString = body()
        def outputString = ""
        if(inputString){
            outputString = inputString.replaceAll(/<!--.*?-->/, '').replaceAll(/<.*?>/, '').replaceAll("&", "&amp;")
        }
        out << outputString
    }
}
