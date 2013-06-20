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
package de.ddb.next.beans

import java.util.Map;

class User {

    public final static String SESSION_USER = "SESSION_USER_ATTRIBUTE"

    String username
    String firstname
    String lastname
    String email
    String password
    boolean openIdUser

    User(){
    }

    // ALERT: This is dangerous, because Groovy creates an implicit constructor with a map as parameter for every bean.
    //
    //    User(Map userMap){
    //        this.username = userMap.id
    //        this.email = userMap.email
    //    }

    public String toString() {
        return "User[username="+username+", email="+email+", openIdUser="+openIdUser+"]"
    }

    // Utility method to get first name and last name if present or username if not
    public String getFirstnameAndLastnameOrNickname() {
      if (firstname || lastname) {
        if (!lastname) {
          return firstname
        } else if (!firstname) {
            return lastname
        } else {
            return firstname+" "+lastname
        }
      } else {
        return username
      }
    }

}
