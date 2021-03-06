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
<!--[if lt IE 9]>
  <div class="footer container" role="contentinfo">
<![endif]-->
<footer class="container">
  <div class="row">
    <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Footer"/></h1>
    <div class="span12 legal">
      <div class="inner">
        <small><g:message code="ddbnext.Copyright_Deutsche_Digitale_Bibliothek"/></small>
        <ul>
          <li><g:link controller="content" params="[dir: 'terms']"><g:message code="ddbnext.Terms_of_Use"/></g:link></li>
          <li><g:link controller="content" params="[dir: 'privacy']"><g:message code="ddbnext.Privacy_Policy"/></g:link></li>
          <li><g:link controller="content" params="[dir: 'publisher']"><g:message code="ddbnext.Publisher"/></g:link></li>
          <li><g:link controller="content" params="[dir: 'sitemap']"><g:message code="ddbnext.Sitemap"/></g:link></li>
          <li><g:link controller="content" params="[dir: 'contact']"><g:message code="ddbnext.Contact"/></g:link></li>
        </ul>
        <div class="build"><g:meta name="app.version"/> / <g:backendVersion/></div>
      </div>
    </div>
  </div>
</footer>
<!--[if lt IE 9]>
  </div>
<![endif]-->
