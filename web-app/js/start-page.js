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
/// <reference path="/Scripts/jquery.carouFredSel-6.2.0-packed.js"/>
/// <reference path="/Scripts/jquery.dotdotdot-1.5.1.js"/>
$(document).ready(function() {
	$(function() {
		$('div.carousel').show();
		$(".article .caption").dotdotdot({});
		var carouselItems = $("#articles");
		if (carouselItems.length) {
			carouselItems.carouFredSel({
				auto : {
					items : 1,
					duration: 1000,
					easing : "linear",
					timeoutDuration : 0
				}
			}).trigger("pause");
	
			$("#articles-prev").hover(function() {
				carouselItems.trigger("configuration", [ "direction", "right" ]);
				carouselItems.trigger("play");
			}, function() {
				carouselItems.trigger("pause");
			}).click(function() {
				return false;
			});
	
			$("#articles-next").hover(function() {
				carouselItems.trigger("configuration", [ "direction", "left" ]);
				carouselItems.trigger("play");
			}, function() {
				carouselItems.trigger("pause");
			}).click(function() {
				return false;
			});
		}
	});
});
