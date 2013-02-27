<html>
<!-- TODO my do write the head element again? -->
<head>
  <title><%=title%></title>
  <meta name="author" content="${author}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="robots" content="${robots}" />
  <meta name="layout" content="main" />
  <link rel="stylesheet" href="${resource(dir: 'css', file: 'staticcontent.css')}" />
</head>
<body><%=content %></body>
</html>
