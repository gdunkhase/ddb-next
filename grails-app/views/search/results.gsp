<g:set var="facetsList" value="${['time_fct', 'place_fct', 'affiliate_fct', 'keywords_fct', 'language_fct', 'type_fct', 'sector_fct', 'provider_fct']}"></g:set>
<html>
<head>
<title><%=title%></title>
<meta name="author" content="${author}" />
<meta name="keywords" content="${keywords}" />
<meta name="robots" content="${robots}" />
<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'results.css')}" />
<script>
window.onload=function(){
  $('.results-paginator-options').removeClass('off');
  $('.results-paginator-view').removeClass('off');
  
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
    imgLoader.src = "${resource(dir: 'images/icons', file: 'loader_small.gif')}";
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
          $('.pages-overall-index').html(JSONresponse.pagesOverallIndex);
          $('#results-total').html(JSONresponse.numberOfResults);
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

    facetsEndPoint: '/facets',
    currentOffset: 0,
    currentRows: 11,
    currentFacetField: null,
    currentFacetValuesSelected: new Array(),

    init: function(){
    },

    fetchFacetValues: function(flyoutWidget){
        var oldParams = this.getUrlVars();
        var currObjInstance = this;
        var fctValues = "";
        var resp = new Array();
        if(oldParams['facetValues%5B%5D']){
          $.each(oldParams['facetValues%5B%5D'], function(key, value){
            fctValues = (value.indexOf(currObjInstance.currentFacetField)>=0)?fctValues:fctValues+'&facetValues%5B%5D='+value;
          });
        }
        flyoutWidget.renderFacetLoader();
        var request = $.ajax({
            type: 'GET',
            dataType: 'json',
            async: true,
            url: this.facetsEndPoint+'?name='+this.currentFacetField+'&searchQuery='+oldParams['query']+fctValues+'&offset='+this.currentOffset+'&rows='+this.currentRows,
            complete: function(data){
                flyoutWidget.renderFacetValues(jQuery.parseJSON(data.responseText));
            }
        });
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
    currentPage: 0,
    fctManager: new FacetsManager(),

    facetLeftContainer: null,
    facetRightContainer:null,
    rightBody: null,
    

    //i18n variables
    
    field_MostRelevant: '<g:message code="ddbnext.Most_relevant"/>',
    field_AddMoreFiltersButtonTooltip: '<g:message code="ddbnext.Add_More_Filters_ButtonTooltip"/>',
    field_SearchResultsFacetValueNext: '<g:message code="ddbnext.SearchResultsFacetValue_Next"/>',
    field_SearchResultsFacetValuePrevious: '<g:message code="ddbnext.SearchResultsFacetValue_Previous"/>',
    field_Page: '<g:message code="ddbnext.Page"/>',
    field_RemoveSelectedItem: '<g:message code="ddbnext.Remove_selected_item"/>',
    field_RemoveButton: '<g:message code="ddbnext.Remove_Button"/>',
    
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
        
        this.facetRightContainer.addClass('flyout-right-container');
        this.facetRightContainer.hide();
        rightHead.addClass('flyout-right-head');
        this.rightBody.addClass('flyout-right-body');
        
        this.facetRightContainer.appendTo(this.mainElement.parent());
        rightHead.appendTo(this.facetRightContainer);
        this.rightBody.appendTo(this.facetRightContainer);
        
        rightHead.html(this.field_MostRelevant);

        this.parentMainElement.fadeIn('fast');
        this.facetRightContainer.fadeIn('fast');
        this.parentMainElement.find('.input-search-fct-container').fadeIn('fast');
        //this.parentMainElement.find('.input-search-fct-container').show('100');
    },
    renderFacetValues: function(facetValues){
        var currObjInstance = this;
        var leftCol = $(document.createElement('div'));
        var rightCol = $(document.createElement('div'));

        this.rightBody.empty();
        
        leftCol.addClass('left-col');
        rightCol.addClass('right-col');

        leftCol.appendTo(this.rightBody);
        rightCol.appendTo(this.rightBody);
        
        if(facetValues.type == this.fctManager.currentFacetField){
          if(facetValues.values.length > 5){
            this.rightBody.addClass('body-extender');
          }
          $.each(facetValues.values, function(index){
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
    renderFacetLoader: function(){
      this.rightBody.empty();
      var imgLoader = document.createElement('img');
      imgLoader.src = "${resource(dir: 'images/icons', file: 'loader_small.gif')}";
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
</script>
</head>
<body>
  <div class="row search-results-container">
  
    <div class="span3 facets-container hidden-phone">
      <div class="facets-head">
        <h3><g:message code="ddbnext.SearchResultsFacetHeading_Filter_Results" /></h3>
        <span class="contextual-help" title="" data-content='<g:message code="ddbnext.SearchResultsFacetHeading_TooltipContent" />'>
      </div>
      <div class="facets-list bt bb">
        <g:each in="${facetsList}" var="mit">
          <g:each in="${(results.facets)}">
            <g:if test="${mit == it.field}">
              <div class="facets-item ${(it.facetValues.size() > 0)?'active':'' } bt bb bl br">
                <a class="h3" href="${facets.mainFacetsUrl[it.field]}" data-fctName="${it.field}"><g:message code="ddbnext.facet_${it.field}" /></a>
                <g:if test="${it.facetValues.size() > 0}">
                  <ul class="unstyled">
                    <g:facetListRender facetValues="${facets.subFacetsUrl[it.field]}" facetType="${it.field}"></g:facetListRender>
                  </ul>
                </g:if>
              </div>
            </g:if>
          </g:each>
        </g:each>
      </div>
      <a href="${clearFilters}" class="clear-filters button" ><g:message code="ddbnext.Clear_filters"/></a>
    </div>
    
    <div class="span9 search-results-content">
    
      <g:resultsPaginatorOptionsRender paginatorData="${resultsPaginatorOptions}"></g:resultsPaginatorOptionsRender>
      
      <g:pageInfoNavRender navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: numberOfResultsFormatted, pagesOverallIndex: pagesOverallIndex, paginationURL: paginationURL]}"></g:pageInfoNavRender>
      
      <div class="row">
        <div class="span9">
          <div class="results-paginator-view off">
            <div class="group-actions">
              <input id="thumbnail-filter" type="checkbox" <g:if test='${isThumbnailFiltered == 'true'}'>checked</g:if>>
              <label for="thumbnail-filter" title="<g:message code="ddbnext.Show_items_with_thumbnails" />"><g:message code="ddbnext.Show_items_with_thumbnails" /></label>
              <input id="toggle-cluster" type="checkbox">
              <label for="toggle-cluster" title="<g:message code="ddbnext.View_as_Cluster" />"><g:message code="ddbnext.View_as_Cluster" /></label>
            </div>
            <div class="view-type-switch">
              <button id="view-list" type="button" class="<g:if test='${viewType != 'grid'}'>selected</g:if>" title="<g:message code="ddbnext.View_as_List" />"><g:message code="ddbnext.View_as_List" /></button>
              <button id="view-grid" type="button" class="<g:if test='${viewType == 'grid'}'>selected</g:if>" title="<g:message code="ddbnext.View_as_Grid" />"><g:message code="ddbnext.View_as_Grid" /></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span9">
          <div class="search-results">
            <g:if test="${results}">
              <g:itemResultsRender results="${results.results["docs"]}"></g:itemResultsRender>
            </g:if>
          </div>
        </div>
      </div>
      
      <g:pageInfoNavRender navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: numberOfResultsFormatted, pagesOverallIndex: pagesOverallIndex, paginationURL:paginationURL]}"></g:pageInfoNavRender>
      
    </div>
  </div>
</body>
</html>