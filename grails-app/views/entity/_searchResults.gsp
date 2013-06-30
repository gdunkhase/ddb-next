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

<g:each var="item" in="${entity.searchPreview.items}">
  <li class="preview-item">
    <div class="preview-item-image">
      <g:link controller="item" action="findById" params="${["id": item.id]}">
        <img src="${request.getContextPath() + item.preview.thumbnail}" alt="${item.label}" />
      </g:link>
    </div>
    <div class="preview-item-label">
      <g:link controller="item" action="findById" params="${["id": item.id]}">
        <g:truncateItemTitle title="${item.label}" length="${ 40 }"></g:truncateItemTitle>        
      </g:link>
    </div>
  </li>
</g:each>
