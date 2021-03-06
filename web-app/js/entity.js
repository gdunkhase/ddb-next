/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(document).ready(function(){
  
  if(jsPageName == "entity"){
  
    var defaultRowCount = 4;

    var offset = parseInt(getUrlParam("offset"));
    if(!offset) {
      offset = 0;
    }
    
    var query = $("#entity-title").html();
    var History = window.History;
    var urlParameters = "?query="+query+"&offset="+offset+"&rows="+defaultRowCount;
    History.pushState("", document.title, decodeURI(urlParameters));  
    
    $(".preview-item-previous").click(function(event){
      event.preventDefault();
  
      var currentOffset = parseInt(getUrlParam("offset"));
      if(!currentOffset) {
        currentOffset = 0;
      }
  
      var currentRows = parseInt(getUrlParam("rows"));
      if(!currentRows) {
        currentRows = defaultRowCount;
      }
      
      if(currentOffset > 0){
        currentOffset = currentOffset - currentRows;
      }
      if(currentOffset < 0) {
        currentOffset = 0;
      }
  
      var currentQuery = getUrlParam("query");
      if(!currentQuery){
        currentQuery = "*"
      }
      
      var History = window.History;
      var urlParameters = "?query="+currentQuery+"&offset="+currentOffset+"&rows="+currentRows;
      History.pushState("", document.title, decodeURI(urlParameters));
      
  
      getNewSearchResults(currentQuery, currentOffset, currentRows);
      
      
    });
  
    $(".preview-item-next").click(function(event){
      event.preventDefault();
  
      var currentOffset = parseInt(getUrlParam("offset"));
      if(!currentOffset) {
        currentOffset = 0;
      }
  
      var currentRows = parseInt(getUrlParam("rows"));
      if(!currentRows) {
        currentRows = defaultRowCount;
      }
      
      if(currentOffset >= 0){
        currentOffset = currentOffset + currentRows;
      }
      if(currentOffset < 0) {
        currentOffset = 0;
      }
      
      var currentQuery = getUrlParam("query");
      if(!currentQuery){
        currentQuery = "*"
      }
  
      var History = window.History;
      var urlParameters = "?query="+currentQuery+"&offset="+currentOffset+"&rows="+currentRows;
      History.pushState("", document.title, decodeURI(urlParameters));
      
      getNewSearchResults(currentQuery, currentOffset, currentRows);
    });
  
    function getNewSearchResults(query, offset, rows){
      var request = $.ajax({
        type: 'GET',
        dataType: 'json',
        async: true,
        url: jsContextPath+'/entity/ajax/searchresults?query='+query+'&offset='+offset+'&rows='+rows,
        complete: function(data){
          var jsonResponse = $.parseJSON(data.responseText);
          
          var itemContainer = $(".preview-item-container");
          itemContainer.empty();
          itemContainer.html(jsonResponse.html);
          
        }
      });
      
    }
    
    function getUrlParam(name){
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.hash);
      
      if(results == null) {
        results = regex.exec(window.location.search);
      }
      
      if(results == null) {
        return "";
      }else{
        return decodeURIComponent(results[1].replace(/\+/g, " "));
      }
    }
  }
});