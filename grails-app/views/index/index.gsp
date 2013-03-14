<html>
<head>
<title><g:message code="ddbnext.Homepage"/> - <g:message code="ddbnext.OpenSearch_Plugin_ShortName_Max16CharsNoHtml"/></title>
<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'start-page.css')}" />
<script type="text/javascript" src="${resource(dir: 'js', file: 'start-page.js')}" ></script>
</head>
<body>
  <div class="row">
    <div class="span12 search-widget">
      <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Search_Widget"/></h1>
      <img src="${resource(dir: 'images', file: 'logo_big.png')}" class="bigLogo" alt="<g:message code="ddbnext.Logo_Description"/>" title="<g:message code="ddbnext.Logo_Title"/>" />
      <form method="get" action="/search" role="search" id="form-search">
        <label>
          <span><g:message code="ddbnext.Search_text_field"/></span>
        </label>
        <input type="search" class="query" name="query" value="" />
        <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
        <span class="contextual-help hidden-phone hidden-tablet"
              title="<g:message code="ddbnext.Search_Hint"
                                args="${[('<a href="/content/help/search-simple">').encodeAsHTML(),('</a>').encodeAsHTML()]}"
                                default="ddbnext.Search_Hint"/>"
              data-content="<g:message code="ddbnext.Search_Hint"
                                       args="${[('<a href="/content/help/search-simple">').encodeAsHTML(),('</a>').encodeAsHTML()]}"
                                       default="ddbnext.Search_Hint"/>">
        </span>
        <a class="link-adv-search" href="advancedsearch"><g:message code="ddbnext.Advanced_search"/></a>
        <div class="tooltip off"></div>
      </form>
    </div>
  </div>
  <div class="row">
    <div class="span12 teaser">
      <noscript>
        <g:if test="${articles}">
          <g:each in="${articles}">
            <div class="span3">
              <a href="${it.uri}" title="${it.title}">
                <img class="article" src="${staticUrl}${it.src}" alt="${it.title}"/>
              </a>
              <div class="caption">
                <a href="${it.uri}" title="${it.title}">
                  ${it.title}
                </a>
              </div>
            </div>
          </g:each>
      </g:if>
      </noscript>
      <div class="carousel">
        <div id="articles">
          <g:if test="${articles}">
            <g:each in="${articles}">
              <div class="article">
                <a href="${it.uri}" title="${it.title}" target="_self">
                  <img src="${staticUrl}${it.src}" alt="${it.title}" />
                </a>
                <div class="caption">
                  <a href="/about-us/institutions" title="${it.title}">${it.title}</a>
                </div>
              </div>
            </g:each>
          </g:if>
        </div>
        <div class="clearfix"></div>
        <a class="previous" id="articles-prev" href=""><span><g:message code="ddbnext.Homepage_Carousel_Previous"/></span></a>
        <a class="next" id="articles-next" href=""><span><g:message code="ddbnext.Homepage_Carousel_Next"/></span></a>
      </div>
    </div>
  </div>
</body>
</html>
