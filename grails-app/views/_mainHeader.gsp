<div class="print-logo off">
  <r:img  dir="images" file="logo_header.png" alt=""/>
</div>

<!--[if lt IE 9]>
  <div class="header" role="contentinfo">
<![endif]-->

<header class="navbar navbar-fixed-top visible-phone">
  <div class="navbar-inner">
    <div class="container">
      <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar" style="visibility:hidden;"></span>
      </button>
      <g:link uri="/" class="brand" title="${message(code: 'ddbnext.OpenSearch_Plugin_ShortName_Max16CharsNoHtml')}" tabindex="-1">
        <r:img dir="images" file="logo_header.png" alt="Deutsche Digitale Bibliothek"/>
      </g:link>
      <div class="nav-collapse collapse">
        <ul class="nav nav-list">
          <li class="active"><g:link uri="/"><g:message code="ddbnext.Search"/></g:link>
            <ul class="nav">
              <li class=""><g:link controller="advancedsearch"><g:message code="ddbnext.Advanced_search"/></g:link></li>
            </ul></li>
          <li class=""><g:link controller="content" params="[dir: 'about']"><g:message code="ddbnext.AboutUs"/></g:link>
            <ul class="nav">
              <li class=""><g:link controller="content" params="[dir: 'news']"><g:message code="ddbnext.News"/></g:link></li>
              <li class=""><g:link controller="institution" action="show"><g:message code="ddbnext.Institutions"/></g:link></li>
              <li class=""><g:link controller="content" params="[dir: 'ddb']"><g:message code="ddbnext.Participate"/></g:link></li>
              <li class=""><g:link controller="content" params="[dir: 'competence-network']"><g:message code="ddbnext.CompetenceNetwork"/></g:link></li>
            </ul></li>
          <li class=""><g:link controller="content" params="[dir: 'help']"><g:message code="ddbnext.Help"/></g:link>
            <ul class="nav">
              <li class=""><g:link controller="content" params="[dir: 'faq']"><g:message code="ddbnext.Faq"/></g:link></li>
              <li class=""><g:link controller="content" params="[dir: 'tutorial']"><g:message code="ddbnext.Tutorial"/></g:link></li>
            </ul></li>
        </ul>
      </div>
    </div>
  </div>
</header>

<header class="hidden-phone">
  <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Header"/></h1>
    <div class="container">
      <div class="row">
        <!--[if lt IE 9]>
          <div class="nav widget span12" data-widget="NavigationWidget">
        <![endif]-->
        <nav class="widget span12" data-widget="NavigationWidget">
          <div class="row">
            <div class="span7">
              <g:link uri="/" class="navigation-header-logo" title="${message(code: 'ddbnext.OpenSearch_Plugin_ShortName_Max16CharsNoHtml')}" tabindex="-1">
                <r:img dir="images" file="logo_header.png" alt=""/>
              </g:link>
              <ul class="navigation inline" role="navigation">
                <li class="root"><g:link uri="/"><g:message code="ddbnext.Search"/></g:link>
                  <ul>
                    <li class=""><g:link controller="advancedsearch"><g:message code="ddbnext.Advanced_search"/></g:link></li>
                  </ul>
                </li>
                <li class=""><g:link controller="content" params="[dir: 'about']"><g:message code="ddbnext.AboutUs"/></g:link>
                  <ul>
                    <li class=""><g:link controller="content" params="[dir: 'news']"><g:message code="ddbnext.News"/></g:link></li>
                    <li class=""><g:link controller="institution" action="show"><g:message code="ddbnext.Institutions"/></g:link></li>
                    <li class=""><g:link controller="content" params="[dir: 'ddb']"><g:message code="ddbnext.Participate"/></g:link></li>
                    <li class=""><g:link controller="content" params="[dir: 'competence-network']"><g:message code="ddbnext.CompetenceNetwork"/></g:link></li>
                  </ul>
                </li>
                <li class=""><g:link controller="content" params="[dir: 'help']"><g:message code="ddbnext.Help"/></g:link>
                  <ul>
                    <li class=""><g:link controller="content" params="[dir: 'faq']"><g:message code="ddbnext.Faq"/></g:link></li>
                    <li class=""><g:link controller="content" params="[dir: 'tutorial']"><g:message code="ddbnext.Tutorial"/></g:link></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="span5 toolbar">
              <div class="language-wrapper">
                <a>
                  <g:currentLanguage />
                </a>
                <ul class="selector language">
                  <li><g:languageLink params="${params}" locale="de" islocaleclass="nopointer"><g:message code="ddbnext.language_de"/></g:languageLink></li>
                  <li><g:languageLink params="${params}" locale="en" islocaleclass="nopointer"><g:message code="ddbnext.language_en"/></g:languageLink></li>
                </ul>  
              </div>
              <div class="search-header hidden-phone">
                <g:form method="get" role="search" id="form-search-header" url="[controller:'search', action:'results']">
                    <label> 
                      <span><g:message code="ddbnext.Search_text_field"/></span>
                    </label>
                    <input type="search" class="query" name="query" id="searchinput" value="<g:getCookieFieldValue fieldname="query" />"/>
                    <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
                    <span class="contextual-help hidden-phone hidden-tablet" 
                          title="<g:message code="ddbnext.Search_Hint" 
                          args="${[('<a href="' + createLink(controller:"content", params:[dir:'help', id:'search-simple']) + '">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                          default="ddbnext.Search_Hint"/>" 
                          data-content="<g:message code="ddbnext.Search_Hint" 
                          args="${[('<a href="' + createLink(controller:"content", params:[dir:'help', id:'search-simple']) + '">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                          default="ddbnext.Search_Hint"/>">
                    </span> 
                    <g:link class="link-adv-search" controller="advancedsearch"><g:message code="ddbnext.Advanced_search"/></g:link>
                    <div class="tooltip off">
                    </div>
                </g:form>
              </div>
            </div>
          </div>
      </nav>
      <!--[if lt IE 9]>
        </div>
      <![endif]-->
    </div>
  </div>
</header>
<!--[if lt IE 9]>
  </div>
<![endif]-->
