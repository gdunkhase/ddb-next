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
