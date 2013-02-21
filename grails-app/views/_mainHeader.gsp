<!--[if lt IE 9]>
  <div class="header" role="contentinfo">
<![endif]-->
<header class="main">
  <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Header"/></h1>
    <div class="container">
      <div class="row">
        <!--[if lt IE 9]>
          <div class="nav widget" data-widget="NavigationWidget">
        <![endif]-->
        <nav class="widget span10 offset1" data-widget="NavigationWidget">
          <div class="row">
            <div class="span5">
              <a href="/" class="navigation-header-logo" title="<g:message code="ddbnext.OpenSearch_Plugin_ShortName_Max16CharsNoHtml"/>" tabindex="-1">
                <r:img dir="images" file="logo_header.png" class="siteLogo" />
              </a>
              <ul class="navigation inline" role="navigation">
                <li class="active root"><a href="/"><g:message code="ddbnext.Search"/></a>
                  <ul>
                    <li class=""><a href="/advancedsearch"><g:message code="ddbnext.Advanced_search"/></a></li>
                  </ul></li>
                <li class=""><a href="/content/about"><g:message code="ddbnext.AboutUs"/></a>
                  <ul>
                    <li class=""><a href="/content/news/"><g:message code="ddbnext.News"/></a></li>
                    <li class=""><a href="/about-us/institutions"><g:message code="ddbnext.Institutions"/></a></li>
                    <li class=""><a href="/content/ddb"><g:message code="ddbnext.Participate"/></a></li>
                    <li class=""><a href="/content/competence-network"><g:message code="ddbnext.CompetenceNetwork"/></a></li>
                  </ul></li>
                <li class=""><a href="/content/help"><g:message code="ddbnext.Help"/></a>
                  <ul>
                    <li class=""><a href="/content/faq"><g:message code="ddbnext.Faq"/></a></li>
                    <li class=""><a href="/content/tutorial"><g:message code="ddbnext.Tutorial"/></a></li>
                  </ul></li>
              </ul>
            </div>
            <div class="span5 toolbar">
              <div class="language-wrapper">
                <g:if test="${locale.toString().substring(0, 2)=="de"}">
                  <a>
                    <g:message code="ddbnext.language_fct_ger"/>
                  </a>
                </g:if>
                <g:else>
                  <a>
                    <g:message code="ddbnext.language_fct_eng"/>
                  </a>
                </g:else>
                <ul class="selector language">
                  <li class="de"><a href="#"><g:message code="ddbnext.language_fct_ger"/></a></li>
                  <li class="en"><a href="#"><g:message code="ddbnext.language_fct_eng"/></a></li>
                </ul>  
              </div>
              <div class="search-header hidden-phone">
                <form method="get" action="search" role="search" id="form-search-header">
                    <label> 
                      <span><g:message code="ddbnext.Search_text_field"/></span>
                      <input type="search" class="query" name="q" value="" data-bind="value: searchTerm" />
                    </label>
                    <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
                    <span class="contextual-help" title="<g:message code="ddbnext.Search_Hint" 
                                                  args="${[('<a href="/content/help/search-simple">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                                                  default="ddbnext.Search_Hint"/>" 
                                                  data-content="<g:message code="ddbnext.Search_Hint" 
                                                  args="${[('<a href="/content/help/search-simple">').encodeAsHTML(),('</a>').encodeAsHTML()]}" 
                                                  default="ddbnext.Search_Hint"/>"></span> 
                    <a class="link-adv-search" href="/advancedsearch"><g:message code="ddbnext.Advanced_search"/></a>
                    <div class="tooltip">
                    </div>
                </form>
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
