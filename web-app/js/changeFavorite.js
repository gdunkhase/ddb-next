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

  $("#idFavorite").parent().click(function(event) {
    event.preventDefault();
    changeFavoriteState(this.href);
    return false;
    
  });
  
  function changeFavoriteState(url) {
    var jElemFavorite = $("#idFavorite");
    var vActn = jElemFavorite.attr("data-actn");
    var url = jsContextPath + "/apis/favorites/" + jElemFavorite.attr("data-itemid") + '/?reqType=ajax';
    var request = $.ajax({
      type: vActn,
      dataType: 'json',
      async: true,
      url: url + (vActn=="DELETE" ? "&reqActn=del" : "&reqActn=add"),
      complete: function(data) {
        if (vActn=="POST") {
          addToFavorites(data);
        }
        else if (vActn=="DELETE") {
          delFromFavorites(data);
        }
        else {
          alert("Method not found...");
        }
      }
    });
  }
  
  function addToFavorites(data) {
    //alert("addToFavorites: status = " + data.status);
    var jElemFavorite = $("#idFavorite");
    switch (data.status) {
      case 200: case 201:
        // -- success
        //var JSONresponse = jQuery.parseJSON(data.responseText);
        jElemFavorite.attr("data-actn", "DELETE");
        jElemFavorite.parent().removeClass("favorite-add");
        jElemFavorite.parent().addClass("favorite-selected");
        break;
      case 400:
        // -- bad request
        break;
      case 401:
        // -- handle unauthorized
        break;
      case 500:
        // -- internal error
        aler("Internal Server Error");
        break;
      default:
        // -- bad response
        alert("Bad response: status: " + data.status);
        break;
    }
  }
  
  function delFromFavorites(data) {
    //alert("delToFavorites: status = " + data.status);
    var jElemFavorite = $("#idFavorite");
    switch (data.status) {
      case 200: case 204:
        // -- success
        //var JSONresponse = jQuery.parseJSON(data.responseText);
        jElemFavorite.attr("data-actn", "POST");
        jElemFavorite.parent().removeClass("favorite-selected");
        jElemFavorite.parent().addClass("favorite-add");
        break;
      case 401:
        // -- handle unauthorized
        break;
      case 404:
        // -- not found
        break;
      case 500:
        // -- internal error
        aler("Internal Server Error");
        break;
      default:
        // -- bad response
        alert("Bad response: status: " + data.status);
        break;
    }
  }
  
  function changeFavorite(url) {
    //url = url + '&reqType=ajax';
    var jElemFavorite = $("#idFavorite");
    //var url = jsContextPath + "/apis/favorites/" + jElemFavorite.attr("data-itemid") + '/changeItemState?reqActn=add&reqType=ajax';
    var url = jsContextPath + "/apis/favorites/" + jElemFavorite.attr("data-itemid") + '/?reqActn=add&reqType=ajax';
    //alert("url = " + url);
    //alert("Method: " + jElemFavorite.attr("data-actn"));
    var request = $.ajax({
      type: jElemFavorite.attr("data-actn"),
      dataType: 'json',
      async: true,
      url: url,
      complete: function(data) {
        //alert("data.responseText = " + data.responseText);
        var JSONresponse = jQuery.parseJSON(data.responseText);
        //alert("JSONresponse.favStatus = " + JSONresponse.favStatus);
        //var elemFavorite = document.getElementById("idFavorite");
        var jElemFavorite = $("#idFavorite");
        if (jElemFavorite == null) {
            alert("Elemt 'idFavorite' not find!");
        }
        if (JSONresponse && jElemFavorite) {
            if (JSONresponse.favStatus == 0) {
                //elemFavorite.style.color = 'silver';
                jElemFavorite.css("color","silver");
                //elemFavorite.parent.style.backgroundPosition = "-2px -0px";
                jElemFavorite.attr("data-actn", "GET");
                jElemFavorite.parent().removeClass("favorite-selected");
                jElemFavorite.parent().removeClass("favorite-add");
                jElemFavorite.parent().css("backgroundPosition","-2px -0px");
            }
            else if (JSONresponse.favStatus == 1) {
                //elemFavorite.style.color = 'green';
                jElemFavorite.css("color","green");
                //elemFavorite.parent.style.backgroundPosition = "-2px -80px";
                //jElemFavorite.parent().css("backgroundPosition","-2px -80px");
                jElemFavorite.attr("data-actn", "POST");
                jElemFavorite.parent().removeClass("favorite-selected");
                jElemFavorite.parent().addClass("favorite-add");
            }
            else if (JSONresponse.favStatus == 2) {
                //elemFavorite.style.color = 'red';
                jElemFavorite.css("color","red");
                //elemFavorite.parent.style.backgroundPosition = "-2px -140px";
                //jElemFavorite.parent().css("backgroundPosition","-2px -140px");
                jElemFavorite.attr("data-actn", "DELETE");
                jElemFavorite.parent().removeClass("favorite-add");
                jElemFavorite.parent().addClass("favorite-selected");
            }
        }
      }
    });
    
  }
  
