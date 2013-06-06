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
<title><g:message code="ddbnext.Registration" /> - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek" /></title>

<meta name="page" content="registration" />
<meta name="layout" content="main" />

</head>
<body>
  <div class="container">
    <div class="well">
      <g:form method="post" id="registration-form" class="form-horizontal" url="[controller:'registration', action:'signup']" >

        <div class="reg-title"><g:message code="ddbnext.Sign_up_here" /></div>

        <div class="control-group">
          <label class="control-label">First Name</label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-user"></i></span>
              <input type="text" class="reg-input" id="fname" name="fname" placeholder="First Name">
            </div>
          </div>
        </div>

        <div class="control-group ">
          <label class="control-label">Last Name</label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-user"></i></span>
              <input type="text" class="reg-input" id="lname" name="lname" placeholder="Last Name">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"><g:message code="ddbnext.Email" /></label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-envelope"></i></span>
              <input type="text" class="reg-input" id="email" name="email" placeholder="<g:message code="ddbnext.Email" />">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"><g:message code="ddbnext.Your_Password" /></label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-lock"></i></span>
              <input type="Password" id="passwd" class="reg-input" name="passwd" placeholder="<g:message code="ddbnext.Your_Password" />">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"><g:message code="ddbnext.Confirm_password" /></label>
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-lock"></i></span>
              <input type="Password" id="conpasswd" class="reg-input" name="conpasswd" placeholder="<g:message code="ddbnext.Confirm_password" />">
            </div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label"></label>
          <div class="controls">
            <button type="submit" class="btn-padding">Create My Account</button>
          </div>
        </div>

      </g:form>
    </div>
  </div>
</body>
</html>