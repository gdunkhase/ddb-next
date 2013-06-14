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

import de.ddb.next.exception.ConfigurationException;

/**
 * Service for accessing the configuration.
 *
 * @author hla
 */
class ConfigurationService {

    def grailsApplication

    def transactional=false

    public String getBinaryUrl(){
        def url = grailsApplication.config.ddb?.binary?.url
        if(!url){
            throw new ConfigurationException("getBinaryBackendUrl(): Configuration entry does not exist -> ddb.binary.backend.url")
        }
        if(!(url instanceof String)){
            throw new ConfigurationException("getBinaryBackendUrl(): apd.binary.backend.url is not a String")
        }
        return url
    }

    public String getStaticUrl(){
        def url = grailsApplication.config.ddb?.static?.url
        if(!url){
            throw new ConfigurationException("getStaticUrl(): Configuration entry does not exist -> ddb.static.url")
        }
        if(!(url instanceof String)){
            throw new ConfigurationException("getStaticUrl(): apd.static.url is not a String")
        }
        return url
    }

    public String getApisUrl(){
        def url = grailsApplication.config.ddb?.apis?.url
        if(!url){
            throw new ConfigurationException("getApisUrl(): Configuration entry does not exist -> ddb.apis.url")
        }
        if(!(url instanceof String)){
            throw new ConfigurationException("getApisUrl(): apd.apis.url is not a String")
        }
        return url
    }

    public String getBackendUrl(){
        def url = grailsApplication.config.ddb?.backend?.url
        if(!url){
            throw new ConfigurationException("getBackendUrl(): Configuration entry does not exist -> ddb.backend.url")
        }
        if(!(url instanceof String)){
            throw new ConfigurationException("getBackendUrl(): apd.backend.url is not a String")
        }
        return url
    }

    public String getAasUrl(){
        def url = grailsApplication.config.ddb?.aas?.url
        if(!url){
            throw new ConfigurationException("getAasUrl(): Configuration entry does not exist -> ddb.aas.url")
        }
        if(!(url instanceof String)){
            throw new ConfigurationException("getAasUrl(): apd.backend.url is not a String")
        }
        return url
    }

    public List getFacetsFilter(){
        def filter = grailsApplication.config.ddb?.backend?.facets?.filter
        if(!filter){
            throw new ConfigurationException("getFacetsFilter(): Configuration entry does not exist -> ddb.backend.facets.filter")
        }
        if(!(filter instanceof List)){
            throw new ConfigurationException("getFacetsFilter(): ddb.backend.facets.filter is not a List")
        }
        return filter
    }

    public String getPiwikTrackingFile(){
        def filepath = grailsApplication.config.ddb?.tracking?.piwikfile
        if(!filepath){
            throw new ConfigurationException("getPiwikTrackingFile(): Configuration entry does not exist -> ddb.tracking.piwikfile")
        }
        filepath = new String(filepath.toString());
        if(!(filepath instanceof String)){
            throw new ConfigurationException("getPiwikTrackingFile(): ddb.tracking.piwikfile is not a String")
        }
        return filepath
    }

    public String getEncoding(){
        def encoding = grailsApplication.config.grails?.views?.gsp?.encoding
        if(!encoding){
            throw new ConfigurationException("getEncoding(): Configuration entry does not exist -> grails.views.gsp.encoding")
        }
        if(!(encoding instanceof String)){
            throw new ConfigurationException("getEncoding(): grails.views.gsp.encoding is not a String")
        }
        return encoding
    }

    public String getMimeTypeHtml(){
        def mimeTypeHtml = grailsApplication.config.grails?.mime?.types["html"][0]
        if(!mimeTypeHtml){
            throw new ConfigurationException("getMimeTypeHtml(): Configuration entry does not exist -> grails.mime.types['html'][0]")
        }
        if(!(mimeTypeHtml instanceof String)){
            throw new ConfigurationException("getMimeTypeHtml(): grails.mime.types['html'][0] is not a String")
        }
        return mimeTypeHtml
    }

