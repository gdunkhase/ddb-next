<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
    <head>
        <title><g:layoutTitle default="Deutsche Digitale Bibliothek"/></title>                         
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="description" content="Deutsche Digitale Bibliothek" />
        <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
        
		<link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.min.css')}" type="text/css"><%--
        <link rel="stylesheet" href="Content/themes/base/styles/ddbPrint.min.css" media="print" />
        --%><link rel="search" title="Deutsche Digitale Bibliothek" href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx" type="application/opensearchdescription+xml" />
        <!--[if lt IE 9]>
            <script src="Scripts/html5shim.googlecode.html5.js"> </script>
        <![endif]-->  
        <g:layoutHead/>
		<r:layoutResources />              
    </head>
    <body class="nojs start">
    	<header class="main">

    <!--[if lt IE 9]>
        <div class="nav widget" data-widget="NavigationWidget">
    <![endif]-->
        <h1 class="a11y">Site Header</h1>
        <nav class="widget" data-widget="NavigationWidget">
            <div role="banner">
              <a href="http://www.deutsche-digitale-bibliothek.de/" class="navigationHeaderLogo" title="Deutsche Digitale Bibliothek" tabindex="-1">
                    <r:img dir="images" file="logo_header.png" class="siteLogo" />
				</a>
            </div>
            <ul class="navigation" role="navigation">
                    <li class="active root"><a href="http://www.deutsche-digitale-bibliothek.de/">Search</a> 
                    	<ul>
                    		<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/advancedsearch">Advanced Search</a></li>
						</ul>
    				</li>
                    <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/about">About Us</a>
						<ul>
							<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/news">News</a></li>
							<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions">Institutions</a></li>
							<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/ddb">Join Us</a></li>
							<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/competence-network">Competence Network</a></li>
						</ul>
    				</li>
                    <li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/help">Help</a>
                    	<ul>
                        	<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/faq">FAQ</a></li>
							<li class=""><a href="http://www.deutsche-digitale-bibliothek.de/content/tutorial">Tutorial</a></li>
						</ul>
					</li>
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
				        <button type="submit" title="Select"><span>Select</span></button>
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
		
		<g:layoutBody/>
        
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
                <div class="build">
                    3.11.1 / 1.0/r13474
                </div>
            </div>
        </div>

    </footer>
    <!--[if lt IE 9]>
        </div>
    <![endif]-->
<div class="widget tooltip" data-widget="TooltipWidget" data-bind="style: { 
                                                                    'display' : isVisible() ? 'block' : 'none',
                                                                    'left': xpx,
                                                                    'top': ypx,
                                                                    'position': positionMode
                                                                   },
                                                                   attr: { 'class': 'widget tooltip ' +layout() }">
    <div data-bind="html: content"></div>
</div>    
		<r:external uri="${resource(dir: '../js', file: 'json2.js')}"/>
		<r:external uri="${resource(dir: '../js', file: 'jquery-1.7.2.min.js')}"/>    
        <r:external uri="${resource(dir: '../js', file: 'jquery.scrollTo-min.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'rx.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'rx.jQuery.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'jquery.cookies.2.2.0.min.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'underscore-min.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'dateformat.min.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'knockout-latest.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'knockout.mapping-latest.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'jquery.mousewheel.min.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'jquery.microdata.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'amplify.min.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'jquery.carouFredSel-5.6.4-packed.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'jquery.dotdotdot-1.5.1.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'jquery.carouFredSel-5.6.4-packed.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'HomePage.js')}"/>
        <r:external uri="${resource(dir: '../js', file: 'ddb.min.js')}"/>
            

        <script type="text/javascript">
            Ddb.Data.Language = 'en-US';
            Ddb.Data.TwoLetterLanguage = 'en';
            Ddb.Data.NumberFormat = {
                NumberDecimalDigits: 2,
                NumberDecimalSeparator: '.',
                NumberGroupSize: 3,
                NumberNegativePattern: '1',
                NumberGroupSeparator: ','
            };
            
            (function (old, NumberFormat) {
                var numberFormatRex = new RegExp("(?=(?!^)(?:\\d{" + NumberFormat.NumberGroupSize + "})+(?!\\d))", "g");
                Number.prototype.toLocaleString = function () {
                    var result = this.toFixed(0).replace(numberFormatRex, NumberFormat.NumberGroupSeparator);
                    var f = this.toFixed(NumberFormat.NumberDecimalDigits).slice(-NumberFormat.NumberDecimalDigits);
                    return result + (parseInt(f, 10) > 0 ? NumberFormat.NumberDecimalSeparator + f : "");
                };
            })(Number.prototype.toLocaleString, Ddb.Data.NumberFormat);
        </script>
    
        <script>
            var global;
            var resources;

            Ddb.siteRoot = 'http://www.deutsche-digitale-bibliothek.de/';

            $(function () {

                // workaround for ffox + ie click focus - prevents links that load dynamic content to be focussed/active. 
                $("a.noclickfocus").live('mouseup', function () { $(this).blur(); });

                var languageCookie = $.cookies.get('language');
                if (languageCookie && languageCookie != Ddb.Data.TwoLetterLanguage) {
                    $.cookies.set('language', Ddb.Data.TwoLetterLanguage); // restore to valid cookie
                }

                resources = new Resources();
                global = new Global();

                Ddb.Publisher.Get("Search").Skip(1).Subscribe(function () {
                    global.body.find('nav li.search').addClass('active');
                });

                Ddb.Publisher.Get("ObjectQuery").Skip(1).Subscribe(function () {
                    global.body.find('nav li.active').removeClass('active').addClass('search');
                });

                var toolbarNav = $('nav ul.toolbar');
                if (toolbarNav.length) {
                    ko.applyBindings(global, toolbarNav.get(0));
                }

                // register all widgets in page at DOM load
                $(".widget").RegisterWidget();

                // open all external links in a new tab
                // ideally should be find('a[rel=external']) or similar
                global.body.bind('click', function (e) {
                    var target = e.target;
                    if (target) {
                        var closestAnchor = $(target).closest('a');
                        if (closestAnchor.length) {
                            var href = closestAnchor.get(0).href;
                            if (href && href.indexOf('mailto:') !== 0) {
                                var isExternalLink = href.indexOf(window.location.host) == -1;
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
