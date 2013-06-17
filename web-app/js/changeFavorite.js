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

  function setFavorite(url, objId){
    
    alert("url = " + url + ", objId = " + objId);
    
    var request = $.ajax({
      type: 'GET',
      dataType: 'json',
      async: true,
      url: url+'&objId='+objId,
      
      complete: function(data) {
        var JSONresponse = jQuery.parseJSON(data.responseText);
        var elemFavoriteMrk = document.getElementsById("idFavoriteMrk").firstChild;
        if (elemFavoriteMrk) {
            elemFavoriteMrk.insertData(JSONresponse.results);
        }
        else {
            alert("Elemt 'idFavoriteMrk' not find.");
        }
      }
      
    });
  }