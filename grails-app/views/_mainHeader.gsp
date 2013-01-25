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
        <a href="http://www.deutsche-digitale-bibliothek.de/" class="navigation-header-logo" title="Deutsche Digitale Bibliothek" tabindex="-1">
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
      <div>
        <ul class="toolbar" role="navigation">
          <li class="language">
            <a href="/language"><g:message code="ddbnext.language_fct_eng"/></a>
          </li>
        </ul>
        <div class="widget language-widget" data-widget="languageWidget">
          <div class="flag"></div>
          <form action="/language" method="post">
            <label> 
              <span><g:message code="ddbnext.ChangeLanguage"/></span> 
              <select name="language">
                <option value='de'><g:message code="ddbnext.language_fct_ger"/></option>
                <option selected='selected' value='en'><g:message code="ddbnext.language_fct_eng"/></option>
              </select>
            </label> 
            <input type="hidden" name="referrer" value="http://www.deutsche-digitale-bibliothek.de/" />
            <button type="submit" title="Select">
              <span><g:message code="ddbnext.Select_button"/></span>
            </button>
          </form>
        </div> 
      </div>
      <div class="search-header">
        <form method="get" action="search" role="search" id="form-search-header">
            <label style="float: left;"> 
              <span><g:message code="ddbnext.Search_text_field"/></span>
              <input type="search" class="query" name="q" value="" data-bind="value: searchTerm" />
            </label>
            <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
            <span class="contextual-help" title="Enter the keyword in the search field. Click the magnifying glass icon or press the Enter key. &lt;a href=&quot;=&quot;/content/help/search-simple&quot;&gt;Help about simple search&lt;/a&gt;"
            data-content="Enter the keyword in the search field. Click the magnifying glass icon or press the Enter key. &lt;a href=&quot;=&quot;/content/help/search-simple&quot;&gt;Help about simple search&lt;/a&gt;">
              <a href="#"> 
                <r:img dir="images" file="tooltips.png" alt="Enter the keyword in the search field. Click the magnifying glass icon or press the Enter key. &lt;a href=&quot;=&quot;/content/help/search-simple&quot;&gt;Help about simple search&lt;/a&gt;" />
              </a>
            </span> 
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