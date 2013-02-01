<meta name="layout" content="start" />
 
<div class="row">
  <div class="span12 search-widget">
    <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Search_Widget"/></h1>
    <img src="${resource(dir: 'images', file: 'logo_big.png')}" class="bigLogo" alt="<g:message code="ddbnext.Logo_Description"/>" title="<g:message code="ddbnext.Logo_Title"/>" />
    <form method="get" action="search" role="search" id="form-search">
      <label style="float: left;"> <span><g:message code="ddbnext.Search_text_field"/></span>
        <input type="search" class="query" name="q" value="" data-bind="value: searchTerm" />
      </label>
      <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
      <span class="contextual-help" title="<g:message code="ddbnext.Search_Hint" />" data-content="<g:message code="ddbnext.Search_Hint" />"></span> 
      <a class="link-adv-search" href="advancedsearch"><g:message code="ddbnext.Advanced_search"/></a>
      <div class="tooltip">
        <div>
          <g:message code="ddbnext.Search_Hint" />
        </div>
      </div>
    </form>
  </div>
</div>
<div class="row">
  <div class="span12 teaser">
    <noscript>
      <g:if test="${articles}">              
        <g:each in="${articles}">
          <div class="span3">
            <a href="<%=it.uri%>" title="<%=it.title%>"> 
              <img class="article" src="http://www.ddb.de/<%=it.src%>" alt="<%=it.title%>"/>
            </a>
            <div class="caption">
              <a href="<%=it.uri%>" title="<%=it.title%>"> 
                <% println "${it.title}" %>
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
			  <a href="<%=it.uri%>" title="<%=it.title%>" target="_self">
			    <img src="http://www.ddb.de/<%=it.src%>" alt="<%=it.title%>">
			  </a>
			  <div class="caption">
				<a href="/about-us/institutions" title="<%=it.title%>"><% println "${it.title}" %></a>
			  </div>
			</div>
          </g:each>
        </g:if>
      </div>
      <div class="clearfix"></div>
      <a class="previous" id="articles_prev" href=""><span><g:message code="ddbnext.Homepage_Carousel_Previous"/></span></a>
      <a class="next" id="articles_next" href=""><span><g:message code="ddbnext.Homepage_Carousel_Next"/></span></a>
    </div>
  </div>
</div>
