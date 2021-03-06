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
<g:redirectIfNotLoggedIn />

<title><g:message code="ddbnext.Password_Change" /> - <g:message
    code="ddbnext.Deutsche_Digitale_Bibliothek" /></title>

<meta name="page" content="passwordchange" />
<meta name="layout" content="main" />
</head>

<body>
    <g:form method="post" id="password-change-form" name="password-change-form"
      class="form-horizontal" url="[controller:'user', action:'passwordChange']">
      <g:if test="${errors != null && errors.size()>0}">
        <g:renderErrors errors="${errors}"></g:renderErrors>
      </g:if>
      <g:if test="${messages != null && messages.size()>0}">
        <g:renderMessages messages="${messages}"></g:renderMessages>
      </g:if>
      <input type="hidden" name="id" value="${ user.id }" />
      <div class="well">
        <div class="profile-nav">
          <g:set var="userLabel">
            <g:getUserLabel />
          </g:set>
          <div>
            <h1>
              <g:message code="ddbnext.Change_Password_Label"
                args="${[userLabel]}" default="ddbnext.Change_Password_Label" />
            </h1>
          </div>
        </div>

        <div class="control-group bt-white">
          <label class="control-label"><g:message
              code="ddbnext.Your_Old_Password" /></label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-lock"></i></span> <input
                type="Password" id="oldpassword" class="profile-input"
                name="oldpassword"
                placeholder="<g:message code="ddbnext.Your_Old_Password" />"
                value="${params.oldpassword}">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"><g:message
              code="ddbnext.Your_New_Password" /></label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-lock"></i></span> <input
                type="Password" id="newpassword" class="profile-input"
                name="newpassword"
                placeholder="<g:message code="ddbnext.Your_New_Password" />"
                value="${params.newpassword}">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"><g:message
              code="ddbnext.Confirm_New_password" /></label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-lock"></i></span> <input
                type="Password" id="confnewpassword" class="profile-input"
                name="confnewpassword"
                placeholder="<g:message code="ddbnext.Confirm_New_password" />"
                value="${params.confnewpassword}">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"></label>
          <div class="controls">
            <button type="submit" class="btn-padding"
              title="<g:message code="ddbnext.Save_Changes"/>">
              <g:message code="ddbnext.Save_Changes" />
            </button>
          </div>
        </div>
      </div>
      <ul id="error-messages" class="off">
        <li><a><g:message code="ddbnext.Field_Required" /></a></li>
        <li><a><g:message
              code="ddbnext.Password_Compulsory_Characters_Number" /></a></li>
        <li><a><g:message code="ddbnext.Insert_Again_The_Password" /></a></li>
      </ul>
    </g:form>
</body>
</html>
