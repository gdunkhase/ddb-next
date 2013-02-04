<!--[if lt IE 9]>
  <div class="header" role="contentinfo">
<![endif]-->
<header class="main">
  <!--[if lt IE 9]>
    <div class="nav widget" data-widget="NavigationWidget">
  <![endif]-->
  <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Header"/></h1>
    <nav class="widget" data-widget="NavigationWidget">
      <div role="banner">
        <a href="http://www.deutsche-digitale-bibliothek.de/" class="navigation-header-logo" title="<g:message code="ddbnext.OpenSearch_Plugin_ShortName_Max16CharsNoHtml"/>" tabindex="-1">
          <r:img dir="images" file="logo_header.png" class="siteLogo" />
        </a>
      </div>
      <ul class="navigation" role="navigation">
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
      <div class="toolbar">    
        <g:if test="${locale.toString().substring(0, 2)=="de_DE"}">
          <a>
            <g:message code="ddbnext.language_fct_ger"/>
          </a>
        </g:if>  
        <g:else>
          <a>
            <g:message code="ddbnext.language_fct_eng"/>
          </a>
        </g:else>       
          <ul class="selector">
            <li class="de"><a href="#"><g:message code="ddbnext.language_fct_ger"/></a></li>
            <li class="en"><a href="#"><g:message code="ddbnext.language_fct_eng"/></a></li>
          </ul>         
      </div>
      <div class="search-header">
        <form method="get" action="search" role="search" id="form-search-header">
            <label> 
              <span><g:message code="ddbnext.Search_text_field"/></span>
              <input type="search" class="query" name="q" value="" data-bind="value: searchTerm" />
            </label>
            <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
            <span class="contextual-help" title="<g:message code="ddbnext.Search_Hint"/>" data-content="<g:message code="ddbnext.Search_Hint"/>"></span> 
            <a class="link-adv-search" href="advancedsearch"><g:message code="ddbnext.Advanced_search"/></a>
            <div class="tutorial tooltip">
              <div>
                <g:message code="ddbnext.Search_Hint"/>
              </div>
            </div>
        </form>
      </div>
  </nav>
  <!--[if lt IE 9]>
    </div>
  <![endif]-->
</header>
<!--[if lt IE 9]>
  </div>
<![endif]-->