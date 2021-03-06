﻿/*
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
/// <reference path="/Scripts/jquery.carouFredSel-6.2.0-packed.js"/>
/// <reference path="/Scripts/jquery.dotdotdot-1.5.1.js"/>
$(document).ready(function() {
    $(function() {
        $('#form-search input[type="search"]').focus();
        $('div.carousel').show();
        if ($(".article .caption").length > 0) {
            $(".article .caption").dotdotdot({});
        }
        var carouselItems = $("#articles");
        if (carouselItems.length) {
            carouselItems.carouFredSel({
                scroll: 1,
                infinite: false,
                auto    : false,
                prev    : {
                    button : "#articles-prev",
                    key    : "left"
                },
                next    : { 
                    button  : "#articles-next",
                    key     : "right"
                }
            });
        }
    });
});
