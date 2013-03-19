                 <g:set var="jsonOrgHierarchy" value="${vApiInst.getChildrenOfInstitutionByItemId(itemId, grailsApplication.config.ddb.backend.url.toString())}" />
                 <g:if test="${((jsonOrgHierarchy != null)&&(jsonOrgHierarchy.size() > 0))}">
                      <ul>
                         <g:each in="${jsonOrgHierarchy}" >
                          <li>
                              <g:link controller="institution" action="readByItemId" params="[id: it.id]">${it.label}</g:link>
                              <g:set var="itemId" value="${it.id}" />
                              <g:render template="subinstitutions" />
                          </li>
                         </g:each>
                      </ul>
                  </g:if>