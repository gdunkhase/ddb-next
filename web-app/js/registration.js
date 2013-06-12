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

  $("#registration-form").validate({

    rules:{
      fname:{
        required:true,
        minlength:2
      },
      lname:{
        required:true,
        minlength:2
      },
      email:{
        required:true,
        email: true
      },
      passwd:{
        required:true,
        minlength: 8
      },
      conpasswd:{
        required:true,
        equalTo: "#passwd"
      },
      errorClass: "help-inline"
    },
    messages: {

      fname: {
        required: $("#error-messages").children('li').eq(0).children('a').text(),
        minlength: $("#error-messages").children('li').eq(1).children('a').text()
      },
      lname: {
        required: $("#error-messages").children('li').eq(0).children('a').text(),
        minlength: $("#error-messages").children('li').eq(1).children('a').text()
      },
      email: {
        required: $("#error-messages").children('li').eq(0).children('a').text(),
        email: $("#error-messages").children('li').eq(3).children('a').text()
      },
      passwd: {
        required: $("#error-messages").children('li').eq(0).children('a').text(),
        minlength: $("#error-messages").children('li').eq(2).children('a').text()
      },
      conpasswd: {
        required: $("#error-messages").children('li').eq(0).children('a').text(),
        equalTo: $("#error-messages").children('li').eq(4).children('a').text()
      }

    }

  });

});