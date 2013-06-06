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

import de.ddb.next.exception.UserNotFoundException
import org.springframework.web.servlet.support.RequestContextUtils;


class UserController {

    static defaultAction = "defaultAction"

    def defaultAction() {
        render(view: "profile", model: [bookmarksCount: "no count yet", username: "testuser"])
    }

    def profilePage() {
        def user = ApiConsumer.getTextAsJson(grailsApplication.config.aas.url.toString() ,'/aas/persons/' + params.id, null, true)
        if("Not found".equals(user)){
            throw new UserNotFoundException()
        }

        render(view: "profile", model: [bookmarksCount: "no count yet", user: user])
    }
    
}
