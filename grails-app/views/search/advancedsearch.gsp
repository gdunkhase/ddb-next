<meta name="layout" content="main" />

<div class="row advanced-search">
    <div class="span12">
        <div class="row heading bb">
            <div class="span6">
                <div class="fl"><h1><g:message code="ddbnext.AdvancedSearch"/></h1></div>
                <span class="contextual-help fl hidden-phone hidden-tablet" 
                      title="<g:message code="ddbnext.AdvancedSearch_Hint"/>" 
                      data-content="<g:message code="ddbnext.AdvancedSearch_Hint"/>">
                </span>
                <div class="tooltip off"></div>
            </div>
        </div>
        <div class="row">
            <div class="span12">
                <form action="advancedsearch" id="advanced-search-form" method="post">
                    <div class="row">
                        <div class="span12">
                            <div class="row operator global-operator">
                                <div class="span12">
                                    <label for="operator" ><g:message code="ddbnext.AdvancedSearch_AllGroupsOperator_MatchLabel"/></label>
                                    <select id="operator" name="operator">
                                        <option value="OR"><g:message code="ddbnext.AdvancedSearchGlobalOperator_AnyGroups"/></option>
                                        <option value="AND"><g:message code="ddbnext.AdvancedSearchGlobalOperator_AllGroups"/></option>
                                    </select>
                                </div>
                            </div>
                            <g:set var="group" value="${0}"/>
                            <g:while test="${group < searchGroupCount}">
                              <g:render template="/search/advancedsearchgroup" /><%group++%>
                            </g:while>
                            <div class="row bb">
                                <div class="span12 button-group">
                                    <button type="button" class="add-group-button fr" style="display: none" title="<g:message code="ddbnext.AdvancedSearch_AddGroupButton_Title"/>">
                                      <g:message code="ddbnext.AdvancedSearch_AddGroupButton_Title"/>
                                    </button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6 button-group fr">
                                  <button class="reset" type="reset"><span><g:message code="ddbnext.Reset"/></span></button>
                                  <button class="submit" type="submit"><span><g:message code="ddbnext.Search"/></span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>   
    </div>
</div>