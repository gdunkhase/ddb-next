package de.ddb.next

import javax.servlet.http.Cookie

class CookieTagLib {
    def searchService
    def AMP = "&amp;"
    def LT = "&lt;"
    def GT = "&gt;"
    def QUOTE = "&quot;"

    def getCookieFieldValue = {
        attrs, body ->
        def map = [:]
        if (params && params.controller == "search" && params.action == "results") {
            def cookies = new Cookie[1]
            cookies[0] = searchService.createSearchCookie(params)
            map = searchService.getSearchCookieAsMap(cookies)
        }
        else {
            map = searchService.getSearchCookieAsMap(request.cookies)
        }
        out << escapeEntities(map[attrs.fieldname])
    }
    
    /** Return the given string with all HTML entities escaped into their 
     * HTML equivalent. 
     * @param text String containing unsafe characters. 
     * @return <var>text</var> with characters turned into HTML entities. 
     */ 
    public String escapeEntities(String text) { 
        if (text == null) {
            text = ""
        } 
        String trim = text.trim() 
        char[] c = trim.toCharArray()
        
        StringBuffer buffer = new StringBuffer() 
        def i = -1 
        while (++i < c.length) { 
            if (c[i]=='&') {
                buffer.append(AMP)
            }
            else if (c[i]=='<') {
                buffer.append(LT)
            }
            else if(c[i]=='>') {
                buffer.append(GT)
            }
            else if(c[i]=='"') {
                buffer.append(QUOTE)
            }
            else {
                buffer.append(c[i]) 
            }
        } 
        return buffer.toString() }
}
