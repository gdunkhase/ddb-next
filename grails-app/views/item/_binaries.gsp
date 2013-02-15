<script type="text/javascript" src="${resource(dir:'js', file:'jquery-1.8.2.min.js')}"></script>
<script type="text/javascript" src="${resource(dir:'js', file:'jquery.fancybox-1.3.4.pack.js')}"></script>
<script type="text/javascript" src="${resource(dir:'jwplayer', file:'jwplayer.js')}"></script>
<script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.carouFredSel-6.2.0-packed.js')}"/></script>
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
  $("p.all").click(function() {
    var x = $("div.all");
    currentTab(this);
    $("div.scroller").hide();
    x.show();
    createGallery($("#gallery-all"));
    updatePreview(x);
  });
  $("p.images").click(function() {
    var x = $("div.images");
    if(x.find("li").size()==0)
      return false;
    currentTab(this);
    $("div.scroller").hide();
    x.show();
    createGallery($("#gallery-images"));
    updatePreview(x);
  });
  $("p.videos").click(function() {
    var x = $("div.videos");
    if(x.find("li").size()==0)
      return false;
    currentTab(this);
    $("div.scroller").hide();
    x.show();
    createGallery($("#gallery-videos"));
    updatePreview(x);
  });
  $("p.audios").click(function() {
    var x = $("div.audios");
    if(x.find("li").size()==0)
      return false;
    currentTab(this);
    $("div.scroller").hide();
    x.show();
    createGallery($("#gallery-audios"));
    updatePreview(x);
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
<div class="slide-viewer">
  <div class="binary-viewer-container">
    <div id="binary-viewer">
      <a class="preview" href="#">
         <img src="" alt="" />
      </a>
    </div>
  </div>
  <div class="binary-viewer-error">
    <p class="error-header"><g:message code="ddbnext.We_could_not_play_the_file" /></p>
    <p>
      The file <span class="media-file"><a
        href="http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg">Szene
          mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut</a></span> cannot
      be displayed.
    </p>
    <p>
      <g:message code="ddbnext.You_can_download_or_use_alternative" 
                 default="ddbnext.You_can_download_or_use_alternative"/>
                 --args missing--
                 <span class="media-file"><a href="">title</a></span>
    </p>
  </div>
  <div class="binary-viewer-flash-upgrade">
    <p class="error-header"><g:message code="ddbnext.BinaryViewer_FlashUpgrade_HeadingText" /></p>
    <p>
      <a href="http://get.adobe.com/flashplayer/"><g:message code="ddbnext.BinaryViewer_FlashUpgrade_DownloadLocationHtml" /></a>
    </p>
  </div>
  <div class="binary-title">
    <span></span>
  </div>

  <div class="tabs">
    <p class="tab all">
      <g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_All" 
                 args="${flash.all}" 
                 default="ddbnext.BinaryViewer_MediaCountLabelFormat_All"/>
    </p>
    <div class="scroller all">
      <ul id="gallery-all">
        <g:each in="${binaryList}">
          <li>
            <a class="group" 
              <g:if test="${it.orig.uri.video == '' && it.orig.uri.audio == ''}">
                href="${it.preview.uri}"
                data-content="${it.full.uri}"
                data-type="image"
                <g:set var="type" value="image"/>
              </g:if>
              <g:elseif test="${it.orig.uri.video != ''}">
                <g:if test="${it.preview.uri == ''}">
                  href="../images/bg/video_poster.png"
                </g:if>
                <g:else>
                  href="${it.preview.uri}"
                </g:else>
                data-content="${it.orig.uri.video}"
                data-type="video"
                <g:set var="type" value="video"/>
              </g:elseif>
              <g:elseif test="${it.orig.uri.audio != ''}">
                <g:if test="${it.preview.uri == ''}">
                  href="../images/bg/audio_poster.png"
                </g:if>
                <g:else>
                  href="${it.preview.uri}"
                </g:else>
                data-content="${it.orig.uri.audio}"
                data-type="audio"
                <g:set var="type" value="audio"/>
              </g:elseif>
                title="${it.orig.title}">
              <div class="thumbnail ${type}">
                <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
              </div>
              <span class="label">${it.orig.title}</span>
            </a>
          </li>
        </g:each>
      </ul>
      <button class="btn-prev">
        <g:message code="ddbnext.Previous_Label" />
        <span class="opaque"></span>
      </button>
      <button class="btn-next">
        <g:message code="ddbnext.Next_Label" />
        <span class="opaque"></span>
      </button>
    </div>
    <noscript>
      <div class="scroller all">
        <ul id="gallery-all">
          <g:each in="${binaryList}">
            <li>
              <a class="group" 
                <g:if test="${it.orig.uri.video == '' && it.orig.uri.audio == ''}">
                  href="${it.full.uri}"
                  <g:set var="type" value="image"/>
                </g:if>
                <g:elseif test="${it.orig.uri.video != ''}">
                  href="${it.orig.uri.video}"
                  <g:set var="type" value="video"/>
                </g:elseif>
                <g:elseif test="${it.orig.uri.audio != ''}">
                  href="${it.orig.uri.audio}"
                  <g:set var="type" value="audio"/>
                </g:elseif>
                  title="${it.orig.title}">
                <div class="thumbnail ${type}">
                  <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                </div>
                <span class="label">${it.orig.title}</span>
              </a>
            </li>
          </g:each>
        </ul>
      </div>
    </noscript>

    <p class="tab divider">|</p>
    <p class="tab images"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_Images" args="${flash.images}" default="ddbnext.BinaryViewer_MediaCountLabelFormat_Images" /></p>
    <div class="scroller images">
      <ul id="gallery-images">
        <g:each in="${binaryList}">
          <g:if test="${it.orig.uri.image != '' && it.orig.uri.video == '' && it.orig.uri.audio == ''}">
            <li>
              <a class="group" href="${it.preview.uri}" data-content="${it.full.uri}" data-type="image" title="${it.preview.title}">
                <div class="thumbnail image">
                  <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                </div>
                <span class="label">${it.preview.title}</span>
              </a>
            </li>
          </g:if>
        </g:each>
      </ul>
      <button class="btn-prev">
        <g:message code="ddbnext.Previous_Label" />
        <span class="opaque"></span>
      </button>
      <button class="btn-next">
        <g:message code="ddbnext.Next_Label" />
        <span class="opaque"></span>
      </button>
    </div>
    <noscript>
      <div class="scroller images">
        <ul id="gallery-images">
          <g:each in="${binaryList}">
            <g:if test="${it.orig.uri.image != '' && it.orig.uri.video == '' && it.orig.uri.audio == ''}">
              <li>
                <a class="group" href="${it.full.uri}" title="${it.preview.title}">
                  <div class="thumbnail image">
                    <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                  </div>
                  <span class="label">${it.preview.title}</span>
                </a>
              </li>
            </g:if>
          </g:each>
        </ul>
      </div>
    </noscript>

    <p class="tab divider">|</p>
    <p class="tab videos"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_Videos" args="${flash.videos}" default="ddbnext.BinaryViewer_MediaCountLabelFormat_Videos" /></p>
    <div class="scroller videos">
      <ul id="gallery-videos">
        <g:each in="${binaryList}">
          <g:if test="${it.orig.uri.video != '' }">
            <li>
              <a class="group"
                 <g:if test="${it.preview.uri == ''}">
                   href="../images/bg/video_poster.png"
                 </g:if>
                 <g:else>
                   href="${it.preview.uri}"
                 </g:else>  
                 data-content="${it.orig.uri.video}" data-type="video" title="${it.orig.title}">
                <div class="thumbnail video">
                  <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                </div>
                <span class="label">${it.orig.title}</span>
              </a>
            </li>
          </g:if>
        </g:each>
      </ul>
      <button class="btn-prev">
        <g:message code="ddbnext.Previous_Label" />
        <span class="opaque"></span>
      </button>
      <button class="btn-next">
        <g:message code="ddbnext.Next_Label" />
        <span class="opaque"></span>
      </button>
    </div>
    <noscript>
      <div class="scroller videos">
        <ul id="gallery-videos">
          <g:each in="${binaryList}">
            <g:if test="${it.orig.uri.video != '' }">
              <li>
                <a class="group" href="${it.orig.uri.video}" title="${it.orig.title}">
                  <div class="thumbnail video">
                    <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                  </div>
                  <span class="label">${it.orig.title}</span>
                </a>
              </li>
            </g:if>
          </g:each>
        </ul>
      </div>
    </noscript>

    <p class="tab divider">|</p>
    <p class="tab audios"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_Audios" args="${flash.audios}" default="ddbnext.BinaryViewer_MediaCountLabelFormat_Audios" /></p>
    <div class="scroller audios">
      <ul id="gallery-audios">
        <g:each in="${binaryList}">
          <g:if test="${it.orig.uri.audio != '' }">
            <li>
              <a class="group"
                 <g:if test="${it.preview.uri == ''}">
                   href="../images/bg/audio_poster.png"
                 </g:if>
                 <g:else>
                   href="${it.preview.uri}"
                 </g:else>
                 data-content="${it.orig.uri.audio}" data-type="audio" title="${it.orig.title}">
                <div class="thumbnail video">
                  <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                </div>
                <span class="label">${it.orig.title}</span>
              </a>
            </li>
          </g:if>
        </g:each>
      </ul>
      <button class="btn-prev">
        <g:message code="ddbnext.Previous_Label" />
        <span class="opaque"></span>
      </button>
      <button class="btn-next">
        <g:message code="ddbnext.Next_Label" />
        <span class="opaque"></span>
      </button>
    </div>
    <noscript>
      <div class="scroller audios">
        <ul id="gallery-audios">
          <g:each in="${binaryList}">
            <g:if test="${it.orig.uri.audio != '' }">
              <li>
                <a class="group" href="${it.orig.uri.audio}" title="${it.orig.title}">
                  <div class="thumbnail video">
                    <img src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
                  </div>
                  <span class="label">${it.orig.title}</span>
                </a>
              </li>
            </g:if>
          </g:each>
        </ul>
      </div>
    </noscript>
  </div>
</div>
