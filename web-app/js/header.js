$(".widget").mouseenter(function() {
        $(".navigation > li").hover(function(){
          $(".navigation li").removeClass("active");
          $(this).addClass("active");
        });
      }).mouseleave(function(){
           $(".navigation li").removeClass("active");
         });