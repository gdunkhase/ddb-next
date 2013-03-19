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
     * @param facetName The name of the facet
     * @param allFacetFilters List of all available facet filter mappings
     * @return List of Facet-Values
     */
    public List getFacet(facetName, allFacetFilters) throws IOException {

        def filtersForFacetName = getFiltersForFacetName(facetName, allFacetFilters)
        def res = []
        int i = 0
        def json = ApiConsumer.getTextAsJson(url ,'/search/facets/' + facetName, null)
        json.facetValues.each{
            if(filtersForFacetName.isEmpty() || !filtersForFacetName.contains(it.value)){
                res[i] = it.value
                i++
            }
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
        def json = ApiConsumer.getTextAsJson(url ,'/search/facets/', [type:'EXTENDED'])
        json.each{
            def part = [:]
            part["name"] = it.name
            part["searchType"] = it.searchType
            part["sortType"] = it.sortType
            res[it.position - 1] = part
        }
        return res
    }


    /**
     * Takes a list of configured facet filter mapping and returns only the filter values for the matching facet name.
     * E.g.: facetName=facet1, allFacetsFilters=[{facetName:facet1, filter:filter1}, {facetName:facet2, filter:filter2}]
     * The returned list would be [filter1]
     * @param facetName The name of the facet 
     * @param allFacetFilters List of mappings containing all available facet filter mappings
     * @return A list of filters for the matching facet name
     */
    private List getFiltersForFacetName(facetName, allFacetFilters){
        def filtersForFacetName = []
        for(filter in allFacetFilters) {
            if(filter.facetName != null && filter.facetName.equals(facetName)){
                filtersForFacetName.add(filter.filter)
            }
        }
        return filtersForFacetName;
    }

}
