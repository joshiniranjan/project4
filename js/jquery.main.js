
// page init
jQuery(function(){
    initInVieport();
    initAccordion();
    menu();
    menuaim();
    movebg();
    initSlideShow();
    initNavigationSelect();
    initMobileNav();
    initDropDownClasses();
    initCustomHover();
    initTooltip();
    switchTabBySelect();
    initlocation();
    initSameHeight();
    // plugin();
    //new styles
    initVideo();    
    // robot();
    initCarousel();
    initTabs();
    initMasonry();
    tab();
    initclass();
});

function initAccordion() {
    jQuery('.accordion').slideAccordion({
        opener: 'a.open',
        slider: '.slide',
        animSpeed: 300
    });
}

function initTabs() {
    jQuery('ul.tabset').tabset({
        tabLinks: 'a',
        addToParent: true
    });
}

;(function($){
    $.fn.slideAccordion = function(opt){
        // default options
        var options = $.extend({
            addClassBeforeAnimation: false,
            allowClickWhenExpanded: false,
            activeClass:'active',
            opener:'.opener',
            slider:'.slide',
            animSpeed: 300,
            collapsible:true,
            event:'click'
        },opt);

        return this.each(function(){
            // options
            var accordion = $(this);
            var items = accordion.find(':has('+options.slider+')');

            items.each(function(){
                var item = $(this);
                var opener = item.find(options.opener);
                var slider = item.find(options.slider);
                opener.bind(options.event, function(e){
                    if(!slider.is(':animated')) {
                        if(item.hasClass(options.activeClass)) {
                            if(options.allowClickWhenExpanded) {
                                return;
                            } else if(options.collapsible) {
                                slider.slideUp(options.animSpeed, function(){
                                    hideSlide(slider);
                                    item.removeClass(options.activeClass);
                                });
                            }
                        } else {
                            // show active
                            var levelItems = item.siblings('.'+options.activeClass);
                            var sliderElements = levelItems.find(options.slider);
                            item.addClass(options.activeClass);
                            showSlide(slider).hide().slideDown(options.animSpeed);
                        
                            // collapse others
                            sliderElements.slideUp(options.animSpeed, function(){
                                levelItems.removeClass(options.activeClass);
                                hideSlide(sliderElements);
                            });
                        }
                    }
                    e.preventDefault();
                });
                if(item.hasClass(options.activeClass)) showSlide(slider); else hideSlide(slider);
            });
        });
    };

    // accordion slide visibility
    var showSlide = function(slide) {
        return slide.css({position:'', top: '', left: '', width: '' });
    };
    var hideSlide = function(slide) {
        return slide.show().css({position:'absolute', top: -9999, left: -9999, width: slide.width() });
    };
}(jQuery));

;(function($, $win) {
    'use strict';

    function Tabset($holder, options) {
        this.$holder = $holder;
        this.options = options;

        this.init();
    }

    Tabset.prototype = {
        init: function() {
            this.$tabLinks = this.$holder.find(this.options.tabLinks);

            this.setStartActiveIndex();
            this.setActiveTab();

            if (this.options.autoHeight) {
                this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
            }
        },

        setStartActiveIndex: function() {
            var $classTargets = this.getClassTarget(this.$tabLinks);
            var $activeLink = $classTargets.filter('.' + this.options.activeClass);
            var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
            var activeIndex;

            if (this.options.checkHash && $hashLink.length) {
                $activeLink = $hashLink;
            }

            activeIndex = $classTargets.index($activeLink);

            this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
        },

        setActiveTab: function() {
            var self = this;

            this.$tabLinks.each(function(i, link) {
                var $link = $(link);
                var $classTarget = self.getClassTarget($link);
                var $tab = $($link.attr(self.options.attrib));

                if (i !== self.activeTabIndex) {
                    $classTarget.removeClass(self.options.activeClass);
                    $tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
                } else {
                    $classTarget.addClass(self.options.activeClass);
                    $tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
                }

                self.attachTabLink($link, i);
            });
        },

        attachTabLink: function($link, i) {
            var self = this;

            $link.on(this.options.event + '.tabset', function(e) {
                e.preventDefault();

                if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
                    self.activeTabIndex = i;
                    self.switchTabs();
                }
            });
        },

        resizeHolder: function(height) {
            var self = this;

            if (height) {
                this.$tabHolder.height(height);
                setTimeout(function() {
                    self.$tabHolder.addClass('transition');
                }, 10);
            } else {
                self.$tabHolder.removeClass('transition').height('');
            }
        },

        switchTabs: function() {
            var self = this;

            var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
            var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

            var $prevTab = this.getTab($prevLink);
            var $nextTab = this.getTab($nextLink);

            $prevTab.removeClass(this.options.activeClass);

            if (self.haveTabHolder()) {
                this.resizeHolder($prevTab.outerHeight());
            }

            setTimeout(function() {
                self.getClassTarget($prevLink).removeClass(self.options.activeClass);

                $prevTab.addClass(self.options.tabHiddenClass);
                $nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);

                self.getClassTarget($nextLink).addClass(self.options.activeClass);

                if (self.haveTabHolder()) {
                    self.resizeHolder($nextTab.outerHeight());

                    setTimeout(function() {
                        self.resizeHolder();
                        self.prevTabIndex = self.activeTabIndex;
                    }, self.options.animSpeed);
                } else {
                    self.prevTabIndex = self.activeTabIndex;
                }
            }, this.options.autoHeight ? this.options.animSpeed : 1);
        },

        getClassTarget: function($link) {
            return this.options.addToParent ? $link.parent() : $link;
        },

        getActiveTab: function() {
            return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
        },

        getTab: function($link) {
            return $($link.attr(this.options.attrib));
        },

        haveTabHolder: function() {
            return this.$tabHolder && this.$tabHolder.length;
        },

        destroy: function() {
            var self = this;

            this.$tabLinks.off('.tabset').each(function() {
                var $link = $(this);

                self.getClassTarget($link).removeClass(self.options.activeClass);
                $($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
            });

            this.$holder.removeData('Tabset');
        }
    };

    $.fn.tabset = function(options) {
        options = $.extend({
            activeClass: 'active',
            addToParent: false,
            autoHeight: false,
            checkHash: false,
            defaultTab: true,
            animSpeed: 500,
            tabLinks: 'a',
            attrib: 'href',
            event: 'click',
            tabHiddenClass: 'js-tab-hidden'
        }, options);
        options.autoHeight = options.autoHeight && $.support.opacity;

        return this.each(function() {
            var $holder = $(this);

            if (!$holder.data('Tabset')) {
                $holder.data('Tabset', new Tabset($holder, options));
            }
        });
    };
}(jQuery, jQuery(window)));

