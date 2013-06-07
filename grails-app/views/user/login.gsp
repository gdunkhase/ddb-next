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
<%@ page import="de.ddb.next.LoginStatus" %>
<html>
  <head>
    <title><g:message code="ddbnext.Login" /> - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>
    
    <meta name="page" content="login" />
    <meta name="layout" content="main" />
  
  </head>
  <body>
  
    <g:isNotLoggedIn>
      <g:message code="ddbnext.Please_Login" />
      <br />
      
      <g:form controller="user" action="doLogin">
      
        <div class="<g:if test="${loginStatus != LoginStatus.FAILURE}">off</g:if>"><g:message code="ddbnext.Error_Email_Password_Combination" /></div>
        <br />
        <g:message code="ddbnext.Username" />
        <input type="text" name="email" value="fiz@fiz.fiz"/>
        <br />
        <g:message code="ddbnext.Your_Password" />
        <input type="password" name="password" value="fiz"/>
        <br />
        <input type="submit" value="<g:message code="ddbnext.Login_Button" />" />
      
      </g:form>
  
      <br />
      <g:link controller="user" action="requestOpenIdLogin" params="${["provider": "google"]}"><div class="openid_google"></div></g:link>
      <br />
      <g:link controller="user" action="requestOpenIdLogin" params="${["provider": "yahoo"]}"><div class="openid_yahoo"></div></g:link>
      <br />
  
      <g:link controller="user" action="registration" ><g:message code="ddbnext.Register" /></g:link>  
    </g:isNotLoggedIn>

    <g:isLoggedIn>
      <g:if test="${loginStatus == LoginStatus.SUCCESS}">
        Sie haben sich erfolgreich eingeloggt
      </g:if>
      <g:else>
        Sie sind bereits eingeloggt
      </g:else>
    
    </g:isLoggedIn>
  
  </body>
</html>
