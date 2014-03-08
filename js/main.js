jQuery.noConflict();    
"use strict";
    //Store Variables 
    var desktopNav, arrows, proccessInnovation, newsEvents, media, contactUs, participate, distillery, home, starward, workWithUs, buyOurWhisky, ourHistory, ourTeam, url;
    desktopNav = jQuery('#navigationMap');
    arrows = jQuery('.arrow');
    proccessInnovation = "process_and_innovation";
    newsEvents = "news_and_events";
    media = "media";
    contactUs = "contact_us";
    participate = "participate";
    distillery = "distillery";
    home = "home";
    starward = "starward";
    workWithUs = "work_with_us";
    buyOurWhisky = "buy_our_whisky";
    ourHistory = "our_history";
    ourTeam = "our_team";
    url = location.href;
    jQuery(window).bind("load", function () {
        //hideloader function is based on the code used on starmatic
        jQuery('#loader').fadeTo(1500, 0, 'easeInOutCubic', function () {
            jQuery(this).remove(); //Remove loader
            checkPageAndRunFunction(); //Run page functions
        });
    });
    // Send tracks to Google Analytics
    jQuery(window).hashchange(function () {
        _gaq.push(['_trackPageview',location.pathname + location.search  + location.hash]);
    });
    jQuery(document).ready(function () {
        // Trigger hashchange
        jQuery(window).hashchange();
        //Enable Ascensor
        jQuery('#ascensorBuilding').ascensor({
            AscensorName: 'ascensor',
            ChildType: 'section',
            PrevNext: true,
            AscensorFloorName: 'starward | home | distillery | our_history | our_team | process_and_innovation | participate | buy_our_whisky | work_with_us | news_and_events | contact_us | media',
            Time: 700,
            WindowsOn: 2,
            Direction: 'chocolate',
            AscensorMap: '1|1 & 2|1 & 3|1 & 3|2 & 3|3 & 3|4 & 4|1 & 4|2 & 4|3 & 4|4 & 5|1 & 5|2',
            Easing: 'easeInOutCubic',
            KeyNavigation: true,
            Queued: false
        });
        if (window.location.href.indexOf(home) > -1) {
            //Hide Navigation Both Desktop & Mobile
            desktopNav.hide();
        }
        jQuery(window).hashchange(function() {
            //Check page
            checkPageAndRunFunction();
        });
        //Stretch background images
        jQuery(".bg2").backstretch("http://newworldwhisky.com.au/wp-content/themes/nww/img/bg2.jpg");
        jQuery(".bg5").backstretch("http://newworldwhisky.com.au/wp-content/themes/nww/img/bg5.jpg");
        jQuery(".bg6").backstretch("http://newworldwhisky.com.au/wp-content/themes/nww/img/bg6.jpg");
        //Fetch canvas script if browser supports Modernizr & on home page or 404 page 
        if ((Modernizr.canvas) && (jQuery("body").hasClass('home')) ||( Modernizr.canvas ) && (jQuery("body").hasClass('error404') )) {
            getCanvasScript();
        }
        // Highlight Landing Page, Top and Bottom sections
        highlight('#top', '.topTitle');
        highlight('#bottom', '.bottomTitle');
        //Placeholder text for inputs so that it will show on old browsers
        if(!Modernizr.input.placeholder){
            jQuery('[placeholder]').focus(function() {
              var input = jQuery(this);
              if (input.val() === input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = jQuery(this);
            if (input.val() === '' || input.val() === input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
        jQuery('[placeholder]').parents('form').submit(function() {
            jQuery(this).find('[placeholder]').each(function() {
                var input = jQuery(this);
                if (input.val() === input.attr('placeholder')) {
                    input.val('');
                }
            });
        });
    }
    });//End Of Document Ready Function
    function checkPageAndRunFunction () {
        if (window.location.href.indexOf(home) > -1) {
            //Hide Navigation Both Desktop & Mobile
            hideAllNavigation();
        } else if (window.location.href.indexOf(starward) > -1) {
            showDesktopNavigation();
            //Hide Menus Starward 
            jQuery(".ascensorLink3").siblings().removeClass('show');
        } else if (window.location.href.indexOf(distillery) > -1) {
            showDesktopNavigation();
            jQuery(".ascensorLink3").siblings().addClass('show');
            hideNavLists('.nParticipate ul','.nContact ul');
        } else if (window.location.href.indexOf(participate) > -1) {
            //Show Participate
            showDesktopNavigation();
            jQuery(".ascensorLink7").siblings().addClass('show');
            jQuery(".ascensorLink7").addClass('ascensorLinkActive');  
            jQuery(".nDistillery > a").addClass('ascensorLinkActive'); 
            hideNavLists('.nAbout ul', '.nContact ul');  
        } else if (window.location.href.indexOf(ourHistory) > -1 || window.location.href.indexOf(ourTeam) > -1 || window.location.href.indexOf(proccessInnovation) > -1 ) {
            //About Sub Menu
            showDesktopNavigation();
            jQuery(".nAbout > ul").addClass('show');
            jQuery(".ascensorLink3").addClass('ascensorLinkActive');        
            hideNavLists('.nParticipate ul','.nContact ul');  
        } else if (window.location.href.indexOf(buyOurWhisky) > -1 || window.location.href.indexOf(workWithUs) > -1 || window.location.href.indexOf(newsEvents) > -1 ) {
            //Participate Sub Menu
            showDesktopNavigation();
            jQuery(".nParticipate > ul").addClass('show');
            jQuery(".ascensorLink7").addClass('ascensorLinkActive');  
            jQuery(".nDistillery > a").addClass('ascensorLinkActive'); 
            hideNavLists('.nAbout ul','.nContact ul');  
        }  else if ( window.location.href.indexOf(contactUs) > -1) {
            showDesktopNavigation();
            jQuery(".ascensorLink12").siblings().addClass('show');
            hideNavLists('.nAbout ul','.nParticipate ul');    
            jQuery(".ascensorLink11").addClass('ascensorLinkActive');  
            jQuery(".nDistillery > a").addClass('ascensorLinkActive'); 
        } else if ( window.location.href.indexOf(media) > -1) {
            showDesktopNavigation();
            jQuery(".nContact > ul").addClass('show');
            hideNavLists('.nAbout ul','.nParticipate ul');           
            jQuery(".ascensorLink11").addClass('ascensorLinkActive');  
            jQuery(".nDistillery > a").addClass('ascensorLinkActive'); 
        } else {           
            showDesktopNavigation();
        }   
    }
    function showDesktopNavigation () {
        //Show Desktop Navation
        desktopNav.slideDown({
            duration:400,
            easing: 'easeInOutCubic'
        });
        showNavigationArrows();
        if ( Modernizr.canvas && jQuery("body").hasClass('error404'))  {
            desktopNav.hide();
        } 
    }
    function hideAllNavigation () {
        desktopNav.slideUp({
            duration:200
        });
        hideNavigationArrows();
    }
    function hideNavigationArrows () {
        arrows.fadeOut(200);
    }
    function showNavigationArrows () {
        arrows.fadeIn(400);
    }
    //Highlight the landing page, top & bottom
    function highlight (elementHovered,toMakeWhite) {
        jQuery(elementHovered).mouseover(function () {
            jQuery(toMakeWhite).addClass('highlight');
        });
        jQuery(elementHovered).mouseout(function () {
            jQuery(toMakeWhite).removeClass('highlight');
        });
    }
    //Show Different Desktop Menu Lists
    function hideNavLists (toHide1,toHide2) {
        jQuery(toHide1).removeClass('show');
        jQuery(toHide2).removeClass('show');
        
        jQuery('a').removeClass('active');
        jQuery('li').removeClass('active');
    }
    
    function getCanvasScript () {
        /* If Browswer Supports Canvas Add Code .Canvas Stars Coded based on Tim Poon' tutorial - http://timothypoon.com/blog/2011/01/19/html5-canvas-particle-animation/ */
        var WIDTH,HEIGHT,canvas,con,g,pxs,rint;
        pxs = new Array();
        rint = 60;
        (function (jQuery) {
            jQuery(document).ready(function(){
                WIDTH = window.innerWidth;
                HEIGHT = window.innerHeight;
                jQuery('.starwardCon').width(WIDTH).height(HEIGHT);
                canvas = document.getElementById('stars');
                jQuery(canvas).attr('width', WIDTH).attr('height',HEIGHT);
                con = canvas.getContext('2d');
                for(var i = 0; i < 100; i++) {
                    pxs[i] = new Circle();
                    pxs[i].reset();
                }
                setInterval(draw,rint);
            });
            function draw() {
                con.clearRect(0,0,WIDTH,HEIGHT);
                for(var i = 0; i < pxs.length; i++) {
                    pxs[i].fade();
                    pxs[i].move();
                    pxs[i].draw();
                }
            }
        //Figure out middle of screen
        var horizontalCenter = Math.floor(window.innerWidth/2);
        var verticalCenter = Math.floor(window.innerHeight/2);

        function Circle() {
            this.s = {ttl:8000, xmax:5, ymax:5, rmax:5, rt:1, xdef:horizontalCenter, ydef:verticalCenter, xdrift:4, ydrift: 4, random:false, blink:true};
            this.reset = function() {
                this.x = (this.s.random ? WIDTH*Math.random() : this.s.xdef);
                this.y = (this.s.random ? HEIGHT*Math.random() : this.s.ydef);
                this.r = ((this.s.rmax-1)*Math.random()) + 1;
                this.dx = (Math.random()*this.s.xmax) * (Math.random() < .5 ? -1 : 1);
                this.dy = (Math.random()*this.s.ymax) * (Math.random() < .5 ? -1 : 1);
                this.hl = (this.s.ttl/rint)*(this.r/this.s.rmax);
                this.rt = Math.random()*this.hl;
                this.s.rt = Math.random()+1;
                this.stop = Math.random()*.2+.4;
                this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
                this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
            }
            this.fade = function() {
                this.rt += this.s.rt;
            }
            this.draw = function() {
                if(this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt*-1;
                else if(this.rt >= this.hl) this.reset();
                var newo = 1-(this.rt/this.hl);
                con.beginPath();
                con.arc(this.x,this.y,this.r,0,Math.PI*2,true);
                con.closePath();
                var cr = this.r*newo;
                g = con.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
                g.addColorStop(0.0, 'rgba(124,124,124,'+newo+')');
                g.addColorStop(this.stop, 'rgba(124,124,124,'+(newo*.6)+')');
                g.addColorStop(1.0, 'rgba(124,124,124,0)');
                con.fillStyle = g;
                con.fill();
            }
            this.move = function() {
                this.x += (this.rt/this.hl)*this.dx;
                this.y += (this.rt/this.hl)*this.dy;
                if(this.x > WIDTH || this.x < 0) this.dx *= -1;
                if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
            }
            this.getX = function() { return this.x; }
            this.getY = function() { return this.y; }
        }
    }(jQuery));
    }//end