function robot() {
    class Robot {
    constructor() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        this.animation = {
            flyingHeight: 2,
            flyingFreq: 0.015,
            eyeAmplitude: 2,
            eyelidAmplitude: 1,
            modelsAmplitude: .3,
            reactionTime: .100,
            speed: .5,
            eyelidsOpening: 0,
            flying: true
        };

        // BINDINGS
        //////////////////////////////////////////
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.render = this.render.bind(this);

        // EVENTS
        //////////////////////////////////////////
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('mousemove', this.onMouseMove);

        this.init();
    }

    /**
  * Init functions.
  */
    init() {
        this.scene = new THREE.Scene();
        this.mouse = new THREE.Vector2(window.innerWidth, window.innerWidth);

        this.newRenderer();
        this.newCamera();
        this.newLight();
        this.newGround();
        this.newRobot();
        this.newGui();
        this.render();
    }

    /**
  * New renderer.
  */
    newRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.renderer.setClearColor(0x9756b2);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }

    /**
  * New camera.
  */
    newCamera() {
        const aspect = this.windowWidth / this.windowHeight;
        const fieldOfView = 45;
        const near = .1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
        this.camera.position.set(0, 1, 27);
    }

    /**
  * New lights.
  */
    newLight() {
        const ambientLight = new THREE.AmbientLight(0xe9e9e9, 1);
        ambientLight.position.set(0, 100, 0);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, .1);
        directionalLight.position.set(0, 100, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    /**
  * New ground.
  */
    newGround() {
        const geometry = new THREE.PlaneGeometry(45, 45);
        const material = new THREE.MeshLambertMaterial({ color: 0x9555b0 });
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = THREE.Math.degToRad(-90);
        this.ground.position.y = -7;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    /**
  * Texture Loader.
  * @param  {int} number of textures
  */
    textureLoader(numberOfTextures) {
        this.textureLoader = {
            loader: new THREE.TextureLoader(),
            total: numberOfTextures,
            loaded: 0,
            loadedComplete: false,
            textureLoaded() {
                this.loaded++;
                if (this.loaded == this.total) {
                    this.loadedComplete = true;
                }
                console.log(`${ this.loaded }/${ this.total } texture(s) loaded`);
            }
        };
    }

    /**
  * New robot.
  */
    newRobot() {
        const url = {
            object: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/boule.DAE',
            texture1: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/face.jpg',
            texture2: 'https://cdn.rawgit.com/Verlangieri/robot-animation/master/app/obj/texture.jpg'
        }
        const loader = new THREE.ColladaLoader();
        loader.load(url.object, collada => {
            // Init texture rendering
            this.dataTexture = [url.texture1, url.texture2];
            this.textureLoader(this.dataTexture.length);

            // Robot model
            this.models = collada.scene;
            this.models.rotation.y = THREE.Math.degToRad(-90); // Rotate robot in front direction

            // Set a pivot point
            this.mesh = new THREE.Object3D();
            this.box = new THREE.Box3().setFromObject(this.models);
            this.box.center(this.models.position);
            this.models.position.multiplyScalar(-1);

            this.mesh.add(this.models);
            this.scene.add(this.mesh);

            // Eye
            this.eye = this.models.getObjectByName("Eye", true);

            // Eyelid
            this.eyelidTop = this.models.getObjectByName("Eyelid-top", true);
            this.eyelidBottom = this.models.getObjectByName("Eyelid-bottom", true);
            this.eyelidTop.rotation.x = THREE.Math.degToRad(-88); // -65 = Open; -88 = closed; 
            this.eyelidBottom.rotation.x = THREE.Math.degToRad(-85); // -115= Open; -85 = closed;

            // Lens
            const lens = this.models.getObjectByName("Lens", true);
            lens.material.map = this.textureLoader.loader.load(this.dataTexture[0], this.textureLoader.textureLoaded());
            lens.material.map.minFilter = THREE.LinearFilter;

            const pointLight = new THREE.PointLight(0xffffff, 0.5, 1);
            pointLight.position.z = 30;
            lens.add(pointLight);

            const tl = new TimelineMax({ repeat: -1, yoyo: true });
            tl.from(pointLight, 1, { intensity: 5 });

            // Body
            this.body = this.models.getObjectByName("Body", true);
            this.body.children[0].material.map = this.textureLoader.loader.load(this.dataTexture[1], this.textureLoader.textureLoaded());
            this.body.children[0].material.map.minFilter = THREE.LinearFilter;
            this.body.children[3].castShadow = true;
            this.camera.lookAt(this.models.position);

            this.parameters = {
                lunchIntro: true,
                introComplete: false,
                coef: 0,
                height: this.models.position.y
            };

            // Remove loading message
            TweenMax.to(document.getElementById('loading'), .5, {opacity: 0});
        });
    }

    /**
  * animation: Introduction.
  */
    introAnimation() {
        const delayTurnOff = 1000;
        const delayTurnOn = 3000;
        TweenMax.set(this.mesh.position, { y: 15 });
        TweenMax.set(this.mesh.rotation, { y: THREE.Math.degToRad(720), z: THREE.Math.degToRad(720) });
        setTimeout(() => {
            this.turnOffAnimation();
        }, delayTurnOff);
        setTimeout(() => {
            this.turnOnAnimation();
        }, delayTurnOn);
    }

    /**
  * animation: Turn off.
  */
    turnOffAnimation() {
        TweenMax.to(this.mesh.position, 1.5, { y: this.ground.position.y + this.box.max.y / 2, ease: Bounce.easeOut });
        TweenMax.to(this.mesh.rotation, 2, {
            x: THREE.Math.degToRad(getRandom(-20, 0)),
            y: THREE.Math.degToRad(getRandom(-30, 30)),
            z: THREE.Math.degToRad(getRandom(-20, 20)),
            ease: Power2.easeOut
        });
    }

    /**
  * animation: Turn on.
  */
    turnOnAnimation() {
        TweenMax.to(this.mesh.position, 1.5, { y: this.animation.flyingHeight, ease: Power2.easeOut });
        TweenMax.to(this.mesh.rotation, 1, { x: 0, y: 0, z: 0, ease: Power2.easeOut });
        TweenMax.to(this.eyelidTop.rotation, .5, { x: THREE.Math.degToRad(-75), ease: Power2.easeOut }, 1.5);
        TweenMax.to(this.eyelidBottom.rotation, .5, { x: THREE.Math.degToRad(-100), ease: Power2.easeOut, onStart: () => {
                this.parameters.introComplete = true;
            } }, 1.5);
    }

    /**
  * animation: Flying effect.
  */
    flyingAnimation() {
        this.parameters.coef += this.animation.flyingFreq;
        const c = Math.sin(Math.PI * this.parameters.coef);
        this.eye.position.y = this.animation.eyeAmplitude * c;
        this.models.position.y = c * this.animation.modelsAmplitude + this.parameters.height;
        this.eyelidTop.position.y = this.eyelidBottom.position.y = this.animation.eyelidAmplitude * c;
    }

    /**
  * animation: Standby.
  */
    standbyAnimation(state) {
        if (!state) {
            this.turnOffAnimation();
            TweenMax.to(this.models.position, .5, { y: this.parameters.height }); // prevent ground collision
        } else if (state) {
            this.turnOnAnimation();
        }
    }

    /**
  * animation: Mouse interaction.
  */
    mouseAnimation() {
        TweenMax.to(this.eye.rotation, this.animation.speed, { x: this.mouse.y / 5, y: this.mouse.x / 3, delay: this.animation.reactionTime });
        TweenMax.to(this.mesh.rotation, this.animation.speed, { y: this.mouse.x / 2, x: -(this.mouse.y / 5), delay: this.animation.reactionTime });
        TweenMax.to(this.eyelidTop.rotation, this.animation.speed, { y: this.mouse.x / 4, x: THREE.Math.degToRad(-75 + this.animation.eyelidsOpening) + (this.mouse.y - Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
        TweenMax.to(this.eyelidBottom.rotation, this.animation.speed, { y: this.mouse.x / 4, x: THREE.Math.degToRad(-100 - this.animation.eyelidsOpening) + (this.mouse.y + Math.abs(this.mouse.x)) / 10, delay: this.animation.reactionTime });
    }

    /**
  * Update robot, only when textures and 3D models are loaded.
  */
    updateRobot() {
        if (this.models !== undefined && this.textureLoader.loadedComplete === true) {
            // Introduction
            if (this.parameters.lunchIntro) {
                this.introAnimation();
                this.parameters.lunchIntro = false;
            }
            // Flying
            if (this.parameters.introComplete && this.animation.flying) {
                this.flyingAnimation();
            }
        }
    }

    /**
  * Mouse update.
  */
    mouseUpdate() {
        if (this.parameters.introComplete) {
            this.mouseAnimation();
        }
    }

    /**
  * EVENT: On mouse move, set the mouse position and update mouseUpdate.
  */
    onMouseMove(event) {
        this.mouse.x = event.clientX / window.innerWidth * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouseUpdate();
    }

    /**
  * EVENT: On window resize, update parameters.
  */
    onWindowResize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
    }

    /**
  * dat.GUI, display animation parameters.
  */
    newGui() {
        const gui = new dat.GUI({ width: 270 });

        const f1 = gui.addFolder('Flying animation');
        f1.add(this.animation, 'flyingFreq', .01, .05).name('frequency');
        f1.add(this.animation, 'modelsAmplitude', 0, 1).name('robot amplitude');
        f1.add(this.animation, 'eyelidAmplitude', 0, 5).name('eyelid amplitude');
        f1.add(this.animation, 'eyeAmplitude', 0, 5).name('eye amplitude');
        f1.add(this.animation, 'flying').onChange(e => {
            this.standbyAnimation(e);
        });

        const f2 = gui.addFolder('Mouse interaction');
        f2.add(this.animation, 'reactionTime', 0, .5).name('reaction time');
        f2.add(this.animation, 'speed', .1, 1).name('slowness');
        f2.add(this.animation, 'eyelidsOpening', 0, 10).name('eyelids opening');
    }

    /**
  * Render.
  */
    render() {
        this.updateRobot();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }
}

/**
 * Get random.
 * @param  {int} min
 * @param  {int} max
 * @return {int} random number
 */
const getRandom = (min, max) => Math.random() * (max - min + 1) + min;

}
function x() {
    (function(window,document,undefined){
    var canvas, ctx, height, width, bounds,
      center, mouse, hover = false, mouseDown = false,
      props, particles,
      stats, gui;
    
    var Vector2 = function(x,y){
        x = x || 0;
        y = y || 0;
        this.x = x;
        this.y = y;
        return this;
    };

    Vector2.prototype.add = function(vec){
        this.x += vec.x;
        this.y += vec.y;
    };

    Vector2.prototype.sub = function(vec){
        this.x -= vec.x;
        this.y -= vec.y;
    };

    Vector2.prototype.lerp = function(to, amount) {
        amount = amount || 0.05;
        this.x = (1 - amount) * this.x + amount * to.x;
        this.y = (1 - amount) * this.y + amount * to.y;
    };


    Vector2.prototype.distanceTo = function(vec){
        return Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
    };

    Vector2.prototype.angleTo = function(vec, format){
        format = format || 'rad';
        var angle = format === 'rad' ? Math.atan2(vec.y - this.y, vec.x - this.x) :
                format === 'deg' ? Math.atan2(vec.y - this.y, vec.x - this.x) * 180 / Math.PI :
                undefined;
        return angle;
    };

    var Particle = function(){
        this.size = props.minSize,
        this.velocity = new Vector2(
            1 - Math.random() * 2,
            1 - Math.random() * 2
        );
        this.position = new Vector2(
            Math.random() * width, 
            Math.random() * height
        );
        return this;
    };

    Particle.prototype.checkBoundaries = function(){
        if(this.position.x < bounds.xMin || this.position.x > bounds.xMax) this.velocity.x *= -1;
        if(this.position.y < bounds.yMin || this.position.y > bounds.yMax) this.velocity.y *= -1;
    };

    Particle.prototype.update = function(){
        this.position.add(this.velocity);
        this.checkBoundaries();
    };
  
    function resize(){
        canvas.height = height = window.innerHeight;
        canvas.width = width = window.innerWidth;
        center = new Vector2(width/2, height/2);
        bounds = {
            xMin: -props.mouseThreshold,
            yMin: -props.mouseThreshold,
            xMax: width + props.mouseThreshold,
            yMax: height + props.mouseThreshold
        };
    }
    
    function populate(){
    particles = [];
        for(var i = 0; i < props.numParticles; particles[i++] = new Particle());
    }
    
  function animateHover(p){
    var mouseDist = p.position.distanceTo(mouse);
    if (mouseDist < props.mouseThreshold){
      var mLineOpacity = 1 - mouseDist/props.mouseThreshold,
          mLineColor = props.mouseConnectColor.substr(0,props.mouseConnectColor.length-2) + mLineOpacity + ')',
          size = props.maxSize * (1 - (mouseDist/props.mouseThreshold)) + props.minSize,
          angle = mouse.angleTo(p.position),
          position = new Vector2(
            mouse.x + props.mouseThreshold * Math.cos(angle),
            mouse.y + props.mouseThreshold * Math.sin(angle)
          );

      p.size = size;
      ctx.beginPath();
      ctx.strokeStyle = mLineColor;
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.position.x, p.position.y);
      ctx.stroke();
      ctx.closePath();

      if(mouseDown)
        p.position.lerp(mouse);
      else
        p.position.lerp(position);
    }
    else{
      p.size = props.minSize;
    }
  }
  
    function draw(){
    ctx.fillStyle = props.backgroundColor;
        ctx.fillRect(0,0,width,height);
        for(var i = 0; i < particles.length; i++){
            var p1 = particles[i],
          p2 = particles[i + 1] || particles[0],
          distance = p2.position.distanceTo(p1.position);
                
            p1.update();
            ctx.fillStyle = props.particleColor;
            ctx.fillRect(p1.position.x - p1.size/2, p1.position.y - p1.size/2,p1.size,p1.size);
            if (distance < props.connectThreshold){
                var pLineOpacity = 1 - distance/props.connectThreshold,
                      pLineColor = props.particleConnectColor.substr(0,props.particleConnectColor.length-2) + pLineOpacity + ')';
                ctx.beginPath();
                ctx.strokeStyle = pLineColor;
                ctx.lineWidth = 1;
                ctx.moveTo(p1.position.x, p1.position.y);
                ctx.lineTo(p2.position.x, p2.position.y);
                ctx.stroke();
                ctx.closePath();
            }
            if (hover){
                animateHover(p1);
            }
        }
    if(props.screenOverlay){
      var grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, width/2);
      grad.addColorStop(0,'rgba(0,0,0,0)');
      grad.addColorStop(1,'rgba(0,0,0,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,width,height);
    }
    }

    function loop(){
    stats.begin();
        draw();
        window.requestAnimationFrame(loop);
    stats.end();
    }
  
  function setProps(){
    props = {
      backgroundColor: '#0c0c0f',
      particleColor: 'rgba(85,255,180,0.25)',
      minSize: 2, 
      maxSize: 30,
      numParticles: 1000,
          connectThreshold: 150,
          mouseThreshold: 150,
      particleConnectColor: 'rgba(200,100,200,0)',
      mouseConnectColor: 'rgba(40,150,250,0)',
      screenOverlay: true
    };
  }
  
  function buildUI(){
    stats = new Stats();
    document.body.appendChild(stats.domElement);
    
    gui = new dat.GUI();
    
    var f1 = gui.addFolder('System'),
        f2 = gui.addFolder('Particles'),
        f3 = gui.addFolder('Interaction');
    
    f1.open();
    f2.open();
    f3.open();
    
    f1.addColor(props, 'backgroundColor');
    f1.add(props, 'screenOverlay');
    
    var updateCount = f2.add(props, 'numParticles',100,4000).step(20);
    
    f2.add(props, 'minSize', 0, 10).step(0.5);
    f2.add(props, 'maxSize', 0, 100);
    f2.addColor(props, 'particleColor');
    f2.add(props, 'connectThreshold', 0, 1000).step(5);
    f2.addColor(props, 'particleConnectColor');
    var updateMouseThreshold = f3.add(props, 'mouseThreshold', 0, 500).step(5);
    f3.addColor(props, 'mouseConnectColor');
    
    updateCount.onFinishChange(function(){
      populate();
    });
    
    updateMouseThreshold.onFinishChange(function(){
      populate(); //to avoid getting particles stuck outside of boundaries
    });
  }
    
    window.onload = function(){
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        mouse = new Vector2();
    setProps();
    buildUI();
        resize();
        populate();
        loop();
    }
    
    window.onresize = function(){
    resize();
    populate();
  };
    
    window.onmousemove = function(e){
        hover = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    
  window.onmousedown = function(){
    mouseDown = true;
  };
  
  window.onmouseup = function(){
    mouseDown = false;
  };
  
    window.onmouseout = function(){
        hover = false;
    };
    
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
    
})(this,document);
}
function initclass() {
    $(".pan").click(function(){
        $(".category-block").addClass("intro");
    });
}


// main video init
function initVideo() {
    var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    var isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);

    if (isTouchDevice || isWinPhoneDevice) {
        jQuery('body').addClass('isTouchDevice');
    } else {
        jQuery('.video-block').each(function() {
            jQuery(this).blockResize({blocks: '.video-holder'});
        });
    }
}

 /*
 * jQuery Block Resize Plugin
 */
;(function($) {
    function BlockResize(options) {
        this.options = $.extend({
            blocks:'video'
        }, options);
        this.init();
    }
    BlockResize.prototype = {
        init: function() {
            if(this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function() {
            var self = this;
            this.holder = $(this.options.holder);
            this.blocks = this.holder.find(this.options.blocks);
            this.blocks.each(function() {
                var block = jQuery(this);
                self.getRatio(block);
                self.resizeBlock(block);
            });
        },
        attachEvents: function() {
            // add handler
            var self = this;
            this.resizeHandler = function(e) {
                self.onWindowResize();
            };
            jQuery(window).on('resize orientationchange', this.resizeHandler);
        },
        onWindowResize: function() {
            var self = this;
            self.blocks.each(function() {
                var block = jQuery(this);
                self.resizeBlock(block);
            });
        },
        resizeBlock: function(block) {
            var self = this;
            if(block.data('iRatio')) {
                // calculate dimensions
                var dimensions = this.getProportion({
                    ratio: block.data('iRatio'),
                    maskWidth: self.holder.innerWidth(),
                    maskHeight: self.holder.innerHeight()
                });
                block.css(dimensions);
            }
        },
        getProportion: function(data) {
            var ratio = data.ratio,
                blockWidth = data.maskWidth,
                blockHeight = blockWidth / ratio;

            if(blockHeight < data.maskHeight) {
                blockHeight = data.maskHeight;
                blockWidth = blockHeight * ratio;
            }
            return {
                width: blockWidth,
                height: blockHeight,
                marginTop: (data.maskHeight - blockHeight) / 2,
                marginLeft: (data.maskWidth - blockWidth) / 2
            };
        },
        getRatio: function(block) {
            block.data('iRatio', block.attr('data-width') / block.attr('data-height'));
        },
        destroy: function() {
            jQuery(window).off('resize orientationchange', this.resizeHandler);
            this.blocks.removeAttr('style');
            this.holder.removeData('BlockResize');
        },
        makeCallback: function(name) {
            if(typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    // jQuery plugin interface
    $.fn.blockResize = function(opt) {
        return this.each(function() {
            jQuery(this).data('BlockResize', new BlockResize($.extend(opt, {holder: this})));
        });
    };
}(jQuery));
function initCarousel() {
    jQuery('.carousel').scrollGallery({
        mask: '.mask',
        slider: '.slideset',
        slides: '.slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        generatePagination: '.pagination',
        autoRotation: true,
        switchTime: 3000,
        animSpeed: 500
    });
}



// block in viewport init
function initInVieport() {
    jQuery('.viewport-section').itemInViewport({
        activeClass: 'in-viewport',
        once: true
    });
}


/*
 * jQuery Carousel plugin
 */
;(function($){
    function ScrollGallery(options) {
        this.options = $.extend({
            mask: 'div.mask',
            slider: '>*',
            slides: '>*',
            activeClass:'active',
            disabledClass:'disabled',
            btnPrev: 'a.btn-prev',
            btnNext: 'a.btn-next',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            pagerLinks: '.pagination li',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            btnPlay: '.btn-play',
            btnPause: '.btn-pause',
            btnPlayPause: '.btn-play-pause',
            galleryReadyClass: 'gallery-js-ready',
            autorotationActiveClass: 'autorotation-active',
            autorotationDisabledClass: 'autorotation-disabled',
            stretchSlideToMask: false,
            circularRotation: true,
            disableWhileAnimating: false,
            autoRotation: false,
            pauseOnHover: isTouchDevice ? false : true,
            maskAutoSize: false,
            switchTime: 4000,
            animSpeed: 600,
            event:'click',
            swipeThreshold: 15,
            handleTouch: true,
            vertical: false,
            useTranslate3D: false,
            step: false
        }, options);
        this.init();
    }
    ScrollGallery.prototype = {
        init: function() {
            if(this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.refreshPosition();
                this.refreshState(true);
                this.resumeRotation();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function() {
            // define dimensions proporties
            this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
            this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
            this.slideSizeFunction = 'outerHeight';
            this.maskSizeProperty = 'height';
            this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

            // control elements
            this.gallery = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.mask = this.gallery.find(this.options.mask);
            this.slider = this.mask.find(this.options.slider);
            this.slides = this.slider.find(this.options.slides);
            this.btnPrev = this.gallery.find(this.options.btnPrev);
            this.btnNext = this.gallery.find(this.options.btnNext);
            this.currentStep = 0; this.stepsCount = 0;

            // get start index
            if(this.options.step === false) {
                var activeSlide = this.slides.filter('.'+this.options.activeClass);
                if(activeSlide.length) {
                    this.currentStep = this.slides.index(activeSlide);
                }
            }

            // calculate offsets
            this.calculateOffsets();

            // create gallery pagination
            if(typeof this.options.generatePagination === 'string') {
                this.pagerLinks = $();
                this.buildPagination();
            } else {
                this.pagerLinks = this.gallery.find(this.options.pagerLinks);
                this.attachPaginationEvents();
            }

            // autorotation control buttons
            this.btnPlay = this.gallery.find(this.options.btnPlay);
            this.btnPause = this.gallery.find(this.options.btnPause);
            this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);

            // misc elements
            this.curNum = this.gallery.find(this.options.currentNumber);
            this.allNum = this.gallery.find(this.options.totalNumber);
        },
        attachEvents: function() {
            // bind handlers scope
            var self = this;
            this.bindHandlers(['onWindowResize']);
            $(window).bind('load resize orientationchange', this.onWindowResize);

            // previous and next button handlers
            if(this.btnPrev.length) {
                this.prevSlideHandler = function(e) {
                    e.preventDefault();
                    self.prevSlide();
                };
                this.btnPrev.bind(this.options.event, this.prevSlideHandler);
            }
            if(this.btnNext.length) {
                this.nextSlideHandler = function(e) {
                    e.preventDefault();
                    self.nextSlide();
                };
                this.btnNext.bind(this.options.event, this.nextSlideHandler);
            }

            // pause on hover handling
            if(this.options.pauseOnHover && !isTouchDevice) {
                this.hoverHandler = function() {
                    if(self.options.autoRotation) {
                        self.galleryHover = true;
                        self.pauseRotation();
                    }
                };
                this.leaveHandler = function() {
                    if(self.options.autoRotation) {
                        self.galleryHover = false;
                        self.resumeRotation();
                    }
                };
                this.gallery.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            }

            // autorotation buttons handler
            if(this.btnPlay.length) {
                this.btnPlayHandler = function(e) {
                    e.preventDefault();
                    self.startRotation();
                };
                this.btnPlay.bind(this.options.event, this.btnPlayHandler);
            }
            if(this.btnPause.length) {
                this.btnPauseHandler = function(e) {
                    e.preventDefault();
                    self.stopRotation();
                };
                this.btnPause.bind(this.options.event, this.btnPauseHandler);
            }
            if(this.btnPlayPause.length) {
                this.btnPlayPauseHandler = function(e) {
                    e.preventDefault();
                    if(!self.gallery.hasClass(self.options.autorotationActiveClass)) {
                        self.startRotation();
                    } else {
                        self.stopRotation();
                    }
                };
                this.btnPlayPause.bind(this.options.event, this.btnPlayPauseHandler);
            }

            // enable hardware acceleration
            if(isTouchDevice && this.options.useTranslate3D) {
                this.slider.css({'-webkit-transform': 'translate3d(0px, 0px, 0px)'});
            }

            // swipe event handling
            if(isTouchDevice && this.options.handleTouch && window.Hammer && this.mask.length) {
                this.swipeHandler = new Hammer.Manager(this.mask[0]);
                this.swipeHandler.add(new Hammer.Pan({
                    direction: self.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL,
                    threshold: self.options.swipeThreshold
                }));

                this.swipeHandler.on('panstart', function() {
                    if(self.galleryAnimating) {
                        self.swipeHandler.stop();
                    } else {
                        self.pauseRotation();
                        self.originalOffset = parseFloat(self.slider.css(self.animProperty));
                    }
                }).on('panmove', function(e) {
                    var tmpOffset = self.originalOffset + e[self.options.vertical ? 'deltaY' : 'deltaX'];
                    tmpOffset = Math.max(Math.min(0, tmpOffset), self.maxOffset);
                    self.slider.css(self.animProperty, tmpOffset);
                }).on('panend', function(e) {
                    self.resumeRotation();
                    if(e.distance > self.options.swipeThreshold) {
                        if(e.offsetDirection === Hammer.DIRECTION_RIGHT || e.offsetDirection === Hammer.DIRECTION_DOWN) {
                            self.nextSlide();
                        } else {
                            self.prevSlide();
                        }
                    } else {
                        self.switchSlide();
                    }
                });
            }
        },
        onWindowResize: function() {
            if(!this.galleryAnimating) {
                this.calculateOffsets();
                this.refreshPosition();
                this.buildPagination();
                this.refreshState();
                this.resizeQueue = false;
            } else {
                this.resizeQueue = true;
            }
        },
        refreshPosition: function() {
            this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
            this.tmpProps = {};
            this.tmpProps[this.animProperty] = this.getStepOffset();
            this.slider.stop().css(this.tmpProps);
        },
        calculateOffsets: function() {
            var self = this, tmpOffset, tmpStep;
            if(this.options.stretchSlideToMask) {
                var tmpObj = {};
                tmpObj[this.innerSizeFunction] = this.mask[this.innerSizeFunction]();
                this.slides.css(tmpObj);
            }

            this.maskSize = this.mask[this.innerSizeFunction]();
            this.sumSize = this.getSumSize();
            this.maxOffset = this.maskSize - this.sumSize;

            // vertical gallery with single size step custom behavior
            if(this.options.vertical && this.options.maskAutoSize) {
                this.options.step = 1;
                this.stepsCount = this.slides.length;
                this.stepOffsets = [0];
                tmpOffset = 0;
                for(var i = 0; i < this.slides.length; i++) {
                    tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
                    this.stepOffsets.push(tmpOffset);
                }
                this.maxOffset = tmpOffset;
                return;
            }

            // scroll by slide size
            if(typeof this.options.step === 'number' && this.options.step > 0) {
                this.slideDimensions = [];
                this.slides.each($.proxy(function(ind, obj){
                    self.slideDimensions.push( $(obj)[self.fullSizeFunction](true) );
                },this));

                // calculate steps count
                this.stepOffsets = [0];
                this.stepsCount = 1;
                tmpOffset = tmpStep = 0;
                while(tmpOffset > this.maxOffset) {
                    tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
                    tmpStep += this.options.step;
                    this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
                    this.stepsCount++;
                }
            }
            // scroll by mask size
            else {
                // define step size
                this.stepSize = this.maskSize;

                // calculate steps count
                this.stepsCount = 1;
                tmpOffset = 0;
                while(tmpOffset > this.maxOffset) {
                    tmpOffset -= this.stepSize;
                    this.stepsCount++;
                }
            }
        },
        getSumSize: function() {
            var sum = 0;
            this.slides.each($.proxy(function(ind, obj){
                sum += $(obj)[this.fullSizeFunction](true);
            },this));
            this.slider.css(this.innerSizeFunction, sum);
            return sum;
        },
        getStepOffset: function(step) {
            step = step || this.currentStep;
            if(typeof this.options.step === 'number') {
                return this.stepOffsets[this.currentStep];
            } else {
                return Math.min(0, Math.max(-this.currentStep * this.stepSize, this.maxOffset));
            }
        },
        getSlideSize: function(i1, i2) {
            var sum = 0;
            for(var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
                sum += this.slideDimensions[i];
            }
            return sum;
        },
        buildPagination: function() {
            if(typeof this.options.generatePagination === 'string') {
                if(!this.pagerHolder) {
                    this.pagerHolder = this.gallery.find(this.options.generatePagination);
                }
                if(this.pagerHolder.length && this.oldStepsCount != this.stepsCount) {
                    this.oldStepsCount = this.stepsCount;
                    this.pagerHolder.empty();
                    this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                    for(var i = 0; i < this.stepsCount; i++) {
                        $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
                    }
                    this.pagerLinks = this.pagerList.children();
                    this.attachPaginationEvents();
                }
            }
        },
        attachPaginationEvents: function() {
            var self = this;
            this.pagerLinksHandler = function(e) {
                e.preventDefault();
                self.numSlide(self.pagerLinks.index(e.currentTarget));
            };
            this.pagerLinks.bind(this.options.event, this.pagerLinksHandler);
        },
        prevSlide: function() {
            if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                if(this.currentStep > 0) {
                    this.currentStep--;
                    this.switchSlide();
                } else if(this.options.circularRotation) {
                    this.currentStep = this.stepsCount - 1;
                    this.switchSlide();
                }
            }
        },
        nextSlide: function(fromAutoRotation) {
            if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                if(this.currentStep < this.stepsCount - 1) {
                    this.currentStep++;
                    this.switchSlide();
                } else if(this.options.circularRotation || fromAutoRotation === true) {
                    this.currentStep = 0;
                    this.switchSlide();
                }
            }
        },
        numSlide: function(c) {
            if(this.currentStep != c) {
                this.currentStep = c;
                this.switchSlide();
            }
        },
        switchSlide: function() {
            var self = this;
            this.galleryAnimating = true;
            this.tmpProps = {};
            this.tmpProps[this.animProperty] = this.getStepOffset();
            this.slider.stop().animate(this.tmpProps, {duration: this.options.animSpeed, complete: function(){
                // animation complete
                self.galleryAnimating = false;
                if(self.resizeQueue) {
                    self.onWindowResize();
                }

                // onchange callback
                self.makeCallback('onChange', self);
                self.autoRotate();
            }});
            this.refreshState();

            // onchange callback
            this.makeCallback('onBeforeChange', this);
        },
        refreshState: function(initial) {
            if(this.options.step === 1 || this.stepsCount === this.slides.length) {
                this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
            }
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
            this.curNum.html(this.currentStep+1);
            this.allNum.html(this.stepsCount);

            // initial refresh
            if(this.options.maskAutoSize && typeof this.options.step === 'number') {
                this.tmpProps = {};
                this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep,this.slides.length-1))[this.slideSizeFunction](true);
                this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
            }

            // disabled state
            if(!this.options.circularRotation) {
                this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
                if(this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
                if(this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
            }

            // add class if not enough slides
            this.gallery.toggleClass('not-enough-slides', this.sumSize <= this.maskSize);
        },
        startRotation: function() {
            this.options.autoRotation = true;
            this.galleryHover = false;
            this.autoRotationStopped = false;
            this.resumeRotation();
        },
        stopRotation: function() {
            this.galleryHover = true;
            this.autoRotationStopped = true;
            this.pauseRotation();
        },
        pauseRotation: function() {
            this.gallery.addClass(this.options.autorotationDisabledClass);
            this.gallery.removeClass(this.options.autorotationActiveClass);
            clearTimeout(this.timer);
        },
        resumeRotation: function() {
            if(!this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.gallery.removeClass(this.options.autorotationDisabledClass);
                this.autoRotate();
            }
        },
        autoRotate: function() {
            var self = this;
            clearTimeout(this.timer);
            if(this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
                this.timer = setTimeout(function(){
                    self.nextSlide(true);
                }, this.options.switchTime);
            } else {
                this.pauseRotation();
            }
        },
        bindHandlers: function(handlersList) {
            var self = this;
            $.each(handlersList, function(index, handler) {
                var origHandler = self[handler];
                self[handler] = function() {
                    return origHandler.apply(self, arguments);
                };
            });
        },
        makeCallback: function(name) {
            if(typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function() {
            // destroy handler
            $(window).unbind('load resize orientationchange', this.onWindowResize);
            this.btnPrev.unbind(this.options.event, this.prevSlideHandler);
            this.btnNext.unbind(this.options.event, this.nextSlideHandler);
            this.pagerLinks.unbind(this.options.event, this.pagerLinksHandler);
            this.gallery.unbind('mouseenter', this.hoverHandler);
            this.gallery.unbind('mouseleave', this.leaveHandler);

            // autorotation buttons handlers
            this.stopRotation();
            this.btnPlay.unbind(this.options.event, this.btnPlayHandler);
            this.btnPause.unbind(this.options.event, this.btnPauseHandler);
            this.btnPlayPause.unbind(this.options.event, this.btnPlayPauseHandler);

            // destroy swipe handler
            if(this.swipeHandler) {
                this.swipeHandler.destroy();
            }

            // remove inline styles, classes and pagination
            var unneededClasses = [this.options.galleryReadyClass, this.options.autorotationActiveClass, this.options.autorotationDisabledClass];
            this.gallery.removeClass(unneededClasses.join(' '));
            this.slider.add(this.slides).removeAttr('style');
            if(typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }
        }
    };

    // detect device type
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jquery plugin
    $.fn.scrollGallery = function(opt){
        return this.each(function(){
            $(this).data('ScrollGallery', new ScrollGallery($.extend(opt,{holder:this})));
        });
    };
}(jQuery));

/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
if(Object.create){!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");}

;(function($, $win) {
    'use strict';

    var ScrollDetector = (function() {
        var data = {};

        return {
            init: function() {
                var self = this;

                this.addHolder('win', $win);

                $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function() {
                    $.each(data, function(holderKey, holderData) {
                        self.calcHolderSize(holderData);

                        $.each(holderData.items, function(itemKey, itemData) {
                            self.calcItemSize(itemKey, itemData);
                        });
                    });
                });
            },

            addHolder: function(holderKey, $holder) {
                var self = this;
                var holderData =  {
                    holder: $holder,
                    items: {},
                    props: {
                        height: 0,
                        scroll: 0
                    }
                };

                data[holderKey] = holderData;

                $holder.on('scroll.blockInViewport', function() {
                    self.calcHolderScroll(holderData);

                    $.each(holderData.items, function(itemKey, itemData) {
                        self.calcItemScroll(itemKey, itemData);
                    });
                });

                this.calcHolderSize(data[holderKey]);
            },

            calcHolderSize: function(holderData) {
                var holderOffset = holderData.holder.offset();

                holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
                holderData.props.offset = holderOffset ? holderOffset.top : 0;

                this.calcHolderScroll(holderData);
            },

            calcItemSize: function(itemKey, itemData) {
                itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
                itemData.height = itemData.$el.outerHeight();

                this.calcItemScroll(itemKey, itemData);
            },

            calcHolderScroll: function(holderData) {
                holderData.props.scroll = holderData.holder.scrollTop();
            },

            calcItemScroll: function(itemKey, itemData) {
                var itemInViewPortFromUp;
                var itemInViewPortFromDown;
                var itemOutViewPort;
                var holderProps = itemData.holderProps.props;

                switch (itemData.options.visibleMode) {
                    case 1:
                        itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
                        itemInViewPortFromUp   = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
                        break;

                    case 2:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;

                    case 3:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;

                    default:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;
                }


                if (itemInViewPortFromUp && itemInViewPortFromDown) {
                    if (!itemData.state) {
                        itemData.state = true;
                        itemData.$el.addClass(itemData.options.activeClass)
                                    .trigger('in-viewport', true);

                        if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
                            delete itemData.holderProps.items[itemKey];
                        }
                    }
                } else {
                    itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;

                    if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
                        itemData.state = false;
                        itemData.$el.removeClass(itemData.options.activeClass)
                                    .trigger('in-viewport', false);
                    }
                }
            },

            addItem: function(el, options) {
                var itemKey = 'item' + this.getRandomValue();
                var newItem = {
                    $el: $(el),
                    options: options
                };
                var holderKeyDataName = 'in-viewport-holder';

                var $holder = newItem.$el.closest(options.holder);
                var holderKey = $holder.data(holderKeyDataName);

                if (!$holder.length) {
                    holderKey = 'win';
                } else if (!holderKey) {
                    holderKey = 'holder' + this.getRandomValue();
                    $holder.data(holderKeyDataName, holderKey);

                    this.addHolder(holderKey, $holder);
                }

                newItem.holderProps = data[holderKey];

                data[holderKey].items[itemKey] = newItem;

                this.calcItemSize(itemKey, newItem);
            },

            getRandomValue: function() {
                return (Math.random() * 100000).toFixed(0);
            },

            destroy: function() {
                $win.off('.blockInViewport');

                $.each(data, function(key, value) {
                    value.holder.off('.blockInViewport');

                    $.each(value.items, function(key, value) {
                        value.$el.removeClass(value.options.activeClass);
                        value.$el.get(0).itemInViewportAdded = null;
                    });
                });

                data = {};
            }
        };
    }());

    ScrollDetector.init();

    $.fn.itemInViewport = function(options) {
        options = $.extend({
            activeClass: 'in-viewport',
            once: true,
            holder: '',
            visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
        }, options);

        return this.each(function() {
            if (this.itemInViewportAdded) {
                return;
            }

            this.itemInViewportAdded = true;

            ScrollDetector.addItem(this, options);
        });
    };
}(jQuery, jQuery(window)));

function tab(){
    $('.category-list li').on('click', function(e){
        e.preventDefault();
        
        var index = $(this).index();
        $(this).siblings().removeClass('active');
          $(this).addClass('active');

        $('.tabs-content').attr('data-tab', index);
    });
}
    

// align blocks height
function initSameHeight() {
    setSameHeight({
        holder: '.three-cols',
        elements: '.col, .content-hold',
        flexible: true,
        multiLine: true,
        biggestHeight: true
    });
    setSameHeight({
        holder: '.feature',
        elements: '.nav-stacked, .tab-content',
        flexible: true,
        multiLine: true,
        biggestHeight: true
    });
    setSameHeight({
        holder: '.col-holder',
        elements: '.col',
        flexible: true,
        multiLine: true,
        biggestHeight: true
    });
    //  setSameHeight({
    //     holder: '.four-columns',
    //     elements: '.content-wrap',
    //     flexible: true,
    //     multiLine: true,
    //     biggestHeight: true
    // });
    setSameHeight({
        holder: '.four-columns',
        elements: '.text-wrap',
        flexible: true,
        multiLine: true,
        biggestHeight: true
    });
}


function plugin() {
    ;(function(root, factory) {
    'use strict';

    if(typeof define === 'function' && define.amd) {
        define(factory);
    }
    else if(typeof exports === 'object') {
        exports = module.exports = factory();
    }
    else {
        root.TinyType = factory();
    }
    })(this, function() {
      return function TinyType(
        selectedElement,   // element's id string OR a DOM Element
        strings = ['Try passing some strings.', 'Pretty cool, isn\'t it?'],
        {
          typeSpeed = 100,
          deleteSpeed = 50,
          startDelay = 500,
          deleteDelay = 500,
          cursor = '|',
          loop = true,
          onFinished,
        } = {}  // configs are optional
      ) {
        const element = (typeof selectedElement === 'string')
          ? document.getElementById(selectedElement)
          : selectedElement;

        deleteDelay = deleteDelay || 0;   // adressess deleteDelay: false
        startDelay = startDelay || 0; // adressess startDelay: false

        if (cursor) {
          const cursorSpan = document.createElement('span');
          cursorSpan.classList.add('tinytype-cursor');
          cursorSpan.textContent = cursor;
          element.insertAdjacentElement('afterend', cursorSpan);
        }

        let stringsIndex = 0;

        typewrite(strings);

        function typewrite(strings) {
          if (stringsIndex === strings.length)
            if (loop) stringsIndex = 0;   // should always be the case
            else return;                  // probably not usefull

          setTimeout(() => { typeString(strings[stringsIndex]); }, startDelay);
        }

        function typeString(str) {
          let index = 0;

          const intervalID = setInterval(() => {
            element.textContent += str[index];
            if (++index === str.length) return onStringTyped(intervalID);
          }, typeSpeed);
        }

        function onStringTyped(id) {
          clearInterval(id);
          if (!loop && stringsIndex === strings.length - 1)   // if no loop, don’t erase last string
            return (onFinished) ? onFinished() : null;
          setTimeout(eraseString, deleteDelay);
        }

        function eraseString() {
          const str = element.textContent;
          let strLength = str.length;

          const intervalID = setInterval(() => {
            element.textContent = str.substr(0, --strLength);
            if (strLength === 0) return onStringErased(intervalID);
          }, deleteSpeed);
        }

        function onStringErased(id) {
          clearInterval(id);
          ++stringsIndex;
          typewrite(strings);
        }

      };

    });


    /************************************************
    ***************** CONFIG TEST *******************
    ************************************************/
    // var frases = ['Vamos testar?'];
    var frases = ['Vamos testar?', 'Sim, claro!', 'E aí? Gostou?'];
    TinyType('tinytype', frases, {
      // cursor: '▐',
      // cursor: '_',
      // cursor: false,
      // startDelay: 750,
      onFinished: function() { console.log('terminou!!'); },
      // deleteDelay: 300,
      // loop: true,
      // typeSpeed: 170,
      deleteSpeed: 80
    });
}


// set same height for blocks
function setSameHeight(opt) {
    // default options
    var options = {
        holder: null,
        skipClass: 'same-height-ignore',
        leftEdgeClass: 'same-height-left',
        rightEdgeClass: 'same-height-right',
        elements: '>*',
        flexible: false,
        multiLine: false,
        useMinHeight: false,
        biggestHeight: false
    };
    for(var p in opt) {
        if(opt.hasOwnProperty(p)) {
            options[p] = opt[p];
        }
    }

    // init script
    if(options.holder) {
        var holders = lib.queryElementsBySelector(options.holder);
        lib.each(holders, function(ind, curHolder){
            var curElements = [], resizeTimer, postResizeTimer;
            var tmpElements = lib.queryElementsBySelector(options.elements, curHolder);

            // get resize elements
            for(var i = 0; i < tmpElements.length; i++) {
                if(!lib.hasClass(tmpElements[i], options.skipClass)) {
                    curElements.push(tmpElements[i]);
                }
            }
            if(!curElements.length) return;

            // resize handler
            function doResize() {
                for(var i = 0; i < curElements.length; i++) {
                    curElements[i].style[options.useMinHeight && SameHeight.supportMinHeight ? 'minHeight' : 'height'] = '';
                }

                if(options.multiLine) {
                    // resize elements row by row
                    SameHeight.resizeElementsByRows(curElements, options);
                } else {
                    // resize elements by holder
                    SameHeight.setSize(curElements, curHolder, options);
                }
            }
            doResize();

            // handle flexible layout / font resize
            function flexibleResizeHandler() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function(){
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(doResize, 100);
                },1);
            }
            if(options.flexible) {
                addEvent(window, 'resize', flexibleResizeHandler);
                addEvent(window, 'orientationchange', flexibleResizeHandler);
                FontResizeEvent.onChange(flexibleResizeHandler);
            }
            // handle complete page load including images and fonts
            addEvent(window, 'load', flexibleResizeHandler);
        });
    }

    // event handler helper functions
    function addEvent(object, event, handler) {
        if(object.addEventListener) object.addEventListener(event, handler, false);
        else if(object.attachEvent) object.attachEvent('on'+event, handler);
    }
}

/*
 * SameHeight helper module
 */
SameHeight = {
    supportMinHeight: typeof document.documentElement.style.maxHeight !== 'undefined', // detect css min-height support
    setSize: function(boxes, parent, options) {
        var calcHeight, holderHeight = typeof parent === 'number' ? parent : this.getHeight(parent);

        for(var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            var depthDiffHeight = 0;
            var isBorderBox = this.isBorderBox(box);
            lib.removeClass(box, options.leftEdgeClass);
            lib.removeClass(box, options.rightEdgeClass);

            if(typeof parent != 'number') {
                var tmpParent = box.parentNode;
                while(tmpParent != parent) {
                    depthDiffHeight += this.getOuterHeight(tmpParent) - this.getHeight(tmpParent);
                    tmpParent = tmpParent.parentNode;
                }
            }
            calcHeight = holderHeight - depthDiffHeight;
            calcHeight -= isBorderBox ? 0 : this.getOuterHeight(box) - this.getHeight(box);
            if(calcHeight > 0) {
                box.style[options.useMinHeight && this.supportMinHeight ? 'minHeight' : 'height'] = calcHeight + 'px';
            }
        }

        lib.addClass(boxes[0], options.leftEdgeClass);
        lib.addClass(boxes[boxes.length - 1], options.rightEdgeClass);
        return calcHeight;
    },
    getOffset: function(obj) {
        if (obj.getBoundingClientRect) {
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
            var clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
            return {
                top:Math.round(obj.getBoundingClientRect().top + scrollTop - clientTop),
                left:Math.round(obj.getBoundingClientRect().left + scrollLeft - clientLeft)
            };
        } else {
            var posLeft = 0, posTop = 0;
            while (obj.offsetParent) {posLeft += obj.offsetLeft; posTop += obj.offsetTop; obj = obj.offsetParent;}
            return {top:posTop,left:posLeft};
        }
    },
    getStyle: function(el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    },
    getStylesTotal: function(obj) {
        var sum = 0;
        for(var i = 1; i < arguments.length; i++) {
            var val = parseFloat(this.getStyle(obj, arguments[i]));
            if(!isNaN(val)) {
                sum += val;
            }
        }
        return sum;
    },
    getHeight: function(obj) {
        return obj.offsetHeight - this.getStylesTotal(obj, 'borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom');
    },
    getOuterHeight: function(obj) {
        return obj.offsetHeight;
    },
    isBorderBox: function(obj) {
        var f = this.getStyle, styleValue = f(obj, 'boxSizing') || f(obj, 'WebkitBoxSizing') || f(obj, 'MozBoxSizing');
        return styleValue === 'border-box';
    },
    resizeElementsByRows: function(boxes, options) {
        var currentRow = [], maxHeight, maxCalcHeight = 0, firstOffset = this.getOffset(boxes[0]).top;
        for(var i = 0; i < boxes.length; i++) {
            if(this.getOffset(boxes[i]).top === firstOffset) {
                currentRow.push(boxes[i]);
            } else {
                maxHeight = this.getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, this.setSize(currentRow, maxHeight, options));
                firstOffset = this.getOffset(boxes[i]).top;
                currentRow = [boxes[i]];
            }
        }
        if(currentRow.length) {
            maxHeight = this.getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, this.setSize(currentRow, maxHeight, options));
        }
        if(options.biggestHeight) {
            for(i = 0; i < boxes.length; i++) {
                boxes[i].style[options.useMinHeight && this.supportMinHeight ? 'minHeight' : 'height'] = maxCalcHeight + 'px';
            }
        }
    },
    getMaxHeight: function(boxes) {
        var maxHeight = 0;
        for(var i = 0; i < boxes.length; i++) {
            maxHeight = Math.max(maxHeight, this.getOuterHeight(boxes[i]));
        }
        return maxHeight;
    }
};

/*
 * FontResize Event
 */
FontResizeEvent = (function(window,document){
    var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
    var resizeFrame = document.createElement('iframe');
    resizeFrame.id = randomID; resizeFrame.className = 'font-resize-helper';
    resizeFrame.style.cssText = 'position:absolute;width:100em;height:10px;top:-9999px;left:-9999px;border-width:0';

    // wait for page load
    function onPageReady() {
        document.body.appendChild(resizeFrame);

        // use native IE resize event if possible
        if (/MSIE (6|7|8)/.test(navigator.userAgent)) {
            resizeFrame.onresize = function() {
                window.FontResizeEvent.trigger(resizeFrame.offsetWidth / 100);
            };
        }
        // use script inside the iframe to detect resize for other browsers
        else {
            var doc = resizeFrame.contentWindow.document;
            doc.open();
            doc.write('<scri' + 'pt>window.onload = function(){var em = parent.document.getElementById("' + randomID + '");window.onresize = function(){if(parent.FontResizeEvent){parent.FontResizeEvent.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
            doc.close();
        }
    }
    if(window.addEventListener) window.addEventListener('load', onPageReady, false);
    else if(window.attachEvent) window.attachEvent('onload', onPageReady);

    // public interface
    var callbacks = [];
    return {
        onChange: function(f) {
            if(typeof f === 'function') {
                callbacks.push(f);
            }
        },
        trigger: function(em) {
            for(var i = 0; i < callbacks.length; i++) {
                callbacks[i](em);
            }
        }
    };
}(this, document));

/*
 * Utility module
 */
lib = {
    hasClass: function(el,cls) {
        return el && el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
    },
    addClass: function(el,cls) {
        if (el && !this.hasClass(el,cls)) el.className += " "+cls;
    },
    removeClass: function(el,cls) {
        if (el && this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
    },
    extend: function(obj) {
        for(var i = 1; i < arguments.length; i++) {
            for(var p in arguments[i]) {
                if(arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    each: function(obj, callback) {
        var property, len;
        if(typeof obj.length === 'number') {
            for(property = 0, len = obj.length; property < len; property++) {
                if(callback.call(obj[property], property, obj[property]) === false) {
                    break;
                }
            }
        } else {
            for(property in obj) {
                if(obj.hasOwnProperty(property)) {
                    if(callback.call(obj[property], property, obj[property]) === false) {
                        break;
                    }
                }
            }
        }
    },
    event: (function() {
        var fixEvent = function(e) {
            e = e || window.event;
            if(e.isFixed) return e; else e.isFixed = true;
            if(!e.target) e.target = e.srcElement;
            e.preventDefault = e.preventDefault || function() {this.returnValue = false;};
            e.stopPropagation = e.stopPropagation || function() {this.cancelBubble = true;};
            return e;
        };
        return {
            add: function(elem, event, handler) {
                if(!elem.events) {
                    elem.events = {};
                    elem.handle = function(e) {
                        var ret, handlers = elem.events[e.type];
                        e = fixEvent(e);
                        for(var i = 0, len = handlers.length; i < len; i++) {
                            if(handlers[i]) {
                                ret = handlers[i].call(elem, e);
                                if(ret === false) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        }
                    };
                }
                if(!elem.events[event]) {
                    elem.events[event] = [];
                    if(elem.addEventListener) elem.addEventListener(event, elem.handle, false);
                    else if(elem.attachEvent) elem.attachEvent('on'+event, elem.handle);
                }
                elem.events[event].push(handler);
            },
            remove: function(elem, event, handler) {
                var handlers = elem.events[event];
                for(var i = handlers.length - 1; i >= 0; i--) {
                    if(handlers[i] === handler) {
                        handlers.splice(i,1);
                    }
                }
                if(!handlers.length) {
                    delete elem.events[event];
                    if(elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
                    else if(elem.detachEvent) elem.detachEvent('on'+event, elem.handle);
                }
            }
        };
    }()),
    queryElementsBySelector: function(selector, scope) {
        scope = scope || document;
        if(!selector) return [];
        if(selector === '>*') return scope.children;
        if(typeof document.querySelectorAll === 'function') {
            return scope.querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for(var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/,'').replace(/\s+$/,'').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (element && tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = element ? [element] : [];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if(attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=': checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue) }; break;
                        case '~': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)'+attrValue+'(\\s|$)'))) }; break;
                        case '|': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))) }; break;
                        case '^': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
                        case '$': checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
                        case '*': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
                        default : checkFunction = function(e) { return e.getAttribute(attrName) };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList,currentContext);
        }
        return resultList;
    },
    trim: function (str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    bind: function(f, scope, forceArgs){
        return function() {return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);};
    }
};

// DOM ready handler
function bindReady(handler){
    var called = false;
    var ready = function() {
        if (called) return;
        called = true;
        handler();
    };
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', ready, false);
    } else if (document.attachEvent) {
        if (document.documentElement.doScroll && window == window.top) {
            var tryScroll = function(){
                if (called) return;
                if (!document.body) return;
                try {
                    document.documentElement.doScroll('left');
                    ready();
                } catch(e) {
                    setTimeout(tryScroll, 0);
                }
            };
            tryScroll();
        }
        document.attachEvent('onreadystatechange', function(){
            if (document.readyState === 'complete') {
                ready();
            }
        });
    }
    if (window.addEventListener) window.addEventListener('load', ready, false);
    else if (window.attachEvent) window.attachEvent('onload', ready);
}



function movebg() {
    $(document).ready(function(){
      var mouseX, mouseY;
      var ww = $( window ).width();
      var wh = $( window ).height();
      var traX, traY;
      $(document).mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
        traX = ((4 * mouseX) / 570) + 40;
        traY = ((4 * mouseY) / 570) + 50;
        console.log(traX);
        $(".title").css({"background-position": traX + "%" + traY + "%"});
      });
    });
}

function menuaim(){
    (function($) {

    $.fn.menuAim = function(opts) {
        // Initialize menu-aim for all elements in jQuery collection
        this.each(function() {
            init.call(this, opts);
        });

        return this;
    };

    function init(opts) {
        var $menu = $(this),
            activeRow = null,
            mouseLocs = [],
            lastDelayLoc = null,
            timeoutId = null,
            options = $.extend({
                rowSelector: "> li",
                submenuSelector: "*",
                submenuDirection: "right",
                tolerance: 75,  // bigger = more forgivey when entering submenu
                enter: $.noop,
                exit: $.noop,
                activate: $.noop,
                deactivate: $.noop,
                exitMenu: $.noop
            }, opts);

        var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
            DELAY = 300;  // ms delay when user appears to be entering submenu

        /**
         * Keep track of the last few locations of the mouse.
         */
        var mousemoveDocument = function(e) {
                mouseLocs.push({x: e.pageX, y: e.pageY});

                if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
                    mouseLocs.shift();
                }
            };

        /**
         * Cancel possible row activations when leaving the menu entirely
         */
        var mouseleaveMenu = function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // If exitMenu is supplied and returns true, deactivate the
                // currently active row on menu exit.
                if (options.exitMenu(this)) {
                    if (activeRow) {
                        options.deactivate(activeRow);
                    }

                    activeRow = null;
                }
            };

        /**
         * Trigger a possible row activation whenever entering a new row.
         */
        var mouseenterRow = function() {
                if (timeoutId) {
                    // Cancel any previous activation delays
                    clearTimeout(timeoutId);
                }

                options.enter(this);
                possiblyActivate(this);
            },
            mouseleaveRow = function() {
                options.exit(this);
            };

        /*
         * Immediately activate a row if the user clicks on it.
         */
        var clickRow = function() {
                activate(this);
            };

        /**
         * Activate a menu row.
         */
        var activate = function(row) {
                if (row == activeRow) {
                    return;
                }

                if (activeRow) {
                    options.deactivate(activeRow);
                }

                options.activate(row);
                activeRow = row;
            };

        /**
         * Possibly activate a menu row. If mouse movement indicates that we
         * shouldn't activate yet because user may be trying to enter
         * a submenu's content, then delay and check again later.
         */
        var possiblyActivate = function(row) {
                var delay = activationDelay();

                if (delay) {
                    timeoutId = setTimeout(function() {
                        possiblyActivate(row);
                    }, delay);
                } else {
                    activate(row);
                }
            };

        /**
         * Return the amount of time that should be used as a delay before the
         * currently hovered row is activated.
         *
         * Returns 0 if the activation should happen immediately. Otherwise,
         * returns the number of milliseconds that should be delayed before
         * checking again to see if the row should be activated.
         */
        var activationDelay = function() {
                if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
                    // If there is no other submenu row already active, then
                    // go ahead and activate immediately.
                    return 0;
                }

                var offset = $menu.offset(),
                    upperLeft = {
                        x: offset.left,
                        y: offset.top - options.tolerance
                    },
                    upperRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: upperLeft.y
                    },
                    lowerLeft = {
                        x: offset.left,
                        y: offset.top + $menu.outerHeight() + options.tolerance
                    },
                    lowerRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: lowerLeft.y
                    },
                    loc = mouseLocs[mouseLocs.length - 1],
                    prevLoc = mouseLocs[0];

                if (!loc) {
                    return 0;
                }

                if (!prevLoc) {
                    prevLoc = loc;
                }

                if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                    prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                    // If the previous mouse location was outside of the entire
                    // menu's bounds, immediately activate.
                    return 0;
                }

                if (lastDelayLoc &&
                        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                    // If the mouse hasn't moved since the last time we checked
                    // for activation status, immediately activate.
                    return 0;
                }

                // Detect if the user is moving towards the currently activated
                // submenu.
                //
                // If the mouse is heading relatively clearly towards
                // the submenu's content, we should wait and give the user more
                // time before activating a new row. If the mouse is heading
                // elsewhere, we can immediately activate a new row.
                //
                // We detect this by calculating the slope formed between the
                // current mouse location and the upper/lower right points of
                // the menu. We do the same for the previous mouse location.
                // If the current mouse location's slopes are
                // increasing/decreasing appropriately compared to the
                // previous's, we know the user is moving toward the submenu.
                //
                // Note that since the y-axis increases as the cursor moves
                // down the screen, we are looking for the slope between the
                // cursor and the upper right corner to decrease over time, not
                // increase (somewhat counterintuitively).
                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
                };

                var decreasingCorner = upperRight,
                    increasingCorner = lowerRight;

                // Our expectations for decreasing or increasing slope values
                // depends on which direction the submenu opens relative to the
                // main menu. By default, if the menu opens on the right, we
                // expect the slope between the cursor and the upper right
                // corner to decrease over time, as explained above. If the
                // submenu opens in a different direction, we change our slope
                // expectations.
                if (options.submenuDirection == "left") {
                    decreasingCorner = lowerLeft;
                    increasingCorner = upperLeft;
                } else if (options.submenuDirection == "below") {
                    decreasingCorner = lowerRight;
                    increasingCorner = lowerLeft;
                } else if (options.submenuDirection == "above") {
                    decreasingCorner = upperLeft;
                    increasingCorner = upperRight;
                }

                var decreasingSlope = slope(loc, decreasingCorner),
                    increasingSlope = slope(loc, increasingCorner),
                    prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                    prevIncreasingSlope = slope(prevLoc, increasingCorner);

                if (decreasingSlope < prevDecreasingSlope &&
                        increasingSlope > prevIncreasingSlope) {
                    // Mouse is moving from previous location towards the
                    // currently activated submenu. Delay before activating a
                    // new menu row, because user may be moving into submenu.
                    lastDelayLoc = loc;
                    return DELAY;
                }

                lastDelayLoc = null;
                return 0;
            };

        /**
         * Hook up initial menu events
         */
        $menu
            .mouseleave(mouseleaveMenu)
            .find(options.rowSelector)
                .mouseenter(mouseenterRow)
                .mouseleave(mouseleaveRow)
                .click(clickRow);

        $(document).mousemove(mousemoveDocument);

    };
})(jQuery);
}
function menu(){
    jQuery(document).ready(function($){
        //open/close mega-navigation
        $('.cd-dropdown-trigger').on('click', function(event){
            event.preventDefault();
            toggleNav();
        });

        //close meganavigation
        $('.cd-dropdown .cd-close').on('click', function(event){
            event.preventDefault();
            toggleNav();
        });

        //on mobile - open submenu
        $('.has-children').children('a').on('click', function(event){
            //prevent default clicking on direct children of .has-children 
            event.preventDefault();
            var selected = $(this);
            selected.next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('move-out');
        });

        //on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
        var submenuDirection = ( !$('.cd-dropdown-wrapper').hasClass('open-to-left') ) ? 'right' : 'left';
        $('.cd-dropdown-content').menuAim({
            activate: function(row) {
                $(row).children().addClass('is-active').removeClass('fade-out');
                if( $('.cd-dropdown-content .fade-in').length == 0 ) $(row).children('ul').addClass('fade-in');
            },
            deactivate: function(row) {
                $(row).children().removeClass('is-active');
                if( $('li.has-children:hover').length == 0 || $('li.has-children:hover').is($(row)) ) {
                    $('.cd-dropdown-content').find('.fade-in').removeClass('fade-in');
                    $(row).children('ul').addClass('fade-out')
                }
            },
            exitMenu: function() {
                $('.cd-dropdown-content').find('.is-active').removeClass('is-active');
                return true;
            },
            submenuDirection: submenuDirection,
        });

        //submenu items - go back link
        $('.go-back').on('click', function(){
            var selected = $(this),
                visibleNav = $(this).parent('ul').parent('.has-children').parent('ul');
            selected.parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('move-out');
        }); 

        function toggleNav(){
            var navIsVisible = ( !$('.cd-dropdown').hasClass('dropdown-is-active') ) ? true : false;
            $('.cd-dropdown').toggleClass('dropdown-is-active', navIsVisible);
            $('.cd-dropdown-trigger').toggleClass('dropdown-is-active', navIsVisible);
            if( !navIsVisible ) {
                $('.cd-dropdown').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
                    $('.has-children ul').addClass('is-hidden');
                    $('.move-out').removeClass('move-out');
                    $('.is-active').removeClass('is-active');
                }); 
            }
        }

        //IE9 placeholder fallback
        //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
        if(!Modernizr.input.placeholder){
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.val(input.attr('placeholder'));
                }
            }).blur();
            $('[placeholder]').parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                })
            });
        }
    });
}

