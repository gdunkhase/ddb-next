$(document).ready(function() {
  $(function() {
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
    if (title.toString().length>270){
        title = title.toString().trim().substring(0, 270).split(" ").slice(0, -1).join(" ") + "...";
    }
    hideErrors();
    if(type=="image"){
      if($("#jwplayer-container"))
        $("#jwplayer-container").remove();
      if($("#jwplayer-container_wrapper"))
        $("#jwplayer-container_wrapper").remove();
      $(".previews").parent().addClass("off");
      $(".previews").each(function() {
        if($(this).attr("href") == previewHref) {
          $(this).parent().removeClass("off");
          return false;
        } else {
            $(this).parent().appendTo($("#previews-list"));
        }
      });
    } else {
        jwPlayerSetup(previewHref,previewUri);
      }
    $("div.binary-title span").text(title);
  };
  function jwPlayerSetup(content,poster){
    $(".previews").parent().addClass("off");
    $("#binary-viewer").append('<div id="jwplayer-container"></div>');
    jwplayer("jwplayer-container").setup({
          file: content,
          controlbar: "bottom",
          stretching: "uniform",
          width: 445,
          height: 320,
          image: poster,
          skin: "/jwplayer/skins/five.xml", 
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
                  if($("#jwplayer-container").attr("type")=="application/x-shockwave-flash") {
                    $("binary-viewer-flash-upgrade").removeClass("off");
                  }else{ 
                	$("div.binary-viewer-error").removeClass("off");
                  }
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
        minimum: 1
      },
      scroll: {
        fx: "fade",
        easing: "linear"
      },
      auto: false,
      prev: ".btn-prev",
      next: ".btn-next"
    });
    if(el.find('li').size()<3) {
      $(".btn-next").addClass("disabled");
    }
  };
  function formatTitle() {
    return '<div class="fancybox-toolbar"><span class="fancybox-toolbar-title">'+$("div.binary-title span").html()+'</span>'
           '<span title="Close" class="fancybox-toolbar-close" onclick="$.fancybox.close();"></span></div>';
  }
  function hideErrors() {
    $("div.binary-viewer-error").addClass("off");
    $("div.binary-viewer-flash-upgrade").addClass("off");
  }
  $("p.all").click(function() {
    var tab = $("div.all");
    currentTab(this);
    $("div.scroller").hide();
    tab.show();
    if($("#gallery-all").find('li').size()>3) {
       createGallery($("#gallery-all"));
    }
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
  $(".previews").click(function(e) {
        e.preventDefault();
        $.fancybox($(".previews"),{
            'padding'   :   0,
            'closeBtn'   :   false,
            'overlayShow'   :   true,
            'openEffect'   : 'fade',
            'closeEffect'   : 'fade',
            'prevEffect'   : 'fade',
            'nextEffect'   : 'fade',
            'tpl' :{
                wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-toolbar"><span class="fancybox-toolbar-title">'+$("div.binary-title span").html()+'</span><span title="Close" class="fancybox-toolbar-close" onclick="$.fancybox.close();"></span></div><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                prev     : '<span title="Previous" class="fancybox-nav fancybox-prev" onclick="$.fancybox.prev();"></span>',
                next     : '<span title="Next" class="fancybox-nav fancybox-next" onclick="$.fancybox.next();"></span>'
            }
        });
        return false;
  });
  $("a.group").click(function(e) {
      e.preventDefault();
      var previewUri = $(this).attr("href");
      var previewTitle = $(this).attr("title");
      var previewHref = $(this).attr("data-content");
      var type = $(this).attr("data-type");
      var title = $(this).find("span").text();
      hideErrors();
      if(type=="image"){
        if($("#jwplayer-container"))
          $("#jwplayer-container").remove();
        if($("#jwplayer-container_wrapper"))
          $("#jwplayer-container_wrapper").remove();
        $(".previews").parent().addClass("off");
        $(".previews").each(function() {
          if($(this).attr("href") == previewHref) {
            $(this).parent().removeClass("off");
            return false;
          } else {
              $(this).parent().appendTo($("#previews-list"));
          }
        });
      } else {
          jwPlayerSetup(previewHref,previewUri);
        }
      $("div.binary-title span").text(title);
      return false;
  });
  //institution hierarchy
  //$(".item-hierarchy").removeClass("off");

  var imgLoader = document.createElement("img");

  imgLoader.src = "../images/icons/loader_small.gif";
  $(".item-hierarchy-result").prepend(imgLoader);
  createHierarchy(parseUrl(location.href));
});
