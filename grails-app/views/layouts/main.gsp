<!DOCTYPE html>
<html>
  <head>
    <title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="description" content="Deutsche Digitale Bibliothek"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
    <!-- TODO: uncomment the next two lines, once we find the icons -->
    <!-- link rel="apple-touch-icon" href="/apple-touch-icon.png"/ -->
    <!-- link rel="apple-touch-startup-image" href="320x460-ipad1004x768.png"/ -->
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap-responsive.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.css')}" type="text/css">
    <link rel="search" title="Deutsche Digitale Bibliothek" href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx" type="application/opensearchdescription+xml" />
    <!--[if lt IE 9]>
      <script src="Scripts/html5shim.googlecode.html5.js"> </script>
    <![endif]-->
    <g:layoutHead />
    <r:layoutResources />
  </head>
  <body>
    <noscript>
      <div class="container">
        <div class="row">
          <div class="span12 warning">
            <span><g:message code="ddbnext.Warning_Non_Javascript"/></span>
          </div>
        </div>
      </div>
    </noscript>
  <g:render template="/mainHeader" />
  <div class="container" role="main">
    <g:layoutBody/>
  </div>
  <g:render template="/footer" />
  <!--  TODO which script do we really use? -->
  <!--  TODO why do we declare jquery here? Don't we use Grails jQuery Plug-in? -->
  <script type="text/javascript" src="${resource(dir:'js', file:'json2.js')}"></script>  
  <script type="text/javascript" src="${resource(dir:'js', file:'jquery-1.8.2.min.js')}"></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.scrollTo-min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'rx.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'rx.jQuery.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.cookies.2.2.0.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'underscore-min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'dateformat.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'knockout-latest.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'knockout.mapping-latest.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.mousewheel.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.microdata.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'amplify.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.dotdotdot-1.5.1.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.carouFredSel-6.2.0-packed.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'ddb.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'large-cookie.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'advanced-search-page.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.fancybox-1.3.4.pack.js')}"></script>
  <script type="text/javascript" src="${resource(dir: 'jwplayer', file: 'jwplayer.js')}"></script>
  <script>jwplayer.key="AUCPxuikvGKUo7iy5PHSNvulij4OHNPvp+v47g=="</script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'tooltip.js')}"></script>
  <script>
			var global;
			var resources;

			Ddb.siteRoot = 'http://www.deutsche-digitale-bibliothek.de/';

			$(function() {

				// workaround for ffox + ie click focus - prevents links that load dynamic content to be focussed/active. 
				$("a.noclickfocus").live('mouseup', function() {
					$(this).blur();
				});

				var languageCookie = $.cookies.get('language');
				if (languageCookie
						&& languageCookie != Ddb.Data.TwoLetterLanguage) {
					$.cookies.set('language', Ddb.Data.TwoLetterLanguage); // restore to valid cookie
				}

				resources = new Resources();
				global = new Global();

				Ddb.Publisher.Get("Search").Skip(1).Subscribe(function() {
					global.body.find('nav li.search').addClass('active');
				});

				Ddb.Publisher.Get("ObjectQuery").Skip(1).Subscribe(
						function() {
							global.body.find('nav li.active').removeClass(
									'active').addClass('search');
						});

				var toolbarNav = $('nav ul.toolbar');
				if (toolbarNav.length) {
					ko.applyBindings(global, toolbarNav.get(0));
				}

				// register all widgets in page at DOM load
				$(".widget").RegisterWidget();

				// open all external links in a new tab
				// ideally should be find('a[rel=external']) or similar
				global.body.bind('click', function(e) {
					var target = e.target;
					if (target) {
						var closestAnchor = $(target).closest('a');
						if (closestAnchor.length) {
							var href = closestAnchor.get(0).href;
							if (href && href.indexOf('mailto:') !== 0) {
								var isExternalLink = href
										.indexOf(window.location.host) == -1;
								if (isExternalLink) {
									e.preventDefault();
									window.open(href);
								}
							}
						}
					}
				});

			});
  </script>
  </body>
</html>
