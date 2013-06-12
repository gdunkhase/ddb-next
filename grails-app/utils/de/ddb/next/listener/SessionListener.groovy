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
package de.ddb.next.listener

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import org.apache.log4j.Logger;


class SessionListener implements HttpSessionListener {

    private Logger log = Logger.getLogger(this.getClass())
    private static long totalSessionCount = 0

    // called by servlet container upon session creation
    void sessionCreated(HttpSessionEvent event) {
        HttpSession session = event.getSession()

        totalSessionCount = totalSessionCount + 1
        log.info "sessionCreated(): A session was created. Total session count on node: " + totalSessionCount
    }

    // called by servlet container upon session destruction
    void sessionDestroyed(HttpSessionEvent event) {
        totalSessionCount = totalSessionCount - 1
        log.info "sessionCreated(): A session was destroyed. Total session count on node: " + totalSessionCount
    }
}