function initHeaderFixed() {
 var offset = 0;
 var item = jQuery('#header');

 //hide or show the "back to top" link
 jQuery(window).scroll(function(){
  if( $(this).scrollTop() > offset ) {
   item.addClass('header-fixed');
  } else {
   item.removeClass('header-fixed');
  }
 });
}

function initparticle() {
    var MyModule;
    $(function() {

      //generate random int a<=x<=b
      function randint(a, b) {
        return Math.floor(Math.random() * (b - a + 1) + a);
      }

      //generate random float
      function randRange(a, b) {
        return Math.random() * (b - a) + a;
      }

      //generate random float more likely to be close to a
      function hyperRange(a, b) {
        return Math.random() * Math.random() * Math.random() * (b - a) + a;
      }

      /*** Configuration constants */
      var config = {
        textAnimationTime: 1500,
        // min and max radius, radius threshold and percentage of filled circles
        radMin: 5,
        radMax: 100,
        filledCircle: 80,
        concentricCircle: 40,
        //min and max speed to move
        speedMin: 0.2,
        speedMax: 2.6,
        //max reachable opacity for every circle and blur effect
        maxOpacity: 0.45,
        //default palette choice
        colors: ["52,168,83", "117,95,147", "199,108,23", "194,62,55", "0,172,212", "120,120,120", "120,120,120"],
        bgColors: ["52,168,83", "117,95,147", "199,108,23", "194,62,55", "0,172,212", "120,120,120", "120,120,120"],
        //multiplier that makes background circles larger and slower
        backgroundMlt: 1.5,
        //blur variable
        blur: 9,
        //min distance for connecting links among spheres
        linkDist: Math.min(window.innerWidth, window.innerHeight) / 3.25,
        //border for the connecting links among spheres
        lineBorder: 2.5,
        //experimental vars
        circleExp: 1,
        circleExpMax: 1.003,
        circleExpMin: 0.997,
        circleExpSp: 0.00004,
        circlePulse: false
      };

      /*** Class that handles animation size. */
      var MyAnimationSize = (function() {
        /*** constructor */
        function MyAnimationSize() {
          this.setSize(0, 0);
        }

        /*** Updates the available size */
        MyAnimationSize.prototype.setSize = function(w, h) {
          var winSizeMlt = Math.min(w / 1980, h / 1200);
          this.width = w;
          this.height = h;
          this.radMax = config.radMax * winSizeMlt;
          this.radThreshold = 25 * winSizeMlt; //IFF special, over this radius concentric, otherwise filled
          this.circleBorder = 10 * winSizeMlt;
          this.maxCircles = 35 * winSizeMlt; // number of circles
        };
        return MyAnimationSize;
      })();

      /*** Class that handles an animation layer (geometry + canvas). */
      var MyAnimationLayer = (function() {

        /*** constructor */
        function MyAnimationLayer(sizeConfig, isBackground) {

          // Global isBackground field that is applied to all circles of this instance.
          this.isBackground = isBackground;

          this.sizeConfig = sizeConfig;
          this.isBackground = isBackground;
          this.sizeConfig = sizeConfig;
          this.circles = [];
        }

        /*** Initializes a circle. */
        MyAnimationLayer.prototype.resetCircle = function(a) {
          var isBg = this.isBackground,
            width = this.sizeConfig.width,
            height = this.sizeConfig.height;
          a.x = randRange(-width / 2, width / 2);
          a.y = randRange(-height / 2, height / 2);
          a.radius = (isBg ? config.backgroundMlt : 1) * hyperRange(config.radMin, this.sizeConfig.radMax);
          a.filled = a.radius < this.sizeConfig.radThreshold ? (randint(0, 100) > config.filledCircle ? false : "full") : (randint(0, 100) > config.concentricCircle ? false : "concentric");
          a.color = isBg ? config.bgColors[randint(0, config.bgColors.length - 1)] : config.colors[randint(0, config.colors.length - 1)];
          a.borderColor = isBg ? config.bgColors[randint(0, config.bgColors.length - 1)] : config.colors[randint(0, config.colors.length - 1)];
          a.opacity = 0.05;
          a.speed = (isBg ? 1 / config.backgroundMlt : 1) * randRange(config.speedMin, config.speedMax);
          a.speedAngle = Math.random() * 2 * Math.PI;
          a.speedx = Math.cos(a.speedAngle) * a.speed;
          a.speedy = Math.sin(a.speedAngle) * a.speed;
          var spacex = Math.abs((a.x - (a.speedx < 0 ? -1 : 1) * (window.innerWidth / 2 + a.radius)) / a.speedx),
            spacey = Math.abs((a.y - (a.speedy < 0 ? -1 : 1) * (window.innerHeight / 2 + a.radius)) / a.speedy);
          a.ttl = Math.min(spacex, spacey);
        };

        /*** Geometry update. */
        MyAnimationLayer.prototype.update = function() {
          var a, circles = this.circles,
            isBg = this.isBackground,
            sizeConfig = this.sizeConfig,
            circlesCount = sizeConfig.maxCircles;
          // Updates the size of the array.
          if (isBg)
            circlesCount *= 0.5;
          if (circles.length > circlesCount) {
            // Reduce the size of the array.
            circles.splice(circlesCount, circles.length - circlesCount);
          } else {
            while (circles.length < circlesCount) {
              // Increase the size of the array.
              a = {};
              this.resetCircle(a);
              circles.push(a);
            }
          }
          // Update all the circles.
          for (var i = 0; i < circles.length; i++) {
            a = circles[i];
            if (a.ttl < -20)
              this.resetCircle(circles[i]);
            var radius = isBg ? a.radius * config.circleExp : a.radius /= config.circleExp;
            a.radius = radius;
            a.lineWidth = Math.max(1, sizeConfig.circleBorder * (config.radMin - a.radius) / (config.radMin - sizeConfig.radMax));
            a.x += a.speedx;
            a.y += a.speedy;
            if (a.opacity < (isBg ? config.maxOpacity : 1))
              a.opacity += 0.01;
            a.ttl--;
          }
        };

        /*** Renders this layer to the 2D context. */
        MyAnimationLayer.prototype.render = function(ctx) {
          var i, circles = this.circles,
            isBg = this.isBackground;
          var offSet = isBg ? -2 * this.sizeConfig.width : 0;
          for (i = 0; i < circles.length; i++) {
            var a = circles[i];
            ctx.beginPath();
            ctx.arc(a.x + offSet, a.y, a.radius * config.circleExp, 0, 2 * Math.PI, false);
            if (isBg) {
              ctx.shadowColor = "rgba(" + a.borderColor + "," + a.opacity + ")";
              ctx.shadowBlur = config.blur;
              ctx.shadowOffsetX = -offSet;
              ctx.fillStyle = "#000";
            } else {
              ctx.fillStyle = "rgba(" + a.borderColor + "," + (isBg ? a.opacity * 0.8 : a.opacity) + ")";
            }
            if (a.filled === "full") {
              ctx.fill();
            } else {
              ctx.lineWidth = a.lineWidth;
              ctx.strokeStyle = "rgba(" + a.borderColor + "," + a.opacity + ")";
              ctx.stroke();
            }
            if (a.filled === "concentric") {
              ctx.beginPath();
              ctx.arc(a.x + offSet, a.y, a.radius * 0.5, 0, 2 * Math.PI, false);
              ctx.lineWidth = a.lineWidth;
              if (isBg) {
                ctx.strokeStyle = "#000";
                ctx.shadowColor = "rgba(" + a.color + "," + a.opacity + ")";
                ctx.shadowBlur = config.blur;
                ctx.shadowOffsetX = -offSet;
              } else {
                ctx.strokeStyle = "rgba(" + a.color + "," + a.opacity + ")";
              }
              ctx.stroke();
            }
            for (var j = i + 1; j < circles.length; j++) {
              var b = circles[j];
              var deltax = a.x - b.x;
              var deltay = a.y - b.y;
              var dist = Math.sqrt(deltax * deltax + deltay * deltay);
              //if the circles are overlapping, no laser connecting them
              if (dist <= a.radius + b.radius)
                continue;
              //otherwise we connect them only if the dist is < linkDist
              if (dist < config.linkDist) {
                var xi = (a.x < b.x ? 1 : -1) * Math.abs(a.radius * deltax / dist);
                var yi = (a.y < b.y ? 1 : -1) * Math.abs(a.radius * deltay / dist);
                var xj = (a.x < b.x ? -1 : 1) * Math.abs(b.radius * deltax / dist);
                var yj = (a.y < b.y ? -1 : 1) * Math.abs(b.radius * deltay / dist);
                ctx.beginPath();
                ctx.moveTo(a.x + xi + offSet, a.y + yi);
                ctx.lineTo(b.x + xj + offSet, b.y + yj);
                ctx.lineWidth = (isBg ? config.lineBorder * config.backgroundMlt : config.lineBorder) * ((config.linkDist - dist) / config.linkDist);
                var clr = "rgba(" + a.borderColor + "," + (Math.min(a.opacity, b.opacity) * ((config.linkDist - dist) / config.linkDist)) + ")";
                if (isBg) {
                  ctx.strokeStyle = "#000";
                  ctx.shadowColor = clr;
                  ctx.shadowBlur = config.blur;
                  ctx.shadowOffsetX = -offSet;
                } else {
                  ctx.strokeStyle = clr;
                }
                ctx.stroke();
              }
            }
          }
        };
        return MyAnimationLayer;
      })();

      /*** The main canvas animation class. Handles the canvas context, resize and rendering. */
      var MyAnimation = (function() {

        /*** constructor */
        function MyAnimation(sizeConfig, elementId) {
          this.sizeConfig = sizeConfig;
          this.elementId = elementId;
          this.sizeConfig = sizeConfig;
          this.elementId = elementId;
          this.context = null;
          this.bgLayer = new MyAnimationLayer(sizeConfig, true);
          this.fgLayer = new MyAnimationLayer(sizeConfig, false);
        }

        /*** Gets the HTML Canvas element for this animation. */
        MyAnimation.prototype.getElement = function() {
          return (document.getElementById ? (document.getElementById(this.elementId)) : null);
        };

        /*** Tries to load the 2D canvas context. */
        MyAnimation.prototype.loadContext = function() {
          var e = this.getElement();
          if (e && e.getContext) {
            var ctx = e.getContext("2d");
            if (ctx) {
              this.context = ctx;
              return true;
            }
          }
          return false; // Context or element not found.
        };

        /*** Called to resize the canvas. */
        MyAnimation.prototype.setSize = function(w, h) {
          this.sizeConfig.setSize(w, h);
          var e = this.getElement();
          if (e) {
            e.style.width = w + "px";
            e.style.height = h + "px";
            e.width = w;
            e.height = h;
          }
        };

        /*** Updates geometry. */
        MyAnimation.prototype.update = function(time) {
          this.bgLayer.update();
          this.fgLayer.update();
        };

        /*** Renders the animation. */
        MyAnimation.prototype.render = function() {
          var ctx = this.context,
            w2 = this.sizeConfig.width / 2,
            h2 = this.sizeConfig.height / 2;
          // reset transform and translate
          ctx.setTransform(1, 0, 0, 1, w2, h2);
          // clear canvas
          ctx.clearRect(-w2, -h2, this.sizeConfig.width, this.sizeConfig.height);
          this.bgLayer.render(ctx);
          this.fgLayer.render(ctx);
        };

        return MyAnimation;
      })();

      var myAnimation = new MyAnimation(new MyAnimationSize(), "canvas");

      // Allows the execution of animation frames with an upper frame rate limit and with the possibility to stop.
      function limitLoop(fn, fps) {
        if (!requestAnimationFrame)
          return false;
        var then = new Date().getTime(),
          interval = 1000 / fps;

        function loop(time) {
          var now = new Date().getTime(),
            delta = now - then;
          if (delta > interval) {
            then = now - (delta % interval);
            if (!fn(time))
              return false;
          }
          requestAnimationFrame(loop);
          return true;
        };

        requestAnimationFrame(loop);
        return true;
      }

      var titles = $("#title > h2 > span");
      var activeTitleState = 0;
      var activeTitleIndex = 0;

      /*** Finite state machine function for texts fade animation. */
      function myTimer() {
        var nextTitleIndex = (activeTitleIndex + 1) % titles.length;
        switch (activeTitleState) {
          case 0: // Fade out
            $(titles[activeTitleIndex]).css({
              opacity: 0
            });
            setTimeout(myTimer, config.textAnimationTime + 50);
            activeTitleState = 1;
            break;
          case 1: // Switch visibility
            $(titles[activeTitleIndex]).css({
              opacity: 0,
              display: "none"
            });
            $(titles[nextTitleIndex]).css({
              opacity: 0,
              display: "inline"
            });
            setTimeout(myTimer, 50);
            activeTitleState = 2;
            break;
          default: // Fade in
            $(titles[nextTitleIndex]).css({
              opacity: 1
            });
            activeTitleIndex = nextTitleIndex;
            setTimeout(myTimer, config.textAnimationTime + 50);
            activeTitleState = 0;
            break;
        }
      }

      // Start the texts animation
      setTimeout(myTimer, 1000);

      // The animation resize function.
      function animationResize() {
        myAnimation.setSize(window.innerWidth, window.innerHeight);
      };

      // First resize.
      animationResize();

      // Attach the window resize event
      $(window).resize(animationResize);

      if (myAnimation.loadContext()) {
        // Starts the canvas animation
        limitLoop(function(time) {
          myAnimation.update(time);
          myAnimation.render();
          return true;
        }, 60);
      }

    });

    $('#toggle').click(function() {
       $(this).toggleClass('active');
      console.log($('#toggle').attr('class'));
       $('#overlay').toggleClass('open');
    });
}

