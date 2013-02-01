package de.ddb.next

/**
 * Renders the body of advanced search form for display.
 *
 * @author mih
 *
 */
public class AdvancedsearchTagLib {
    def enumSearchType = "ENUM"
    def textSearchType = "TEXT"
    def languageTagPrefix = "ddbnext.facet_"
    def facetNameSuffix = "_fct"
    def labelSortType = "ALPHA_LABEL"

    def messageSource

    int searchGroupCount
    int searchFieldCount
    def facetSearchfields
    def nofacetSearchfields

    def facetValuesMap = [:]

    /**
     * render html.
     */
    def advancedsearch = { attrs, body ->
        searchGroupCount = Integer.parseInt(grailsApplication.config.ddb.advancedsearch.searchgroupcount)
        searchFieldCount = Integer.parseInt(grailsApplication.config.ddb.advancedsearch.searchfieldcount)
        def url = grailsApplication.config.ddb.backend.url;
        facetSearchfields = new Facets(url:url).getExtendedFacets();
        getFacetValues()
        for (int i = 0; i < searchGroupCount; i++) {
            out << body() << renderSearchGroup(i).toString()
        }
    }

    /**
     * render one group of search-form
     * 
     * @param groupId
     * @return StringBuffer group as html
     */
    private StringBuffer renderSearchGroup(groupId) {
        def spacer = '                            ';
        def res = new StringBuffer()

        res << spacer << '<div class="row-fluid search-group">\n'
        res << spacer << '  <div class="span12">\n'
        res << spacer << '    <div class="row-fluid">\n'
        res << spacer << '      <div class="span11 operator group-operator">\n'
        res << spacer << '          <label for="operator-group-' << groupId << '">'
        res << getMessage("ddbnext.AdvancedSearch_Operator_MatchLabel")
        res << '</label>\n'
        res << spacer << '          <select id="operator-group-' << groupId << '" name="operator-group-' << groupId << '">\n'
        res << spacer << '              <option value="OR">'
        res << getMessage("ddbnext.AdvancedSearchGroupOperator_AnyTerms")
        res << '</option>\n'
        res << spacer << '              <option value="AND">'
        res << getMessage("ddbnext.AdvancedSearchGroupOperator_AllTerms")
        res << '</option>\n'
        res << spacer << '          </select>\n'
        res << spacer << '      </div>\n'

        res << spacer << '      <div class="span1 button-group">\n'
        res << spacer << '          <button type="button" class="remove-group-button" style="display:none" title="'
        res << getMessage("ddbnext.AdvancedSearch_RemoveGroupButton_Title")
        res << '">'
        res << '</button>\n'
        res << spacer << '      </div>\n'
        res << spacer << '    </div>\n'
        
        res << spacer << '    <div class="row-fluid">\n'
        res << spacer << '      <div class="span12 hr white"></div>\n'
        res << spacer << '    </div>\n'
        res << spacer << '    <div class="row-fluid">\n'
        res << spacer << '      <div class="span12 search-field-group">\n'
        for (int i = 0; i < searchFieldCount; i++) {
            res << spacer << '          <div class="row-fluid search-field-row">\n'
            res << renderSearchField(groupId,i);
            res << spacer << '          </div>\n'
        }
        res << spacer << '      </div>\n'
        res << spacer << '    </div>\n'
        res << spacer << '  </div>\n'
        res << spacer << '</div>\n'
        return res
    }

