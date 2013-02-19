<html>
<head>
<title><%=title%></title>
<meta name="author" content="${author}" />
<meta name="keywords" content="${keywords}" />
<meta name="robots" content="${robots}" />
<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'jquery.fancybox-1.3.4.css')}" type="text/css" media="screen">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'viewer.css')}" />
<script type="text/javascript">
window.onload = function(){
  $(document).ready(function() {
    currentTab($("p.all"));
    $(function() {
      $("div.all").show();
      $("p.divider").show();
      $("div.tabs").addClass("fix");
    });
    createGallery($("#gallery-all"));
    updatePreview($("div.all"));
  });
  function currentTab(el) {
    $("p.tab").removeClass("current-tab")
    $(el).addClass("current-tab");
  };
  function updatePreview(gallerydiv) {
    var a = gallerydiv.find("ul").children('li').eq(0).children('a');
    var previewUri = $(a).attr("href");
    var previewTitle = $(a).attr("title");
    var previewHref = $(a).attr("data-content");
    var type = $(a).attr("data-type");
    var title = $(a).find("span").text();
    hideErrors();
    $("a.preview img").fadeOut();
    if(type=="image"){
      if($("#jwplayer-container"))
        $("#jwplayer-container").remove();
      if($("#jwplayer-container_wrapper"))
        $("#jwplayer-container_wrapper").remove();
      $("a.preview").show();
      $("a.preview").attr("href", previewHref);
      $("a.preview img").attr("src", previewUri);
      $("a.preview img").attr("alt", previewTitle);
      $("a.preview img").fadeIn("fast");
    } else {
        jwPlayerSetup(previewHref,previewUri);
      }
    $("div.binary-title span").text(title);
  };
  function jwPlayerSetup(content,poster){
    $("a.preview").hide();
    $("#binary-viewer").append('<div id="jwplayer-container"></div>');
    jwplayer("jwplayer-container").setup({
          file: content,
          controlbar: "bottom",
          stretching: "uniform",
          width: 445,
          height: 320,
          image: poster,
          //skin: "/jwplayer/skin/ddbskin.xml", 
          modes: [{
              type: "html5"
          }, {
              type: "flash",
              src: "../jwplayer/jwplayer.flash.swf"
          }, {
              type: "download"
          }],
          events: {
              onError: function () {
                  if($("#jwplayer-container"))
                    $("#jwplayer-container").remove();
                  if($("#jwplayer-container_wrapper"))
                    $("#jwplayer-container_wrapper").remove();
                  if($("#jwplayer-container").attr("type")=="application/x-shockwave-flash")
                    $("binary-viewer-flash-upgrade").show();
                    else $("div.binary-viewer-error").show();
              },
              onReady: function () {
                  if ($.browser.msie && this.getRenderingMode() === "html5") {
                    $("#binary-viewer").find("[id*='jwplayer']").each(function () {
                          $(this).attr("unselectable", "on")
                    })
                  }
              }
          }
    })
  };
  function createGallery(el) {
    el.carouFredSel({
      circular: false,
      infinite: false,
      width: 445,
      align: false,
      height: 131,
      items: {
        visible: 3,
        minimum: 3
      },
      scroll: {
        fx: "fade",
        easing: "linear"
      },
      auto: false,
      prev: ".btn-prev",
      next: ".btn-next"
    });
  };
  function formatTitle() {
    return '<div class="fancybox-toolbar"><span class="fancybox-toolbar-title">'+$("div.binary-title span").html()+'</span><span title="Close" class="fancybox-toolbar-close" onclick="$.fancybox.close();"></span>';
  }
  function hideErrors() {
    $("div.binary-viewer-error").hide();
    $("div.binary-viewer-flash-upgrade").hide();
  }
  $("p.all").click(function() {
    var tab = $("div.all");
    currentTab(this);
    $("div.scroller").hide();
    tab.show();
    createGallery($("#gallery-all"));
    updatePreview(tab);
  });
  $("p.images").click(function() {
    var tab = $("div.images");
    if(tab.find("li").size()==0)
      return false;
    currentTab(this);
    $("div.scroller").hide();
    tab.show();
    createGallery($("#gallery-images"));
    updatePreview(tab);
  });
  $("p.videos").click(function() {
    var tab = $("div.videos");
    if(tab.find("li").size()==0)
      return false;
    currentTab(this);
    $("div.scroller").hide();
    tab.show();
    createGallery($("#gallery-videos"));
    updatePreview(tab);
  });
  $("p.audios").click(function() {
    var tab = $("div.audios");
    if(tab.find("li").size()==0)
      return false;
    currentTab(this);
    $("div.scroller").hide();
    tab.show();
    createGallery($("#gallery-audios"));
    updatePreview(tab);
  });
  $(function() {
    $(".preview").fancybox({
      'showCloseButton' : false,
      'titlePosition'   : 'over',
      'titleFormat' : formatTitle
    });
    $(".preview").click(function(e) {
      e.preventDefault();
      return false;
    });
  });
  $("a.group").click(function(e) {
      e.preventDefault();
      var previewUri = $(this).attr("href");
      var previewTitle = $(this).attr("title");
      var previewHref = $(this).attr("data-content");
      var type = $(this).attr("data-type");
      var title = $(this).find("span").text();
      hideErrors();
      $("a.preview img").fadeOut();
      if(type=="image"){
        if($("#jwplayer-container"))
          $("#jwplayer-container").remove();
        if($("#jwplayer-container_wrapper"))
          $("#jwplayer-container_wrapper").remove();
        $("a.preview").show();
        $("a.preview").attr("href", previewHref);
        $("a.preview img").attr("src", previewUri);
        $("a.preview img").attr("alt", previewTitle);
        $("a.preview img").fadeIn("fast");
      } else {
          jwPlayerSetup(previewHref,previewUri);
        }
      $("div.binary-title span").text(title);
      return false;
  });
};
</script>
</head>
<body>
  <!-- TODO: change .culturalItem to .cultural-item -->
  <div class="culture-item-page">
    <g:render template="controls" />
    <g:render template="institution" />
    <div class="row">
      <div class="span8">
        <h2>${item.title}</h2>
        <g:render template="fields" />
        <g:render template="rights" />
        <g:render template="origin" />
      </div>
      <div class="span4">
        <g:if test="${binaryList.size != 0}">
          <g:render template="binaries" />
        </g:if>
      </div>
    </div>
  </div>
</body>
</html>