function initLoadMore() {
    jQuery('.load-more-holder').loadMore({
        linkSelector: 'a.load-more',
        additionBottomOffset: 50
    });
}


function initlocation(){
    $("#location-bar a").click(function(event){
      event.preventDefault();
      
      var $this = $(this),
          $li = $this.parent(),
          selectedMap = $this.attr("href"),
          selectedLocation = $this.data('location');
     
      $li.addClass('active').siblings('li').removeClass('active');

      //Update #map bkimage with the image from the location
      $('#map').css('background-image', 'url(' + selectedMap + ')');  
      //update tooltip 'address'
      $('.selectedLocation').text(selectedLocation);
    });
}

function initMasonry() {
    jQuery(window).on('load masonry/refresh', function() {
        jQuery('.js-masonry').masonry('layout');
    });
}

function switchTabBySelect() {
    jQuery('.nav-tabs').each(function(){
        var tabSet = jQuery(this);
        var links = tabSet.find('a');
        var select = tabSet.siblings('select');

        links.on('click', function(){
            select.prop('selectedIndex', links.index(jQuery(this)) + 1);
        });

        select.on('change', function(){
            links.eq(this.selectedIndex - 1).trigger('click');
        });
    });
}


// tooltip
function initTooltip() {
    jQuery('[data-toggle="tooltip"]').tooltip();
}

