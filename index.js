var value = 0
$("#image").rotate({ 
   bind: 
     { 
        hover: function(){
            value +=360;
            $(this).rotate({ animateTo:value})
        }
     } 
   
});