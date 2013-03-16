//IMPORTANT FOR MERGING: This is the main function that has to be called when we are in the search results page
window.onload=function(){
  if (window.history && history.pushState) {
    historyedited = false;
    $(window).bind('popstate', function(e) {
     if (historyedited) {
      stateManager(location.pathname + location.search);
     }
    });
  }
  
  searchResultsInitializer();
  
  function stateManager(url){
    $('#main-container').load(url+' .search-results-container', function(){
      searchResultsInitializer();
    });
  }
};

function historyManager(path){
if(window.history && history.pushState) {
  window.history.pushState({path:path},'',path);
    historyedited = true;
  }
}

function setHovercardEvents(){
    $('.thumbnail a').mouseenter(function(){
        $(this).parents('.thumbnail-wrapper').find('.hovercard-info-item').addClass('on');
    });
    $('.thumbnail a').mouseleave(function(){
        $(this).parents('.thumbnail-wrapper').find('.hovercard-info-item').removeClass('on');
    });
}

function searchResultsInitializer(){
  $('.results-paginator-options').removeClass('off');
  $('.results-paginator-view').removeClass('off');
  $('.page-input').removeClass('off');
  $('.page-nonjs').addClass("off");
  
  setHovercardEvents();
  
  $('.page-filter select').change(function(){
    var paramsArray = new Array(new Array('rows', this.value), new Array('offset', 0));
    fetchResultsList(addParamToCurrentUrl(paramsArray));
    $('.clear-filters').attr('href', $('.clear-filters').attr('href').replace(/rows=\d+/g,'rows='+this.value));
    return false;
  });
  
  $('.sort-results-switch select').change(function(){
    var paramsArray = new Array(new Array('sort', this.value), new Array('offset', 0));
    fetchResultsList(addParamToCurrentUrl(paramsArray));
    $('.clear-filters').attr('href', $('.clear-filters').attr('href').replace(/sort=(RELEVANCE|ALPHA_DESC|ALPHA_ASC)/i,'sort='+this.value));
    return false;
  });
  
  function addParamToCurrentUrl(arrayParamVal, urlParameters){
    return addParamToUrl(arrayParamVal, null, urlParameters);
  }
  //This function will give you back the current url (if no urlParameters is setted) plus the new parameters added
  //IMPORTANT: remember to pass your arrayParamVal already URL decoded
  function addParamToUrl(arrayParamVal, path, urlParameters){
    var queryParameters = {}, queryString = (urlParameters==null)?location.search.substring(1):urlParameters,
      re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1].replace(/\+/g,'%20'))] = decodeURIComponent(m[2].replace(/\+/g,'%20'));
    }
    $.each(arrayParamVal, function(key, value){
      queryParameters[value[0]] = value[1];
    });
    var tmp = jQuery.param(queryParameters, true);
    if (path == null) {
      return window.location.pathname+'?'+tmp;
    }
    else {
      return path+'?'+tmp;
    }
  }
  
  function setSearchCookieParameter(arrayParamVal){
    var searchParameters = readCookie("searchParameters");
    if (searchParameters != null && searchParameters.length > 0) {
        searchParameters = searchParameters.substring(1, searchParameters.length -1);
        searchParameters = searchParameters.replace(/\\"/g,'"');
        var json = $.parseJSON(searchParameters);
        $.each(arrayParamVal, function(key, value){
          if (value[1].constructor === Array) {
            for(var i = 0; i < value[1].length; i++) {
                if (value[1][i].constructor === String) {
                    value[1][i] = encodeURIComponent(value[1][i]).replace(/%20/g,'\+');
                }
            }
          }
          else if (value[1].constructor === String) {
            value[1] = encodeURIComponent(value[1]).replace(/%20/g,'\+');
          }
          json[value[0]] = value[1];
        });
        document.cookie = "searchParameters=\"" + JSON.stringify(json).replace(/"/g,'\\"') + "\"; path=/";
    }
  }
  
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  $('.page-nav-result').click(function(){
    fetchResultsList(this.href);
    return false;
  });
  $('#view-list').click(function(){
    $('.summary-main .title a').each(function(index,value){
      var newTitle = value.title.toString();
      if(newTitle.length>100){
          newTitle = newTitle.trim().substring(0, 100).split(" ").slice(0, -1).join(" ") + "...";
      }
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
    $('.results-list a').each(function(){
      this.href = addParamToUrl(paramsArray, this.href.split("?")[0], this.href.split("?")[1]);
    });
    $('.clear-filters').attr('href', $('.clear-filters').attr('href').replace(/viewType=(list|grid)/i,'viewType=list'));
    historyManager(newUrl);
    setSearchCookieParameter(paramsArray);
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
    historyManager(newUrl);
  });
  $('#view-grid').click(function(){
    $('.summary-main .title a').each(function(index,value){
      var newTitle = value.title.toString();
      if(newTitle.length>53){
          newTitle = newTitle.trim().substring(0, 53).split(" ").slice(0, -1).join(" ") + "...";
      }
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
    $('.results-list a').each(function(){
      this.href = addParamToUrl(paramsArray, this.href.split("?")[0], this.href.split("?")[1]);
    });
    $('.clear-filters').attr('href', $('.clear-filters').attr('href').replace(/viewType=(list|grid)/i,'viewType=grid'));
    historyManager(newUrl);
    setSearchCookieParameter(paramsArray);
    historyedited= true;
  });
  function fetchResultsList(url){
    $('.search-results').empty();
    var imgLoader = document.createElement('img');
    imgLoader.src = "../images/icons/loader_small.gif";
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
        historyManager(url);
        $('.search-results').fadeIn('fast');
        setHovercardEvents();
        });
      }
    });
  }
 
  //Facets Manager --
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
                //Initialization of currentFacetValuesSelected / currentFacetValuesNotSelected
                currObjInstance.initializeFacetValuesStructures(parsedResponse.values);
                flyoutWidget.initializeFacetValues(parsedResponse.type, currObjInstance.currentFacetValuesNotSelected);
                }
            });
    },
    //Initialize the structures for the pagination logic inside facets flyoutWidget
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
        this.connectedflyoutWidget.paginationLiNext.removeClass('off');
      }
      this.connectedflyoutWidget.setFacetValuesPage(this.currentPage);
    },
    initializeFacetValuesStructures: function(responseFacetValues){
      //LeftBody will not exists on the first opening of the flyout
      if(this.connectedflyoutWidget.facetLeftContainer){
        var currObjInstance = this;
        var selectedList = this.connectedflyoutWidget.facetLeftContainer.find('.selected-items li');
        this.currentFacetValuesNotSelected = responseFacetValues;
        if(selectedList.length>0){
          selectedList.each(function(){
            var tmpFacetValue = $(this).attr('data-fctvalue');
            currObjInstance.currentFacetValuesSelected.push(tmpFacetValue);
            currObjInstance.currentFacetValuesNotSelected = jQuery.grep(currObjInstance.currentFacetValuesNotSelected, function(element) {
                return element.value != tmpFacetValue;
            });
          });
        }
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
    
    selectFacetValue: function(facetValue, localizedValue){
        var currObjInstance = this;
        this.currentFacetValuesSelected.push(facetValue);
        
        this.currentFacetValuesNotSelected = jQuery.grep(this.currentFacetValuesNotSelected, function(element) {
            return element.value != facetValue;
        });
        
        var selectedFacetValue = this.connectedflyoutWidget.renderSelectedFacetValue(facetValue, localizedValue);
        
        selectedFacetValue.find('.facet-remove').click(function(){
          currObjInstance.unselectFacetValue(selectedFacetValue);
        });
        
        if(this.currentFacetValuesSelected.length == 1){
            this.connectedflyoutWidget.renderAddMoreFiltersButton(this.currentFacetField);
            this.connectedflyoutWidget.addMoreFilters.click(function(event){
                currObjInstance.connectedflyoutWidget.build($(this));
            });
        }
        this.connectedflyoutWidget.close();
        
        //We want to add the facet value selected, but at the same time we want to keep all the old selected values
        var paramsFacetValues = this.getUrlVar('facetValues%5B%5D');
        if(paramsFacetValues){
          $.each(paramsFacetValues, function(key,value){
            paramsFacetValues[key] = decodeURIComponent(value);
          });
          paramsFacetValues.push(this.currentFacetField+'='+facetValue);
          var paramsArray = new Array(new Array('facetValues[]', paramsFacetValues));
        }else{
          var paramsArray = new Array(new Array('facetValues[]', this.currentFacetField+'='+facetValue));
        }
        fetchResultsList(addParamToCurrentUrl(paramsArray));
    },
    
    unselectFacetValue: function(element){
      var facetFieldFilter = element.parents('.facets-item');
      if(this.connectedflyoutWidget.opened){
          this.connectedflyoutWidget.close();
          this.currentFacetValuesSelected = jQuery.grep(this.currentFacetValuesSelected, function(el) {
              return el != element.attr('data-fctvalue');
          });
      }
      //if in the list there is only one element means that is the case of the last element that we are going to remove
      if(facetFieldFilter.find('.selected-items li').length == 1){
        var facetFieldFilter = element.parents('.facets-item');
        this.connectedflyoutWidget.removeAddMoreFiltersButton(facetFieldFilter, facetFieldFilter.find('.add-more-filters'));
      }
      fetchResultsList(window.location.href.replace('&facetValues%5B%5D='+facetFieldFilter.find('.h3').attr('data-fctname')+'%3D'+element.attr('data-fctvalue'),''));
      element.remove();
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
      return this.getUrlVars()[name];
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
    selectedItems: null,
    paginationLiPrev: null,
    paginationLiNext: null,
    paginationLiSeite: null,
    addMoreFilters: null,
    

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
        if((element.attr('data-fctname') != this.fctManager.currentFacetField 
                || (element.attr('data-fctname') == this.fctManager.currentFacetField && !this.opened))){
          if(this.opened) this.close();
          this.mainElement = element.parents('.facets-item').find('.h3');
          this.parentMainElement = this.mainElement.parent();
          this.fctManager.currentFacetField = this.mainElement.attr('data-fctname');
          if(!this.parentMainElement.hasClass('active')){
            this.parentMainElement.hide();
            this.parentMainElement.addClass('active');
          }
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
        this.selectedItems = this.parentMainElement.find('.selected-items');
        inputSearchContainer = this.parentMainElement.find('.input-search-fct-container');
        this.inputSearch = this.parentMainElement.find('.input-search-fct');
      }else{
        this.facetLeftContainer = $(document.createElement('div'));
        this.selectedItems = $(document.createElement('ul'));
        inputSearchContainer = $(document.createElement('div'));
        inputSearch = $(document.createElement('input'));

        this.facetLeftContainer.addClass('flyout-left-container');
        this.selectedItems.addClass('selected-items unstyled');
        inputSearchContainer.addClass('input-search-fct-container');
        inputSearch.attr('type','text');
        inputSearch.addClass('input-search-fct');
        
        this.facetLeftContainer.appendTo(this.mainElement.parent());
        this.selectedItems.appendTo(this.facetLeftContainer);
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
      var currObjInstance = this;
        
      var leftCol = this.rightBody.find('.left-col');
      var rightCol = this.rightBody.find('.right-col');
      
      if(field == this.fctManager.currentFacetField){
        if(facetValues.length > 5){
          this.rightBody.addClass('body-extender');
        }
        this.rightBody.fadeOut('fast', function(){
          leftCol.empty();
          rightCol.empty();
          
          $.each(facetValues, function(index){
            if(jQuery.inArray(this.value,currObjInstance.fctManager.currentFacetValuesSelected)==-1){
                var facetValueContainer = $(document.createElement('div'));
                var spanCount = $(document.createElement('span'));
                var facetValue = this.value;
                var localizedValue = this.localizedValue;
                
                facetValueContainer.click(function(){
                  currObjInstance.fctManager.selectFacetValue($(this).attr('data-fctvalue'), localizedValue);
                });
                
                facetValueContainer.attr('data-fctvalue', facetValue);
                spanCount.html('('+this.count+')');
        
                if(index<5){
                  facetValueContainer.appendTo(leftCol);
                }
                else if(index<10){
                  facetValueContainer.appendTo(rightCol);
                }
                spanCount.appendTo(facetValueContainer);
                $(document.createTextNode(localizedValue)).appendTo(facetValueContainer);
            }
          });
          currObjInstance.rightBody.fadeIn('fast');
        });
      }
    },
    
    renderSelectedFacetValue: function(facetValue, localizedValue){
      var facetValueContainer = $(document.createElement('li'));
      var facetValueSpan = $(document.createElement('span'));
      var facetValueRemove = $(document.createElement('span'));
      
      facetValueContainer.attr('data-fctvalue', facetValue);
      facetValueSpan.attr('title', localizedValue);
      facetValueSpan.html(localizedValue);
      facetValueRemove.attr('title', this.field_RemoveButton);
      
      facetValueSpan.addClass('facet-value');
      facetValueRemove.addClass('facet-remove fr');
      
      facetValueSpan.appendTo(facetValueContainer);
      facetValueRemove.appendTo(facetValueContainer);
      facetValueContainer.appendTo(this.selectedItems);
      
      return facetValueContainer;
    },
    
    renderAddMoreFiltersButton: function(facetField){
        this.addMoreFilters = $(document.createElement('div'));
        var text = $(document.createElement('span'));
        var icon = $(document.createElement('span'));
        
        this.addMoreFilters.attr('data-fctname', facetField);
        text.html(this.field_AddMoreFiltersButtonTooltip);
        
        this.addMoreFilters.addClass('add-more-filters');
        icon.addClass('icon');
        
        text.appendTo(this.addMoreFilters);
        icon.appendTo(this.addMoreFilters);
        this.addMoreFilters.appendTo(this.facetLeftContainer);
        this.facetLeftContainer.find('.input-search-fct-container').appendTo(this.facetLeftContainer);
    },
    
    removeAddMoreFiltersButton: function(FacetFieldFilter , addMoreFiltersElement){
      addMoreFiltersElement.remove();
      this.resetFacetFieldFilter(FacetFieldFilter);
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
        }
      });
    },
    
    cleanNonJsStructures: function(){
      $('.facets-item >ul').remove();
    },
    
    close: function(){
      var currObjInstance = this;
      var oldMainElement = this.mainElement;
      var oldParentMainElement = this.parentMainElement;
      oldParentMainElement.find('.input-search-fct-container').hide('100', function(){
        if(oldParentMainElement.find('.flyout-left-container ul li').length > 0){
          oldParentMainElement.find('.add-more-filters').show('100');
        }else{
          currObjInstance.resetFacetFieldFilter(oldParentMainElement);
        }
      });
      oldParentMainElement.find('.flyout-right-container').hide('100', function(){
        oldParentMainElement.find('.flyout-right-container').remove();
      });
      this.fctManager.currentPage = 1;
      this.fctManager.currentOffset = 0;
      this.fctManager.currentFacetValuesSelected = new Array();
      this.opened = false;
    },
    
    resetFacetFieldFilter: function(element){
        element.fadeOut('fast',function(){
            element.removeClass('active');
            element.fadeIn('fast');
          });
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