// fade gallery init
function initSlideShow() {
    jQuery('.slideshow').fadeGallery({
        slides: '.slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        generatePagination: '.pagination',
        event: 'click',
        useSwipe: true,
        autoRotation: true,
        switchTime: 5000,
        animSpeed: 500
    });
}

// mobile menu init
function initMobileNav() {
    jQuery('body').mobileNav({
        hideOnClickOutside: true,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        menuDrop: '.menu'
    });
}

// add classes if item has dropdown
function initDropDownClasses() {
    jQuery('#nav li').each(function() {
        var item = jQuery(this);
        var drop = item.find('ul');
        var link = item.find('a').eq(0);
        if(drop.length) {
            item.addClass('has-drop-down');
            if(link.length) link.addClass('has-drop-down-a');
        }
    });
}

// add classes on hover/touch
function initCustomHover() {
    jQuery('.menu li a').touchHover({hoverClass: 'is-active'});
}


// generate select from navigation
function initNavigationSelect() {
    jQuery('.tab-header ul').navigationSelect({
        defaultOptionAttr: 'title',
        defaultOptionText: '',
        selectClass: 'tab-select',
        activeClass: 'tab-active'
    });
    jQuery('.tab-header-inner ul').navigationSelect({
        defaultOptionAttr: 'title',
        defaultOptionText: '',
        selectClass: 'tab-select',
        activeClass: 'inner-tab-active'
    });
    jQuery('.feature-nav ul').navigationSelect({
        defaultOptionAttr: 'title',
        defaultOptionText: '',
        selectClass: 'tab-select'
    });
}
/*
 * Convert navigation to select
 */
 ;(function($) {
    function NavigationSelect(options) {
        this.options = $.extend({
            list: null,
            levelIndentHTML: ' &bull; ',
            defaultOptionAttr: 'title',
            defaultOptionText: '...',
            selectClass: 'nav-select',
            activeClass: 'nav-active',
            defaultOptionClass: 'opt-default',
            hasDropClass: 'opt-sublevel',
            levelPrefixClass: 'opt-level-',
            useDefaultOption: true
        }, options);
        if(this.options.list) {
            this.createSelect();
            this.attachEvents();
        }
    }
    NavigationSelect.prototype = {
        createSelect: function() {
            var self = this;
            this.startIndex = 0;
            this.navigation = $(this.options.list);
            this.select = $('<select>').addClass(this.options.selectClass);
            this.createDefaultOption();
            this.createList(this.navigation, 0);
            this.select.insertBefore(this.navigation);
        },
        createDefaultOption: function() {
            if(this.options.useDefaultOption) {
                var attrText = this.navigation.attr(this.options.defaultOptionAttr);
                var defaultOption = $('<option>').addClass(this.options.defaultOptionClass).text(attrText || this.options.defaultOptionText);
                this.navigation.removeAttr(this.options.defaultOptionAttr);
                this.select.append(defaultOption);
                this.startIndex = 1;
            }
        },
        createList: function(list, level) {
            var self = this;
            list.children().each(function(index, item) {
                var listItem = $(this),
                listLink = listItem.find('a').eq(0),
                listDrop = listItem.find('ul').eq(0),
                hasDrop = listDrop.length > 0;

                if(listLink.length) {
                    self.select.append(self.createOption(listLink, hasDrop, level, listLink.hasClass(self.options.activeClass)));
                }
                if(hasDrop) {
                    self.createList(listDrop, level + 1);
                }
            });
        },
        createOption: function(link, hasDrop, level, selected) {
            var optionHTML = this.getLevelIndent(level) + link.html();
            return $('<option>').html(optionHTML)
            .addClass(this.options.levelPrefixClass + (level + 1))
            .toggleClass(this.options.hasDropClass, hasDrop)
            .val(link.attr('href')).attr('selected', selected ? 'selected' : false);
        },
        getLevelIndent: function(level) {
            return (new Array(level + 1)).join(this.options.levelIndentHTML);
        },
        attachEvents: function() {
            // redirect on select change
            var self = this;
            this.select.change(function() {
                if(this.selectedIndex >= self.startIndex) {
                    location.href = this.value;
                }
            });
        }
    };

    // jquery pluginm interface
    $.fn.navigationSelect = function(opt) {
        return this.each(function() {
            new NavigationSelect($.extend({list: this}, opt));
        });
    };
}(jQuery));


