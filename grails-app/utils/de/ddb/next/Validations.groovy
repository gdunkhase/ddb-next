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

import org.apache.commons.lang.StringUtils

/**
 * check password and new password.
 * @param userPassword
 * @param actualPassword
 * @param newPassword
 * @param confirmNewPassword
 * @return list with errors
 */
public static List<String> validatorPasswordChange(String userPassword, String actualPassword, String newPassword, String confirmNewPassword) {
    List<String> errors = []
    if (!userPassword.equals(actualPassword)) {
        errors.add("ddbnext.Error_Password_Provided")
    }
    if (StringUtils.isEmpty(newPassword) || StringUtils.isEmpty(confirmNewPassword)) {
        if (StringUtils.isEmpty(newPassword)) {
            errors.add("ddbnext.Error_Password_New_Empty")
        }
        if (StringUtils.isEmpty(confirmNewPassword)) {
            errors.add("ddbnext.Error_Password_New_Empty")
        }
    }
    else {
        if (!newPassword.equals(confirmNewPassword)) {
            errors.add("ddbnext.Error_Password_Match")
        }
        if (newPassword.trim().length() < 8 || !newPassword.find("[0-9]") ||!newPassword.find("[a-z]") || !newPassword.find("[A-Z]")) {
            errors.add("ddbnext.Error_Password_Rules")
        }
    }
    return errors
}

/**
 * 
 * @param email
 * @return true or false (valid or not)
 */
public static validatorEmail(String email){
    def res = (email ==~ /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,4}/)
    return res
}

/**
 *
 * @param val1
 * @param val2
 * @return true or false (different or not)
 */
public static isDifferent(String val1, String val2) {
    if ((StringUtils.isBlank(val1) && !StringUtils.isBlank(val2))
    || (StringUtils.isBlank(val2) && !StringUtils.isBlank(val1))) {
        return true
    }
    if (!val1.equals(val2)) {
        return true
    }
    return false
}

