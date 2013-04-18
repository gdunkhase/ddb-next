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

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;


/**
 * A request filter that ensures that no malicious code (script-tags, etc) comes in over request parameters or cookies.
 * 
 * @author hla
 */
class DdbSecurityFilter implements Filter {

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        def timestamp = System.currentTimeMillis()

        DdbServletRequestWrapper requestWrapper = new DdbServletRequestWrapper(request)
        def ddbSecurityHelper = new DdbSecurityHelper()
        ddbSecurityHelper.sanitizeRequest(requestWrapper)

        chain.doFilter(requestWrapper, response)
    }

    @Override
    public void init(FilterConfig config) throws ServletException {
    }
}
