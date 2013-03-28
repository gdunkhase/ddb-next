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
$(document).ready(function() {
  $('.object-controls .page-link').click(function(event){
    if(event.which==1){
      event.preventDefault();
      var linkForContent = $(document.createElement('input'));
      linkForContent.attr('value',window.location.protocol + "//" + window.location.host+$(this).attr('href'));
      linkForContent.attr('type', 'text');
      var title = $(document.createElement('div'));
      title.addClass('page-link');
      title.html(messages.ddbnext.CulturalItem_LinkToThisPage_Label);
      openModalDialog(title,linkForContent);
      $('.modal-dialog-content').find('input')[0].select();
    }
  });
});

function openModalDialog(title,content){
  var body = $('body');
  var modalDialogOverlay = $(document.createElement('div'));
  var modalDialogWrapper = $(document.createElement('div'));
  var modalDialogFooter = $(document.createElement('div'));
  var modalDialogCloseButton = $(document.createElement('a'));
  
  modalDialogOverlay.addClass('modal-dialog-overlay');
  modalDialogWrapper.addClass('modal-dialog-wrapper');
  modalDialogFooter.addClass('modal-dialog-footer');
  modalDialogCloseButton.addClass('button');
  
  if(title){
    var modalDialogTitle = $(document.createElement('div'));
    modalDialogTitle.addClass('modal-dialog-title bb');
    modalDialogTitle.html(title);
    modalDialogTitle.appendTo(modalDialogWrapper);
  }
  
  if(content){
    var modalDialogContent = $(document.createElement('div'));
    modalDialogContent.addClass('modal-dialog-content');
    content.appendTo(modalDialogContent);
    modalDialogContent.appendTo(modalDialogWrapper);
  }
  
  modalDialogCloseButton.attr('href','#');
  modalDialogCloseButton.html(messages.ddbnext.BinaryViewer_Lightbox_CloseButton_Title);
  
  modalDialogCloseButton.appendTo(modalDialogFooter);
  modalDialogFooter.appendTo(modalDialogWrapper);
  modalDialogWrapper.appendTo(modalDialogOverlay);
  modalDialogOverlay.appendTo(body);
  
  body.css('overflow','hidden');
  
  modalDialogCloseButton.click(function(){
    modalDialogOverlay.fadeOut('fast',function(){
      body.css('overflow','auto');
      modalDialogOverlay.remove();
    });
  });
  
  return false;
}
