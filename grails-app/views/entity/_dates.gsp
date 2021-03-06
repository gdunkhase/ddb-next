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
<div class="dates">

  <div><g:message code="ddbnext.Entity_Birth" />: ${entity.dateOfBirth}
    <g:if test="${entity.placeOfBirth}"> 
      , <a href="" class="todo-gnd">${entity.placeOfBirth}</a>
    </g:if>
  </div>
  <div><g:message code="ddbnext.Entity_Death" />: ${entity.dateOfDeath}
    <g:if test="${entity.placeOfDeath}"> 
      , <a href="" class="todo-gnd">${entity.placeOfDeath}</a>
    </g:if>
  </div>
</div>