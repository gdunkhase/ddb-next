<html>
<head>
<title><%=title%></title>
<meta name="author" content="${author}" />
<meta name="keywords" content="${keywords}" />
<meta name="robots" content="${robots}" />
<meta name="layout" content="main" />
<link rel="stylesheet"
  href="${resource(dir: 'css', file: 'ddb.css')}" />
</head>
<body>
  <div class="searchResults">
    <%
    if(results){
    %>
    <ul class="result">
      <%
        results.each{ i->
      %>
      <li class="item" style="z-index: 1;">
        <div class="summary">
          <div class="summaryWrapper">
            <h2 class="title">
              <a class="persist" href="http://www.deutsche-digitale-bibliothek.de/item/<%=i.id%>" title="<%=i.title%>">
                <strong>
                  <%
                  println "${i.title}"
                  %>
                </strong>
              </a>
            </h2>
            <div class="subtitle">
              <%
              println "${i.subtitle}"
              %>
            </div>
            <div class="thumbnail">
              <a class="persist" tabindex="-1" href="http://www.deutsche-digitale-bibliothek.de/item/<%=i.id%>">
                <img src="http://www.binary-p1.deutsche-digitale-bibliothek.de/binary/<%=i.id%>/list/1.jpg" alt="<%=i.title%>">
              </a>
            </div>
          </div>
          <ul class="matches">
            <li class="matchingItem">
              <span>
                <strong>
                    <%
                    println "${i.title}"
                    %>
                </strong>
              </span> …
            </li>
          </ul>
        </div>
        <div class="extra">
          <ul class="types">
            <li class="image" classname="image" title="Image">
              Image
            </li>
          </ul>
        </div>
        <div class="information"></div>
      </li>
          <li class="divider"><hr></li>
      <%
        }
      %>
      </ul>
  <%
    }
  %>

  </div>
</body>
</html>