    /**
     * render one row of a group of search-form
     * 
     * @param groupId
     * @param fieldId
     * @return StringBuffer row as html
     */
    private StringBuffer renderSearchField(groupId, fieldId) {
        def spacer = '                                      ';
        def res = new StringBuffer()

        res << spacer << '<div class="span12">\n'
        res << spacer << '  <div class="row-fluid">\n'
        res << spacer << '    <div class="span11">\n'
        res << spacer << '      <div class="row-fluid">\n'
        res << spacer << '        <div class="span3">\n'
        res << spacer << '          <select class="facet facet-js" id="facet-js-' << groupId << '-' << fieldId << '" name="facet-' << groupId << '-' << fieldId << '" style="display:none" disabled="disabled">\n'
        for ( facetSearchfield in facetSearchfields ) {
            if (facetSearchfield.searchType.equals(enumSearchType)) {
                res << spacer << '              <option value="' << facetSearchfield.name << '" data-inputid="' << facetSearchfield.name << facetNameSuffix << '-' << groupId << '-' << fieldId << '">' << getMessage(languageTagPrefix + facetSearchfield.name) << '</option>\n'
            }
            else {
                res << spacer << '              <option value="' << facetSearchfield.name << '" data-inputid="value-' << groupId << '-' << fieldId << '">' << getMessage(languageTagPrefix + facetSearchfield.name) << '</option>\n'
            }
        }
        res << spacer << '          </select>\n\n'

        res << spacer << '          <select class="facet facet-simple" name="facet-' << groupId << '-' << fieldId << '">\n'
        for ( facetSearchfield in facetSearchfields ) {
            if (facetSearchfield.searchType.equals(textSearchType)) {
                res << spacer << '              <option value="' << facetSearchfield.name << '">' << getMessage(languageTagPrefix + facetSearchfield.name) << '</option>\n'
            }
        }
        res << spacer << '          </select>\n\n'
        res << spacer << '        </div>\n'

        res << spacer << '        <div class="span6">\n'
        for ( facetSearchfield in facetSearchfields ) {
            if (facetSearchfield.searchType.equals(enumSearchType)) {
                res << spacer << '          <select class="facet-values" id="' << facetSearchfield.name << facetNameSuffix << '-' << groupId << '-' << fieldId << '" name="' << facetSearchfield.name << facetNameSuffix << '-' << groupId << '-' << fieldId << '" style="display: none">\n'
                res << spacer << '              <option value="">' << getMessage("ddbnext.AdvancedSearch_PleaseSelect") << '</option>\n'
                for (facetValue in facetValuesMap[facetSearchfield.name + facetNameSuffix]) {
                    res << spacer << '              <option value="' << facetValue.key << '">' << facetValue.value << '</option>\n'
                }
                res << spacer << '          </select>\n\n'
            }
        }

        res << spacer << '          <input class="value" type="text" id="value-' << groupId << '-' << fieldId << '" name="value-' << groupId << '-' << fieldId << '" />\n\n'
        res << spacer << '        </div>\n'

        res << spacer << '        <div class="span3">\n'
        res << spacer << '          <select class="match" name="match-' << groupId << '-' << fieldId << '">\n'
        res << spacer << '            <option value="ANY">' << getMessage("ddbnext.AdvancedSearch_Any") << '</option>\n'
        res << spacer << '            <option value="ALL">' << getMessage("ddbnext.AdvancedSearch_All") << '</option>\n'
        res << spacer << '            <option value="EXACT">' << getMessage("ddbnext.AdvancedSearch_Exact") << '</option>\n'
        res << spacer << '          </select>\n\n'
        res << spacer << '        </div>\n'
        res << spacer << '      </div>\n'
        res << spacer << '    </div>\n'
        res << spacer << '    <div class="span1 row-button-group">\n'
        res << spacer << '        <button type="button" class="remove-button" style="display:none" title="' << getMessage("ddbnext.AdvancedSearch_RemoveRowButton_Title") << '"></button>\n'
        res << spacer << '        <button type="button" class="add-button" style="display:none" title="' << getMessage("ddbnext.AdvancedSearch_AddRowButton_Title") << '"></button>\n'
        res << spacer << '    </div>\n'
        res << spacer << '  </div>\n'
        res << spacer << '  <div class="clearfix"></div>\n'
        res << spacer << '</div>\n'
        return res
    }

    /**
     * request facet-values (for select-box) for all facets that are searchable.
     * fill results in global variable facetValuesMap (key: name of facet, value: map with value, display-value, sorted)
     * 
     */
    private void getFacetValues() {
        def url = grailsApplication.config.ddb.backend.url
        def facetsRequester = new Facets(url:url)
        for ( facetSearchfield in facetSearchfields ) {
            if (facetSearchfield.searchType.equals(enumSearchType)) {
                def facetValues = facetsRequester.getFacet(facetSearchfield.name + facetNameSuffix)
                def facetDisplayValuesMap = new TreeMap()
                for (facetValue in facetValues) {
                    facetDisplayValuesMap[facetValue] = getMessage("ddbnext." + facetSearchfield.name + facetNameSuffix + "_" + facetValue)
                }
                if (facetSearchfield.sortType != null && facetSearchfield.sortType.equals(labelSortType)) {
                    facetDisplayValuesMap = facetDisplayValuesMap.sort {it.value}
                }
                else {
                    facetDisplayValuesMap = facetDisplayValuesMap.sort {it.key}
                }

                facetValuesMap[facetSearchfield.name + facetNameSuffix] = facetDisplayValuesMap
            }
        }
    }

    /**
     * get display-value language-dependent.
     * 
     * @param name fieldname
     * @return String translated display-value
     */
    private String getMessage(name) {
        return messageSource.getMessage(name,null, request.getLocale())
    }
}
