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
<ul class="results-list unstyled  <g:if test="${viewType == 'grid'}">grid</g:if>">
  <g:set var="pageHitCounter" value="${0}"/>
  <g:each in="${results}">
    <g:set var="pageHitCounter" value="${pageHitCounter + 1}" />
    <g:set var="hitNumber" value="${offset + pageHitCounter}"/>
    <g:set var="controller" value="item" />
    <g:set var="action" value="findById" />
    <g:if test="${it.category == 'Institution'}">
        <g:set var="controller" value="institution" />
        <g:set var="action" value="showInstitutionsTreeByItemId" />
    </g:if>
    <li class="item bt">
      <div class="summary <g:if test="${viewType != 'grid'}">row</g:if>">
        <g:if test="${viewType == 'grid'}">
          <g:render template="thumbnailWrapper" model="${[viewType: viewType, item: it, confBinary: confBinary, hitNumber: hitNumber, action: action, controller: controller]}" />
          <g:render template="summaryMainWrapper" model="${[viewType: viewType, item: it, urlParams: urlParams, hitNumber: hitNumber, action: action, controller: controller]}" />
        </g:if>
        <g:else>
          <g:render template="summaryMainWrapper" model="${[viewType: viewType, item: it, urlParams: urlParams, hitNumber: hitNumber, action: action, controller: controller]}" />
          <g:render template="thumbnailWrapper" model="${[viewType: viewType, item: it, confBinary: confBinary, hitNumber: hitNumber, action: action, controller: controller]}" />
        </g:else>
      </div>
    </li>
  </g:each>
</ul>