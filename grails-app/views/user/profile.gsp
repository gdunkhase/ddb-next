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
<title><g:message code="ddbnext.user.profilepage" /> - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

<meta name="page" content="userprofile" />
<meta name="layout" content="main" />

</head>

<body>
  <div class="row search-results-container">
    <div>
        <g:message code="ddbnext.user.name" />${username}
    </div>
    <div>
        <g:message code="ddbnext.user.password" />
    </div>
    <div>
        <g:message code="ddbnext.user.email" />
    </div>
    <div>
       <label class="checkbox"> <input type="checkbox"><g:message code="ddbnext.newsletter.subscription" /></label>
    </div>
    <div>
      <a title="<g:message code="ddbnext.user.showBookmarks" />" class="persist" href="/ddb-next/user/${userId}/bookmarks">
            <g:message code="ddbnext.user.showBookmarks" />, count: ${bookmarksCount }
      </a>
    </div>
    <div>
      <a title="<g:message code="ddbnext.user.deleteAccount" />" class="persist" href="/ddb-next/user/${userId}/delete">
            <g:message code="ddbnext.user.deleteAccount" />
      </a>
    </div>
    <div class="span12 button-group">
      <button class="submit" type="submit" title="<g:message code="ddbnext.user.saveChanges"/>">
        <g:message code="ddbnext.user.saveChanges"/>
      </button>
    </div>
  </div>
</body>
</html>
