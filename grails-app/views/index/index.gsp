<meta name="layout" content="start" />
 
<div class="row">
  <div class="span12">
    <div class="search-widget">
      <h1 class="invisible-but-readable"><g:message code="ddbnext.Heading_Search_Widget"/></h1>
      <r:img dir="images" file="logo_big.png"
        alt="The logo of Deutsche Digitale Bibliothek shows three red flying dandelion seeds and contains the name of the German Digital Library and the subtitle Das Netzwerk f&#252;r Kultur und Wissenschaft."
        class="bigLogo"
        title="The Deutsche Digitale Bibliothek is the central national portal for culture and science. It gives internet access to the nation’s cultural heritage. In future, digital objects from all sectors and of all possible media types (text, sound, images, moving images) will be offered. First, the portal provides a simple search function for searching the complete inventory." />
      <form method="get" action="search" role="search" id="form-search">
        <label style="float: left;"> <span><g:message code="ddbnext.Search_text_field"/></span>
          <input type="search" class="query" name="q" value=""
          data-bind="value: searchTerm" />
        </label>
        <button type="submit"><g:message code="ddbnext.Go_Button"/></button>
        <span class="contextual-help" title="<g:message code="ddbnext.Search_Hint" />" data-content="<g:message code="ddbnext.Search_Hint" />"></span> 
        <a class="link-adv-search" href="advancedsearch"><g:message code="ddbnext.Advanced_search"/></a>
        <div class="tutorial tooltip">
          <div>
            <g:message code="ddbnext.Search_Hint" />
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
<div class="row">
  <div class="teaser">
  <%
    if(articles) 
  %>
  <div class="span12">    
    <%
      articles.each(){ i->
    %>
    <div class="span3">
      <a href="<%=i.uri%>" title="<%=i.title%>"> 
        <img class="article" src="http://www.ddb.de/<%=i.src%>" alt="<%=i.title%>"/>
      </a>
      <div class="caption">
        <a href="<%=i.uri%>" title="<%=i.title%>"> 
          <%
            println "${i.title}"
          %>
        </a>
      </div>
    </div>
    <%
      }
    %>
  </div>
  
  </div>
</div>
