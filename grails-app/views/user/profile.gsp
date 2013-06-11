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
  <div class="container row">
    <g:form method="post" id="user-profile-form" name="user-profile-form" class="form-horizontal" url="[controller:'user', action:'save']" >
        <input type="hidden" name="id" value="${ user.id }"/>
        <div class="row well">
            <div class="profile-nav">
                <div class="profile-title"><g:message code="ddbnext.userprofile"/>  ${ user.id }</div>
                <div class="profile-links">
                    <a class="profile-link" title="<g:message code="ddbnext.user.showBookmarks" />" class="persist" href="${createLink(controller="user",action: 'bookmarks', params:[:])}">
                        <g:message code="ddbnext.user.showBookmarks" />, count: ${bookmarksCount }
                    </a>
                    <a class="profile-link" title="<g:message code="ddbnext.user.deleteAccount" />" class="persist" href="${createLink(controller="user",action: 'delete', params:[id:user.id])}">
                        <g:message code="ddbnext.user.deleteAccount" />
                    </a>
                </div>
            </div>

            <div class="span12 control-group">
              <label class="control-label"><g:message code="ddbnext.user.name" /></label>
              <div class="controls">
                <div class="input-prepend">
                  <span class="add-on"><i class="icon-user"></i></span>
                  <input type="text" class="profile-input" id="name" name="name" value="${ user.id }">
                </div>
              </div>
            </div>
            <div class="span12 control-group">
              <label class="control-label"><g:message code="ddbnext.Email" /></label>
              <div class="controls">
                <div class="input-prepend">
                  <span class="add-on"><i class="icon-envelope"></i></span>
                  <input type="text" class="profile-input" id="email" name="email" value="${user.email}">
                </div>
              </div>
            </div>

            <div class="span12 control-group">
              <label class="control-label"><g:message code="ddbnext.Your_Password" /></label>
              <div class="controls">
                <div class="input-prepend">
                  <span class="add-on"><i class="icon-lock"></i></span>
                  <input type="Password" id="password" class="profile-input" name="password" placeholder="<g:message code="ddbnext.Your_Password" />">
                </div>
              </div>
            </div>
    
            <div class="span12 control-group">
              <label class="control-label"><g:message code="ddbnext.Confirm_password" /></label>
              <div class="controls">
                <div class="input-prepend">
                  <span class="add-on"><i class="icon-lock"></i></span>
                  <input type="Password" id="confpassword" class="profile-input" name="confpassword" placeholder="<g:message code="ddbnext.Confirm_password" />">
                </div>
              </div>
            </div>

            <div class="span12 control-group">
              <label class="control-label"><g:message code="ddbnext.newsletter.subscription" /></label>
              <div class="controls">
                <div class="input-prepend">
                  <input type="checkbox" id="newsletter" class="profile-input" name="newsletter">
                </div>
              </div>
            </div>

            <div class="span12 control-group">
              <div class="controls">
                <button type="submit" class="btn-padding" title="<g:message code="ddbnext.user.saveChanges"/>"><g:message code="ddbnext.Save"/></button>
              </div>
            </div>
        </div>
    </g:form>
  </div>
</body>
</html>
