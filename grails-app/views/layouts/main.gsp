<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html
  lang="en"
  class="no-js">
<!--<![endif]-->
<head>
<title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
<meta
  http-equiv="Content-Type"
  content="text/html; charset=utf-8" />
<meta
  name="description"
  content="Deutsche Digitale Bibliothek" />
<link
  rel="shortcut icon"
  href="${resource(dir: 'images', file: 'favicon.ico')}"
  type="image/x-icon">
<link
  rel="stylesheet"
  href="${resource(dir: 'css', file: 'ddb.min.css')}"
  type="text/css">
<link
  rel="search"
  title="Deutsche Digitale Bibliothek"
  href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx"
  type="application/opensearchdescription+xml" />
<!--[if lt IE 9]>
            <script src="Scripts/html5shim.googlecode.html5.js"> </script>
        <![endif]-->
<g:layoutHead />
<r:layoutResources />
</head>
<body class="nojs start">
  <header class="main">
    <!--[if lt IE 9]>
        <div class="nav widget" data-widget="NavigationWidget">
    <![endif]-->
    <h1 class="a11y">Site Header</h1>
    <nav
      class="widget"
      data-widget="NavigationWidget">
      <div role="banner">
        <a
          href="http://www.deutsche-digitale-bibliothek.de/"
          class="navigationHeaderLogo"
          title="Deutsche Digitale Bibliothek"
          tabindex="-1"> <r:img
            dir="images"
            file="logo_header.png"
            class="siteLogo" />
        </a>
      </div>
      <ul
        class="navigation"
        role="navigation">
        <li class="active root"><a href="http://www.deutsche-digitale-bibliothek.de/">Search</a>
          <ul>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/advancedsearch">Advanced
                Search</a></li>
          </ul></li>
        <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/about">About Us</a>
          <ul>
            <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/news">News</a></li>
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
        <ul
          class="toolbar"
          role="navigation">
          <li class="language"><a href="http://www.deutsche-digitale-bibliothek.de/language">English</a>
          </li>
        </ul>
        <div
          class="widget languageWidget"
          data-widget="LanguageWidget">
          <div class="flag"></div>
          <form
            action="http://www.deutsche-digitale-bibliothek.de/language"
            method="post">
            <label> <span>Change Language</span> <select name="language">
                <option value='de'>Deutsch</option>
                <option
                  selected='selected'
                  value='en'>English</option>
            </select>
            </label> <input
              type="hidden"
              name="referrer"
              value="http://www.deutsche-digitale-bibliothek.de/" />
            <button
              type="submit"
              title="Select">
              <span>Select</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
    <!--[if lt IE 9]>
            </div>
        <![endif]-->
  </header>
  <!--[if lt IE 9]>
            </div>
        <![endif]-->
  <div
    class="container"
    role="main">
    <g:layoutBody />
  </div>
  <!--[if lt IE 9]>
    <div class="footer" role="contentinfo">
		<![endif]-->
  <footer role="contentinfo">
    <h1 class="a11y">Site Footer</h1>
    <div class="legal">
      <div class="inner">
        <small>Copyright &#169; 2012 Deutsche Digitale Bibliothek</small>
        <ul>
          <li><a href="http://www.deutsche-digitale-bibliothek.de/content/terms">Terms of Use</a></li>
          <li><a href="http://www.deutsche-digitale-bibliothek.de/content/privacy">Privacy Policy</a></li>
          <li><a href="http://www.deutsche-digitale-bibliothek.de/content/publisher">Legal Notice</a></li>
          <li><a href="http://www.deutsche-digitale-bibliothek.de/content/sitemap">Sitemap</a></li>
          <li><a href="http://www.deutsche-digitale-bibliothek.de/content/contact">Contact</a></li>
        </ul>
        <div class="build">3.11.1 / 1.0/r13474</div>
      </div>
    </div>
  </footer>
  <!--[if lt IE 9]>
        </div>
    <![endif]-->
  <div
    class="widget tooltip"
    data-widget="TooltipWidget"
    data-bind="style: {'display' : isVisible() ? 'block' : 'none',
    'left': xpx,
    'top': ypx,
    'position': positionMode
},
attr: { 'class': 'widget tooltip ' +layout() }">
    <div data-bind="html: content"></div>
  </div>
</body>
</html>