/*
 * jQuery Load More plugin
 */
 ;(function($, $win) {
    'use strict';

    var ScrollLoader = {
        attachEvents: function() {
            var self = this;

            $win.on('load.ScrollLoader resize.ScrollLoader orientationchange.ScrollLoader', function() { self.onResizeHandler(); });
            $win.on('scroll.ScrollLoader', function() { self.onScrollHandler(); });
            this.$holder.on('ContentLoader/loaded.ScrollLoader', function() { self.onResizeHandler(); });

            this.winProps = {};
            this.holderProps = {};
            this.onResizeHandler();
        },

        onResizeHandler: function() {
            this.winProps.height = $win.height();
            this.holderProps.height = this.$holder.outerHeight();
            this.holderProps.offset = this.$holder.offset().top;

            this.onScrollHandler();
        },

        onScrollHandler: function() {
            this.winProps.scroll = $win.scrollTop();

            if (this.winProps.scroll + this.winProps.height + Math.min(1, this.options.additionBottomOffset) > this.holderProps.height + this.holderProps.offset) {
                this.loadInclude();
            }
        },

        destroySubEvents: function() {
            $win.off('.ScrollLoader');
            this.$holder.off('.ScrollLoader');
        }
    };

    var ClickLoader = {
        attachEvents: function() {
            var self = this;

            this.$holder.on('click.ClickLoader', this.options.linkSelector, function(e) { self.onClickHandler(e); });
        },

        onClickHandler: function(e) {
            e.preventDefault();

            this.loadInclude();
        },

        destroySubEvents: function() {
            this.$holder.off('.ClickLoader');
        }
    };

    var ContentLoader = function($holder, options) {
        this.$holder = $holder;
        this.options = options;

        this.init();
    };

    var ContentLoaderProto = {
        init: function() {
            this.$link = this.$holder.find(this.options.linkSelector);
            this.$newContentTarget = this.options.newContentTarget ? this.$holder.find(this.options.newContentTarget) : this.$holder;

            if (!this.$link.length) {
                this.removeInstance();
                return;
            }

            this.attachEvents();
        },

        loadInclude: function() {
            if (this.isBusy) {
                return;
            }

            var self = this;

            this.toggleBusyMode(true);

            $.get(self.$link.attr('href'), function(source) { self.successHandler(source); });
        },

        successHandler: function(include) {
            var $tmpDiv = jQuery('<div>').html(include);
            var $nextIncludeLink = $tmpDiv.find(this.options.linkSelector);

            if ($nextIncludeLink.length) {
                this.refreshLink($nextIncludeLink);
            } else {
                this.destroy();
            }

            this.appendItems($tmpDiv.children());
        },

        appendItems: function($newItems) {
            var self = this;

            this.$newContentTarget.append($newItems.addClass(this.options.preAppendClass));

            setTimeout(function() { // need this timeout coz need some time for css preAppendClass applied to the new items
                $newItems.removeClass(self.options.preAppendClass);

                self.$holder.trigger('ContentLoader/loaded');
                self.toggleBusyMode(false);
            }, 100);

            if (window.picturefill) {
                window.picturefill();
            }
        },

        refreshLink: function($nextIncludeLink) {
            this.$link.attr('href', $nextIncludeLink.attr('href'));
            $nextIncludeLink.remove();
        },

        toggleBusyMode: function(state) {
            this.$holder.toggleClass(this.options.busyClass, state);
            this.isBusy = state;
        },

        removeInstance: function() {
            this.$holder.removeData('ContentLoader');
        },

        destroy: function() {
            this.removeInstance();
            this.destroySubEvents();

            this.$link.remove();
        }
    };

    $.fn.loadMore = function(options) {
        options = $.extend({
            scroll: false,
            linkSelector: '.load-more',
            newContentTarget: null,
            busyClass: 'is-busy',
            additionBottomOffset: 50,
            preAppendClass: 'new-item'
        }, options);
        
        return this.each(function() {
            var $holder = $(this);

            ContentLoader.prototype = $.extend(options.scroll ? ScrollLoader : ClickLoader, ContentLoaderProto);

            $holder.data('ContentLoader', new ContentLoader($holder, options));
        });
    };
 }(jQuery, jQuery(window)));

