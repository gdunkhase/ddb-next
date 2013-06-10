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
  <div class="row">
    <g:form method="post" id="user-profile-form" url="[controller:'user', action:'save']" >
        <input type="hidden" name="id" value="${ user.id }"/>
        <div class="row heading bb">
            <div class="span6">
                <div class="fl"><h1><g:message code="ddbnext.userprofile"/>  ${ user.id }</h1></div>
                <span 
                    class="contextual-help fl hidden-phone hidden-tablet" 
                        title="<g:message code="ddbnext.UserProfile_Hint" 
                        args="${[('<a href="' + createLink(controller:"content", params:[dir:'help', id:'user-profile']) + '">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                        default="ddbnext.UserProfile_Hint"/>" 
                        data-content="<g:message code="ddbnext.UserProfile_Hint" 
                        args="${[('<a href="' + createLink(controller:"content", params:[dir:'help', id:'user-profile']) + '">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                        default="ddbnext.UserProfile_Hint"/>">
                </span>
                <div class="tooltip" style="display: none;" />
            </div>
        </div>
        <div class="row">
            <div class="span12 page-filter">
                <g:message code="ddbnext.user.name" />
                <input type="text" name="name" class="page-input" maxlength="50" value="${ user.id }"/>
            </div>
            <div class="span12">
                <g:message code="ddbnext.user.email" />
                <input type="text" name="email" class="page-input" maxlength="50" value="${user.email}"/>
            </div>
            <div class="span12">
                <g:message code="ddbnext.user.password" />
                <input type="text" name="password" class="page-input" maxlength="50" value="${password}"/>
            </div>
            <div class="span12">
                <g:message code="ddbnext.user.password" />
                <input type="text" name="password1" class="page-input" maxlength="50" value="${password}"/>
            </div>
            <div class="span12">
               <label class="checkbox"> <input type="checkbox" name="newsletter"><g:message code="ddbnext.newsletter.subscription" /></label>
            </div>
            <div class="span12">
              <a title="<g:message code="ddbnext.user.showBookmarks" />" class="persist" href="${createLink(controller="user",action: 'bookmarks', params:[:])}">
                <g:message code="ddbnext.user.showBookmarks" />, count: ${bookmarksCount }
              </a>
            </div>
            <div class="span12">
              <a title="<g:message code="ddbnext.user.deleteAccount" />" class="persist" href="${createLink(controller="user",action: 'delete', params:[id:user.id])}">
                    <g:message code="ddbnext.user.deleteAccount" />
              </a>
            </div>
            <div class="span12 button-group">
              <button class="submit" type="submit" title="<g:message code="ddbnext.user.saveChanges"/>">
                <g:message code="ddbnext.user.saveChanges"/>
              </button>
          </div>
        </div>
    </g:form>
  </div>
</body>
</html>
