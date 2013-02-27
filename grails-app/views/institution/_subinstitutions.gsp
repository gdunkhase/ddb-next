                <%
                  //ApiInstitution vApiInst = new ApiInstitution();
                  def jsonOrgHierarchy = vApiInst.getChildrenOfInstitutionByItemId(itemId, grailsApplication.config.ddb.backend.url.toString())
                  if ((jsonOrgHierarchy != null)&&(jsonOrgHierarchy.size() > 0)) {
                 %>
                      <ul>
                        <%
                      for (int i = 0; i < jsonOrgHierarchy.size(); i++) {
                         %>
                          <li>
                              <a href="/about-us/institutions/item/${jsonOrgHierarchy[i].id}">${jsonOrgHierarchy[i].label}</a>
                              <% itemId = jsonOrgHierarchy[i].id; %>
                              <g:render template="subinstitutions"  />
                          </li>
                        <%}%> 
                      </ul>
                <% }%>
