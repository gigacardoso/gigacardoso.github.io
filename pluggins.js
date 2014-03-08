// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
/*********************************************************************************************************

    JQUERY.ASCENSOR.JS
        VERSION: 1.5.2
        DATE: 21/10/2012

    INDEX
        1. PLUGIN DEFAULTS OPTIONS
        2. NODE OPTIONS DEFINITIONS
        3. SETTINGS
        4. START PLUGIN ACTION
        5. HASH FUNCTION
        6. RESIZE FONCTION
        7. SCROLLTO FONCTION
        8. KEYPRESS FUNCTION
        9. LINK FONCTION DEFINITION
        10. MOBILE ROTATION DETECTION
        11. WINDOW RESIZE EVENT
        12. WRAPPER AROUND PLUGIN

    check on :  - Chrome v22 
                - Safari v6.0.1
                - firefox 15.0.1
                - opera v12.02 
                - IE 8
                - IE9

                - Chrome mobile (IOS)
                - Safari mobile (IOS)

    Please, sand request/bug to contact@kirkas.ch

**********************************************************************************************************/


;(function ($, window, undefined) {


    /***********************************************************************
        1. PLUGIN DEFAULTS OPTION
    ********************************************************************** */
    var pluginName = 'ascensor',
        defaults = {
            AscensorName: "ascensor",               //  First, choose the ascensor name
            AscensorFloorName: "",                  //  Choose name for each floor
            ChildType: "div",                       //  Specify the child type if there are no 'div'
            
            WindowsOn: 1,                           //  Choose the floor to start on
            Direction: "y",                         //  specify if direction is x,y or chocolate
            AscensorMap: "",                        //  If you choose chocolate for direction, speficy position
            
            Time: "1000",                           //  Specify speed of transition
            Easing: "linear",                       //  Specify easing option
            
            KeyNavigation: true,                    //  choose if you want direction key support
            
            Queued:false,                           //  choose if you want direction scroll queued
            QueuedDirection:"x"                     //  choose if you want direction scroll queued "x" or "y" (default : "x")
        };
    
    
    /***********************************************************************
        2. NODE OPTIONS DEFINITIONS
    ***********************************************************************/
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    
    
    Plugin.prototype.init = function () {
        
        
        /***********************************************************************
            3. SETTINGS
        ***********************************************************************/
        
        //element settings
        var
            self = this,
            node = this.element,
            nodeChildren = $(node).children(self.options.ChildType),
            
            //floor counter settings
            floorActive = self.options.WindowsOn,
            floorCounter = 0,
            
            //height/width settings
            WW,
            WH,
            
            //plugins settings
            floorXY = self.options.AscensorMap.split(" & "),
            floorName = self.options.AscensorFloorName.split(" | "),
            direction = self.options.Direction,
            
            //hash 
            hash;
            
        
        /***********************************************************************
            4. START PLUGIN ACTION
        ***********************************************************************/
        
        //define position,height & width
        $(node)
            .css("position", "absolute")
            .width(WW)
            .height(WH);
            
        //define height & width
        $(nodeChildren)
            .width(WW)
            .height(WH)
            
            //for each floor
            .each(function () {
                
                //count floor
                floorCounter++;
                
                //give class and spcific id
                $(this)
                    .attr("id", self.options.AscensorName + "Floor" + floorCounter)
                    .addClass(self.options.AscensorName + "Floor");
            });
            
        // if direction is x or chocolate
        if(direction==="x" || direction==="chocolate"){
        
            //children position = absolute
            $(nodeChildren).css("position", "absolute");
        }
        
        
        
        
        /***********************************************************************
            5. HASH FUNCTION
        ***********************************************************************/
        function hashChange() {
        
            //if the url have an "hash"
            if ( window.location.hash ) {
            
                //cut the "#/" part
                hash = window.location.hash.split("/").pop();
                
                //for each floorName given
                $(floorName).each(function (index) {
                
                    //compare with the hash, if equal
                    if (hash === floorName[index]) {
                    
                        //the floor become the index of equivalent floorName
                        floorActive = index + 1;
                        
                        //remove and add class "link active" to the current link
                        $("." + self.options.AscensorName + "Link")
                            .removeClass(self.options.AscensorName + "LinkActive")
                            .eq(floorActive - 1)
                            .addClass(self.options.AscensorName + "LinkActive");
                            
                        //Scroll to the target floor
                        targetScroll(floorActive, self.options.Time);
                        
                    }
                    
                });
                
            }
            
        }
        
        //when hash change, start hashchange function
        $(window).on("hashchange", function () {
            hashChange();
        });
        
        //start hashChange function at document loading
        hashChange();
        
        
        /***********************************************************************
            6. RESIZE FONCTION
        ***********************************************************************/
        function elementResize() {
            
            //update WW & WH variables
            WW = $(window).width();
            WH = $(window).height();
            
            //node and node children get have window widht & height
            $(nodeChildren)
                .width(WW)
                .height(WH);
                
            $(node)
                .width(WW)
                .height(WH);
                
            //if direction is y
            if (direction === "y") {
            
                //stop animation and update node scrollTop
                $(node)
                    .stop()
                    .scrollTop((floorActive - 1) * WH);
            }
            
            //if direction is x
            if (direction === "x") {
            
                //stop animation and update scrollLeft
                $(node)
                    .stop()
                    .scrollLeft((floorActive - 1) * WW);
                
                //deplace each children depending on index and left margin
                $(nodeChildren).each(function (index) {
                    $(this).css("left", index * WW);
                });
            }
            
            //if direction is chocolate
            if (direction === "chocolate") {
            
                // get current floor axis axis info
                var target = floorXY[floorActive - 1].split("|");
                
                //for each children
                $(nodeChildren).each(function (index) {
                    
                    //get equivalent axis info
                    var CoordName = floorXY[index].split("|");
                    
                    //deplace each children in x/y, depending on the index position
                    $(this).css({
                        "left": (CoordName[1] - 1) * WW,
                        "top": (CoordName[0] - 1) * WH
                    }); 
                    
                });
                
                //stop animation and update scrollLeft & scrollTop
                $(node)
                    .stop()
                    .scrollLeft((target[1] - 1) * WW)
                    .scrollTop((target[0] - 1) * WH);
            }
        }
        
        //bind to resize
        $(window)
            .resize(function(){elementResize();})
            .load(function(){elementResize();})
            .resize();
            
        //if browser is mobile
        if (window.DeviceOrientationEvent) {

            //add orientation check
            $(window).bind('orientationchange', function(){elementResize();});
        }
        
                
        /***********************************************************************
            7. SCROLLTO FONCTION
        ***********************************************************************/
        function targetScroll(floor, time) {
            
            //if direction is y
            if (direction === "y") {
            
                //stop animation and animate the "scrollTop" to the targeted floor
                $(node)
                    .stop()
                    .animate(
                        {scrollTop: (floor - 1) * WH},
                        time,
                        self.options.Easing
                    );
            }
            
            //if direction is x
            if (direction === "x") {
            
                //stop animation and animate the "scrollLeft" to the targeted floor
                $(node)
                    .stop()
                    .animate(
                        {scrollLeft: (floor - 1) * WW},
                        time,
                        self.options.Easing
                    );
            }
            
        
            //if direction is chocolate
            if (direction === "chocolate") {
            
                //get target axis
                var target = floorXY[floor - 1].split("|");
                
                //if queued options is true
                if(self.options.Queued){
                
                    //queued direction is "x"
                    if(self.options.QueuedDirection==="x"){
                    
                        //if target is on the same horizontal level
                        if($(node).scrollLeft()===(target[1] - 1) * WW){
                        
                            //stop animation and animate the "scrollTop" to the targeted floor
                            $(node)
                                .stop()
                                .animate(
                                    {scrollTop: (target[0] - 1) * WH},
                                    time,
                                    self.options.Easing
                                );
                                
                        //if target is not on the same level
                        }else{
                        
                            //stop animation, first  animate the "scrollLeft" to the targeted floor
                            $(node)
                                .stop()
                                .animate(
                                    {scrollLeft: (target[1] - 1) * WW},
                                    time,
                                    self.options.Easing,
                                    
                                    //and then animate the "scrollTop" to the targeted floor
                                    function(){
                                        $(node)
                                            .stop()
                                            .animate(
                                                {scrollTop: (target[0] - 1) * WH},
                                                time,
                                                self.options.Easing
                                            );
                                    }
                                );
                        }
                        
                    //if queued direction is set on y
                    }else if(self.options.QueuedDirection==="y"){
                    
                        //if target is on the same vertical level
                        if($(node).scrollTop()===(target[0] - 1) * WH){
                        
                            //stop animation and animate the "scrollLeft" to the targeted floor
                            $(node)
                                .stop()
                                .animate(
                                    {scrollLeft: (target[1] - 1) * WW},
                                    time,
                                    self.options.Easing
                                );
                        
                        //if target is not on the same vertical level
                        }else{
                        
                            //stop animation, first  animate the "scrollTop" to the targeted floor
                            $(node)
                                .stop()
                                .animate(
                                    {scrollTop: (target[0] - 1) * WH},
                                    time,
                                    self.options.Easing,
                                    
                                    //and then animate the "scrollLeft" to the targeted floor
                                    function(){
                                        $(node)
                                            .stop()
                                            .animate(
                                                {scrollLeft: (target[1] - 1) * WW},
                                                time,
                                                self.options.Easing
                                            );
                                    }
                            );
                        }
                                        
                    }
                
                //if queued option is false
                }else{
                
                    //stop animation,  animate the "scrollLeft" & "scrollTop" to the targeted floor
                    $(node)
                        .stop()
                        .animate(
                            {
                                scrollLeft: (target[1] - 1) * WW,
                                scrollTop: (target[0] - 1) * WH
                            },
                            time,
                            self.options.Easing
                        );
                }
                
                
            }
            
            //if floor name string has been defined
            if (self.options.AscensorFloorName !== null) {
            
                //update url hash
                window.location.hash = "/" + floorName[floor - 1];
            }
            
            //remove linkActive class on every link
            $("." + self.options.AscensorName + "Link").removeClass(self.options.AscensorName + "LinkActive");
            
            //add LinkActive class to equivalent Link
            $("." + self.options.AscensorName + "Link" + floor).addClass(self.options.AscensorName + "LinkActive");
            
            //update floorActive variable
            floorActive = floor;
        }
        
        //scroll to active floor at start
        targetScroll(floorActive, 1);
        
        
        /***********************************************************************
            8. KEYPRESS FUNCTION
        ***********************************************************************/
        function navigationPress(addCoordY, addCoordX) {
            
            //if direction is y
            if (direction === "y") {
            
                //if keydown
                if (addCoordY === 1 && addCoordX === 0) {
                    
                    //if smaller or equal to floor number
                    if (floorActive + 1 < floorCounter || floorActive + 1 === floorCounter) {
                    
                        //go to next floor
                        targetScroll(floorActive + 1, self.options.Time);
                    }
                }
                
                //if keyup
                if (addCoordY === -1 && addCoordX === 0) {
                
                    //if bigger than one or equal one
                    if (floorActive - 1 > 1 || floorActive - 1 === 1) {
                    
                        //scroll to previous floor
                        targetScroll(floorActive - 1, self.options.Time);
                    }
                }
            }
            
            //if direction is x
            if (direction === "x") {
            
                //if  keyleft
                if (addCoordY === 0 && addCoordX === -1) {
                
                    //if bigger than one or equal one
                    if (floorActive - 1 > 1 || floorActive - 1 === 1) {
                    
                        //go to next floor
                        targetScroll(floorActive - 1, self.options.Time);
                    }
                }
                
                //if keyright
                if (addCoordY === 0 && addCoordX === 1) {
                
                    //if smaller or equal to floor number
                    if (floorActive + 1 < floorCounter || floorActive + 1 === floorCounter) {
                    
                        //go to next floor
                        targetScroll(floorActive + 1 , self.options.Time);
                    }
                }
            }
            
            //if direction is chocolate
            if (direction === "chocolate") {
            
                //get floor reference
                var floorReference = floorXY[floorActive - 1].split("|");
                
                //for each floor
                $.each(floorXY, function (index) {
                    
                    //if there is a floor equivalent to the target
                    if (floorXY[index] === (parseInt(floorReference[0], 10) + addCoordY) + "|" + (parseInt(floorReference[1], 10) + addCoordX)) {
                    
                        //go the this floor
                        targetScroll(index + 1, self.options.Time);
                    }
                });
            }
        }
        
        //check key function
        function checkKey(e) {
            switch (e.keyCode) {
            case 40:
                //keyDown
                navigationPress(1, 0);
                break;
            case 38:
                
                //keyUp
                navigationPress(-1, 0);
                break;
            case 37:
            
                //keyLeft
                navigationPress(0, - 1);
                break;
            case 39:
            
                //keyRight
                navigationPress(0, 1);
                break;
            }
        }   

        //if key navigation is true
        if (self.options.KeyNavigation) {
        
            //if browser is mozilla
            if ($.browser.mozilla) {
            
                //use keypress
                $(document).keypress(checkKey);
                
            //for all brother
            } else {
            
                //use keydown
                $(document).keydown(checkKey);
            }
        }
        
        
        /***********************************************************************
            9. LINK FONCTION DEFINITION
        ***********************************************************************/
        
        //on ascensor link click
        $("." + self.options.AscensorName + "Link").on("click", function () {
        
            //look for the second class and split the number
            var floorReference = $(this).attr("class");
                floorReference = floorReference.split(" ");
                floorReference = floorReference[1];
                floorReference = floorReference.split(self.options.AscensorName + "Link");
                floorReference = parseInt(floorReference[1], 10);
                
            //target the floor number
            targetScroll(floorReference, self.options.Time);
        });
        
        //on ascensor prev link click
        $("." + self.options.AscensorName + "LinkPrev").on("click", function () {
            
            //soustract one to current floor
            floorActive = floorActive-1;
            
            //if smaller than 1
            if (floorActive < 1) {
            
                //get last floor(remove if you don't want a loop) and add: floorActive=1;
                floorActive = floorCounter;
            }
            
            //target floor number
            targetScroll(floorActive, self.options.Time);
        });
        
        
        //on ascensor next click
        $("." + self.options.AscensorName + "LinkNext").on("click", function () {
        
            //add one to current floor
            floorActive=floorActive+1;
        
            //if bigger than floor total
            if (floorActive > floorCounter) {
            
                //floor = first one (remove if you don't want a loop) and add: floorActive=floorCounter;
                floorActive = 1;
            }
            
            //target floor number
            targetScroll(floorActive, self.options.Time);
        });
        
    //end plugin action
    };
    
    
    /***********************************************************************
        12. WRAPPER AROUND PLUGIN
    ***********************************************************************/
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery, window));
/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);
//EASING
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright � 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright � 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

