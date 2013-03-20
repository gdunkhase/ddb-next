                 <g:set var="jsonHierarchyChildrenOfOrg" value="${vApiInst.getChildrenOfInstitutionByItemId(itemId, grailsApplication.config.ddb.backend.url.toString())}" />
                 <g:if test="${((jsonHierarchyChildrenOfOrg)&&(jsonHierarchyChildrenOfOrg.size() > 0))}">
                      <ol class="institution-list">
                         <g:each in="${jsonHierarchyChildrenOfOrg}" >
                          <li class="institution-listitem" data-sector="${ it?.sector }" data-institution-id="${ it?.id }" >
                              <g:if test="${(selectedItemId == it.id)}">
                                  <i class="icon-institution"></i>
                                  <b>${it.label}</b>
                              </g:if>
                              <g:else>
                                  <i class="icon-child-institution"></i>
                                  <a href="/about-us/institutions/item/${it.id}">${it.label}</a>
                              </g:else>
                              <g:if test="${!(it.aggregationEntity)}">
                                  <g:set var="itemId" value="${it.id}" />
                                  <g:render template="subinstitutions" />
                              </g:if>
                          </li>
                         </g:each>
                      </ol>
                  </g:if>