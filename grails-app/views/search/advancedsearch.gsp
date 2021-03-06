<%--
Copyright (C) 2013 FIZ Karlsruhe
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>
<html>
<head>
<title><g:message code="ddbnext.Advanced_search" /> - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

<meta name="page" content="advancedsearch" />
<meta name="layout" content="main" />

</head>
<body>
  <div class="row advanced-search">
      <div class="span12">
          <div class="row heading bb">
              <div class="span6">
                  <div class="fl"><h1><g:message code="ddbnext.AdvancedSearch"/></h1></div>
                  <span class="contextual-help fl hidden-phone hidden-tablet" 
                        title="<g:message code="ddbnext.AdvancedSearch_Hint" 
                        args="${[('<a href="' + createLink(controller:"content", params:[dir:'help', id:'search-advanced']) + '">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                        default="ddbnext.AdvancedSearch_Hint"/>" 
                        data-content="<g:message code="ddbnext.AdvancedSearch_Hint" 
                        args="${[('<a href="' + createLink(controller:"content", params:[dir:'help', id:'search-advanced']) + '">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                        default="ddbnext.AdvancedSearch_Hint"/>">
                  </span> 
                  <div class="tooltip off"></div>
              </div>
          </div>
          <div class="row">
              <div class="span12">
                  <g:form method="post" id="advanced-search-form" url="[controller:'advancedsearch', action:'executeSearch']" >
                      <div class="row">
                          <div class="span12">
                              <fieldset>
                                <div class="row operator global-operator">
                                  <div class="span12">
                                      <label for="operator" ><g:message code="ddbnext.AdvancedSearch_AllGroupsOperator_MatchLabel"/></label>
                                      <select id="operator" name="operator">
                                          <option value="OR"><g:message code="ddbnext.AdvancedSearchGlobalOperator_AnyGroups"/></option>
                                          <option value="AND"><g:message code="ddbnext.AdvancedSearchGlobalOperator_AllGroups"/></option>
                                      </select>
                                  </div>
                                </div>
                              </fieldset>
                              <g:set var="group" value="${0}"/>
                              <g:while test="${group < searchGroupCount}">
                                <fieldset>
                                    <g:render template="/search/advancedsearchgroup" /><%group++%>
                                </fieldset>
                              </g:while>
                              <fieldset>
                                <div class="row bb">
                                  <div class="span12 button-group">
                                      <button type="button" class="add-group-button fr" style="display: none" title="<g:message code="ddbnext.AdvancedSearch_AddGroupButton_Title"/>">
                                        <g:message code="ddbnext.AdvancedSearch_AddGroupButton_Title"/>
                                      </button>
                                  </div>
                                </div>
                              </fieldset>
                              <fieldset>
                                <div class="row">
                                  <div class="span6 button-group fr">
                                    <button class="reset" type="reset"><span><g:message code="ddbnext.Reset"/></span></button>
                                    <button class="submit" type="submit"><span><g:message code="ddbnext.Search"/></span></button>
                                  </div>
                                </div>
                              </fieldset>
                          </div>
                      </div>
                  </g:form>
              </div>
          </div>   
      </div>
  </div>
</body>
</html>
