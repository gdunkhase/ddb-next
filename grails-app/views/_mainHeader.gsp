<!--[if lt IE 9]>
  <div class="header" role="contentinfo">
<![endif]-->
<header class="main">
  <!--[if lt IE 9]>
    <div class="nav widget" data-widget="NavigationWidget">
  <![endif]-->
  <h1 class="a11y">Site Header</h1>
    <nav class="widget" data-widget="NavigationWidget">
      <div role="banner">
        <a href="http://www.deutsche-digitale-bibliothek.de/" class="navigation-header-logo" title="Deutsche Digitale Bibliothek" tabindex="-1">
          <r:img dir="images" file="logo_header.png" class="siteLogo" />
        </a>
      </div>
      <ul class="navigation" role="navigation">
        <li class="active root"><a href="/">Search</a>
          <ul>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/advancedsearch">Advanced
                Search</a></li>
          </ul></li>
        <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/about">About Us</a>
          <ul>
            <li class=""><a href="/content/news/">News</a></li>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions">Institutions</a></li>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/ddb">Join Us</a></li>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/competence-network">Competence
                Network</a></li>
          </ul></li>
        <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/help">Help</a>
          <ul>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/faq">FAQ</a></li>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/tutorial">Tutorial</a></li>
          </ul></li>
      </ul>
      <div>
        <ul class="toolbar" role="navigation">
          <li class="language">
            <a href="http://www.deutsche-digitale-bibliothek.de/language">English</a>
          </li>
        </ul>
        <div class="widget languageWidget" data-widget="LanguageWidget">
          <div class="flag"></div>
          <form action="http://www.deutsche-digitale-bibliothek.de/language" method="post">
            <label> 
              <span>Change Language</span> 
              <select name="language">
                <option value='de'>Deutsch</option>
                <option selected='selected' value='en'>English</option>
              </select>
            </label> 
            <input type="hidden" name="referrer" value="http://www.deutsche-digitale-bibliothek.de/" />
            <button type="submit" title="Select">
              <span>Select</span>
            </button>
          </form>
        </div> 
      </div>
      <div class="search-header">
        <form method="get" action="search" role="search" id="formSearchHeader">
            <label style="float: left;"> 
              <span>Search text field</span>
              <input type="search" class="query" name="q" value="" data-bind="value: searchTerm" />
            </label>
            <button type="submit">Go</button>
            <span class="contextual-help" title="Enter the keyword in the search field. Click the magnifying glass icon or press the Enter key. &lt;a href=&quot;=&quot;/content/help/search-simple&quot;&gt;Help about simple search&lt;/a&gt;"
            data-content="Enter the keyword in the search field. Click the magnifying glass icon or press the Enter key. &lt;a href=&quot;=&quot;/content/help/search-simple&quot;&gt;Help about simple search&lt;/a&gt;">
              <a href="#"> 
                <r:img dir="images" file="tooltips.png" alt="Enter the keyword in the search field. Click the magnifying glass icon or press the Enter key. &lt;a href=&quot;=&quot;/content/help/search-simple&quot;&gt;Help about simple search&lt;/a&gt;" />
              </a>
            </span> 
            <a class="link-adv-search" href="advancedsearch">Advanced Search</a>
            <div class="tutorial tooltip">
              <div>
                Enter the keyword in the search field. Click the magnifying glass
                icon or press the Enter key. 
                <a href="="http://ddb.de/content/help/search-simple">Help about simple search</a>
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