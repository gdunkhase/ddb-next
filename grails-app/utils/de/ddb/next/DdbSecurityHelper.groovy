/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.ddb.next

import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.LogFactory;
import org.ccil.cowan.tagsoup.Parser;

import de.ddb.next.exception.InvalidUrlException;


/**
 * Helper class to sanitize all incoming request data (parameters, cookies, etc) from malicious code.
 * Mainly script tags used for XSS attacks.
 * 
 * @author hla
 */
class DdbSecurityHelper {

    private def log = LogFactory.getLog(this.class)

    /**
     * Cleans a ServletRequest from malicious code. The request object must be of type DdbRequestWrapper, because
     * the original HttpServletRequest does not allow manipulation of the request parameters.
     * 
     * @param request The wrapped request object
     */
    void sanitizeRequest(DdbServletRequestWrapper request, HttpServletResponse response){
        Parser tagsoupParser = new Parser()
        XmlSlurper slurper = new XmlSlurper(tagsoupParser)

        sanitizeRequestUrl(request, response)
        sanitizeRequestParameters(request, slurper)
        sanitizeRequestCookies(request, slurper)
        sanitizeRequestHeaders(request)
    }

    private void sanitizeRequestUrl(DdbServletRequestWrapper request, HttpServletResponse response) {
        String requestUri = request.getRequestURI()

        if(requestUri.contains("<") ||
        requestUri.contains(">") ||
        requestUri.contains("%3E") ||
        requestUri.contains("%3C")) {
            log.warn "sanitizeRequestUrl(): possible xss attempt over url: '"+requestUri+"', redirecting to '"+request.getContextPath()+"'"
            throw new InvalidUrlException()
        }
    }

    /**
     * Cleans the "Host" header of a servlet request from characters that are definetly not allowed there
     * (e.g. <, >, -, ...) thus preventing code-injection over this field
     * 
     * @param request The wrapped request object
     */
    private void sanitizeRequestHeaders(DdbServletRequestWrapper request) {
        request.getHeaderNames().each {
            if(it.toLowerCase() == "host"){
                String hostHeader = request.getHeader(it)
                if(hostHeader.contains(">") || hostHeader.contains("<") || hostHeader.contains("%3C") || hostHeader.contains("%3E") ){
                    log.warn "sanitizeRequestHeaders(): possible xss attempt over host header: '"+hostHeader+"'"
                }
                hostHeader = hostHeader.replace(">", "")
                hostHeader = hostHeader.replace("<", "")
                hostHeader = hostHeader.replace("%3C", "") // <
                hostHeader = hostHeader.replace("%3E", "") // >
                hostHeader = hostHeader.replace("\"", "")
                hostHeader = hostHeader.replace("'", "")
                hostHeader = hostHeader.replace("-", "")
                request.setHeader(it, hostHeader)
            }
        }
    }

    /**
     * Cleans the request parameters from malicious code
     * 
     * @param parameterMap The parameter map
     * @param slurper The XmlSlurper instance
     */
    private void sanitizeRequestParameters(DdbServletRequestWrapper request, XmlSlurper slurper){
        Map<String,String[]> parameterMap = request.getParameterMap()

        String[] keys = parameterMap.keySet().toArray()
        for (int i=0; i<keys.length; i++) {

            String key = keys[i]
            String[] valueArray = parameterMap.get(key)

            for (int j=0; j<valueArray.length; j++) {
                String parsedText = slurper.parseText(valueArray[j]).text()
                if(valueArray[j] != parsedText){
                    log.warn "sanitizeRequestParameters(): possible xss attempt over request parameters: '"+valueArray[j]+"' -> '"+parsedText+"'"
                }
                valueArray[j] = parsedText
            }

            parameterMap.put(key, valueArray)
        }
    }

    /**
     * Cleans the request cookies from malicious code
     * 
     * @param cookies
     * @param slurper The cookie array
     */
    private void sanitizeRequestCookies(DdbServletRequestWrapper request, XmlSlurper slurper){
        Cookie[] cookies = request.getCookies()

        if(cookies){
            for (int i=0; i<cookies.length; i++){
                Cookie cookie = cookies[i]
                String decodedCookieValue = URLDecoder.decode(cookie.value, "UTF-8")
                String parsedCookieValue = slurper.parseText(decodedCookieValue).text()
                if(decodedCookieValue != parsedCookieValue){
                    log.warn "sanitizeRequestCookies(): possible xss attempt over cookie: '"+decodedCookieValue+"' -> '"+parsedCookieValue+"'"
                }
                cookie.setValue(parsedCookieValue)
            }
        }
    }
}
