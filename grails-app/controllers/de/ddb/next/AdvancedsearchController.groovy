package de.ddb.next
import java.util.List;

import net.sf.json.JSONArray
import org.apache.commons.lang.builder.ReflectionToStringBuilder
import grails.converters.JSON
import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder


/**
 * COntroller for Advanced Search
 * 
 * @author mih
 *
 */
class AdvancedsearchController {

    /**
     * render advanced search form
     * 
     * @return
     */
    def fillValues() {
        render(view: "/search/advancedsearch")
    }

    /**
     * Take form-parameters from advanced-search-form, generate query and call search with query.
     * 
     * @throws IOException
     */
    def executeSearch() throws IOException {
        int searchGroupCount = Integer.parseInt(grailsApplication.config.ddb.advancedsearch.searchgroupcount);
        int searchFieldCount = Integer.parseInt(grailsApplication.config.ddb.advancedsearch.searchfieldcount);
        int offset = Integer.parseInt(grailsApplication.config.ddb.advancedsearch.defaultoffset);
        int rows = Integer.parseInt(grailsApplication.config.ddb.advancedsearch.defaultrows);
        def url = grailsApplication.config.ddb.backend.url;
        def facetSearchfields = new Facets(url:url).getExtendedFacets();

        AdvancedSearchFormToQueryConverter converter =
                new AdvancedSearchFormToQueryConverter(params, searchGroupCount, searchFieldCount, facetSearchfields);
        String query = converter.convertFormParameters();
        redirect(uri: "/search?query=" + query + "&offset=" + offset + "&rows=" + rows);
    }
}
