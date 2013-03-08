window.onload=function(){
  $('.results-paginator-options').removeClass('off');
  $('.results-paginator-view').removeClass('off');
  $('.page-input').removeClass('off');
  $('.page-nonjs').addClass("off");
  
  $('.page-filter select').change(function(){
    var paramsArray = new Array(new Array('rows', this.value), new Array('offset', 0));
    fetchResultsList(addParamToCurrentUrl(paramsArray));
    return false;
  });
  
  $('.sort-results-switch select').change(function(){
    var paramsArray = new Array(new Array('sort', this.value), new Array('offset', 0));
    fetchResultsList(addParamToCurrentUrl(paramsArray));
    return false;
  });
  
  function addParamToCurrentUrl(arrayParamVal, urlParameters){
    var queryParameters = {}, queryString = (urlParameters==null)?location.search.substring(1):urlParameters,
      re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    $.each(arrayParamVal, function(key, value){
      queryParameters[value[0]] = value[1];
    });
    var tmp = jQuery.param(queryParameters, true);
    return window.location.pathname+'?'+tmp;
  }
  
  $('.page-nav a').click(function(){
    fetchResultsList(this.href);
    return false;
  });
  $('#view-list').click(function(){
    $('.summary-main .title a').each(function(index,value){
      var newTitle = (value.title.length>100)?value.title.substring(0,96)+'...':value.title;
      $(this).closest('.summary-main').find('.matches li span strong').each(function(sindex, svalue){
        newTitle = newTitle.replace(new RegExp(svalue.innerHTML, 'g'),'<strong>'+svalue.innerHTML+'</strong>'); 
      });
      value.innerHTML = newTitle;
    });
    $('#view-list').addClass('selected');
    $('#view-grid').removeClass('selected');
    $('.search-results').fadeOut('fast', function(){
      $('.results-list .summary').addClass('row');
      $('.summary-main-wrapper').addClass('span7');
      $('.thumbnail-wrapper').addClass('span2');
      $('.results-list').removeClass("grid");
      $('.search-results').fadeOut('fast');
      $('.summary .thumbnail-wrapper').each(function(){
        $(this).appendTo(this.parentNode);
      });
      $('.search-results').fadeIn('fast');
    });
    var paramsArray = new Array(new Array('viewType', 'list'));
    var newUrl = addParamToCurrentUrl(paramsArray);
    $('.page-nav a').each(function(){
      this.href = addParamToCurrentUrl(paramsArray, this.href.split("?")[1]);
    });
    window.history.pushState({path:newUrl},'',newUrl);
  });
  $('.page-input').keyup(function(e){
    if(e.keyCode == 13) {
      if (/^[0-9]+$/.test(this.value)) {
        if (parseInt(this.value) <= 0) {
            this.value = 1;
        }
        else if (parseInt(this.value) > parseInt($('.result-pages-count').text())) {
            this.value = $('.result-pages-count').text();
        }
      }
      else {
        this.value = 1;
      }
      var paramsArray = new Array(new Array('offset', (this.value - 1) * $('.page-filter').find("select").val()));
      var newUrl = addParamToCurrentUrl(paramsArray);
      fetchResultsList(newUrl);
    }
  });
  $('#thumbnail-filter').click(function(){
    var valueCheck = $(this);
    if(valueCheck.is(':checked'))
      var paramsArray = new Array(new Array('isThumbnailFiltered', 'true'));
    else
      var paramsArray = new Array(new Array('isThumbnailFiltered', 'false'));
    var newUrl = addParamToCurrentUrl(paramsArray);
    fetchResultsList(newUrl);
    window.history.pushState({path:newUrl},'',newUrl);
  });
  $('#view-grid').click(function(){
    $('.summary-main .title a').each(function(index,value){
      var newTitle = (value.title.length>53)?value.title.substring(0,50)+'...':value.title;
      $(this).closest('.summary-main').find('.matches li span strong').each(function(sindex, svalue){
        newTitle = newTitle.replace(new RegExp(svalue.innerHTML, 'g'),'<strong>'+svalue.innerHTML+'</strong>'); 
      });
      value.innerHTML = newTitle;
    });
    var newTitle = $('.summary-main .title a').title;
    $('#view-list').removeClass('selected');
    $('#view-grid').addClass('selected');
    $('.search-results').fadeOut('fast', function(){
      $('.results-list .summary').removeClass('row');
      $('.summary-main-wrapper').removeClass('span7');
      $('.thumbnail-wrapper').removeClass('span2');
      $('.results-list').addClass("grid");
      $('.search-results').fadeOut('fast');
      $('.summary .summary-main-wrapper').each(function(){
        $(this).appendTo(this.parentNode);
      });
      $('.search-results').fadeIn('fast');
    });
    var paramsArray = new Array(new Array('viewType', 'grid'));
    var newUrl = addParamToCurrentUrl(paramsArray);
    $('.page-nav a').each(function(){
      this.href = addParamToCurrentUrl(paramsArray, this.href.split("?")[1]);
    });
    window.history.pushState({path:newUrl},'',newUrl);
  });
  function fetchResultsList(url){
    $('.search-results').empty();
    var imgLoader = document.createElement('img');
    imgLoader.src = "/static/images/icons/loader_small.gif";
    $('.search-results').prepend(imgLoader);
    var request = $.ajax({
      type: 'GET',
      dataType: 'json',
      async: true,
      url: url+'&reqType=ajax',
      complete: function(data){
        $('.search-results').fadeOut('fast', function(){
        var JSONresponse = jQuery.parseJSON(data.responseText);
        $('.search-results').html(JSONresponse.results);
        $('.results-overall-index').html(JSONresponse.resultsOverallIndex);
        $('.page-input').attr("value", JSONresponse.page);
        $('.page-nonjs').html(JSONresponse.page);
        $('.total-pages').html(JSONresponse.totalPages);
        $('.result-pages-count').html(JSONresponse.totalPages);
        $('.results-total').html(JSONresponse.numberOfResults);
        if(JSONresponse.paginationURL.nextPg){
          $(".page-nav .next-page").removeClass("off");
          $(".page-nav .last-page").removeClass("off");
          $('.page-nav .next-page a').attr('href', JSONresponse.paginationURL.nextPg);
          $('.page-nav .last-page a').attr('href', JSONresponse.paginationURL.lastPg);
        }else{
          $(".page-nav .next-page").addClass("off");
          $(".page-nav .last-page").addClass("off");
        }
        if(JSONresponse.paginationURL.firstPg){
          $(".page-nav .prev-page").removeClass("off");
          $(".page-nav .first-page").removeClass("off");
          $('.page-nav .prev-page a').attr('href', JSONresponse.paginationURL.prevPg);
          $('.page-nav .first-page a').attr('href', JSONresponse.paginationURL.firstPg);
        }else{
          $(".page-nav .prev-page").addClass("off");
          $(".page-nav .first-page").addClass("off");
        }
        window.history.pushState({path:url},'',url);
        $('.search-results').fadeIn('fast');
        });
      }
    });
  }
  //Facet Manager --
  FacetsManager = function(){
    this.init();
  }

  $.extend(FacetsManager.prototype, {
      
    connectedflyoutWidget: null,
    facetsEndPoint: '/facets',
    currentOffset: 0, 
    currentRows: -1, //all facets
    currentFacetField: null,
    currentFacetValuesSelected: new Array(),
    currentFacetValuesNotSelected: new Array(),
    currentPage: 1,

    init: function(){
    },

    fetchFacetValues: function(flyoutWidget){
        this.connectedflyoutWidget = flyoutWidget;
        var oldParams = this.getUrlVars();
        var currObjInstance = this;
        var fctValues = "";
        var resp = new Array();
        if(oldParams['facetValues%5B%5D']){
          $.each(oldParams['facetValues%5B%5D'], function(key, value){
            fctValues = (value.indexOf(currObjInstance.currentFacetField)>=0)?fctValues:fctValues+'&facetValues%5B%5D='+value;
          });
        }
        this.connectedflyoutWidget.renderFacetLoader();
        var request = $.ajax({
            type: 'GET',
            dataType: 'json',
            async: true,
            url: this.facetsEndPoint+'?name='+this.currentFacetField+'&searchQuery='+oldParams['query']+fctValues+'&offset='+this.currentOffset+'&rows='+this.currentRows,
            complete: function(data){
                var parsedResponse = jQuery.parseJSON(data.responseText);
                currObjInstance.currentFacetValuesNotSelected = parsedResponse.values;
                flyoutWidget.initializeFacetValues(parsedResponse.type, currObjInstance.currentFacetValuesNotSelected);
                }
            });
    },
    //Initialize the structures for the pagination logic
    initPagination: function(){
        var currObjInstance = this;
      if(Math.round((this.currentFacetValuesNotSelected.length)/10)>1){
        this.connectedflyoutWidget.paginationLiPrev.click(function(e){
            e.preventDefault();
            currObjInstance.goPrevPage();
            return false;
        });
        this.connectedflyoutWidget.paginationLiNext.click(function(e){
            e.preventDefault();
            currObjInstance.goNextPage();
            return false;
        });
        this.connectedflyoutWidget.setFacetValuesPage(this.currentPage);
        this.connectedflyoutWidget.paginationLiNext.removeClass('off');
      }
    },
    goNextPage: function(){
      this.currentOffset += 10;
      this.currentPage +=1;
      this.connectedflyoutWidget.renderFacetValues(this.currentFacetField, this.currentFacetValuesNotSelected.slice(this.currentOffset));
      this.connectedflyoutWidget.setFacetValuesPage(this.currentPage);
      
      if(this.currentPage+1 > Math.ceil((this.currentFacetValuesNotSelected.length)/10)){
          this.connectedflyoutWidget.paginationLiNext.addClass('off');
      }
      this.connectedflyoutWidget.paginationLiPrev.removeClass('off');
    },
    goPrevPage: function(){
      this.currentOffset -= 10;
      this.currentPage -=1;
      this.connectedflyoutWidget.renderFacetValues(this.currentFacetField, this.currentFacetValuesNotSelected.slice(this.currentOffset));
      this.connectedflyoutWidget.setFacetValuesPage(this.currentPage);
      
      if(this.currentPage-1 < 1){
          this.connectedflyoutWidget.paginationLiPrev.addClass('off');
      }
      this.connectedflyoutWidget.paginationLiNext.removeClass('off');
    },
    getUrlVars: function(){
      var vars = {}, hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        if(!Object.prototype.hasOwnProperty.call(vars, hash[0])){
          vars[hash[0]] = new Array();
        }
        vars[hash[0]].push(hash[1]);
      }
      return vars;
    },
    getUrlVar: function(name){
      return $.getUrlVars()[name];
    }
  });
  
  //Flyout Widget --
  FlyoutFacetsWidget = function(){
    this.init();
  }

  $.extend(FlyoutFacetsWidget.prototype, {
  mainElement: null,
    parentMainElement: null,
    opened: false,
    fctManager: new FacetsManager(),

    facetLeftContainer: null,
    facetRightContainer:null,
    rightBody: null,
    leftBody: null,
    paginationLiPrev: null,
    paginationLiNext: null,
    paginationLiSeite: null,
    

    //i18n variables
    
    field_MostRelevant: messages.ddbnext.Most_relevant,
    field_AddMoreFiltersButtonTooltip: messages.ddbnext.Add_More_Filters_ButtonTooltip,
    field_SearchResultsFacetValueNext: messages.ddbnext.SearchResultsFacetValue_Next,
    field_SearchResultsFacetValuePrevious: messages.ddbnext.SearchResultsFacetValue_Previous,
    field_Page: messages.ddbnext.Page,
    field_RemoveSelectedItem: messages.ddbnext.Remove_selected_item,
    field_RemoveButton: messages.ddbnext.Remove_Button,
    
    init: function(){
        this.cleanNonJsStructures();
    },
    build: function(element){
        if(element.attr('data-fctname') != this.fctManager.currentFacetField || (element.attr('data-fctname') == this.fctManager.currentFacetField && !this.opened)){
          if(this.opened) this.close();
          this.mainElement = element;
          this.parentMainElement = this.mainElement.parent();
          this.fctManager.currentFacetField = this.mainElement.attr('data-fctname');
          this.parentMainElement.hide();
          this.parentMainElement.addClass('active');
          this.buildStructure();
          this.fctManager.fetchFacetValues(this);
          this.opened = true;
        }
    },
    buildStructure: function(){
      var inputSearchContainer;
      var inputSearch;
      
      if(this.parentMainElement.find('.flyout-left-container').length>0){
        this.facetLeftContainer = this.parentMainElement.find('.flyout-left-container');
        inputSearchContainer = this.parentMainElement.find('.input-search-fct-container');
        this.inputSearch = this.parentMainElement.find('.input-search-fct');
      }else{
        this.facetLeftContainer = $(document.createElement('div'));
        inputSearchContainer = $(document.createElement('div'));
        inputSearch = $(document.createElement('input'));

        this.facetLeftContainer.addClass('flyout-left-container');
        inputSearchContainer.addClass('input-search-fct-container');
        inputSearch.attr('type','text');
        inputSearch.addClass('input-search-fct');
        
        this.facetLeftContainer.appendTo(this.mainElement.parent());
        inputSearch.appendTo(inputSearchContainer);
        inputSearchContainer.appendTo(this.facetLeftContainer);
      }
      
      this.facetRightContainer = $(document.createElement('div'));
      var rightHead = $( document.createElement('div') );
      this.rightBody = $( document.createElement('div') );
      //pagination structure for facets
      var paginationContainer = $(document.createElement('div'));
      var paginationUl = $(document.createElement('ul'));
      this.paginationLiPrev = $(document.createElement('li'));
      this.paginationLiNext = $(document.createElement('li'));
      this.paginationLiSeite = $(document.createElement('li'));
      var paginationAPrev = $(document.createElement('a'));
      var paginationANext = $(document.createElement('a'));
      var spanSeiteNumber = $(document.createElement('span'));
      
      this.facetRightContainer.addClass('flyout-right-container');
      this.facetRightContainer.hide();
      rightHead.addClass('flyout-right-head');
      this.rightBody.addClass('flyout-right-body');
      paginationContainer.addClass('flyout-page-nav fr');
      paginationUl.addClass('inline');
      this.paginationLiPrev.addClass('prev-page br off');
      this.paginationLiNext.addClass('next-page bl off');
      this.paginationLiSeite.addClass('pages-overall-index');
      paginationAPrev.attr('href','');
      paginationANext.attr('href','');
      
      this.facetRightContainer.appendTo(this.mainElement.parent());
      rightHead.appendTo(this.facetRightContainer);
      this.rightBody.appendTo(this.facetRightContainer);
      
      rightHead.html(this.field_MostRelevant);
      
      paginationAPrev.html(this.field_SearchResultsFacetValuePrevious);
      paginationANext.html(this.field_SearchResultsFacetValueNext);
      this.paginationLiSeite.html(this.field_Page);
      
      paginationContainer.appendTo(rightHead);
      paginationUl.appendTo(paginationContainer);
      this.paginationLiPrev.appendTo(paginationUl);
      this.paginationLiSeite.appendTo(paginationUl);
      this.paginationLiNext.appendTo(paginationUl);
      paginationAPrev.appendTo(this.paginationLiPrev);
      paginationANext.appendTo(this.paginationLiNext);
      spanSeiteNumber.appendTo(this.paginationLiSeite);

      this.parentMainElement.fadeIn('fast');
      this.facetRightContainer.fadeIn('fast');
      this.parentMainElement.find('.input-search-fct-container').fadeIn('fast');
      //this.parentMainElement.find('.input-search-fct-container').show('100');
    },
    initializeFacetValues: function(field, facetValues){
        var currObjInstance = this;
        var leftCol = $(document.createElement('div'));
        var rightCol = $(document.createElement('div'));

        this.rightBody.empty();
        
        leftCol.addClass('left-col');
        rightCol.addClass('right-col');

        leftCol.appendTo(this.rightBody);
        rightCol.appendTo(this.rightBody);
        
        this.renderFacetValues(field, facetValues);
        this.fctManager.initPagination();
    },
    renderFacetValues: function(field, facetValues){
      
      var leftCol = this.rightBody.find('.left-col');
      var rightCol = this.rightBody.find('.right-col');
      
      leftCol.empty();
      rightCol.empty();
      
      if(field == this.fctManager.currentFacetField){
        if(facetValues.length > 5){
          this.rightBody.addClass('body-extender');
        }
        $.each(facetValues, function(index){
          var facetValueContainer = $(document.createElement('div'));
          var spanCount = $(document.createElement('span'));

          facetValueContainer.attr('data-fctvalue', this.value);
          spanCount.html('('+this.count+')');

          if(index<5){
            facetValueContainer.appendTo(leftCol);
          }
          else if(index<10){
            facetValueContainer.appendTo(rightCol);
          }
          spanCount.appendTo(facetValueContainer);
          $(document.createTextNode(this.localizedValue)).appendTo(facetValueContainer);
        });
      }
    },
    setFacetValuesPage: function(pageNumber){
      this.paginationLiSeite.find('span').html(pageNumber);
    },
    renderFacetLoader: function(){
      this.rightBody.empty();
      var imgLoader = document.createElement('img');
      imgLoader.src = "/static/images/icons/loader_small.gif";
      this.rightBody.prepend(imgLoader);
    },
    manageOutsideClicks: function(thisInstance){
      $(document).mouseup(function (e){
        var container = $(".facets-list");
        if (container.has(e.target).length === 0 && thisInstance.opened == true){
          thisInstance.close();
          thisInstance.opened = false;
        }
      });
    },
    cleanNonJsStructures: function(){
      $('.facets-item >ul').remove();
    },
    close: function(){
      var oldMainElement = this.mainElement;
      var oldParentMainElement = this.parentMainElement;
      oldParentMainElement.find('.input-search-fct-container').hide('100', function(){
        if(oldParentMainElement.find('.flyout-left-container ul li').length > 0){
          oldParentMainElement.find('.addMoreFilters').show('100');
        }else{
          oldParentMainElement.fadeOut('fast',function(){
            oldParentMainElement.removeClass('active');
            oldParentMainElement.fadeIn('fast');
          });
        }
      });
      oldParentMainElement.find('.flyout-right-container').hide('100', function(){
        oldParentMainElement.find('.flyout-right-container').remove();
      });
      this.fctManager.currentPage = 1;
      this.fctManager.currentOffset = 0;
    }
  });
  
  function initializeFacets(){
    var fctWidget = new FlyoutFacetsWidget();
    $('.facets-item a').each(function(){
        $(this).click(function(event){
            event.preventDefault();
            fctWidget.build($(this));
        });
    });
    fctWidget.manageOutsideClicks(fctWidget);
  }
  initializeFacets();
  //-- End Facet Manager
};