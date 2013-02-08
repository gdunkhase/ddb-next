<div class="slide-viewer">
  <div class="binary-viewer-container">
    <div class="binary-viewer">
      <g:set var="preview" value="${binaryList[0]}" />
      <img src="${preview.preview.uri}" alt="${preview.preview.title}"/>
    </div>
  </div>
  <div class="binaryViewerError" style="display: none;">
    <p class="errorHeader"><g:message code="ddbnext.We_could_not_play_the_file" /></p>
    <p>
      The file <span class="mediaFile"><a
        href="http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg">Szene
          mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut</a></span> cannot
      be displayed.
    </p>
  </div>
  <div class="binaryViewerFlashUpgrade" style="display: none;">
    <p class="errorHeader">You need to upgrade your Adobe Flash Player to
      watch this video.</p>
    <p>
      <a href="http://get.adobe.com/flashplayer/">Download the latest Adobe
        Flash Player.</a>
    </p>
    <p>
      <g:message code="ddbnext.You_can_download_or_use_alternative" 
                 default="ddbnext.You_can_download_or_use_alternative"/>
                 --args missing--
                 <span class="mediaFile"><a href="${preview.preview.uri}">${preview.preview.title}</a></span>
    </p>
  </div>
  <div class="binary-title">
    <span data-bind="text: selectedBinary">${preview.preview.title}</span>
  </div>

  <div class="tabs">
    <p class="tab all currentTab">
      <g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_All" 
                 args="${flash.all}" 
                 default="ddbnext.BinaryViewer_MediaCountLabelFormat_All"/>
    </p>
    <div class="scroller all" style="overflow: hidden;">
      <button class="btn-prev">
        <g:message code="ddbnext.Previous_Label" />
        <span class="opaque"></span>
      </button>
      <ul>
        <g:each in="${binaryList}">
          <li>
            <a href="${it.preview.uri}" data-fullsrc="${it.full.uri}" title="${it.preview.title}">
              <div class="thumbnail image">
                <img style="display: inline-block;" src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
              </div>
              <span class="label">${it.preview.title}</span>
            </a>
          </li>
        </g:each>
      </ul>
      <button class="btn-next">
        <g:message code="ddbnext.Next_Label" />
        <span class="opaque"></span>
      </button>
    </div>
    <noscript></noscript>
    <script type="text/javascript">
        var category_all = [];
            category_all.push({
                 name : "Szene mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut",
                     uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     full_uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     thumbnail : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvth/1.jpg",
                     primary : true,
                 shortType : "image"
            });
        
        categories.push({name: "all", data: category_all});
    </script>

    <p class="tab divider">|</p>
    <p class="tab images"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_Images" args="${flash.images}" default="ddbnext.BinaryViewer_MediaCountLabelFormat_Images" /></p>
    <div class="scroller images" style="display: none;">
      <ul></ul>
    </div>
    <noscript></noscript>
    <script type="text/javascript">
        var category_images = [];
            category_images.push({
                 name : "Szene mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut",
                     uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     full_uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     thumbnail : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvth/1.jpg",
                     primary : true,
                 shortType : "image"
            });
        
        categories.push({name: "images", data: category_images});
    </script>

    <p class="tab divider">|</p>
    <p class="tab videos"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_Videos" args="${flash.videos}" default="ddbnext.BinaryViewer_MediaCountLabelFormat_Videos" /></p>
    <div class="scroller videos" style="display: none;">
      <ul></ul>
    </div>
    
    <noscript>
    </noscript>
    
    <script type="text/javascript">
        var category_videos = [];
        categories.push({name: "videos", data: category_videos});
    </script>

    <p class="tab divider">|</p>
    <p class="tab audios"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_Audios" args="${flash.audios}" default="ddbnext.BinaryViewer_MediaCountLabelFormat_Audios" /></p>
    <div class="scroller audios" style="display: none;">
      <ul></ul>
    </div>
    
    <noscript>
    </noscript>
    
    <script type="text/javascript">
        var category_audios = [];
        categories.push({name: "audios", data: category_audios});
    </script>
  </div>
</div>