    /*
     ddb.advancedSearch.defaultOffset=0
     ddb.advancedSearch.defaultRows=20
     */

    public int getSearchGroupCount() {
        def searchGroupCount = grailsApplication.config.ddb?.advancedSearch?.searchGroupCount
        if(!searchGroupCount ){
            throw new ConfigurationException("""getSearchGroupCount(): Configuration entry does not exist ->
                ddb.advancedSearch.searchGroupCount""")
        }
        if(!(searchGroupCount instanceof String)){
            throw new ConfigurationException("""getSearchGroupCount(): ddb.advancedSearch.searchGroupCount is not
                a String""")
        }
        try {
            searchGroupCount = new Integer(Integer.parseInt(searchGroupCount));
        }
        catch (NumberFormatException e) {
            throw new ConfigurationException("""getSearchGroupCount(): ddb.advancedSearch.searchGroupCount is not
                an Integer""")
        }
        return searchGroupCount
    }

    public int getSearchFieldCount() {
        def searchFieldCount= grailsApplication.config.ddb.advancedSearch?.searchFieldCount
        if(!searchFieldCount){
            throw new ConfigurationException("""getSearchFieldCount(): Configuration entry does not exist ->
                ddb.advancedSearch.searchFieldCount""")
        }
        if(!(searchFieldCount instanceof String)){
            throw new ConfigurationException("""getSearchFieldCount(): ddb.advancedSearch.searchFieldCount is not
                a String""")
        }
        try {
            searchFieldCount = new Integer(Integer.parseInt(searchFieldCount));
        }
        catch (NumberFormatException e) {
            throw new ConfigurationException("""getSearchFieldCount(): ddb.advancedSearch.searchFieldCount is not
                an Integer""")
        }
        return searchFieldCount
    }

    public int getSearchOffset() {
        def offset = grailsApplication.config.ddb.advancedSearch?.defaultOffset
        if(!offset){
            throw new ConfigurationException("""getSearchOffset(): Configuration entry does not exist ->
                ddb.advancedSearch.defaultOffset""")
        }
        if(!(offset instanceof String)){
            throw new ConfigurationException("""getSearchOffset(): ddb.advancedSearch.defaultOffset is not
                a String""")
        }
        try {
            offset = new Integer(Integer.parseInt(offset));
        }
        catch (NumberFormatException e) {
            throw new ConfigurationException("""getSearchOffset(): ddb.advancedSearch.defaultOffset is not
                an Integer""")
        }
        return offset
    }

    public int getSearchRows() {
        def rows = grailsApplication.config.ddb?.advancedSearch?.defaultRows
        if(!rows){
            throw new ConfigurationException("""getSearchRows(): Configuration entry does not exist ->
                ddb.advancedSearch.defaultRows""")
        }
        if(!(rows instanceof String)){
            throw new ConfigurationException("""getSearchRows(): ddb.advancedSearch.defaultRows is not
                a String""")
        }
        try {
            rows = new Integer(Integer.parseInt(rows));
        }
        catch (NumberFormatException e) {
            throw new ConfigurationException("""getSearchRows(): ddb.advancedSearch.defaultRows is not
                an Integer""")
        }
        return rows
    }

    public int getSessionTimeout() {
        def timeout = grailsApplication.config.ddb?.session?.timeout
        if(!timeout){
            throw new ConfigurationException("""getSessionTimeout(): Configuration entry does not exist ->
                ddb.session.timeout""")
        }
        if(!(timeout instanceof String)){
            throw new ConfigurationException("""getSessionTimeout(): ddb.session.timeout is not
                a String""")
        }
        try {
            timeout = new Integer(Integer.parseInt(timeout));
        }
        catch (NumberFormatException e) {
            throw new ConfigurationException("""getSessionTimeout(): ddb.session.timeout is not
                an Integer""")
        }
        return timeout
    }
}