/*
 * jQuery SlideShow plugin
 */
;(function($){
    function FadeGallery(options) {
        this.options = $.extend({
            slides: 'ul.slideset > li',
            activeClass:'active',
            disabledClass:'disabled',
            btnPrev: 'a.btn-prev',
            btnNext: 'a.btn-next',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            pagerLinks: '.pagination li',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            btnPlay: '.btn-play',
            btnPause: '.btn-pause',
            btnPlayPause: '.btn-play-pause',
            galleryReadyClass: 'gallery-js-ready',
            autorotationActiveClass: 'autorotation-active',
            autorotationDisabledClass: 'autorotation-disabled',
            autorotationStopAfterClick: false,
            circularRotation: true,
            switchSimultaneously: true,
            disableWhileAnimating: false,
            disableFadeIE: false,
            autoRotation: false,
            pauseOnHover: true,
            autoHeight: false,
            useSwipe: false,
            swipeThreshold: 15,
            switchTime: 4000,
            animSpeed: 600,
            event:'click'
        }, options);
        this.init();
    }
    FadeGallery.prototype = {
        init: function() {
            if(this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.refreshState(true);
                this.autoRotate();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function() {
            // control elements
            this.gallery = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.slides = this.gallery.find(this.options.slides);
            this.slidesHolder = this.slides.eq(0).parent();
            this.stepsCount = this.slides.length;
            this.btnPrev = this.gallery.find(this.options.btnPrev);
            this.btnNext = this.gallery.find(this.options.btnNext);
            this.currentIndex = 0;

            // disable fade effect in old IE
            if(this.options.disableFadeIE && !$.support.opacity) {
                this.options.animSpeed = 0;
            }

            // create gallery pagination
            if(typeof this.options.generatePagination === 'string') {
                this.pagerHolder = this.gallery.find(this.options.generatePagination).empty();
                this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                for(var i = 0; i < this.stepsCount; i++) {
                    $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
                }
                this.pagerLinks = this.pagerList.children();
            } else {
                this.pagerLinks = this.gallery.find(this.options.pagerLinks);
            }

            // get start index
            var activeSlide = this.slides.filter('.'+this.options.activeClass);
            if(activeSlide.length) {
                this.currentIndex = this.slides.index(activeSlide);
            }
            this.prevIndex = this.currentIndex;

            // autorotation control buttons
            this.btnPlay = this.gallery.find(this.options.btnPlay);
            this.btnPause = this.gallery.find(this.options.btnPause);
            this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);

            // misc elements
            this.curNum = this.gallery.find(this.options.currentNumber);
            this.allNum = this.gallery.find(this.options.totalNumber);

            // handle flexible layout
            this.slides.css({display:'block',opacity:0}).eq(this.currentIndex).css({
                opacity:''
            });
        },
        attachEvents: function() {
            var self = this;

            // flexible layout handler
            this.resizeHandler = function() {
                self.onWindowResize();
            };
            $(window).bind('load resize orientationchange', this.resizeHandler);

            if(this.btnPrev.length) {
                this.btnPrevHandler = function(e){
                    e.preventDefault();
                    self.prevSlide();
                    if(self.options.autorotationStopAfterClick) {
                        self.stopRotation();
                    }
                };
                this.btnPrev.bind(this.options.event, this.btnPrevHandler);
            }
            if(this.btnNext.length) {
                this.btnNextHandler = function(e) {
                    e.preventDefault();
                    self.nextSlide();
                    if(self.options.autorotationStopAfterClick) {
                        self.stopRotation();
                    }
                };
                this.btnNext.bind(this.options.event, this.btnNextHandler);
            }
            if(this.pagerLinks.length) {
                this.pagerLinksHandler = function(e) {
                    e.preventDefault();
                    self.numSlide(self.pagerLinks.index(e.currentTarget));
                    if(self.options.autorotationStopAfterClick) {
                        self.stopRotation();
                    }
                };
                this.pagerLinks.bind(self.options.event, this.pagerLinksHandler);
            }

            // autorotation buttons handler
            if(this.btnPlay.length) {
                this.btnPlayHandler = function(e) {
                    e.preventDefault();
                    self.startRotation();
                };
                this.btnPlay.bind(this.options.event, this.btnPlayHandler);
            }
            if(this.btnPause.length) {
                this.btnPauseHandler = function(e) {
                    e.preventDefault();
                    self.stopRotation();
                };
                this.btnPause.bind(this.options.event, this.btnPauseHandler);
            }
            if(this.btnPlayPause.length) {
                this.btnPlayPauseHandler = function(e){
                    e.preventDefault();
                    if(!self.gallery.hasClass(self.options.autorotationActiveClass)) {
                        self.startRotation();
                    } else {
                        self.stopRotation();
                    }
                };
                this.btnPlayPause.bind(this.options.event, this.btnPlayPauseHandler);
            }

            // swipe gestures handler
            if(this.options.useSwipe && window.Hammer && isTouchDevice) {
                this.swipeHandler = new Hammer.Manager(this.gallery[0]);
                this.swipeHandler.add(new Hammer.Swipe({
                    direction: Hammer.DIRECTION_HORIZONTAL,
                    threshold: self.options.swipeThreshold
                }));
                this.swipeHandler.on('swipeleft', function() {
                    self.nextSlide();
                }).on('swiperight', function() {
                    self.prevSlide();
                });
            }

            // pause on hover handling
            if(this.options.pauseOnHover) {
                this.hoverHandler = function() {
                    if(self.options.autoRotation) {
                        self.galleryHover = true;
                        self.pauseRotation();
                    }
                };
                this.leaveHandler = function() {
                    if(self.options.autoRotation) {
                        self.galleryHover = false;
                        self.resumeRotation();
                    }
                };
                this.gallery.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            }
        },
        onWindowResize: function(){
            if(this.options.autoHeight) {
                this.slidesHolder.css({height: this.slides.eq(this.currentIndex).outerHeight(true) });
            }
        },
        prevSlide: function() {
            if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                this.prevIndex = this.currentIndex;
                if(this.currentIndex > 0) {
                    this.currentIndex--;
                    this.switchSlide();
                } else if(this.options.circularRotation) {
                    this.currentIndex = this.stepsCount - 1;
                    this.switchSlide();
                }
            }
        },
        nextSlide: function(fromAutoRotation) {
            if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                this.prevIndex = this.currentIndex;
                if(this.currentIndex < this.stepsCount - 1) {
                    this.currentIndex++;
                    this.switchSlide();
                } else if(this.options.circularRotation || fromAutoRotation === true) {
                    this.currentIndex = 0;
                    this.switchSlide();
                }
            }
        },
        numSlide: function(c) {
            if(this.currentIndex != c) {
                this.prevIndex = this.currentIndex;
                this.currentIndex = c;
                this.switchSlide();
            }
        },
        switchSlide: function() {
            var self = this;
            if(this.slides.length > 1) {
                this.galleryAnimating = true;
                if(!this.options.animSpeed) {
                    this.slides.eq(this.prevIndex).css({opacity:0});
                } else {
                    this.slides.eq(this.prevIndex).stop().animate({opacity:0},{duration: this.options.animSpeed});
                }

                this.switchNext = function() {
                    if(!self.options.animSpeed) {
                        self.slides.eq(self.currentIndex).css({opacity:''});
                    } else {
                        self.slides.eq(self.currentIndex).stop().animate({opacity:1},{duration: self.options.animSpeed});
                    }
                    clearTimeout(this.nextTimer);
                    this.nextTimer = setTimeout(function() {
                        self.slides.eq(self.currentIndex).css({opacity:''});
                        self.galleryAnimating = false;
                        self.autoRotate();

                        // onchange callback
                        self.makeCallback('onChange', self);
                    }, self.options.animSpeed);
                };

                if(this.options.switchSimultaneously) {
                    self.switchNext();
                } else {
                    clearTimeout(this.switchTimer);
                    this.switchTimer = setTimeout(function(){
                        self.switchNext();
                    }, this.options.animSpeed);
                }
                this.refreshState();

                // onchange callback
                this.makeCallback('onBeforeChange', this);
            }
        },
        refreshState: function(initial) {
            this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.curNum.html(this.currentIndex+1);
            this.allNum.html(this.stepsCount);

            // initial refresh
            if(this.options.autoHeight) {
                if(initial) {
                    this.slidesHolder.css({height: this.slides.eq(this.currentIndex).outerHeight(true) });
                } else {
                    this.slidesHolder.stop().animate({height: this.slides.eq(this.currentIndex).outerHeight(true)}, {duration: this.options.animSpeed});
                }
            }

            // disabled state
            if(!this.options.circularRotation) {
                this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
                if(this.currentIndex === 0) this.btnPrev.addClass(this.options.disabledClass);
                if(this.currentIndex === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
            }

            // add class if not enough slides
            this.gallery.toggleClass('not-enough-slides', this.stepsCount === 1);
        },
        startRotation: function() {
            this.options.autoRotation = true;
            this.galleryHover = false;
            this.autoRotationStopped = false;
            this.resumeRotation();
        },
        stopRotation: function() {
            this.galleryHover = true;
            this.autoRotationStopped = true;
            this.pauseRotation();
        },
        pauseRotation: function() {
            this.gallery.addClass(this.options.autorotationDisabledClass);
            this.gallery.removeClass(this.options.autorotationActiveClass);
            clearTimeout(this.timer);
        },
        resumeRotation: function() {
            if(!this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.gallery.removeClass(this.options.autorotationDisabledClass);
                this.autoRotate();
            }
        },
        autoRotate: function() {
            var self = this;
            clearTimeout(this.timer);
            if(this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.timer = setTimeout(function(){
                    self.nextSlide(true);
                }, this.options.switchTime);
            } else {
                this.pauseRotation();
            }
        },
        makeCallback: function(name) {
            if(typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function() {
            // navigation buttons handler
            this.btnPrev.unbind(this.options.event, this.btnPrevHandler);
            this.btnNext.unbind(this.options.event, this.btnNextHandler);
            this.pagerLinks.unbind(this.options.event, this.pagerLinksHandler);
            $(window).unbind('load resize orientationchange', this.resizeHandler);

            // remove autorotation handlers
            this.stopRotation();
            this.btnPlay.unbind(this.options.event, this.btnPlayHandler);
            this.btnPause.unbind(this.options.event, this.btnPauseHandler);
            this.btnPlayPause.unbind(this.options.event, this.btnPlayPauseHandler);
            this.gallery.unbind('mouseenter', this.hoverHandler);
            this.gallery.unbind('mouseleave', this.leaveHandler);

            // remove swipe handler if used
            if(this.swipeHandler) {
                this.swipeHandler.destroy();
            }
            if(typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }

            // remove unneeded classes and styles
            var unneededClasses = [this.options.galleryReadyClass, this.options.autorotationActiveClass, this.options.autorotationDisabledClass];
            this.gallery.removeClass(unneededClasses.join(' '));
            this.slidesHolder.add(this.slides).removeAttr('style');
        }
    };

    // detect device type
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jquery plugin
    $.fn.fadeGallery = function(opt){
        return this.each(function(){
            $(this).data('FadeGallery', new FadeGallery($.extend(opt,{holder:this})));
        });
    };
}(jQuery));

/*
 * Simple Mobile Navigation
 */
;(function($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }
    MobileNav.prototype = {
        initStructure: function() {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function() {
            var self = this;

            if(activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function(e) {
                if(self.isOpened()) {
                    var target = $(e.target);
                    if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };

            this.openerClickHandler = function(e) {
                e.preventDefault();
                self.toggle();
            };

            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function() {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function() {
            this.container.addClass(this.options.menuActiveClass);
            if(this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function() {
            this.container.removeClass(this.options.menuActiveClass);
            if(this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function() {
            if(this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function() {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function() {
        var win = $(window),
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
        var removeClassHandler = function() {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function() {
            if(!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.mobileNav = function(options) {
        return this.each(function() {
            var params = $.extend({}, options, {container: this}),
                instance = new MobileNav(params);
            $.data(this, 'MobileNav', instance);
        });
    };
}(jQuery));

/*
 * Mobile hover plugin
 */
;(function($){

    // detect device type
    var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);

    // define events
    var eventOn = (isTouchDevice && 'touchstart') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerdown') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerDown') || 'mouseenter',
        eventOff = (isTouchDevice && 'touchend') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerup') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerUp') || 'mouseleave';

    // event handlers
    var toggleOn, toggleOff, preventHandler;
    if(isTouchDevice || isWinPhoneDevice) {
        // prevent click handler
        preventHandler = function(e) {
            e.preventDefault();
        };

        // touch device handlers
        toggleOn = function(e) {
            var options = e.data, element = $(this);

            var toggleOff = function(e) {
                var target = $(e.target);
                if (!target.is(element) && !target.closest(element).length) {
                    element.removeClass(options.hoverClass);
                    element.off('click', preventHandler);
                    if(options.onLeave) options.onLeave(element);
                    $(document).off(eventOn, toggleOff);
                }
            };

            if(!element.hasClass(options.hoverClass)) {
                element.addClass(options.hoverClass);
                element.one('click', preventHandler);
                $(document).on(eventOn, toggleOff);
                if(options.onHover) options.onHover(element);
            }
        };
    } else {
        // desktop browser handlers
        toggleOn = function(e) {
            var options = e.data, element = $(this);
            element.addClass(options.hoverClass);
            $(options.context).on(eventOff, options.selector, options, toggleOff);
            if(options.onHover) options.onHover(element);
        };
        toggleOff = function(e) {
            var options = e.data, element = $(this);
            element.removeClass(options.hoverClass);
            $(options.context).off(eventOff, options.selector, toggleOff);
            if(options.onLeave) options.onLeave(element);
        };
    }

    // jQuery plugin
    $.fn.touchHover = function(opt) {
        var options = $.extend({
            context: this.context,
            selector: this.selector,
            hoverClass: 'hover'
        }, opt);

        $(this.context).on(eventOn, this.selector, options, toggleOn);
        return this;
    };
}(jQuery));


!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(window),function(){function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a){function b(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function c(){}function d(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=g.length;c>b;b++){var d=g[b];a[d]=0}return a}function e(c){function e(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||f("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=c("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var g=document.body||document.documentElement;g.appendChild(e);var h=j(e);l=200===b(h.width),g.removeChild(e)}}}function h(a){if(e(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var c=j(a);if("none"===c.display)return d();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var h=f.isBorderBox=!(!k||!c[k]||"border-box"!==c[k]),m=0,n=g.length;n>m;m++){var o=g[m],p=c[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=h&&l,y=b(c.width);y!==!1&&(f.width=y+(x?0:r+v));var z=b(c.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return h}var f="undefined"==typeof console?c:function(a){console.error(a)},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property")):a.getSize=e(a.getStyleProperty)}(window),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(a){function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matches)return"matches";if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a,b){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(c,d){return b(a,c,d)}):"object"==typeof exports?module.exports=b(a,require("doc-ready"),require("desandro-matches-selector")):a.fizzyUIUtils=b(a,a.docReady,a.matchesSelector)}(window,function(a,b,c){var d={};d.extend=function(a,b){for(var c in b)a[c]=b[c];return a},d.modulo=function(a,b){return(a%b+b)%b};var e=Object.prototype.toString;d.isArray=function(a){return"[object Array]"==e.call(a)},d.makeArray=function(a){var b=[];if(d.isArray(a))b=a;else if(a&&"number"==typeof a.length)for(var c=0,e=a.length;e>c;c++)b.push(a[c]);else b.push(a);return b},d.indexOf=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},d.removeFrom=function(a,b){var c=d.indexOf(a,b);-1!=c&&a.splice(c,1)},d.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1==a.nodeType&&"string"==typeof a.nodeName},d.setText=function(){function a(a,c){b=b||(void 0!==document.documentElement.textContent?"textContent":"innerText"),a[b]=c}var b;return a}(),d.getParent=function(a,b){for(;a!=document.body;)if(a=a.parentNode,c(a,b))return a},d.getQueryElement=function(a){return"string"==typeof a?document.querySelector(a):a},d.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},d.filterFindElements=function(a,b){a=d.makeArray(a);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f];if(d.isElement(h))if(b){c(h,b)&&e.push(h);for(var i=h.querySelectorAll(b),j=0,k=i.length;k>j;j++)e.push(i[j])}else e.push(h)}return e},d.debounceMethod=function(a,b,c){var d=a.prototype[b],e=b+"Timeout";a.prototype[b]=function(){var a=this[e];a&&clearTimeout(a);var b=arguments,f=this;this[e]=setTimeout(function(){d.apply(f,b),delete f[e]},c||100)}},d.toDashed=function(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()};var f=a.console;return d.htmlInit=function(c,e){b(function(){for(var b=d.toDashed(e),g=document.querySelectorAll(".js-"+b),h="data-"+b+"-options",i=0,j=g.length;j>i;i++){var k,l=g[i],m=l.getAttribute(h);try{k=m&&JSON.parse(m)}catch(n){f&&f.error("Error parsing "+h+" on "+l.nodeName.toLowerCase()+(l.id?"#"+l.id:"")+": "+n);continue}var o=new c(l,k),p=a.jQuery;p&&p.data(l,e,o)}})},d}),function(a,b){"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(c,d,e,f){return b(a,c,d,e,f)}):"object"==typeof exports?module.exports=b(a,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(a.Outlayer={},a.Outlayer.Item=b(a,a.EventEmitter,a.getSize,a.getStyleProperty,a.fizzyUIUtils))}(window,function(a,b,c,d,e){function f(a){for(var b in a)return!1;return b=null,!0}function g(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}function h(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}var i=a.getComputedStyle,j=i?function(a){return i(a,null)}:function(a){return a.currentStyle},k=d("transition"),l=d("transform"),m=k&&l,n=!!d("perspective"),o={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[k],p=["transform","transition","transitionDuration","transitionProperty"],q=function(){for(var a={},b=0,c=p.length;c>b;b++){var e=p[b],f=d(e);f&&f!==e&&(a[e]=f)}return a}();e.extend(g.prototype,b.prototype),g.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.getSize=function(){this.size=c(this.element)},g.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=q[c]||c;b[d]=a[c]}},g.prototype.getPosition=function(){var a=j(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=a[c?"left":"right"],f=a[d?"top":"bottom"],g=this.layout.size,h=-1!=e.indexOf("%")?parseFloat(e)/100*g.width:parseInt(e,10),i=-1!=f.indexOf("%")?parseFloat(f)/100*g.height:parseInt(f,10);h=isNaN(h)?0:h,i=isNaN(i)?0:i,h-=c?g.paddingLeft:g.paddingRight,i-=d?g.paddingTop:g.paddingBottom,this.position.x=h,this.position.y=i},g.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={},d=b.isOriginLeft?"paddingLeft":"paddingRight",e=b.isOriginLeft?"left":"right",f=b.isOriginLeft?"right":"left",g=this.position.x+a[d];c[e]=this.getXValue(g),c[f]="";var h=b.isOriginTop?"paddingTop":"paddingBottom",i=b.isOriginTop?"top":"bottom",j=b.isOriginTop?"bottom":"top",k=this.position.y+a[h];c[i]=this.getYValue(k),c[j]="",this.css(c),this.emitEvent("layout",[this])},g.prototype.getXValue=function(a){var b=this.layout.options;return b.percentPosition&&!b.isHorizontal?a/this.layout.size.width*100+"%":a+"px"},g.prototype.getYValue=function(a){var b=this.layout.options;return b.percentPosition&&b.isHorizontal?a/this.layout.size.height*100+"%":a+"px"},g.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={};j.transform=this.getTranslate(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},g.prototype.getTranslate=function(a,b){var c=this.layout.options;return a=c.isOriginLeft?a:-a,b=c.isOriginTop?b:-b,n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"},g.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},g.prototype.moveTo=m?g.prototype._transitionTo:g.prototype.goTo,g.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},g.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},g.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var r="opacity,"+h(q.transform||"transform");g.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:r,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(o,this,!1))},g.prototype.transition=g.prototype[k?"_transition":"_nonTransition"],g.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},g.prototype.onotransitionend=function(a){this.ontransitionend(a)};var s={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};g.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,c=s[a.propertyName]||a.propertyName;if(delete b.ingProperties[c],f(b.ingProperties)&&this.disableTransition(),c in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[c]),c in b.onEnd){var d=b.onEnd[c];d.call(this),delete b.onEnd[c]}this.emitEvent("transitionEnd",[this])}},g.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(o,this,!1),this.isTransitioning=!1},g.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var t={transitionProperty:"",transitionDuration:""};return g.prototype.removeTransitionStyles=function(){this.css(t)},g.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},g.prototype.remove=function(){if(!k||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.once("transitionEnd",function(){a.removeElem()}),this.hide()},g.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("visibleStyle");b[c]=this.onRevealTransitionEnd,this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},g.prototype.getHideRevealTransitionEndProperty=function(a){var b=this.layout.options[a];if(b.opacity)return"opacity";for(var c in b)return c},g.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("hiddenStyle");b[c]=this.onHideTransitionEnd,this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},g.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},g}),function(a,b){"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(c,d,e,f,g){return b(a,c,d,e,f,g)}):"object"==typeof exports?module.exports=b(a,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):a.Outlayer=b(a,a.eventie,a.EventEmitter,a.getSize,a.fizzyUIUtils,a.Outlayer.Item)}(window,function(a,b,c,d,e,f){function g(a,b){var c=e.getQueryElement(a);if(!c)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(c||a)));this.element=c,i&&(this.$element=i(this.element)),this.options=e.extend({},this.constructor.defaults),this.option(b);var d=++k;this.element.outlayerGUID=d,l[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var h=a.console,i=a.jQuery,j=function(){},k=0,l={};return g.namespace="outlayer",g.Item=f,g.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e.extend(g.prototype,c.prototype),g.prototype.option=function(a){e.extend(this.options,a)},g.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},g.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},g.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},g.prototype._filterFindItemElements=function(a){return e.filterFindElements(a,this.options.itemSelector)},g.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},g.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},g.prototype._init=g.prototype.layout,g.prototype._resetLayout=function(){this.getSize()},g.prototype.getSize=function(){this.size=d(this.element)},g.prototype._getMeasurement=function(a,b){var c,f=this.options[a];f?("string"==typeof f?c=this.element.querySelector(f):e.isElement(f)&&(c=f),this[a]=c?d(c)[b]:f):this[a]=0},g.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},g.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},g.prototype._layoutItems=function(a,b){if(this._emitCompleteOnItems("layout",a),a&&a.length){for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d],g=this._getItemLayoutPosition(f);g.item=f,g.isInstant=b||f.isLayoutInstant,c.push(g)}this._processLayoutQueue(c)}},g.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},g.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},g.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},g.prototype._postLayout=function(){this.resizeContainer()},g.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},g.prototype._getContainerSize=j,g.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},g.prototype._emitCompleteOnItems=function(a,b){function c(){e.dispatchEvent(a+"Complete",null,[b])}function d(){g++,g===f&&c()}var e=this,f=b.length;if(!b||!f)return void c();for(var g=0,h=0,i=b.length;i>h;h++){var j=b[h];j.once(a,d)}},g.prototype.dispatchEvent=function(a,b,c){var d=b?[b].concat(c):c;if(this.emitEvent(a,d),i)if(this.$element=this.$element||i(this.element),b){var e=i.Event(b);e.type=a,this.$element.trigger(e,c)}else this.$element.trigger(a,c)},g.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},g.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},g.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},g.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e.removeFrom(this.stamps,d),this.unignore(d)}},g.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=e.makeArray(a)):void 0},g.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},g.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},g.prototype._manageStamp=j,g.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,e=d(a),f={left:b.left-c.left-e.marginLeft,top:b.top-c.top-e.marginTop,right:c.right-b.right-e.marginRight,bottom:c.bottom-b.bottom-e.marginBottom};return f},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.bindResize=function(){this.isResizeBound||(b.bind(a,"resize",this),this.isResizeBound=!0)},g.prototype.unbindResize=function(){this.isResizeBound&&b.unbind(a,"resize",this),this.isResizeBound=!1},g.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},g.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},g.prototype.needsResizeLayout=function(){var a=d(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},g.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},g.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},g.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},g.prototype.reveal=function(a){this._emitCompleteOnItems("reveal",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.reveal()}},g.prototype.hide=function(a){this._emitCompleteOnItems("hide",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.hide()}},g.prototype.revealItemElements=function(a){var b=this.getItems(a);this.reveal(b)},g.prototype.hideItemElements=function(a){var b=this.getItems(a);this.hide(b)},g.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},g.prototype.getItems=function(a){a=e.makeArray(a);for(var b=[],c=0,d=a.length;d>c;c++){var f=a[c],g=this.getItem(f);g&&b.push(g)}return b},g.prototype.remove=function(a){var b=this.getItems(a);if(this._emitCompleteOnItems("remove",b),b&&b.length)for(var c=0,d=b.length;d>c;c++){var f=b[c];f.remove(),e.removeFrom(this.items,f)}},g.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete l[e],delete this.element.outlayerGUID,i&&i.removeData(this.element,this.constructor.namespace)},g.data=function(a){a=e.getQueryElement(a);var b=a&&a.outlayerGUID;return b&&l[b]},g.create=function(a,b){function c(){g.apply(this,arguments)}return Object.create?c.prototype=Object.create(g.prototype):e.extend(c.prototype,g.prototype),c.prototype.constructor=c,c.defaults=e.extend({},g.defaults),e.extend(c.defaults,b),c.prototype.settings={},c.namespace=a,c.data=g.data,c.Item=function(){f.apply(this,arguments)},c.Item.prototype=new f,e.htmlInit(c,a),i&&i.bridget&&i.bridget(a,c),c},g.Item=f,g}),function(a,b){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):a.Masonry=b(a.Outlayer,a.getSize,a.fizzyUIUtils)}(window,function(a,b,c){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}var d=this.columnWidth+=this.gutter,e=this.containerWidth+this.gutter,f=e/d,g=d-e%d,h=g&&1>g?"round":"floor";f=Math[h](f),this.cols=Math.max(f,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c.indexOf(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d});

// DOM ready handler
function bindReady(handler){
    var called = false;
    var ready = function() {
        if (called) return;
        called = true;
        handler();
    };
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', ready, false);
    } else if (document.attachEvent) {
        if (document.documentElement.doScroll && window == window.top) {
            var tryScroll = function(){
                if (called) return;
                if (!document.body) return;
                try {
                    document.documentElement.doScroll('left');
                    ready();
                } catch(e) {
                    setTimeout(tryScroll, 0);
                }
            };
            tryScroll();
        }
        document.attachEvent('onreadystatechange', function(){
            if (document.readyState === 'complete') {
                ready();
            }
        });
    }
    if (window.addEventListener) window.addEventListener('load', ready, false);
    else if (window.attachEvent) window.attachEvent('onload', ready);
}


/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
if(Object.create){!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");}