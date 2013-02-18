package de.ddb.next

import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.Method.GET
import static groovyx.net.http.ContentType.JSON
import net.sf.json.JSONArray

/**
 * Get facetted searchfields and values for facet from Backend.
 * 
 * @author mih
 *
 */
public class FacetsService {
    //Backend URL
    String url
	
	/**
	 * Get values for a facet.
	 * 
	 * @param facetName
	 * @return List of Facet-Values
	 */
    public List getFacet(facetName) throws IOException {
        def res = []
        int i = 0
        try {
            def json = ApiConsumer.getTextAsJson(url ,'/search/facets/' + facetName, null)
            json.facetValues.each{
                res[i] = it.value
                i++
            }
        }
        catch (ConnectException e) {
            throw new IOException(e.getMessage(), e)
        }
        return res
	}

	/**
	 * Get List of Searchfields(Facets) for advanced search.
	 * 
	 * @return List of Arrays.<br>
	 *     Array contains name, searchType(TEXT or ENUM), sortType(ALPHA_ID, ALPHA_LABEL).<br>
	 *     name: name of facet(Searchfield).<br>
	 *     searchType TEXT: display textfield for searchstring.<br>
	 *     searchType ENUM: display selectbox with possible values for searchstring.<br>
	 *     sortType (for searchType = ENUM): how to sort possible values.
	 *     ALPHA_ID: sort by id.<br>
	 *     ALPHA_LABEL: sort by value.<br>
	 */
    public List getExtendedFacets() throws IOException {
        def res = [];
        try {
            def json = ApiConsumer.getTextAsJson(url ,'/search/facets/', [type:'EXTENDED'])
            json.each{
                def part = [:]
                part["name"] = it.name
                part["searchType"] = it.searchType
                part["sortType"] = it.sortType
                res[it.position - 1] = part
            }
        }
        catch (ConnectException e) {
            throw new IOException(e.getMessage(), e)
        }
        return res
	}

	
}