/*! Backstretch - v2.0.3 - 2012-11-30
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT */
(function(e,t,n){"use strict";e.fn.backstretch=function(r,s){return(r===n||r.length===0)&&e.error("No images were supplied for Backstretch"),e(t).scrollTop()===0&&t.scrollTo(0,0),this.each(function(){var t=e(this),n=t.data("backstretch");n&&(s=e.extend(n.options,s),n.destroy(!0)),n=new i(this,r,s),t.data("backstretch",n)})},e.backstretch=function(t,n){return e("body").backstretch(t,n).data("backstretch")},e.expr[":"].backstretch=function(t){return e(t).data("backstretch")!==n},e.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5e3,fade:0};var r={wrap:{left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},img:{position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxWidth:"none",zIndex:-999999}},i=function(n,i,o){this.options=e.extend({},e.fn.backstretch.defaults,o||{}),this.images=e.isArray(i)?i:[i],e.each(this.images,function(){e("<img />")[0].src=this}),this.isBody=n===document.body,this.$container=e(n),this.$wrap=e('<div class="backstretch"></div>').css(r.wrap).appendTo(this.$container),this.$root=this.isBody?s?e(t):e(document):this.$container;if(!this.isBody){var u=this.$container.css("position"),a=this.$container.css("zIndex");this.$container.css({position:u==="static"?"relative":u,zIndex:a==="auto"?0:a,background:"none"}),this.$wrap.css({zIndex:-999998})}this.$wrap.css({position:this.isBody&&s?"fixed":"absolute"}),this.index=0,this.show(this.index),e(t).on("resize.backstretch",e.proxy(this.resize,this)).on("orientationchange.backstretch",e.proxy(function(){this.isBody&&t.pageYOffset===0&&(t.scrollTo(0,1),this.resize())},this))};i.prototype={resize:function(){try{var e={left:0,top:0},n=this.isBody?this.$root.width():this.$root.innerWidth(),r=n,i=this.isBody?t.innerHeight?t.innerHeight:this.$root.height():this.$root.innerHeight(),s=r/this.$img.data("ratio"),o;s>=i?(o=(s-i)/2,this.options.centeredY&&(e.top="-"+o+"px")):(s=i,r=s*this.$img.data("ratio"),o=(r-n)/2,this.options.centeredX&&(e.left="-"+o+"px")),this.$wrap.css({width:n,height:i}).find("img:not(.deleteable)").css({width:r,height:s}).css(e)}catch(u){}return this},show:function(t){if(Math.abs(t)>this.images.length-1)return;this.index=t;var n=this,i=n.$wrap.find("img").addClass("deleteable"),s=e.Event("backstretch.show",{relatedTarget:n.$container[0]});return clearInterval(n.interval),n.$img=e("<img />").css(r.img).bind("load",function(t){var r=this.width||e(t.target).width(),o=this.height||e(t.target).height();e(this).data("ratio",r/o),e(this).fadeIn(n.options.speed||n.options.fade,function(){i.remove(),n.paused||n.cycle(),n.$container.trigger(s,n)}),n.resize()}).appendTo(n.$wrap),n.$img.attr("src",n.images[t]),n},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(this.index===0?this.images.length-1:this.index-1)},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this.next(),this},cycle:function(){return this.images.length>1&&(clearInterval(this.interval),this.interval=setInterval(e.proxy(function(){this.paused||this.next()},this),this.options.duration)),this},destroy:function(n){e(t).off("resize.backstretch orientationchange.backstretch"),clearInterval(this.interval),n||this.$wrap.remove(),this.$container.removeData("backstretch")}};var s=function(){var e=navigator.userAgent,n=navigator.platform,r=e.match(/AppleWebKit\/([0-9]+)/),i=!!r&&r[1],s=e.match(/Fennec\/([0-9]+)/),o=!!s&&s[1],u=e.match(/Opera Mobi\/([0-9]+)/),a=!!u&&u[1],f=e.match(/MSIE ([0-9]+)/),l=!!f&&f[1];return!((n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1||n.indexOf("iPod")>-1)&&i&&i<534||t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]"||u&&a<7458||e.indexOf("Android")>-1&&i&&i<533||o&&o<6||"palmGetResource"in t&&i&&i<534||e.indexOf("MeeGo")>-1&&e.indexOf("NokiaBrowser/8.5.0")>-1||l&&l<=6)}()})(jQuery,window);