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

class MapToGetParametersTagLib {
    /**
     * Converts a map into a GET-Parameters String.
     *
     * @attr map REQUIRED data 
     */
    def convertMapToGetParameters = { atts, body ->
        out << convert(atts.map)
    }

    /**
     * 
     * @param map
     * @return String Get-Parameters
     */
    def convert(map) {
        StringBuilder builder = new StringBuilder()
        if (map) {
            for (entry in map) {
                if (entry.value instanceof Object[]) {
                    for (val in entry.value) {
                        if (builder.length() > 0) {
                            builder.append("&")
                        }
                        builder.append(append(entry.key, val))
                    }
                }
                else {
                    if (builder.length() > 0) {
                        builder.append("&")
                    }
                    builder.append(append(entry.key, entry.value))
                }
            }
        }
        return builder
    }
    
    /**
     * 
     * @param key
     * @param value
     * @return String 1 GET-Parameter
     */
    def append(key, value) {
        StringBuilder builder = new StringBuilder()
        builder.append(key).append("=")
        if (value instanceof String) {
            builder.append(URLEncoder.encode(value, "UTF-8"))
        }
        else {
            builder.append(value)
        }
        return builder.toString()
    }
}
