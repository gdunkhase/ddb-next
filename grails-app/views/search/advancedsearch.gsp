<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'advancedsearch.css')}" type="text/css"> 

<div class="advanced-search row-fluid">
    <div class="span12">
        <div class="heading row-fluid">
            <div class="span6">
                <h1><g:message code="ddbnext.AdvancedSearch"/></h1>
                <span class="contextual-help hidden-phone hidden-tablet" title="<g:message code="ddbnext.AdvancedSearch_Hint"/>" 
                                                                         data-content="<g:message code="ddbnext.AdvancedSearch_Hint"/>">
                                                                         ?
                </span>
            </div>
        </div>
        <div class="row-fluid">
            <div class="hr span12"></div>
        </div>
        <div class="row-fluid">
            <div class="span12">
                <form action="advancedsearch" id="advanced-search-form" method="post">
                    <div class="row-fluid">
                        <div class="span12">
                            <div class="row-fluid operator global-operator">
                                <div class="span12">
                                    <label for="operator" ><g:message code="ddbnext.AdvancedSearch_AllGroupsOperator_MatchLabel"/></label>
                                    <select id="operator" name="operator">
                                        <option value="OR"><g:message code="ddbnext.AdvancedSearchGlobalOperator_AnyGroups"/></option>
                                        <option value="AND"><g:message code="ddbnext.AdvancedSearchGlobalOperator_AllGroups"/></option>
                                    </select>
                                </div>
                            </div>
<g:set var="group" value="${0}"/><g:while test="${group < searchGroupCount}"><g:render template="/search/advancedsearchgroup" /><%group++%></g:while>
                            <div class="row-fluid">
                                <div class="span12 button-group">
                                    <button type="button" class="add-group-button" style="display: none" title="<g:message code="ddbnext.AdvancedSearch_AddGroupButton_Title"/>"><g:message code="ddbnext.AdvancedSearch_AddGroupButton_Title"/></button>
                                </div>
                            </div>
                            <div class="row-fluid">
                                <div class="closing-hr span12"></div>
                            </div>
                            <div class="row-fluid">
                                <div class="span12 button-group">
                                    <div class="row-fluid">
                                        <div class="span3 offset9">
                                            <div class="row-fluid">
                                                <div class="span6">
                                                    <button class="reset" type="reset"><span><g:message code="ddbnext.Reset"/></span></button>
                                                </div>
                                                <div class="span6">
                                                    <button class="submit" type="submit"><span><g:message code="ddbnext.Search"/></span></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>   
    </div>
</div>

                