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

import javax.servlet.http.Cookie;
import org.apache.commons.logging.LogFactory;
import org.ccil.cowan.tagsoup.Parser;


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
    void sanitizeRequest(DdbServletRequestWrapper request){
        try {
            Parser tagsoupParser = new Parser()
            XmlSlurper slurper = new XmlSlurper(tagsoupParser)

            sanitizeRequestParameters(request, slurper)
            sanitizeRequestCookies(request, slurper)
            sanitizeRequestHeaders(request)
        }catch(Throwable t){
            // Never let any exception pass in a filter, or the application will run into an infinite loop:
            // because the error-page will be called, which causes this filter to be called, which causes
            // this Exception to be thrown, which causes the error-page to be called, ....
            log.error "sanitizeRequest(): Critical exception occured in filter", t
        }
    }

    /**
     * Cleans the "Host" header of a servlet request from characters that are definetly not allowed there
     * (e.g. <, >, -, ...) thus preventing code-injection over this field
     * 
     * @param request The wrapped request object
     */
    private void sanitizeRequestHeaders(DdbServletRequestWrapper request) {
        try {
            request.getHeaderNames().each {
                if(it.toLowerCase() == "host"){
                    String hostHeader = request.getHeader(it)
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
        }catch(Throwable t){
            // Never let any exception pass in a filter, or the application will run into an infinite loop:
            // because the error-page will be called, which causes this filter to be called, which causes
            // this Exception to be thrown, which causes the error-page to be called, ....
            log.error "sanitizeRequestHeaders(): Critical exception occured in filter", t
        }
    }

    /**
     * Cleans the request parameters from malicious code
     * 
     * @param parameterMap The parameter map
     * @param slurper The XmlSlurper instance
     */
    private void sanitizeRequestParameters(DdbServletRequestWrapper request, XmlSlurper slurper){
        try {
            Map<String,String[]> parameterMap = request.getParameterMap()

            String[] keys = parameterMap.keySet().toArray()
            for (int i=0; i<keys.length; i++) {

                String key = keys[i]
                String[] valueArray = parameterMap.get(key)

                for (int j=0; j<valueArray.length; j++) {
                    String parsedText = slurper.parseText(valueArray[j]).text()
                    valueArray[j] = parsedText
                }

                parameterMap.put(key, valueArray)
            }
        }catch(Throwable t){
            // Never let any exception pass in a filter, or the application will run into an infinite loop:
            // because the error-page will be called, which causes this filter to be called, which causes
            // this Exception to be thrown, which causes the error-page to be called, ....
            log.error "sanitizeRequestParameters(): Critical exception occured in filter", t
        }
    }

    /**
     * Cleans the request cookies from malicious code
     * 
     * @param cookies
     * @param slurper The cookie array
     */
    private void sanitizeRequestCookies(DdbServletRequestWrapper request, XmlSlurper slurper){
        try {
            Cookie[] cookies = request.getCookies()

            if(cookies){
                for (int i=0; i<cookies.length; i++){
                    Cookie cookie = cookies[i]
                    String decodedCookieValue = URLDecoder.decode(cookie.value, "UTF-8")
                    String parsedCookieValue = slurper.parseText(decodedCookieValue).text()
                    cookie.setValue(parsedCookieValue)
                }
            }
        }catch(Throwable t){
            // Never let any exception pass in a filter, or the application will run into an infinite loop:
            // because the error-page will be called, which causes this filter to be called, which causes
            // this Exception to be thrown, which causes the error-page to be called, ....
            log.error "sanitizeRequestCookies(): Critical exception occured in filter", t
        }
    }
}
