
if ((typeof window.Shopify) == 'undefined') {
    window.Shopify = {};
}
var DOMAnimations = {
    slideUp: function(element, duration = 500) {
        return new Promise(function(resolve, reject) {
            element.style.height = element.offsetHeight + 'px';
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            window.setTimeout(function() {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                resolve(false);
            }, duration)
        })
    },

    slideDown: function(element, duration = 500) {
        return new Promise(function(resolve, reject) {
            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;
            if (display === 'none')
                display = 'block';
            element.style.display = display;
            let height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.offsetHeight;
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            window.setTimeout(function() {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
            }, duration)
        })
    },

    slideToggle(element, duration = 500) {
        const isHidden = window.getComputedStyle(element).display === 'none';
        return isHidden ? this.slideDown(element, duration) : this.slideUp(element, duration);
    },    

    classToggle: function(element, className) {
        element.classList.toggle(className);
    }
}

if (!Element.prototype.fadeIn) {
    Element.prototype.fadeIn = function() {
        let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
            func = typeof arguments[0] === 'function' ? arguments[0] : (
                typeof arguments[1] === 'function' ? arguments[1] : null
            );

        this.style.opacity = 0;
        this.style.filter = "alpha(opacity=0)";
        this.style.display = "inline-block";
        this.style.visibility = "visible";
        let $this = this,
        opacity = 0,
        timer = setInterval(function() {
            opacity += 50 / ms;
            if (opacity >= 1) {
                clearInterval(timer);
                opacity = 1;

                if (func) func('done!');
            }
            $this.style.opacity = opacity;
            $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50);
    }
}

if (!Element.prototype.fadeOut) {
    Element.prototype.fadeOut = function() {
        let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
            func = typeof arguments[0] === 'function' ? arguments[0] : (
                typeof arguments[1] === 'function' ? arguments[1] : null
            );

        let $this = this,
            opacity = 1,
            timer = setInterval(function() {
                opacity -= 50 / ms;
                if (opacity <= 0) {
                    clearInterval(timer);
                    opacity = 0;
                    $this.style.display = "none";
                    $this.style.visibility = "hidden";

                    if (func) func('done!');
                }
                $this.style.opacity = opacity;
                $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
            }, 50);
    }
}

Shopify.bind = function(fn, scope) {
    return function() {
        return fn.apply(scope, arguments);
    }
};
Shopify.setSelectorByValue = function(selector, value) {
    const options = selector.options;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (value === option.value || value === option.text) {
            selector.selectedIndex = i;
            return i;
        }
    }
    // Return -1 if no matching option is found
    return -1;
};

Shopify.addListener = function(target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on' + eventName, callback);
};

    Shopify.postLink = function(path, options = {}) {
        const method = options.method || 'post';
        const parameters = options.parameters || {};
        const form = document.createElement('form');
        form.method = method;
        form.action = path;
        Object.keys(parameters).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = parameters[key];
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };
    
    Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
        this.countryEl = document.getElementById(country_domid);
        this.provinceEl = document.getElementById(province_domid);
        this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);
        Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));
        this.initCountry();
        this.initProvince();
    };

Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
        var value = this.countryEl.getAttribute('data-default');
        Shopify.setSelectorByValue(this.countryEl, value);
        this.countryHandler();
    },

    initProvince: function() {
        var value = this.provinceEl.getAttribute('data-default');
        if (value && this.provinceEl.options.length > 0) {
            Shopify.setSelectorByValue(this.provinceEl, value);
        }
    },

    countryHandler: function(e) {
        var opt = this.countryEl.options[this.countryEl.selectedIndex];
        var raw = opt.getAttribute('data-provinces');
        var provinces = JSON.parse(raw);

        this.clearOptions(this.provinceEl);
        if (provinces && provinces.length == 0) {
            if (this.provinceContainer) {
                this.provinceContainer.style.display = 'none';
            }
        } else {
            for (var i = 0; i < provinces.length; i++) {
                var opt = document.createElement('option');
                opt.value = provinces[i][0];
                opt.innerHTML = provinces[i][1];
                this.provinceEl.appendChild(opt);
            }

            if (this.provinceContainer) {
                this.provinceContainer.style.display = '';
            }
        }
    },

    clearOptions: function(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    },

    setOptions: function(selector, values) {
        for (var i = 0, count = values.length; i < values.length; i++) {
            var opt = document.createElement('option');
            opt.value = values[i];
            opt.innerHTML = values[i];
            selector.appendChild(opt);
        }
    }
};

class Accordion {
    constructor(el) {
        this.el = el;
        this.summary = el.querySelector('summary');
        this.content = el.querySelector('[detail-expand]');
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }
    onClick(e) {
        e.preventDefault();
        this.el.style.overflow = 'hidden';
        if (this.isClosing || !this.el.open) {
            this.open();
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }
    shrink() {
        this.isClosing = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;
        if (this.animation) {

            this.animation.cancel();
        }
        // Start a WAAPI animation
        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        this.animation.oncancel = () => this.isClosing = false;
    }
    open() {
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        window.requestAnimationFrame(() => this.expand());
    }
    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }
        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinish(true);
        this.animation.oncancel = () => this.isExpanding = false;
    }
    onAnimationFinish(open) {
        this.el.open = open;
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = '';
    }
}
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);

        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');

            if (isNaN(number) || number == null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
            case 'amount_no_decimals_with_space_separator':
                value = formatWithDelimiters(cents, 0, ' ', ' ');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}

function focusableElements(wrapper) {
    if(!wrapper) return false;
    let elements = Array.from(
        wrapper.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe")
    );
    return elements;
}
const listFocusElements = {};
var previousFocusElement = '';

function focusElementsRotation(wrapper) {
    stopFocusRotation();
    let elements = focusableElements(wrapper);
    if(elements == false) return false;
    let first = elements[0];
    first.focus();
    let last = elements[elements.length - 1];
    listFocusElements.focusin = (e) => {
        if (
            e.target !== wrapper &&
            e.target !== last &&
            e.target !== first
        )
            return;

        document.addEventListener('keydown', listFocusElements.keydown);
    };

    listFocusElements.focusout = function() {
        document.removeEventListener('keydown', listFocusElements.keydown);
    };

    listFocusElements.keydown = function(e) {
        if (e.code.toUpperCase() !== 'TAB') return;
        if (e.target === last && !e.shiftKey) {
            e.preventDefault();
            first.focus();
        }
        if ((e.target === wrapper[0] || e.target === first) && e.shiftKey) {
            e.preventDefault();
            last.focus();
        }
    };

    document.addEventListener('focusout', listFocusElements.focusout);
    document.addEventListener('focusin', listFocusElements.focusin);
}

function stopFocusRotation() {
    document.removeEventListener('focusin', listFocusElements.focusin);
    document.removeEventListener('focusout', listFocusElements.focusout);
    document.removeEventListener('keydown', listFocusElements.keydown);
}

function pad(num, size) {
    return num.toString().padStart(size, "0");
}

function parseDate(date) {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) return parsed
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
}

function getTimeRemaining(endtime) {
  const total = parseDate(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

// function shippingEstimates() {
//     if (Shopify && Shopify.CountryProvinceSelector) {
//         var country = document.getElementById("shippingCountry");
//         if (!country) {
//             return false;
//         }
//         var shipping = new Shopify.CountryProvinceSelector(
//             "shippingCountry",
//             "shippingProvince", {
//                 hideElement: "shipping-province-container",
//             }
//         );
//         setupEventListeners();
//     }
// }

// function setupEventListeners() {
//     if (document.getElementById("fetch-sipping-estimates")) {
//         const button = document.getElementById("fetch-sipping-estimates");
//         button.addEventListener("click", (e) => {
//             e.preventDefault();
//             const shippingEstimatesResponse = document.getElementById("shipping-estimates-response");
//             shippingEstimatesResponse.innerHTML = "";
//             shippingEstimatesResponse.classList.remove('success','error');
//             // shippingEstimatesResponse.classList.remove("error");
//             shippingEstimatesResponse.hidden = true;

//             const shippingAddress = {};
//             shippingAddress.zip = document.getElementById("shippingZip").value || "";
//             shippingAddress.country = document.getElementById("shippingCountry").value || "";
//             shippingAddress.province = document.getElementById("shippingProvince").value || "";
//             fetchShippingEstimates(shippingAddress);
//         });
//     }

// }

// const fetchShippingEstimates = async (shippingAddress) => {
//     const response =  await fetch("/cart/shipping_rates.json", {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ shipping_address: shippingAddress }),
//     })
//     if (response.ok) {
//         const shippingRates = await response.json();
//         _fetchResponse(shippingRates);
//     } else {
//         const errresponse = await response.json();
//         _fetchError(errresponse);
//     }
// };


// const _fetchError = (XMLHttpRequest, textStatus) => {
//     const shippingEstimatesResponse = document.getElementById("shipping-estimates-response");

//     for (const [property, messages] of Object.entries(XMLHttpRequest)) {
//         for (const message of messages) {
//             shippingEstimatesResponse.innerHTML = `<p class="error-message no-bg">${message}</p>`;
//         }
//     }
//     shippingEstimatesResponse.style.display = 'block';
// };

// const _fetchResponse = (response) => {
//     const shippingEstimatesResponse = document.getElementById("shipping-estimates-response");
//     if (response.shipping_rates && response.shipping_rates.length > 0) {
//         const html = `${response.shipping_rates.map((shipping) => {
//             return `<p><strong>${shipping.name}</strong>: ${Shopify.formatMoney(shipping.price * 100, moneyFormat)}</p>`;
//         }).join("")}`;
//         const shippingEstimateMultipleMessages = `<div class="success-message">${html}</div>`;
//         shippingEstimatesResponse.innerHTML = shippingEstimateMultipleMessages;
//         shippingEstimatesResponse.style.display = 'block';
//     } else {
//         shippingEstimatesResponse.innerHTML = `<p class="error-message no-bg">${shipRateUnavailable}</p>`;
//         shippingEstimatesResponse.style.display = 'block';
//     }
// };
  

function countdownClock(section = document) {
    const parentSelectors = section.querySelectorAll("[data-countdown]");
    if (parentSelectors) {
      Array.from(parentSelectors).forEach(function (parentSelector) {
        const dateSelector = parentSelector.querySelector("[data-countdown-input]");
        if (dateSelector.value != "") {
          const myArr = dateSelector.value.split("/");
          let _day = myArr[0];
          let _month = myArr[1];
          let _year = myArr[2];
          const endtime = _month + "/" + _day + "/" + _year + " 00:00:00";
          const days = parentSelector.querySelector("#days");
          const hours = parentSelector.querySelector("#hours");
          const minutes = parentSelector.querySelector("#minutes");
          const seconds = parentSelector.querySelector("#seconds");
  
          var timeinterval = setInterval(function () {
            var time = getTimeRemaining(endtime);
            if (time.total <= 0) {
              parentSelector.style.display = "none";
              clearInterval(timeinterval);
            } else {
              days.innerHTML = pad(time.days, 2);
              hours.innerHTML = pad(time.hours, 2);
              minutes.innerHTML = pad(time.minutes, 2);
              seconds.innerHTML = pad(time.seconds, 2);
            }
          }, 1000);
        }
      });
    }
}

slickSlider = function(selector, slideIndex) {
    var optionContainer = selector.attr('data-slick');
    if (optionContainer) {
        const isSplitSliderEnabled = selector.attr('data-split-slider');
        if(isSplitSliderEnabled !== undefined){
            const sliderSectionID = selector.attr('data-counter-id');
            const sliderCounterContainer = document.querySelector(`.${sliderSectionID}`);
            const totalSlideCountElement = sliderCounterContainer.querySelector('[data-total-count]');
            const currentSlideCountElement = sliderCounterContainer.querySelector('[data-current-count]');

            var updateSliderCounter = function(slickInstance, currentIndex) {
                  const currentSlideIndex = slickInstance.slickCurrentSlide() + 1;
                const totalSlides = slickInstance.slideCount;
                totalSlideCountElement.innerHTML = totalSlides.toString().padStart(2, '0');
                currentSlideCountElement.innerHTML = currentSlideIndex.toString().padStart(2, '0');
            };

            selector.on('init', function(event, slickInstance) {
                updateSliderCounter(slickInstance);
                const sliderProgress = selector.attr('slider-progress');
            });
            
            var optionsnew = JSON.parse(optionContainer);
        }else{

            selector.on('init', function(event, slickInstance) {
                const sliderProgressOnInit = selector.attr('slider-progress');
                if (sliderProgressOnInit !== undefined) {
                    const progressSectionIDOnInit = selector.attr('data-section-id');
                    const progressSectionWrapperOnInit = document.querySelector(`.${progressSectionIDOnInit}`); 

                    if (progressSectionWrapperOnInit) {
                        const currentSlideOnInit = slickInstance.currentSlide;
                      const calcProgressOnInit = ((currentSlideOnInit + 1) / slickInstance.slideCount) * 100;
                      progressSectionWrapperOnInit.style.backgroundSize = `${calcProgressOnInit}% 100%`;
                    }
                }
            });

            var options = JSON.parse(optionContainer);
            var optionsnew = Object.assign(options, { prevArrow: prevArrow, nextArrow: nextArrow });
        }
        if (selector.hasClass('slick-slider')) {
            // selector.slick('resize');
            selector.slick('setPosition');
        } else {
            if (slideIndex) {
                selector.not('.slick-slider').slick(optionsnew).slick('select', slideIndex);
            } else {
                selector.not('.slick-slider').slick(optionsnew).slick('resize');
            }
        }

    

        selector.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
          if (selector.hasClass("carousel-block-color-true")) {
            let nxtSlide = $(slick.$slides.get(nextSlide))
            let textColor = nxtSlide.find(".announcement-bar-item").attr("data-color");
            let backgroundColor = nxtSlide.find(".announcement-bar-item").attr("data-bg");
            let linkColor = nxtSlide.find(".announcement-bar-item").attr("data-link");
            selector.closest(".announcement-bar-main").css({ "--announcement-bar-background":backgroundColor, "--announcement-bar-color":textColor, "--announcement-bar-link-color":linkColor });
          }

          const sliderProgress = selector.attr('slider-progress');
          if (sliderProgress !== undefined) {
              const progressSectionID = selector.attr('data-section-id');
              const progressSectionWrapper = document.querySelector(`.${progressSectionID}`); 
              
              if (progressSectionWrapper) {
                const calcProgress = ((nextSlide + 1) / slick.slideCount) * 100;
                progressSectionWrapper.style.backgroundSize = `${calcProgress}% 100%`;
              }
          }

          selector[0].querySelectorAll(".product-model-item").forEach(getmodel => {
                    getmodel.modelViewerUI.pause();
            });
          selector[0].querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
            });
            selector[0].querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
                video.contentWindow.postMessage('{"method":"pause"}', "*");
            });
            selector[0].querySelectorAll("video").forEach((video) => {
                video.pause();
            });

            var currentSlideElement = slick.$slides.get(currentSlide);
            if(currentSlideElement){
            var modelItems =  currentSlideElement.querySelectorAll(".product-model-item");
            if(modelItems.length > 0){
                modelItems.forEach(function(modelItem) {
                      var getCloseButton = modelItem.querySelector('.close-product-model');
                      if (getCloseButton) {
                          getCloseButton.dispatchEvent(new Event('click'));
                      }
                  });          
            }
           }
        });
        selector.on('afterChange', function(event, slick, currentSlide, nextSlide){
            if(isSplitSliderEnabled !== undefined){
                updateSliderCounter(slick, currentSlide);
            }
            // var currentSlideElement = slick.$slides.get(currentSlide);
            // var videos = currentSlideElement.querySelectorAll("video");
            // if (videos.length > 0) {
            //     videos.forEach(function(video) {
            //         video.play();
            //     });
            // }
             var currentSlideElement = slick.$slides.get(currentSlide);
             if(currentSlideElement){
             var get_video = currentSlideElement.querySelector("video"); 
                if(get_video){
                    var video = currentSlideElement.querySelector("video");
                    video.play();
                }
            }
        });

    }
}
sliders = function() {
        var sliders = jQuery('body').find('[data-slick]');
        if (sliders.length > 0) {
            sliders.each(function(index) {
                if (!jQuery(this).hasClass('slick-slider')) {
                    let slider = jQuery(this);
                    slickSlider(slider);
                } else {
                    jQuery(this).slick('resize');
                }
            });
        }
       
    }
  
/*-------------tabbed-collections------------------ */
function tabbedCollection(section = document) {
    var bindAll = function() {
        var menuElements = document.querySelectorAll('[data-tab-filters]');
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].addEventListener('click', change, false);
        }
    }

    var clear = function(sectionID) {
        var mainSection = document.querySelector(`.tab-setion-${sectionID}`);
        var menuElements = mainSection.querySelectorAll('[data-tab-filters]');
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].classList.remove('active');
            var id = menuElements[i].getAttribute('data-tab-filters');
            var targetElement = mainSection.querySelector(`#${id}`); // Use querySelector instead of getElementById
            if (targetElement) {
                targetElement.classList.remove('active');
            }
            if (mainSection.querySelector('[data-id="' + id + '"]')) {
                mainSection.querySelector('[data-id="' + id + '"]').classList.remove('active');
            }
        }
    }

    var change = function(e) {
        e.preventDefault();
        var getSectionID = e.currentTarget.getAttribute('data-section-id');
        clear(getSectionID);
        var mainSection = document.querySelector(`.tab-setion-${getSectionID}`);
        e.currentTarget.classList.add('active');
        var id = e.currentTarget.getAttribute('data-tab-filters');
        var targetElement = mainSection.querySelector(`#${id}`); // Use querySelector instead of getElementById
        if (targetElement) {
            targetElement.classList.add('active');
        }
        if (mainSection.querySelector('[data-id="' + id + '"]')) {
            mainSection.querySelector('[data-id="' + id + '"]').classList.add('active');
        }
        $('.collection-tabs-products-content[id="' + id + '"]').slick('setPosition');
    }

    bindAll();
}
    
function detailDisclouserInit(section = document) {
    let detailsElements = section.querySelectorAll('[data-detail-button]');
    if (detailsElements) {
        Array.from(detailsElements).forEach((detailsElement) => {
            // new Accordion(detailsElement);
            new Accordion(detailsElement);
        });
    }
}
/*-------------collapsible-content------------------ */
function collapsiblecontentClose() {
    var closeButtons = document.querySelectorAll('[data-close-button]');
    Array.from(closeButtons).forEach(function(closeButton) {
        closeButton.addEventListener("click", (event) => {
            event.preventDefault();
            closeButton.closest(".accordion-item").removeAttribute("open");
        });
    });
}

function trapFocus(container){   
    const focusableElements = 'button, [href], input:not([type="hidden"]), select, textarea, a';
    const firstFocusable = container.querySelector(focusableElements);
    const lastFocusable = container.querySelectorAll(focusableElements);
    const lastFocusableElement = lastFocusable[lastFocusable.length - 1];
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) { 
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else { 
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

function filtersDesktopTrigger(){
    let filterDrawerItems = document.querySelectorAll('[data-filter-desktop]');
    if (filterDrawerItems) {
        Array.from(filterDrawerItems).forEach(function(element) {
            element.addEventListener("click", (e) => {
              const filterId = element.getAttribute("data-id");
              let DesktopSideElementBody = document.querySelector("#" + filterId);
                if(element.classList.contains('filters-opened')){
                    DesktopSideElementBody.classList.add('hide-filters');
                    element.classList.remove('filters-opened');
                    const headingText = element.querySelector('.filter-heading-text');
                    if (headingText) {
                        headingText.textContent = 'Show filters';
                    }
                }else{
                    DesktopSideElementBody.classList.remove('hide-filters');
                    element.classList.add('filters-opened');
                    const headingText = element.querySelector('.filter-heading-text');
                    if (headingText) {
                        headingText.textContent = 'Hide filters';
                    }
                }
            });
        });
    }
}

function sideDrawerInt() {
    let sideDrawerSelectors = document.querySelectorAll('[data-sidedrawer-button]');
    let sideDrawerBodySelectors = document.querySelectorAll('[data-sidedrawer-wrapper]');
    let id = '';
    Array.from(sideDrawerBodySelectors).forEach(function(sideElement) {
    if (sideElement) {
        Array.from(sideElement.querySelectorAll('video')).forEach(function (video) {
          video.pause();
        });
        Array.from(sideElement.querySelectorAll('.youtube_video,.youtube-video,iframe[src*="www.youtube.com"]')).forEach(function (video) {
          video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
        Array.from(sideElement.querySelectorAll('.vimeo_video,.vimeo-video, iframe[src*="player.vimeo.com"]')).forEach(function (video) {
          video.contentWindow.postMessage('{"method":"pause"}', '*');
        });
      }
    });
    if (sideDrawerSelectors) {
        Array.from(sideDrawerSelectors).forEach(function(element) {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                const getSearchBar = document.querySelector('[data-search-wrapper]');
                if (getSearchBar?.classList.contains('show')){
                    document.querySelector("body").classList.remove("no-scroll","search-drawer-open");
                    getSearchBar.classList.remove('show');
                }
                Array.from(sideDrawerBodySelectors).forEach(function(sideElement) {
                    if (sideElement.classList.contains("show")) {
                        setTimeout(() => {
                            sideElement.style.display = "none";
                        }, 300)
                        setTimeout(() => {
                            sideElement.classList.remove('show');
                        }, 200);                        
                    }
                })
                id = element.getAttribute("data-id");
                let sideElementBody = document.querySelector("#" + id);
                    document.querySelector("body").classList.add("no-scroll");
                if(sideElementBody && sideElementBody.classList.contains('pickup-availability-side-drawer')){
                    document.querySelector("body").classList.add("pickup-side-drawer-open");
                }
                    setTimeout(() => {
                        sideElementBody.style.display = 'flex';
                    }, 200)
                    setTimeout(() => {
                        sideElementBody.classList.add('show');
                        setTimeout(() => {
                            if(id == 'cart-side-drawer'){
                                slickSlider($(".cart--drawer-suggestion-wrapper"));
                            }
                         }, 100);             
                    }, 300);
                setTimeout(() => {
                   if(id == 'footer-newsletter-popup'){
                      sideElementBody.querySelector('button[data-popup-close]').focus();
                   }else{
                       sideElementBody.querySelector('.side-drawer-panel button[data-sidedrawer-close]').focus();
                   }
                }, 1000);
                trapFocus(sideElementBody);
                
            });
        })
    }

    let sideDrawerClose = document.querySelectorAll('[data-sidedrawer-close]');
    if (sideDrawerClose) {
        Array.from(sideDrawerClose).forEach(function(element) {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                Array.from(sideDrawerBodySelectors).forEach(function(sideElement) {
                    if (sideElement.classList.contains("show")) {
                        setTimeout(() => {
                            document.querySelector("body").classList.remove("no-scroll");
                            document.querySelector("body").classList.remove("pickup-side-drawer-open");
                            sideElement.classList.remove('show');
                            if (sideElement) {
                                Array.from(sideElement.querySelectorAll('video')).forEach(function (video) {
                                  video.pause();
                                });
                                Array.from(sideElement.querySelectorAll('.youtube_video,.youtube-video,iframe[src*="www.youtube.com"]')).forEach(function (video) {
                                  video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                                });
                                Array.from(sideElement.querySelectorAll('.vimeo_video,.vimeo-video, iframe[src*="player.vimeo.com"]')).forEach(function (video) {
                                    video.contentWindow.postMessage('{"method":"pause"}', '*');
                                });
                            }
                        }, 500);
                        setTimeout(() => {
                            sideElement.style.display = "none";
                        }, 700)

                        // setTimeout(() => {
                        //     sideElementBody.querySelector('.side-drawer-panel button[data-sidedrawer-close]').focus();
                        //  }, 1000);
                        //  trapFocus(sideElementBody); 
                    }
                })

            });
        })
    }
}

function quickViewElements(section = document) {
    let quickviewElements = section.querySelectorAll("[data-quickview-action]");
    Array.from(quickviewElements).forEach(function(element) {
        initQuickView(element);
    });
}

function initQuickView(element) {
    element.addEventListener('click', (event) => {
        let checkquickviewContainer = document.querySelector('[data-quickview-drawer]');
        if(checkquickviewContainer != null){
        event.preventDefault();
        if(element.getAttribute("href")){
            var _url = element.getAttribute("href");
                if (_url.indexOf("?") > -1) {
                    _url = _url.split("?");
                    _url = _url[0];
                }              
                let quickviewContainer = document.querySelector('[data-quickview-drawer]');
                const quickViewSectionID = quickviewContainer.dataset.sectionId;
                var productUrl = _url + `?section_id=${quickViewSectionID}`;
                quickviewContainer.querySelector('[data-quickview-content]').innerHTML = quickViewpreLoaderIcon;
                document.querySelector('body').classList.add('no-scroll');
                quickviewContainer.style.display = 'block';
                setTimeout(function(){
                    quickviewContainer.classList.add('show');                   
                },300)
                fetch(productUrl)
                    .then((response) => response.text())
                    .then((text) => {
                        var sectionhtml = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section");
                        setTimeout(function(){
                        quickviewContainer.innerHTML = sectionhtml.querySelector("[data-quickview-drawer]").innerHTML;
                        if (Shopify.PaymentButton) {
                            Shopify.PaymentButton.init();
                        }
                        
                        // const quickViewMediaSlider = quickviewContainer.querySelector("[data-product-main-media]");
                        // console.log(quickViewMediaSlider);
                        // slickSlider(${quickViewMediaSlider});
                        slickSlider($(".quickview-product-image-slider"));
                        customDropdownElements(quickviewContainer);
                        productVariantOption();
                        getAddToCartElements(quickviewContainer);
                        quantitySelectors(quickviewContainer);
                        sideDrawerInt();
                        productMedia3dModel();
                        setTimeout(function(){
                            const mainquickproductwrapper = quickviewContainer.querySelector('[data-product-wrapper]');
                            if (mainquickproductwrapper) {
                                const videoManager = new VideoManager(mainquickproductwrapper);
                            
                                videoManager.loadYouTubeAPI()
                                    .then(() => {
                                        videoManager.init(); // Reinitialize after API is ready
                                    })
                                    .catch(error => {
                                        console.warn('Failed to load YouTube API for Quick View:', error);
                                    });
                            }
                            
                        },500)
                        // quickviewContainer.querySelectorAll('[data-product-wrapper]').forEach(wrapper => {
                            quickviewContainer.querySelector('button[data-sidedrawer-close]').focus();
                            trapFocus(quickviewContainer);
                        // });
                    },500)
                    })
                    .catch((e) => {});
        }
    }
      
    });

}


/*-------------shipping bar ------------------ */
let convertShippingAmount = freeShippingAmount;

// function checkShippingAvailablity() {
//     let selectedCountry = Shopify.country;
//     let shippingCountriesContainer = $('#shipping-countries');

//     if (shippingCountriesContainer.length == 0) {
//         shippingCountriesContainer = $('#shippingCountry');
//     }

//     if (shippingCountriesContainer && shippingCountriesContainer.find('option').length > 0) {
//         let shippingSelectedCountry = countryListData[selectedCountry];
//         if (shippingCountriesContainer.find('[value="' + shippingSelectedCountry + '"]').length > 0) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return false;
//     }
// }

function freeShippingBar(totalPrice, itemCount) {
    // let shippingCountryAvailable = checkShippingAvailablity();
    let shippingBarContainer = document.querySelector('[data-free-shipping-wrapper]');
    if (itemCount == 0 && document.querySelector('[data-shipping-message]')) {
        shippingBarContainer.classList.add('hidden');
        document.querySelector('[data-shipping-progress-bar]').classList.add('hidden');
        document.querySelector('[data-shipping-message]').classList.add('hidden');
        return false;
    }
    if (shippingBarContainer) {
        shippingBarContainer.classList.add('hidden');

        const cartTotal = totalPrice;
        const shippingRate = shippingBarContainer.getAttribute('data-cart-rate');
        const conversionRate = Shopify.currency.rate || 1; // Get the current conversion rate
        const shippingRateInCurrentCurrency = Math.round(shippingRate * conversionRate);
       
        const cartTotalInCurrentCurrency = Math.round(cartTotal * conversionRate);

        let adjustedShippingPercentage = (cartTotalInCurrentCurrency * 100) / shippingRateInCurrentCurrency;
        adjustedShippingPercentage =
          adjustedShippingPercentage > 100 ? 100 : Math.abs(adjustedShippingPercentage).toFixed(2);

          let freeShippingNeedPrice = shippingRate - totalPrice;
          freeShippingNeedPrice = Shopify.formatMoney(freeShippingNeedPrice, moneyFormat);

        if (document.querySelector('[data-shipping-message]')) {
            if (adjustedShippingPercentage >= 100) {
                let freeShippingBarSuccessTextNew = freeShippingBarSuccessText
                .replace(/\[/g, '<span class="highlighted-success">')
                .replace(/\]/g, '</span>');
                document.querySelector('[data-shipping-message]').innerHTML = freeShippingBarSuccessTextNew;
            } else {
                document.querySelector('[data-shipping-message]').textContent = ShippingBarText.replace('||amount||', freeShippingNeedPrice);
            }
        }

        if (document.querySelector('[data-shipping-bar]')) {
            document.querySelector('[data-shipping-bar]').style.width = adjustedShippingPercentage + '%';
        }
        shippingBarContainer.classList.remove('hidden');
        document.querySelector('[data-shipping-progress-bar]').classList.remove('hidden');
        document.querySelector('[data-shipping-message]').classList.remove('hidden')

    }
}
if (freeShippingBarStatus) {
    freeShippingBar(cartTotalPrice, cartItemCount);
}

function quantitySelectors(section = document) {
    let quantityElements = section.querySelectorAll("[data-quantity-wrapper]");
    Array.from(quantityElements).forEach(function(element) {
        initQuantityAction(element);
    });
    let cartGiftWrapATC = section.querySelectorAll("[data-gift-atc]");
    Array.from(cartGiftWrapATC).forEach(function(cartGiftWrap) {
        cartGiftWrap.addEventListener('click', (event) => {
            let formParent = cartGiftWrap.closest('[data-cart-giftwrap]');
            let form = formParent.querySelector('form');
            addItemToCart(formParent, form, cartGiftWrap);
        });
    });
}

function initQuantityAction(element) {
    const changeEvent = new Event('change', { bubbles: true });
    let quantityInput = element.querySelector('[data-quantity-input]')
    let quantityIncrement = element.querySelector('[data-quantity-increment]')
    let quantityDecrement = element.querySelector('[data-quantity-decrement]')
    if (quantityInput.classList.contains('ajax-quantity')) {
        quantityInput.addEventListener('change', (event) => {
            setTimeout(function() {
                let currentValue = parseInt(quantityInput.value);
                let section = quantityInput.closest('[data-cart-content]');
                let line = quantityInput.dataset.line;                
                if (quantityInput.closest('[data-cart-item]').querySelector('.error-message')) {
                    quantityInput.closest('[data-cart-item]').querySelector('.error-message').classList.add('hidden');
                    quantityInput.closest('[data-cart-item]').querySelector('.error-message').innerHTML = '';
                }
                updateCartItem(line, currentValue, section,quantityInput.closest('[data-cart-item]'))
            }, 500)
        });
    }
    quantityIncrement.addEventListener('click', (event) => {
        event.preventDefault();
        const previousValue = quantityInput.value;
        if (parseInt(quantityInput.dataset.min) > parseInt(quantityInput.step) && quantityInput.value == 0) {
            quantityInput.value = quantityInput.dataset.min;
        } else {
            quantityInput.stepUp();
        }
        if (previousValue !== quantityInput.value){
         quantityInput.dispatchEvent(changeEvent);
        }
    });
    quantityDecrement.addEventListener('click', (event) => {
        event.preventDefault();
        const previousValue = quantityInput.value;
        quantityInput.stepDown();
        if (quantityInput.dataset.min === previousValue) {
            quantityInput.value = parseInt(quantityInput.min);
        }

        if (previousValue !== quantityInput.value){
            quantityInput.dispatchEvent(changeEvent);
        }
    });
}

function updateQuantity(quantityInput) {
    let section = quantityInput.closest('[data-cart-content]');
    quantityInput.closest('[data-cart-item]').classList.add('disabled')
    let quantity = parseInt(quantityInput.value);
    let line = quantityInput.dataset.line;    
    if (quantityInput.closest('[data-cart-item]').querySelector('.error-message')) {
        quantityInput.closest('[data-cart-item]').querySelector('.error-message').classList.add('hidden');
        quantityInput.closest('[data-cart-item]').querySelector('.error-message').innerHTML = '';
    }
    updateCartItem(line, quantity, section,quantityInput.closest('[data-cart-item]'))
}

function updateCartItem(line, quantity, section,lineItem) {
    let sectionId = section.dataset.section;
    const body = JSON.stringify({
        line,
        quantity,
        sections: [sectionId]
    });
    fetch(cartChangeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
            body
        })
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const cart = JSON.parse(state);
            if (cart.status) {
                if (lineItem.querySelector('.error-message')) {
                    lineItem.querySelector('.error-message').innerHTML = cart.description;
                    lineItem.querySelector('.error-message').classList.remove('hidden');
                }
                return false;
            }
            updateCartHtml(section, cart, sectionId)
        })
}

function updateCartHtml(section, cart, sectionId) {
    if (cart.sections) {
        let updatedCartHtml = new DOMParser().parseFromString(cart.sections[sectionId], 'text/html');
        let itemCount = parseInt(updatedCartHtml.querySelector('[data-cart-content]').dataset.cartItem);
        let totalPrice = parseInt(updatedCartHtml.querySelector('[data-cart-content]').dataset.cartTotalPrice);

        if (window.location.href.includes("/cart")) {
            if(itemCount == 0){
                section.innerHTML =  updatedCartHtml.querySelector('[data-cart-content]').innerHTML;
            }else{
            section.querySelector('[data-cart-form]').innerHTML = updatedCartHtml.querySelector('[data-cart-form]').innerHTML;
            section.querySelector('[data-cart-prices]').innerHTML = updatedCartHtml.querySelector('[data-cart-prices]').innerHTML;
            if (section.querySelector('[data-cart-note-wrapper]') && updatedCartHtml.querySelector('[data-cart-note-wrapper]')) {
                section.querySelector('[data-cart-note-wrapper]').innerHTML = updatedCartHtml.querySelector('[data-cart-note-wrapper]').innerHTML;
            }
            if (section.querySelector('[data-cart-giftwrap]') && updatedCartHtml.querySelector('[data-cart-giftwrap]')) {
                section.querySelector('[data-cart-giftwrap]').innerHTML = updatedCartHtml.querySelector('[data-cart-giftwrap]').innerHTML;
            }
            cartCountUpdate(itemCount)
            quantitySelectors(section);
            cartItemRemoveElements(section);
            updateCartNote();
            cartDrawerNoteInit();
            if (freeShippingBarStatus) {
                freeShippingBar(totalPrice, itemCount)
            }
          }
        } else {
            if (sectionId == 'ajax-cart') {
                document.querySelector('[data-cart-content]').innerHTML = updatedCartHtml.querySelector('[data-cart-content]').innerHTML;
                document.querySelector('[data-cart-drawer-footer]').innerHTML = updatedCartHtml.querySelector('[data-cart-drawer-footer]').innerHTML;
                let datasection = document.querySelector('[data-cart-drawer-body]');
                datasection.classList.add('empty-mini-cart');
                let cartCount = updatedCartHtml.querySelector('[data-cart-content]').getAttribute('data-item-count');
                let cartDrawertotalPrice = updatedCartHtml.querySelector('[data-cart-content]').getAttribute('data-cart-total-price');
                cartCountUpdate(cartCount)
                quantitySelectors(datasection);
                cartItemRemoveElements(datasection);
                updateCartNote();
                cartDrawerNoteInit();
                slickSlider($(".cart--drawer-suggestion-wrapper"));
                if (freeShippingBarStatus) {
                    freeShippingBar(cartDrawertotalPrice, cartCount)
                }
            }
        }
    }
}

function cartItemRemoveElements(section = document) {
    let cartItemRemoveElements = section.querySelectorAll("[data-remove-item]");
    Array.from(cartItemRemoveElements).forEach(function(element) {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            let section = element.closest('[data-cart-content]');
            element.closest('[data-cart-item]').classList.add('disabled')
            let line = element.dataset.line;            
            if (element.closest('[data-cart-item]').querySelector('.error-message')) {
                element.closest('[data-cart-item]').querySelector('.error-message').classList.add('hidden');
                element.closest('[data-cart-item]').querySelector('.error-message').innerHTML = '';
            }
            updateCartItem(line, 0, section,element.closest('[data-cart-item]'))
        });

    });
}

function updateCartNote() { 
    let cartNoteElements = document.querySelectorAll('[data-cart-note]')
    var cartNoteTyping;
    Array.from(cartNoteElements).forEach(function(element) {
        element.addEventListener('keydown', (event) => {
            clearTimeout(cartNoteTyping);
        });
        element.addEventListener('keyup', (event) => {
            clearTimeout(cartNoteTyping);
            cartNoteTyping = setTimeout(function() {
                const body = JSON.stringify({
                    note: element.value
                });
                // cartNoteAPI(body);
                fetch(cartUpdateUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
                        body
                    })
                    .then((response) => {
                        return response.text();
                    })
            }, 1000);
        });
    })
}

function cartNoteAPI(body) {
    fetch(cartUpdateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
        body
    })
    .then((response) => {
        return response.text();
    })
}

/* get variant based on selected options start */
function getVariantDetails(options, type, selector, allVariants, parent) {
    let currentVariant = allVariants.find((variant) => {
        if (type === "options") {
            return !variant.options.map((option, index) => {
                return options[index] === option;
            }).includes(false);
        }
        if (type === "id") {
            return variant.id == options;
        }
    });
    return currentVariant;
}

function getFirstAvailableVariant(options, type, selector, allVariants) {
    let availableVariant = null,
        slicedCount = 0;
    do {
        options.pop();
        slicedCount += 1;
        availableVariant = allVariants.find((variant) => {
            return variant["options"].slice(0, variant["options"].length - slicedCount).every((value, index) => value === options[index]);
        });
    } while (!availableVariant && options.length > 0);
    if (availableVariant) {
        let fieldsets = Array.from(selector.querySelectorAll(".product-loop-variants"));
        fieldsets.forEach((fieldset, index) => {
            let option = fieldset.querySelector('input[value="' + availableVariant['options'][index] + '"]')
            if (option && option.checked == false) {
                // option.click();
                if (option.hasAttribute('custom-dropdown')) {
                    option.closest('.custom-select').querySelector('.custom-select-text').innerHTML = '<strong>' + availableVariant['options'][index] + '</strong>';
                    option.closest('.custom-select').querySelector('.custom-select-button ').setAttribute('data-type', availableVariant['options'][index])
                }
            }
        });
    }
    return availableVariant;
}

function updateUrl(selectedVariant) {
    const baseURL = window.location.pathname;
    if (baseURL.indexOf("/products/") == -1) return;
    const UpdatedURL = baseURL + "?variant=" + selectedVariant.id;
    window.history.replaceState({}, '', `${UpdatedURL}`);
}

function updateAllVariantInput(selectedVariant, _productParent) {
    let productFormsInputs = _productParent.querySelectorAll(`input[name="id"]`);
    productFormsInputs.forEach((productFormInput) => {
        productFormInput.value = selectedVariant.id;
        productFormInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
    if (_productParent.querySelector("shopify-payment-terms")) {
        _productParent.querySelector(
            "shopify-payment-terms"
        ).style.display = "block";
    }
}

function updateVariantQuantity(productSection, productParent, selectedVariant) {
    if (!selectedVariant || !productParent) return;

    const sectionId = productParent.dataset.section;
    const quantityWrapper = productParent.querySelector('[data-quantity-wrapper]');

    if (sectionId && quantityWrapper) {
        const productUrl = quantityWrapper.dataset.url;
        const requestUrl = `${productUrl}?variant=${selectedVariant.id}&section_id=${sectionId}`;

        fetch(requestUrl)
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then((responseHtml) => {
                const parser = new DOMParser();
                const updatedHtml = parser.parseFromString(responseHtml, "text/html");
                const updatedQuantityWrapper = updatedHtml.querySelector('[data-quantity-wrapper]');

                if (updatedQuantityWrapper) {
                    quantityWrapper.innerHTML = updatedQuantityWrapper.innerHTML;
                    initQuantityAction(quantityWrapper);
                }
            })
            .catch((error) => {
                console.error('Error updating variant quantity:', error);
            });
    }
}
    

/* update the price based on selected variant start */
function updateVariantPrice(_productSection, priceContainer, selectedVariant, showSaved) {
    if (priceContainer) {
        if (selectedVariant != undefined) {
            priceContainer.style.display = 'block';
            var compareAtPrice = parseInt(selectedVariant.compare_at_price);
            var comparePriceSelectors = priceContainer.querySelectorAll('[data-compare-price]');
            var price = parseInt(selectedVariant.price);
            var priceSelectors = priceContainer.querySelectorAll('[data-actual-price]');
            var savingPercentage = Math.round((compareAtPrice - price) * 100 / compareAtPrice) + "% " + saleOffText;
            var savingPercentageSelector = priceContainer.querySelectorAll('[data-price-saving]');
            var unitPriceSelectors = priceContainer.querySelectorAll('[data-unit-price]');
            var soldoutTextSelectors = priceContainer.querySelectorAll('[data-soldout-text]');
            Array.from(priceSelectors).forEach(function(priceSelector) {
                priceSelector.innerHTML = Shopify.formatMoney(price, moneyFormat);
            })


            Array.from(comparePriceSelectors).forEach(function(comparePriceSelector) {
                if (compareAtPrice > price) {
                    if (comparePriceSelector) {
                        comparePriceSelector.innerHTML = Shopify.formatMoney(compareAtPrice, moneyFormat);
                        comparePriceSelector.classList.remove('hidden');
                        Array.from(savingPercentageSelector).forEach(function(spSelector) {
                            spSelector.innerHTML = savingPercentage;
                            spSelector.classList.remove('hidden');
                        })
                    }
                } else {
                    comparePriceSelector.innerHTML = Shopify.formatMoney(compareAtPrice, moneyFormat);
                    comparePriceSelector.classList.add('hidden');
                    Array.from(savingPercentageSelector).forEach(function(spSelector) {
                        spSelector.innerHTML = savingPercentage;
                        spSelector.classList.add('hidden');
                    })
                }
            })

            Array.from(unitPriceSelectors).forEach(function(unitPriceSelector) {
                if (unitPriceSelector) {
                    if (selectedVariant.unit_price_measurement) {
                        var unitpriceText = Shopify.formatMoney(selectedVariant.unit_price, moneyFormat) + " / ";
                        unitpriceText +=
                            selectedVariant.reference_value == 1 ? "" : selectedVariant.unit_price_measurement.reference_value;
                        unitpriceText += selectedVariant.unit_price_measurement.reference_unit + "</p>";
                        unitPriceSelector.innerHTML = unitpriceText;
                        unitPriceSelector.classList.remove('hidden');
                    } else {
                        unitPriceSelector.classList.add('hidden');
                    }
                }
                Array.from(soldoutTextSelectors).forEach(function(soldoutTextSelector) {
                    if (soldoutTextSelector) {
                        if (selectedVariant.available != true) {
                            soldoutTextSelector.innerHTML = soldOutText;
                        } else {
                            soldoutTextSelector.innerHTML = '';
                        }
                    }
                })
            })
        }
        else{
            priceContainer.style.display = 'none';
        }
    }
}

/* variant sku update on change */
function updateVariantSku(selectedVariant, _productParent) {
    let variantSku = "";
    if (selectedVariant && selectedVariant.sku) {
        variantSku = selectedVariant.sku;
    }
    let variantSkuContainer = _productParent.querySelector("[data-variant-sku]");
    if (variantSkuContainer) {
        variantSkuContainer.innerHTML = variantSku;
    }
}

/* Update inventory bar start */
function updateInventroyBar(variantQty, variantPolicy, variant) {
    let productInventoryBar = document.querySelector("[data-product-inventory-bar-wrapper]");
    if (productInventoryBar) {
        let quantity = productInventoryBar.querySelector("[data-inventory-check]").dataset.quantity;
        if (variantQty >= 0 && variantPolicy != '') {
            quantity = variantQty;
            if (quantity > 0 && quantity <= minInventroyQty && variantPolicy == "deny") {
                productInventoryBar.classList.remove("hidden", "full-inventory");
                productInventoryBar.classList.add("low-inventory");
                let quantityHtml = `<strong> ${variantQty} </strong>`;
                let newStatus = invLowStatus.replace("||inventory||", quantityHtml);
                productInventoryBar.querySelector("[data-inventory-message]").innerHTML = newStatus;
             
            } else if (quantity >= 0 && variant.available == true) {
                productInventoryBar.classList.remove("hidden", "low-inventory");
                productInventoryBar.classList.add("full-inventory");
                productInventoryBar.querySelector("[data-inventory-message]").innerHTML = invAvailableStatus;

            } else {
                productInventoryBar.classList.add("hidden");
            }
            productInventoryBar.querySelector("[data-inventory-check]").setAttribute("data-quantity", variantQty);
        } else {
            productInventoryBar.classList.add("hidden");
        }
    }
} 
/* Update variant image in gallery based on selected variant start */

function createResponsiveImage(featuredMediaUrl, container) {
    const widths = [246, 493, 600, 713, 823, 990, 1100, 1206, 1346, 1426, 1646, 1946];
    const img = document.createElement('img');
    const srcset = widths
      .map(width => `${featuredMediaUrl}?width=${width} ${width}w`)
      .join(', '); 
    img.src = `${featuredMediaUrl}?width=1946`;
    img.sizes = 'auto';
    img.srcset = srcset;
    img.loading =  'eager';

    if (!container) {
      console.error('Container not found.');
      return;
    }
    container.innerHTML = img.outerHTML;
}

function updateVariantImage(variant, _productParent) {
    if (variant.featured_media) {
        const variantStckyImageURL = variant.featured_media.preview_image.src;
        const variantStckyMainWrapper = _productParent.querySelector('[data-sticky-variant-image]');
        if(variantStckyMainWrapper){
            
        const variantStckyMainWrapperInner = variantStckyMainWrapper.querySelector('.media-box');
            if(variantStckyMainWrapperInner && variantStckyImageURL){
                variantStckyMainWrapper.classList.remove('hidden');
                createResponsiveImage(variantStckyImageURL, variantStckyMainWrapperInner);
            }
        }
        let variantMediaId = variant.featured_media.id;
        let sectionId = _productParent.querySelector('[data-product-main-media]').getAttribute("data-section-id");
        let variantMedia = _productParent.querySelector('#' + sectionId + '-productMedia-' + variantMediaId);
        let mediaParent = _productParent.querySelector('[data-product-main-media]');
        if (variantMedia && mediaParent) {
            if (mediaParent.classList.contains('slick-initialized')) {
                let slickIndex = variantMedia.closest(".slick-slide").getAttribute("data-slick-index");
                let slider = $(mediaParent)
                slider.slick('slickGoTo', slickIndex);
            } else {
                let childCount = mediaParent.children.length;
                let firstChild = mediaParent.firstChild;
                if (childCount > 1) {
                    mediaParent.insertBefore(variantMedia, firstChild)
                }
            }

        }
    }

}
/* Update buttons according selected variant */
function updateButtonText(selectedVariant, _productParent, variantInventory, AddToCartButtonWrapper, AddToCartButtonText) {
    if (selectedVariant.available == true) {
        if (AddToCartButtonWrapper) {
            AddToCartButtonWrapper.removeAttribute("disabled");
        }
        if (AddToCartButtonText) {
            if (preorderStatus && variantInventory.inventory_policy == "continue" && variantInventory.inventory_quantity <= 0) {
                AddToCartButtonText.innerHTML = preorderText;
            } else {
                AddToCartButtonText.innerHTML = addToCartText;
            }
        }

    } else {
        if (AddToCartButtonWrapper) {
            AddToCartButtonWrapper.setAttribute("disabled", true);
        }
        if (AddToCartButtonText) {
            AddToCartButtonText.innerHTML = soldOutText;
        }
    }

}

function pickUpAvialabiliy(parentSection, variant) {
    let pickupSection = parentSection.querySelector('[data-pickup-availability]');
    let pickupContent = parentSection.querySelector('[data-pickup-availability-content]');
    let pickupDrawer = parentSection.querySelector('[data-pickup-location-list]');
    let pickupDrawerMain = parentSection.querySelector('.pickup-availability-side-drawer');
    if (pickupSection) {
        if (variant != undefined && variant.available == true) {
            var rootUrl = pickupSection.dataset.rootUrl;
            var variantId = variant.id;
            if (!rootUrl.endsWith("/")) {
                rootUrl = rootUrl + "/";
            }
            var variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

            fetch(variantSectionUrl)
                .then((response) => response.text())
                .then((text) => {
                    
                    var pickupAvailabilityHTML = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section");
                    let currentVariantPickupContent = pickupAvailabilityHTML.querySelector('[data-pickup-availability-content]');

                    if(pickupDrawerMain){
                        let sectionid = pickupDrawerMain.id;
                        let button = currentVariantPickupContent.querySelector('[data-sidedrawer-button]');
                        if (button) {
                            button.setAttribute('data-id', sectionid);
                        }
                    }

                    let currentVariantPickuplist = pickupAvailabilityHTML.querySelector('[data-pickup-location-list]');
                    pickupContent.innerHTML = currentVariantPickupContent ? currentVariantPickupContent.innerHTML : '';
                    pickupDrawer.innerHTML = currentVariantPickuplist ? currentVariantPickuplist.innerHTML : '';
                    if (currentVariantPickupContent.innerHTML.trim() != '') {
                        pickupSection.setAttribute('available', '')
                    } else {
                        pickupSection.removeAttribute('available')
                    }
                    // sideDrawerEventsInit(parentSection)
                    sideDrawerInt();
                })
                .catch((e) => {});
        } else {
            pickupContent.innerHTML = '';
            pickupDrawer.innerHTML = '';
            pickupSection.removeAttribute('available')
        }
    }

}
/// add to cart element 
function getAddToCartElements(section = document) {
    let cartAtcElements = section.querySelectorAll("[data-add-to-cart]");
    Array.from(cartAtcElements).forEach(function(element) {
        initAddToCart(element);
    });

}
/// initialize add to cart element 
function initAddToCart(element) {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        let form = element.closest('form');
        let formParent = form.closest('.shopify-section');
        if(formParent.classList.contains('collection-table')){
            formParent = form.closest('.collection-table-variant-list');
        }
        
        if (element.hasAttribute('data-add-to-cart')) {
            element.classList.add('loading');
        }
        if (!form) {
            let productFrom = formParent.querySelector('.main-product-form');
            if (productFrom) {
                let atcButton = productFrom.querySelector("[data-add-to-cart]");
                if (atcButton) {
                    previousFocusElement = element;
                    atcButton.click();
                }
            }
            return false;
        }
        let giftCardSection = formParent.querySelector('[data-gift-card-box]');
        if (giftCardSection) {
            let errormessageWrapper = giftCardSection.querySelector('[data-gift-card-errors]');
            let errorMessage = errormessageWrapper.querySelector('.error-message')
            errormessageWrapper.classList.add('hidden')
            errorMessage.innerHTML = '';
        }        
        if (formParent.querySelector('.error-message')) {
            formParent.querySelector('.error-message').style.display = 'none';
            formParent.querySelector('.error-message').innerHTML = '';
        }
        addItemToCart(formParent, form, element) 
    });
}

function addItemToCart(formParent, form, element) {
    const config = {
        method: 'POST',
        headers: {
            'X-Requested-With': `XMLHttpRequest`,
            'Accept': `application/javascript`
        }
    };
    const formData = new FormData(form);

    let sectionId = 'ajax-cart';
    let cartSection = document.querySelector('[data-cart-content]');
    var baseUrl = window.location.pathname;
    if (baseUrl.indexOf("/cart") > -1) {
        if (cartSection) {
            sectionId = cartSection.dataset.section;
        }
    }
    formData.append('sections', [sectionId]);
    config.body = formData;
    fetch(cartAddUrl, config)
        .then((response) => {
            return response.text();
        })
        .then((result) => {
            const cart = JSON.parse(result);
            if (element.hasAttribute('data-add-to-cart')) {
                element.classList.remove('loading')
            }
            if (cart.status) {
                if (cart.errors) {
                    let giftCardWrapper = formParent.querySelector('[data-gift-card-box]');
                    if (giftCardWrapper) {
                        // let errormessageWrapper = giftCardWrapper.querySelector('[data-gift-card-errors]');
                        // let giftCardEmail = formParent.querySelector('[type=email]');
                        // let errorMessage = errormessageWrapper.querySelector('.error-message');
                        // errorMessage.innerHTML = giftCardEmail.dataset.attr + ' ' + cart.errors['email'];
                        // errorMessage.style.display = 'block';
                        // errormessageWrapper.classList.remove('hidden')

                        const errormessageWrapper = giftCardWrapper.querySelector('[data-gift-card-errors]');
                        const errorMessage = errormessageWrapper.querySelector('.error-message');
                        
                        errorMessage.innerHTML = '';
                        
                        // for (const [field, messages] of Object.entries(cart.errors)) {
                        //         messages.forEach(message => {
                        //             errorMessage.innerHTML += `<p>${field},${message}</p>`;
                        //         });
                        // }
                        errorMessage.innerHTML += `<p>${cart.message}</p>`;
                        errorMessage.style.display = 'block';
                        errormessageWrapper.classList.remove('hidden');
                    }
                } else
                if (formParent.querySelector('.error-message')) {
                    formParent.querySelector('[data-error-text]').innerHTML = cart.description;
                    formParent.querySelector('.error-message').style.display = 'block';
                    if (isOnScreen(formParent.querySelector('.error-message'))) {
                        return false;
                    }
                    var scrollDiv = document.querySelector('.error-message').offsetTop;
                    window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
                }
                return false;
            }
            let cartHtml = new DOMParser().parseFromString(cart.sections[sectionId], 'text/html').querySelector('.shopify-section');
            if (baseUrl.indexOf("/cart") > -1){
                updateCartHtml(cartSection,cart,sectionId)
                var scrollDiv = cartSection.offsetTop;
                window.scrollTo({ top: scrollDiv, behavior: 'smooth' });
            }
            else{
                let cartDrawer = document.querySelector('#cart-side-drawer');
                if (cartDrawer) {
                    document.querySelector('[data-cart-drawer]').innerHTML = cartHtml.querySelector('[data-cart-drawer]').innerHTML;
                    if(formParent.classList.contains("quickview-drawer")){
                        setTimeout(function() {  formParent.classList.remove("show")},200);
                        setTimeout(function() { formParent.style.display = "none"},300);     
                    }
                  
                    sideDrawerInt();
                    cartDrawer.style.display = "flex";
                    document.querySelector('body').classList.add('no-scroll');
                    setTimeout(function() { cartDrawer.classList.add("show"); }, 500)

                    if (previousFocusElement == '') {
                        previousFocusElement = element;
                    }
                    setTimeout(() => {
                        focusElementsRotation(document.querySelector('[data-cart-drawer]'));
                    },1000);
                    updateCartHtml(cartSection, cart, sectionId)
               
                }
            }
            // if (freeShippingBarStatus) {
            //     freeShippingBar(cart.final_line_price, cartItemCount)
            // }
        })
}

function cartDrawerNoteInit() {
    if(document.querySelector("[data-cart-toggle]") && document.querySelector("[data-cart-note-wrapper]")) {
        let cartDrawerNoteBtn = document.querySelector("[data-cart-toggle]");
        let cartDrawerNoteWrap = document.querySelector("[data-cart-note-wrapper]");
        let cartDrawerApiTrigger = document.querySelectorAll("[data-cart-note-trigger]");
        Array.from(cartDrawerApiTrigger).forEach(function(element) {
            element.addEventListener("click", function(event) {
                cartDrawerNoteWrap.classList.remove("active");    
            });
            
        });

        // let cartDrawerApiTrigger = document.querySelector("[data-cart-note-trigger]");
        cartDrawerNoteBtn.addEventListener("click", function(event) {
            cartDrawerNoteWrap.classList.toggle("active");
        });
       
    }
}

function cartCountUpdate(count) {
    let cartselector = document.querySelector("[data-header-cart-count]")
    if (count == 0) {
        if(cartselector){
            cartselector.textContent = count;
            cartselector.classList.remove("count-dot");
            cartselector.classList.add("hidden")
        }
    } else {
        if(count<=99){
            count=count;
            cartselector.classList.remove("count-dot");
        }else{
            count='99+';
            cartselector.classList.add("count-dot");
        }
        if(cartselector){
            cartselector.textContent = count;
            cartselector.classList.remove("hidden")
        }
    }
}

function colorSwatchesMediaChanged(section = document) {
    let gridSwatchTriggers = section.querySelectorAll("[card-color-option]");
    Array.from(gridSwatchTriggers).forEach(function(element) {
        element.addEventListener("mouseover", function(event) {
            let productGrid = element.closest('[data-product-card]');
            let gridMainImage = productGrid.querySelector('[data-main-image]')
            let moreImageElement = element.querySelector('script');
            if (productGrid.querySelector(".variant-item.active")) {
                productGrid.querySelector(".variant-item.active").classList.remove("active");
            }
            element.classList.add("active");
            if (moreImageElement && gridMainImage) {
                let swatchMedia = new DOMParser().parseFromString(JSON.parse(moreImageElement.textContent), "text/html").querySelector('.media-content');
                gridMainImage.innerHTML = swatchMedia.innerHTML;
            }
        })
        element.addEventListener("click", function(event) {
            let url = element.getAttribute('data-url');
            if (url) {
                let finalUrl = window.location.origin + url;
                window.location.href = finalUrl
            }
        })
    })

}

/* change product option on select */
function productVariantOption(section = document) {
    let productContentContainers = section.querySelectorAll('[data-product-content]');
    Array.from(productContentContainers).forEach(function(productContentContainer) {
        let parentVariants = productContentContainer.querySelector(".product-variants-options");
        let selectIds = productContentContainer.querySelectorAll('[name="id"]');
        Array.from(selectIds).forEach(function(selectId) {
            selectId.removeAttribute("disabled");
        });
        let option = productContentContainer.querySelectorAll('.option');
        option.forEach((element) => {
            element.addEventListener('click', (event) => {
                let parent = event.target.closest('.custom-select').children[0];
                parent.setAttribute('data-type', event.target.getAttribute('data-type'));
                parent.querySelector(".custom-select-text").innerHTML = '<strong>' + event.target.innerText + '</strong>';
            });
        });
        let currentfieldsets = Array.from(productContentContainer.querySelectorAll(".product-loop-variants"));
        var productOptions = productContentContainer.getElementsByClassName("productOption");
        if (productOptions) {
            var options = [];
            let optionStyle = 'select';
            let eventType = "change";
            // productdetails
            let productDetail = '';
            if (productContentContainer.querySelector('[type="application/json"][data-name="product-variants"]')) {
                productDetail = JSON.parse(productContentContainer.querySelector('[type="application/json"][data-name="product-variants"]').textContent);
            }

            let productOptionsWithValues = '';
            if (productContentContainer.querySelector('[type="application/json"][data-name="product-options"]')) {
                productOptionsWithValues = JSON.parse(
                    productContentContainer.querySelector('[type="application/json"][data-name="product-options"]').textContent
                );
            }
            let productvariantInventory = '';
            let variantInventory = '';
            if (productContentContainer.querySelector('[type="application/json"][data-name="product-inventories"]')) {
                productvariantInventory = JSON.parse(productContentContainer.querySelector('[type="application/json"][data-name="product-inventories"]').textContent);
            }
            if (productDetail != '' && productOptionsWithValues != '') {
                options = currentfieldsets.map((fieldset) => { return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value; });        
                var _productSection = productContentContainer.closest(".shopify-section");
                var selectedVariant = getVariantDetails(options, "options", productContentContainer, productDetail, productContentContainer);    
                updateOptions(productDetail, productOptionsWithValues, selectedVariant, currentfieldsets, parentVariants);
                let inventoryBar = productContentContainer.querySelector("[data-product-inventory-bar-wrapper]");
                if (inventoryBar && productvariantInventory != '' && selectedVariant != undefined) {
                    variantInventory = productvariantInventory.find((variant) => {
                        return variant.id == selectedVariant.id;
                    });
                    inventoryBar.classList.remove("hidden");
                    updateInventroyBar(variantInventory.inventory_quantity, variantInventory.inventory_policy, selectedVariant);
                }
               
            }

            Array.from(productOptions).forEach(function(productOption) {
                productOption.addEventListener(eventType, () => {
                    var _productParent = productOption.closest("[data-product-wrapper]");
                    var partent = productOption.closest(".product-loop-variants");

                    if (productOption && productOption.hasAttribute('data-product-url')) {
                        let replaceURLProduct =  productOption.dataset.productUrl;
                        let requestURL = productOption.dataset.productUrl; 
                          var optionValueIds = Array.from(_productParent.querySelectorAll("input.productOption:checked")).map(({ dataset }) => dataset.valueProductId);
                          const productSectionID = _productParent.dataset.section;
                          requestURL += `?option_values=${optionValueIds}&section_id=${productSectionID}`;
                          fetch(requestURL)
                          .then((response) => response.text())
                          .then((text) => {
                            var updatedProductHTML = new DOMParser().parseFromString(
                              text,
                              "text/html"
                            );  
                              if (
                                _productParent &&
                                updatedProductHTML.querySelector("[data-product-wrapper]")
                              ) {
                                _productParent.innerHTML = updatedProductHTML.querySelector("[data-product-wrapper]").innerHTML;
                                setTimeout(function(){
                                    if (Shopify.PaymentButton) {
                                        Shopify.PaymentButton.init();
                                    }
                                    customDropdownElements(_productParent);
                                    productVariantOption();
                                    getAddToCartElements(_productParent);
                                    quantitySelectors(_productParent);
                                    sideDrawerInt();
                                    productMedia3dModel();

                                    setTimeout(function(){
                                        if (_productParent) {
                                            const videoManager = new VideoManager(_productParent);
                                        
                                            videoManager.loadYouTubeAPI()
                                                .then(() => {
                                                    videoManager.init();
                                                })
                                                .catch(error => {
                                                    console.warn('Failed to load YouTube API :', error);
                                                });
                                        }
                                        
                                    },500)

                                    if (_productParent.classList.contains("main-product-container")) {
                                        var _updateUrl =  replaceURLProduct;
                                        window.history.replaceState({}, null, _updateUrl);
                                      }
                                      sliders();
                                      popupContentElements();
                                },500)
                              }
                            
                          })
                          .catch((e) => {});

                    }else{

                    let optionValue = productOption.value;
                    let productPageSection = _productParent.closest(".shopify-section");
                    const fieldsets = Array.from(_productParent.querySelectorAll(".product-loop-variants"));
                    if (optionStyle == "dropdown") {
                        options = fieldsets.map((fieldset) => {
                            return Array.from(fieldset.querySelectorAll("select")).find((select) => select).value;
                        });
                    } else {
                        options = fieldsets.map((fieldset) => {
                            return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value;
                        });
                        var getMainParents = partent.closest('.product-variants-wrapper');
                        var colorWraperSource = getMainParents.querySelector('[data-selected-variant]');
                        if(colorWraperSource){
                           colorWraperSource.innerText = ': '+optionValue;
                        }
                    }
                    if (partent) {
                        if (partent.querySelector("li.variant-item.active")) {
                            partent.querySelector("li.variant-item.active").classList.remove("active");
                        }
                        if (productOption.closest('li.variant-item')) {
                            productOption.closest("li.variant-item").classList.add("active")
                        }
                    }
                 

                    var selectedVariant = getVariantDetails(options, "options", _productParent, productDetail, productContentContainer);
                    updateOptions(productDetail, productOptionsWithValues, selectedVariant, fieldsets, parentVariants)
                    var priceContainer = productContentContainer.querySelector("[data-price-wrapper]");
                    updateVariantQuantity(_productSection, _productParent, selectedVariant);
                    updateVariantPrice(_productSection, priceContainer, selectedVariant, true);
                    let errorWrappers = productPageSection.querySelectorAll(".error-message");
                    if (errorWrappers) {
                        Array.from(errorWrappers).forEach(function(errorWrapper) {
                            errorWrapper.innerHTML = "";
                            errorWrapper.style.display = "none";
                        });
                    }
                    var AddToCartButtonWrapper = _productParent.querySelector("[data-addtocart-wrapper]");
                    var AddToCartButtonText = AddToCartButtonWrapper.querySelector("[data-addtocart-text]");
                    let inventoryBar = _productParent.querySelector("[data-product-inventory-bar-wrapper]");

                    pickUpAvialabiliy(_productSection, selectedVariant)
                    if (selectedVariant != undefined) {
                        updateAllVariantInput(selectedVariant, _productParent);
                        updateVariantSku(selectedVariant, _productParent);
                        if (_productParent.classList.contains("main-product-container")) {
                          updateUrl(selectedVariant);
                        }
                        if (productvariantInventory != '') {
                            variantInventory = productvariantInventory.find((variant) => {
                                return variant.id == selectedVariant.id;
                            });
                        }
                        updateButtonText(selectedVariant, _productParent, variantInventory, AddToCartButtonWrapper, AddToCartButtonText);
                        variantInventory = productvariantInventory.find((variant) => {
                            return variant.id == selectedVariant.id;
                        });
                        if (inventoryBar) {
                            inventoryBar.classList.remove("hidden");
                            updateInventroyBar(variantInventory.inventory_quantity, variantInventory.inventory_policy, selectedVariant);
                        }
                        updateVariantImage(selectedVariant, _productParent)
                    } else {
                        let inventoryBar = _productParent.querySelector("[data-product-inventory-bar-wrapper]");
                        if (inventoryBar) {
                            inventoryBar.classList.add("hidden");
                        }
                        if (_productParent.querySelector("shopify-payment-terms")) {
                            _productParent.querySelector(
                                "shopify-payment-terms"
                            ).style.display = "none";
                        }
                        if (AddToCartButtonWrapper) {
                            AddToCartButtonWrapper.setAttribute("disabled", true);
                        }
                        if (AddToCartButtonText) {
                            AddToCartButtonText.innerHTML = unavailableText;
                        }
                    }
                }

                });
            });
        }
    });
}


function updateOptions(product, productOptions, selectedVariant, optionSelectors, productParent) {
    if (!selectedVariant) {
        return;
    }
    const getOption1Value = selectedVariant.option1;
    const selectedOptionOneVariants = product.filter(
        (variant) => getOption1Value === variant.option1
    );
    optionSelectors.forEach((option, index) => {
        if (index === 0) return;
        const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
        const previousOptionSelected = optionSelectors[index - 1].querySelector(':checked').value;

        const availableOptionInputsValue = selectedOptionOneVariants
        .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
        .map((variantOption) => variantOption[`option${index + 1}`]);
       // _setInputAvailability(optionInputs, availableOptionInputsValue, productParent);
    });

}
// function _setInputAvailability(elementList, availableValuesList){
//     elementList.forEach((element) => {
//         const value = element.getAttribute('value');
//         const availableElement = availableValuesList.includes(value);
//         element.classList.toggle('not-available', !availableElement);
//     });
// }

function _setInputAvailability(elementList, availableValuesList,productParent){
    elementList.forEach((element) => {
          const value = element.getAttribute('value');
          const availableElement = availableValuesList.includes(value);
         if(!productParent.querySelector('[data-combined-listing-product]')){
           const parentVariants = productParent.querySelectorAll('.product-loop-variants');
           parentVariants.forEach(variant => {
              let unavailableInputs = variant.querySelectorAll('.productOption.un-available');
              unavailableInputs.forEach(input => {
                  input.classList.add('not-available');
               
              });
          });
            element.classList.toggle('not-available', !availableElement);
         }else
         {
           element.classList.remove('not-available');
         }
      });
    // not-available
  }
  

function isOnScreen(elem, form) {
    if (elem.length == 0) {
        return;
    }
    var $window = $(window);
    var viewport_top = $window.scrollTop();
    var viewport_height = $window.height();
    var viewport_bottom = viewport_top + viewport_height;
    var $elem = $(elem);
    var top = $elem.offset().top;
    var height = $elem.height();
    var bottom = top + height;

    return (
        (top >= viewport_top && top < viewport_bottom) ||
        (bottom > viewport_top && bottom <= viewport_bottom) ||
        (height > viewport_height &&
            top <= viewport_top &&
            bottom >= viewport_bottom)
    );
}
// Product recommendation start 
function productRecommendations() {
    const productRecommendationsSections = document.querySelectorAll("[product-recommendations]");
    Array.from(productRecommendationsSections).forEach(function(productRecommendationsSection) {
        productRecommendationsInit(productRecommendationsSection);
    });
}

function productRecommendationsInit(productRecommendationsSection) {
    const url = productRecommendationsSection.dataset.url;
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            const html = document.createElement("div");
            html.innerHTML = text;
            const recommendations = html.querySelector("[product-recommendations]");
            if (recommendations && recommendations.innerHTML.trim().length) {
                productRecommendationsSection.innerHTML = recommendations.innerHTML;
                productRecommendationsSection.closest('.shopify-section').style.display = 'block'
                let slider = productRecommendationsSection.querySelector("[ data-slick]");
                if (slider) {
                    let sliderId = slider.getAttribute("id");
                    if (!slider.classList.contains("slick-initialized")) {
                        slickSlider($("#" + sliderId));
                    }
                }
                quickViewElements(productRecommendationsSection);
                colorSwatchesMediaChanged();
               
            }
        })
        .catch((e) => {
            console.error(e);
        });
}
// document.addEventListener("shopify:section:load",productRecommendations,false);
function recentlyViewedProducts() {
    let rvpWrappers = document.querySelectorAll('[data-recent-viewed-products]')
    Array.from(rvpWrappers).forEach(function(element) {
        let currentProduct = parseInt(element.dataset.product);

        let section = element.closest('.shopify-section');
        let cookieName = 'guru-recently-viewed-products';
        let rvProducts = JSON.parse(window.localStorage.getItem(cookieName) || '[]');
        if (!isNaN(currentProduct)) {
            if (!rvProducts.includes(currentProduct)) {
                rvProducts.unshift(currentProduct);
            }
            window.localStorage.setItem(cookieName, JSON.stringify(rvProducts.slice(0, 14)));

            if (rvProducts.includes(parseInt(currentProduct))) {
                rvProducts.splice(rvProducts.indexOf(parseInt(currentProduct)), 1);
            }
        }
        let currentItems = rvProducts.map((item) => "id:" + item).slice(0, 14).join(" OR ");
        fetch(element.dataset.section + currentItems)
            .then(response => response.text())
            .then(text => {
                const html = document.createElement('div');
                html.innerHTML = text;
                const recents = html.querySelector('[data-recent-viewed-products]');
                if (recents && recents.innerHTML.trim().length) {
                    element.innerHTML = recents.innerHTML;
                    element.closest('.shopify-section').classList.remove('hidden');
                    let slider = section.querySelector("[data-slick]");
                    if (slider) {
                        let sliderId = slider.getAttribute("id");
                        if (!slider.classList.contains("slick-initialized")) {
                            slickSlider($("#" + sliderId));
                        }
                    }
                    quickViewElements(section);
                    colorSwatchesMediaChanged();
                   
                }
            })
            .catch(e => {
                console.error(e);
            });
    })
}

function marqueeScrollBar(selector) {
    var marqueeElement = selector;
    var marqueeParent = marqueeElement.closest('.shopify-section');
    var position = marqueeParent.getBoundingClientRect();
    var elementPosition = marqueeElement.getBoundingClientRect();
    var Elewidth = position.width;
    if (isOnScreen(marqueeParent)) {

        let speed = parseInt(marqueeElement.getAttribute('data-marquee-speed'))
        if (window.innerWidth < 768 && marqueeElement.hasAttribute('data-marquee-speed-mobile')) {
            speed = parseInt(marqueeElement.getAttribute("data-marquee-speed-mobile"));
        }
        if (marqueeElement.classList.contains('rtl-direction')) {
            var marqueepsoition = -(Elewidth / 2) + elementPosition.top;
            marqueeElement.style.transform = `translate3d(${(marqueepsoition / speed) * 10}px, 0px, 0px)`;
        } else {
            var marqueepsoition = (Elewidth / 2) - elementPosition.top;
            marqueeElement.style.transform = `translate3d(${marqueepsoition / speed * 10}px, 0px, 0px)`;
        }
    }
}

function marqueeTextScroll(section = document) {
    let marqueeElements = section.querySelectorAll('[data-marquee-on-scroll]');
    Array.from(marqueeElements).forEach((element) => {
        window.addEventListener('scroll', function() {
            marqueeScrollBar(element);
        });
    });
}

function marqueeTextAutoplay(section = document) {
    let marqueeElements = section.querySelectorAll('[data-marquee-text]');
    Array.from(marqueeElements).forEach((element) => {
        if (!element.querySelector("[data-marque-node]")) return false;
        let resizedMobile = false;
        let resizedDesktop = false;
        marqueeTextAutoplayInit(element)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767 && resizedDesktop == false) {
                marqueeTextAutoplayInit(element)
                resizedDesktop = true;
                resizedMobile = false;
            } else if (window.innerWidth < 768 && resizedMobile == false) {
                marqueeTextAutoplayInit(element)
                resizedMobile = true;
                resizedDesktop = true;
            }
        });
    });
}

function marqueeTextAutoplayInit(element) {
    let scrollingSpeed = parseInt(element.getAttribute("data-marquee-speed") || 15);
    if (window.innerWidth < 768 && element.hasAttribute('data-marquee-speed-mobile')) {
        scrollingSpeed = parseInt(element.getAttribute("data-marquee-speed-mobile"));
    }
    const contentWidth = element.clientWidth,
        node = element.querySelector("[data-marque-node]"),
        nodeWidth = node.clientWidth;
    // windowWidth = window.innerWidth;
    let slowFactor = 1 + (Math.max(1600, contentWidth) - 375) / (1600 - 375);
    element.parentElement.style.setProperty("--animation-speed", `${(scrollingSpeed * slowFactor * nodeWidth / contentWidth).toFixed(3)}s`);

}
/*------------------------Video play button------------------------------*/
function videoPlayInit() {
    if (document.querySelectorAll('[data-video-play-button]')) {
        let playButtons = document.querySelectorAll('[data-video-play-button]');
        Array.from(playButtons).forEach(function(playButton) {
            if (playButton) {
                videoPlayButtonClickEvent(playButton);
            }
        })
    }
}

function videoPlayButtonClickEvent(playButton) {
    let parent_wrapper = playButton.closest('[data-video-main-wrapper]');
    let video_style = parent_wrapper.querySelector('video');
    let iframe_style = parent_wrapper.querySelector('iframe');
    playButton.addEventListener("click", function(event) {
        event.preventDefault();
        playButton.style.display = "none";
        let videoWrapper = parent_wrapper.querySelector('[data-video-content-wrapper]');
        let videoTitle = parent_wrapper.querySelector('.video-title');
        parent_wrapper.querySelector('[data-video-thumbnail]').style.display = "none";
        if (videoWrapper) {
           videoWrapper.style.display = "none";
        }
        if (videoTitle) {
           videoTitle.style.display = "none";
        }
        if (video_style) {
           video_style.style.display = "block";
           video_style.play();
        } else {
           iframe_style.style.display = "block";
        }
    })
}
/*** End */

function textWithIcons(section = document) {
    let TextWithIconsSections = section.querySelectorAll('[data-text-with-icon]');
    Array.from(TextWithIconsSections).forEach(function(TextWithIcons) {
        TextWithIcons.querySelectorAll('.text-with-icon-item').forEach(item => {
            item.addEventListener('mouseover', function() {
                TextWithIcons.querySelectorAll('.text-with-icon-item').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
            });     
        });
    });
}

function customDropdownElements(section = document) {
    let customDropdowns = section.querySelectorAll('[data-custom-select]');
    Array.from(customDropdowns).forEach(function(dropdown) {
        const isSpecialDropdown = dropdown.classList.contains('custom-select-currency') || dropdown.classList.contains('custom-select-language');

        dropdown.addEventListener('click', () => {
            if (isSpecialDropdown) {
                const getSearchBar = document.querySelector('[data-search-wrapper]');
                if (getSearchBar?.classList.contains('show')){
                    document.querySelector("body").classList.remove("no-scroll","search-drawer-open");
                    getSearchBar.classList.remove('show');
                }
                dropdown.classList.toggle('active');
            } else {
                DOMAnimations.slideToggle(dropdown.querySelector('[data-custom-select-summary]'), 300);
            }
        });

        dropdown.onkeydown = function(e) {
            if (e.keyCode === 13 || e.keyCode === 32) {
                dropdown.click();
            }
        };

        section.addEventListener('click', (event) => {
            if (!dropdown.parentNode.contains(event.target)) {
                if (isSpecialDropdown) {
                    dropdown.classList.remove('active');
                } else {
                    DOMAnimations.slideUp(dropdown.querySelector('[data-custom-select-summary]'), 300);
                } 
            }
        });

        const container = dropdown.querySelector('[data-custom-select-summary] .custom-select-list');
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const focusedButton = document.activeElement;
                if (focusedButton.tagName === 'BUTTON') {
                    focusedButton.click();
                }
            }
        });
    });

}

function initMaps(section = document) {
    let mapSelectors = section.querySelectorAll('[data-map-container]');
    Array.from(mapSelectors).forEach(function(selector) {
        createMap(selector);
    })
}
var apiloaded = null;

function checkMapApi(selector, section = document) {
    let mapSelectors = section.querySelectorAll('[data-map-container]');
    let mapAddress = false;
    if (selector) {
        if (selector.getAttribute('data-location') != '' || selector.getAttribute('data-location') != null) {
            mapAddress = true
        }
    }
    Array.from(mapSelectors).forEach(function(selector) {
        if (selector.getAttribute('data-location') != '' || selector.getAttribute('data-location') != null) {
            mapAddress = true
        }
    })
    if (!mapAddress) return false;
    if (selector || mapSelectors.length > 0) {
        if (apiloaded === "loaded") {
            if (selector) {
                createMap(selector);
            } else {
                initMaps(section);
            }
        } else {

            if (apiloaded !== "loading") {
                apiloaded = "loading";
                if (
                    typeof window.google === "undefined" ||
                    typeof window.google.maps === "undefined"
                ) {
                    var script = document.createElement("script");
                    script.onload = function() {
                        apiloaded = "loaded";
                        if (selector) {
                            createMap(selector);
                        } else {
                            initMaps(section);
                        }
                    };
                    script.src = "https://maps.googleapis.com/maps/api/js?key=" + googleMapApiKey;
                    document.head.appendChild(script);
                }
            }
        }
    }
}

const createMarker = (map, position) => {
    return new google.maps.Marker({
        position: position,
        map: map
    });
};
const markers = [];
const updateMap = (map, latitude, longitude) => {
    map.setCenter({ lat: latitude, lng: longitude });
    map.setZoom(15);
    markers.forEach(marker => marker.setMap(null));
    const position = { lat: latitude, lng: longitude };
    const marker = createMarker(map, position);
    markers.push(marker);
};

function createMap(selector) {
    var geocoder = new google.maps.Geocoder();
    var address = jQuery(selector).data("location");
    var mapStyle = jQuery(selector).data("map-style");
    geocoder.geocode({ address: address }, function(results, status) {
        if (results != null) {
            var options = {
                zoom: 17,
                backgroundColor: "none",
                center: results[0].geometry.location,
                mapTypeId: mapStyle,
            };
            var map = (this.map = new google.maps.Map(selector, options));
            var center = (this.center = map.getCenter());
            var marker = new google.maps.Marker({
                map: map,
                position: map.getCenter(),
            });
            window.addEventListener("resize", function() {
                setTimeout(function() {
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);
                }, 250);
            });
            let parentSection = selector.closest('.shopify-section');
            var details = parentSection.querySelectorAll('[data-store-details]');
            Array.from(details).forEach(function(element) {
                mapSidebarElements(element, map, geocoder)
            });
        }
    });
}
async function getGeoDetails(geocoder, address) {
    let getAddress = new Promise(function(resolve, reject) {
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
            } else {
                reject(new Error('Couldnt\'t find the location ' + address));
            }
        })
    })
    return await getAddress;
}

function initBeforeAfter(section = document) {
    let cursors = section.querySelectorAll(".before-after-drag-point");
    setTimeout(() => {
        Array.from(cursors).forEach(function(cursor) {
            beforeAfterImage(cursor);
        });
    }, 500);
}

function beforeAfterImage(cursor) {
    const parentSection = cursor.closest(".shopify-section");
    if (!cursor.offsetParent) {
        return false;
    }
    let pointerDown = false;
    let _offsetX = (_currentX = 0);
    let minOffset = -cursor.offsetLeft - 0;
    let maxOffset = cursor.offsetParent.clientWidth + minOffset;
    parentSection.addEventListener("pointerdown", function(event) {
        if (event.target === cursor || event.target.closest(".before-after-drag-point") === cursor) {
            _initialX = event.clientX - _offsetX;
            pointerDown = true;
        }
    });
    parentSection.addEventListener("pointermove", function(event) {
        if (!pointerDown) {
            return;
        }
        _currentX = Math.min(Math.max(event.clientX - _initialX, minOffset), (maxOffset));
        _offsetX = _currentX;
        _currentX = _currentX.toFixed(1);
        parentSection.style.setProperty(
            "--image-clip-position",
            `${_currentX}px`
        );
    });
    parentSection.addEventListener("pointerup", function(event) {
        pointerDown = false;
    });
    window.addEventListener("resize", function() {
        if (!cursor.offsetParent) {
            return false;
        }
        minOffset = -cursor.offsetLeft - 0;
        maxOffset = cursor.offsetParent.clientWidth + minOffset;
        _currentX = Math.min(Math.max(minOffset, _currentX), (maxOffset))

        parentSection.style.setProperty(
            "--image-clip-position",
            `${_currentX}px`
        );
    });
}

class ScrollableImage extends HTMLElement {
    constructor() {
        super();
        this.allImages = this.querySelectorAll('.scrollable-image-text-image-inner');
        this.allContent = this.querySelectorAll('.scrollable-image-text-inner');
        this.contentMap = {};
        this.allImages.forEach(image => {
            const getContentId = image.getAttribute('data-content-id');
            this.contentMap[getContentId] = document.querySelector(`#${getContentId}`);
        });
        this.handleScroll = this.handleScroll.bind(this);
        this.debouncedHandleScroll = this.debounce(this.handleScroll, 50); 
        window.addEventListener('scroll', this.debouncedHandleScroll);
    }
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleScroll() {
        const windowScrollY = window.scrollY;
        this.allImages.forEach((image) => {
            const imageTop = image.getBoundingClientRect().top + windowScrollY - 200;
            if (windowScrollY >= imageTop) {
                const getContentId = image.getAttribute('data-content-id');
                this.allContent.forEach(content => {
                    content.classList.remove('active');
                });
                
                if (this.contentMap[getContentId]) {
                    this.contentMap[getContentId].classList.add('active');
                }

                image.classList.add('active');
            } else {
                image.classList.remove('active');
            }
        });
    }
    disconnectedCallback() {
        window.removeEventListener('scroll', this.debouncedHandleScroll);
    }
}

customElements.define('scrollable-image', ScrollableImage);


class TabbedShortVideo extends HTMLElement {
    constructor() {
      super();
      this.drawerSelector = this.getAttribute("data-popup");
      this.videoSrc = this.getAttribute("data-video-url");
      this.drawerElement = document.querySelector('#' + this.drawerSelector);
      this.contentElement = this.drawerElement?.querySelector('[data-popup-content]');
      this.addEventListener('click', this.handleClick.bind(this));
    }
  
    handleClick(event) {
      event.preventDefault();
      this.openDrawer();
    }
  
    openDrawer() {
      if (!this.drawerElement || !this.videoSrc) return;
      this.setVideoContent();
      this.drawerElement.classList.add('show');
      this.drawerElement.style.display = 'flex';
      document.body.classList.add('no-scroll');
    }
  
    setVideoContent() {
      if (this.contentElement) {
        this.contentElement.innerHTML = `
          <video
            class="popup-video" 
            autoplay 
            muted 
            loop 
            playsinline 
            controls
            data-autoplay="true"
          >
            <source src="${this.videoSrc}" type="video/mp4">
          </video>
        `;
      }
    }
  }
  
  customElements.define('tabbed-short-video', TabbedShortVideo);
  

  class TabsWrapper extends HTMLElement {
    constructor() {
      super();
      this.tabHeader = this.querySelector('[tab-content-header]');
      this.tabContent = this.querySelector('[tab-content-wrapper]');
      this.tabTriggers = this.tabHeader?.querySelectorAll('[data-tab-trigger]') || [];
      this.tabContents = this.tabContent?.querySelectorAll('[data-tab-content]') || [];
  
      this.handleClick = this.handleClick.bind(this);
  
      this.autoSwitch = this.dataset.autoSwitch === 'true';
      this.autoSwitchTime = parseInt(this.dataset.autochangeTime, 10) || 3000;
      this.currentTabIndex = 0;
      this.interval = null;
  
      if (this.autoSwitch) {
        this.startAutoSwitch();
      }
  
      this.init();
    }
  
    init() {
      if (!this.tabHeader || !this.tabContent) {
        console.warn('TabsWrapper: Missing required elements.');
        return;
      }
      this.tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', this.handleClick);
      });
    }
  
    startAutoSwitch() {
      this.interval = setInterval(() => {
        this.autoSwitchTab();
      }, this.autoSwitchTime);
    }
  
    autoSwitchTab() {
        this.querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
            if (video.getAttribute('data-autoplay') == 'false') {
                video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
            }
        });
        this.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
            if (video.getAttribute('data-autoplay') == 'false') {
                video.contentWindow.postMessage('{"method":"pause"}', "*");
            }
        });
        this.querySelectorAll("video").forEach((video) => {
            if (video.getAttribute('data-autoplay') == 'false') {
                video.pause();
            }
        });

      this.tabTriggers.forEach(trigger => trigger.classList.remove('active'));
      this.tabContents.forEach(content => content.classList.remove('active', 'animate'));
  
      this.currentTabIndex = (this.currentTabIndex + 1) % this.tabTriggers.length;
  
      const nextTabTrigger = this.tabTriggers[this.currentTabIndex];
      const nextContentId = nextTabTrigger.getAttribute('data-tab-trigger');
  
      nextTabTrigger.classList.add('active');
      this.tabContents.forEach(content => {
        if (content.getAttribute('data-tab-content') === nextContentId) {
          content.classList.add('active');
          setTimeout(() => content.classList.add('animate'), 200);
        }
      });
    }
  
    handleClick(event) {
      event.preventDefault();
  
      if (this.interval) {
        clearInterval(this.interval);
        this.classList.remove('auto-change-tabs-true');
      }


      this.querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
        if (video.getAttribute('data-autoplay') == 'false') {
            video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
        }
      });
      this.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
        if (video.getAttribute('data-autoplay') == 'false') {
            video.contentWindow.postMessage('{"method":"pause"}', "*");
        }
      });
      this.querySelectorAll("video").forEach((video) => {
        if (video.getAttribute('data-autoplay') == 'false') {
            video.pause();
        }
      });


  
      const clickedTrigger = event.currentTarget;
      const contentId = clickedTrigger.getAttribute('data-tab-trigger');
      this.tabTriggers.forEach(trigger => {
        trigger.classList.toggle('active', trigger === clickedTrigger);
      });
      this.tabContents.forEach(content => {
        if (content.getAttribute('data-tab-content') === contentId) {
          content.classList.add('active');
          setTimeout(() => {
            content.classList.add('animate');
          }, 200);
        } else {
          content.classList.remove('active', 'animate');
        }
      });
    }
  
    disconnectedCallback() {
      this.tabTriggers.forEach(trigger => {
        trigger.removeEventListener('click', this.handleClick);
      });
      if (this.interval) {
        clearInterval(this.interval);
        this.classList.remove('auto-change-tabs-true');
      }
    }
  }
  
  customElements.define('tabs-wrapper', TabsWrapper);
  
 class TaggedCollections extends HTMLElement {
    constructor() {
        super();
        this.triggers = [];
        this.images = [];
        this.content = [];
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
    }

    connectedCallback() {
        this.triggers = this.querySelectorAll('[data-tagged-collections-trigger]');

        const imagesWrapper = this.querySelector('[data-images]');
        this.images = imagesWrapper ? imagesWrapper.querySelectorAll('[data-id]') : [];

        const contentWrapper = this.querySelector('[data-content]');
        this.content = contentWrapper ? contentWrapper.querySelectorAll('[data-id]') : [];

        this.triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', this.handleMouseEnter);
        });
    }

    handleMouseEnter(event) {
        const id = event.currentTarget.getAttribute('data-tagged-collections-id');
        this.triggers.forEach(trigger =>
            trigger.classList.toggle('active', trigger.getAttribute('data-tagged-collections-id') === id)
        );
        this.images.forEach(image =>
            image.classList.toggle('active', image.getAttribute('data-id') === id)
        );
       this.content.forEach(item =>
            item.classList.toggle('active', item.getAttribute('data-id') === id)
        );
    }

    disconnectedCallback() {
        this.triggers.forEach(trigger => {
            trigger.removeEventListener('mouseenter', this.handleMouseEnter);
        });
    }
}
customElements.define('tagged-collections', TaggedCollections);

class collectonTableVariant extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
      if(this.form){
        this.form.querySelector('[name=id]').disabled = false;

        const debouncedOnChange = this.debounce((event) => {
            this.onChange(event);
        }, 10);
        this.addEventListener('change', debouncedOnChange.bind(this));
     }
    }
  onChange(event) {
      const getQuantity = parseInt(event.target.value);
      const totalPrice = this.querySelector('[data-collection-table-variant-total]');
      const getCurrentPrice =  parseInt(totalPrice.getAttribute('data-price'));
      const calTotalPrice = getCurrentPrice * getQuantity; 
      totalPrice.querySelector('.table-total-price').innerHTML =  `${Shopify.formatMoney(calTotalPrice, moneyFormat)}`;
  }
  debounce(fn, wait) {
    let t;
    return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
    };
 }
}
customElements.define('collecton-table-variant', collectonTableVariant);


class CollageImageAnimator extends HTMLElement {
    constructor() {
      super();
      this.section = this.closest('section');
      this.images = this.querySelectorAll('[data-images]');
      this.translationSettings = [
        { initialX: 0, finalX: -50, initialY: 0, finalY: -60 },
        { initialX: 0, finalX: 0, initialY: 0, finalY: -50 },
        { initialX: 0, finalX: 50, initialY: 0, finalY: -60 },
        { initialX: 0, finalX: -60, initialY: 0, finalY: -40 },
        { initialX: 0, finalX: 40, initialY: 0, finalY: -50 }
      ];
      this.handleScroll = this.onScroll.bind(this);
    }
  
    connectedCallback() {
      window.addEventListener('scroll', this.handleScroll);
    }
  
    onScroll() {
      if (isOnScreen(this.section)) {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const boundingRect = this.getBoundingClientRect();
        const contentTopPosition = boundingRect.top;
        const scrollProgress = (viewportHeight - boundingRect.bottom) / viewportHeight;
        const distanceFromBottom = viewportHeight - boundingRect.bottom;
  
        this.images.forEach((image, index) => {
          const { initialX = 0, finalX = 0, initialY = 0, finalY = 0 } = this.translationSettings[index] || {};
  
          if (distanceFromBottom < 100) {
            image.style.transform = `translate(0%, 0%)`;
            return;
          }
          if(contentTopPosition > 250){
            image.classList.remove('active');
          }else{
            image.classList.add('active');
          }
          const translateX = initialX + (finalX - initialX) * scrollProgress;
          const translateY = initialY + (finalY - initialY) * scrollProgress;
         if(contentTopPosition > 150){
           image.style.transform = `translate(${translateX}%, ${translateY}%)`; 
        }
        });
      }
    }
  }
  
customElements.define('collage-image-animator', CollageImageAnimator);


class AddAllVariants extends HTMLElement {
    constructor() {
        super();
        this.addToCartButton = this.querySelector('[data-addtocart-all]');
        this.dataErrorText = this.querySelector('[data-error-text]');
        this.addToCartButton.addEventListener('click', (event) => {
            event.stopPropagation();  
            event.preventDefault();
            this.handleAddToCart(event);
        });
    }

    handleAddToCart() {
        if(this.dataErrorText){
         this.dataErrorText.classList.add('hidden');
         this.dataErrorText.innerHTML = '';
        }
        const mainProductElement = this.closest('[data-main-product]');
        const variantElements = mainProductElement.querySelectorAll('collecton-table-variant');
        const variantItems = [];
        let checkAjaxCart = false;
        variantElements.forEach((variantElement) => {
            const addToCartButton = variantElement.querySelector('[data-addtocart-wrapper]');
            if(addToCartButton.hasAttribute('data-add-to-cart')){
                checkAjaxCart = true;
            }
            if (!addToCartButton.hasAttribute('disabled')) {
                
                const variantId = parseInt(variantElement.querySelector('[name=id]').value);
                const variantQuantity = parseInt(variantElement.querySelector('[data-quantity-input]').value);
                if(variantQuantity > 0){
                 variantItems.push({ id: variantId, quantity: variantQuantity });
                }
            }
        });
      if(variantItems.length > 0){
        const ajaxCartSectionId = 'ajax-cart';
        const cartContentElement = document.querySelector('[data-cart-content]');
        const payload = {
            items: variantItems,
            sections: [ajaxCartSectionId],
        };

        fetch(cartAddUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.text())
            .then((result) => {
                const cartData = JSON.parse(result);

                if (cartData.status) {
                    if (cartData.errors) {
                        if(this.dataErrorText){
                            this.dataErrorText.innerHTML = `<p>${cartData.message}</p>`;
                            this.dataErrorText.classList.remove('hidden');
                        }
                    } else {
                        if(this.dataErrorText){
                            this.dataErrorText.innerHTML = `<p>${cartData.description}</p>`;
                            this.dataErrorText.classList.remove('hidden');
                        }
                    }
                    return;
                }
                if(checkAjaxCart == true){
                const updatedCartHtml = new DOMParser()
                    .parseFromString(cartData.sections[ajaxCartSectionId], 'text/html')
                    .querySelector('.shopify-section');
                const cartDrawerElement = document.querySelector('#cart-side-drawer');

                if (cartDrawerElement) {
                    document.querySelector('[data-cart-drawer]').innerHTML = updatedCartHtml.querySelector('[data-cart-drawer]').innerHTML;
                    sideDrawerInt();
                    cartDrawerElement.style.display = 'flex';
                    document.body.classList.add('no-scroll');
                    setTimeout(() => cartDrawerElement.classList.add('show'), 500);

                    if (!previousFocusElement) {
                        previousFocusElement = this.addToCartButton;
                    }

                    setTimeout(() => focusElementsRotation(document.querySelector('[data-cart-drawer]')), 1000);
                    updateCartHtml(cartContentElement, cartData, ajaxCartSectionId);
                }
               }else{
                window.location.href = "/cart";
               }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
           
        }
    }
}

customElements.define('add-all-variants', AddAllVariants);


class AnimatedSlideshow extends HTMLElement {
    constructor() {
        super();
        this.wrapper = this.querySelector('[data-animated-slideshow-wrapper]');
        this.slideButtons = this.querySelectorAll('[data-slide-button]');
        this.slideArrows = this.querySelectorAll('[data-slider-arrow]');
        this.slides = this.querySelectorAll('[data-item-slide]');

        this.autoplay = this.getAttribute('data-autoplay') === 'true';
        this.autoplayInterval = parseInt(this.getAttribute('data-autoplay-time'), 10) || 5000;
        this.autoplayTimer = null; 

        setTimeout(() => {
            this.activateSlide(0);
            this.addSwipeListeners();
            if (this.autoplay) {
              this.startAutoplay();
            }
        }, 100);

        if(this.slideButtons.length > 0){
            this.wrapper.addEventListener('swipeRight', () =>{
                this.handleSwipeEvent('right');
                this.pauseAutoplay();
            });
            this.wrapper.addEventListener('swipeLeft', () =>{
                this.handleSwipeEvent('left');
                this.pauseAutoplay();
            });
        }
        this.slideButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.handleButtonClick(index);
                this.pauseAutoplay();
            });
        });

         if(this.slideArrows){
            this.slideArrows.forEach((arrow, index) => {
                arrow.addEventListener('click', () => {
                    if (arrow.hasAttribute('data-slider-prev')) {
                        this.handleSwipeEvent('right');                        
                    } else if (arrow.hasAttribute('data-slider-next')) {
                        this.handleSwipeEvent('left');
                    } else {
                        console.log('No matching action for attribute value:', attrValue);
                    }
                    this.pauseAutoplay();
                });
            });
        }        
    }

    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            this.handleSwipeEvent('left');
        }, this.autoplayInterval);
    }

    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
            if (this.autoplay) {
              setTimeout(() => this.startAutoplay(), this.autoplayInterval);
            }
        }
    }

    handleSwipeEvent(direction) {
        if (!this.wrapper.classList.contains('is-animating')) {
            this.wrapper.classList.add('is-animating');
            this.navigateSlides(direction);
        }
    }
    handleButtonClick(index) {
        if (!this.slideButtons[index].classList.contains('active') && !this.wrapper.classList.contains('is-animating')) {
            this.wrapper.classList.add('is-animating');
            this.activateSlide(index);
        }
    }
    activateSlide(index) {
        this.slides.forEach((slide) => slide.classList.remove('active'));
        if(this.slideButtons.length > 0){
            this.slideButtons.forEach((btn) => btn.classList.remove('active'));
            this.slideButtons[index].classList.add('active');
        }
        this.slides[index].classList.add('active');
        this.animateText();
    }
    navigateSlides(direction) {
        const currentIndex = Array.from(this.slideButtons).findIndex((btn) => btn.classList.contains('active'));
        let newIndex;

        if (direction === 'right') {
            newIndex = (currentIndex === 0) ? this.slideButtons.length - 1 : currentIndex - 1;
        } else if (direction === 'left') {
            newIndex = (currentIndex === this.slideButtons.length - 1) ? 0 : currentIndex + 1;
        }

        this.activateSlide(newIndex);
    }
    addSwipeListeners() {
        let startX, startY, endX, endY;

        const startHandler = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
        };

        const endHandler = (e) => {
            const touch = e.changedTouches ? e.changedTouches[0] : e;
            endX = touch.clientX;
            endY = touch.clientY;
            this.detectSwipe(startX, startY, endX, endY);
        };

        this.wrapper.addEventListener('touchstart', startHandler);
        this.wrapper.addEventListener('mousedown', startHandler);
        this.wrapper.addEventListener('touchend', endHandler);
        this.wrapper.addEventListener('mouseup', endHandler);
    }

    detectSwipe(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            this.triggerSwipeEvent(diffX > 0 ? 'swipeRight' : 'swipeLeft');
        } else {
            this.triggerSwipeEvent(diffY > 0 ? 'swipeDown' : 'swipeUp');
        }
    }
    triggerSwipeEvent(eventType) {
        const event = new Event(eventType);
        this.wrapper.dispatchEvent(event);
    }

    animateText() {
        setTimeout(() => {
            this.wrapper.classList.remove('is-animating');
        }, 1000);
    }
}

customElements.define('animated-slideshow', AnimatedSlideshow);


class collectionTable extends HTMLElement {
    constructor() {
      super();
      this.wrapper = this;
      this.addEventListener('click', (event) => {
        const target = event.target.closest('view-all-variants');
        if (target) {
          this.handleViewAllVariants(target);
        }
      });
    }
  
    handleViewAllVariants(target) {
      target.innerHTML = preLoaderIcon;
      const parentElement = target.closest('[variants-main-parents]');
      const productUrl = target.getAttribute('data-product-url');
      const sectionId = target.getAttribute('data-section');
  
      if (!productUrl || !sectionId) {
        console.error('Missing data-product-url or data-section attributes');
        return;
      }
      fetch(`${productUrl}?section_id=${sectionId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((htmlString) => {
          const parsedHTML = new DOMParser().parseFromString(htmlString, 'text/html');
          const shopifySection = parsedHTML.querySelector('.shopify-section');
          if (shopifySection) {
              const shopifySectionHTML = shopifySection.innerHTML;
              target.outerHTML = shopifySectionHTML;
              const updatedvariantsWrapper = parentElement.querySelectorAll('.extra-varinats-wrapper');
              updatedvariantsWrapper.forEach((variantWrapper) => {
                const quantityWrapper = variantWrapper.querySelector('[data-quantity-wrapper]');
                const cartAtcElements = variantWrapper.querySelector("[data-add-to-cart]");
                   initQuantityAction(quantityWrapper);
                   initAddToCart(cartAtcElements);
              });
              
          }
        })
        .catch((error) => console.error('Error loading variants:', error));
    }
}
  
customElements.define('collection-table', collectionTable);

function collectionTableElements() {
    // document.querySelectorAll("[view-all-variants]").forEach(element => {
    //     element.addEventListener("click", event => {
    //         const viewAllParent = element.closest("[detail-expand]");
    //         if (!viewAllParent) return;
    //         element.classList.add("hidden");
    //         viewAllParent.querySelectorAll("collecton-table-variant").forEach(item => {
    //             item.classList.remove("hidden");
    //         });
    //     });
    // });
}

function popupContentElements() {
    let popupElements = document.querySelectorAll("[data-popup-header]");
    let popupBody = document.querySelectorAll("[data-popup-body]");
    let closepopupElement = document.querySelectorAll("[data-popup-close]");
    Array.from(popupElements).forEach(function(element) {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            
                document.querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                    if (video.getAttribute('data-autoplay') == 'false') {
                        video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
                    }
                });
                document.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
                    if (video.getAttribute('data-autoplay') == 'false') {
                        video.contentWindow.postMessage('{"method":"pause"}', "*");
                    }
                });
                document.querySelectorAll("video").forEach((video) => {
                    if (video.getAttribute('data-autoplay') == 'false') {
                        video.pause();
                    }
                });

                var modelItems =  document.querySelectorAll(".product-model-item");
                if(modelItems.length > 0){
                    modelItems.forEach(function(modelItem) {
                        var getCloseButton = modelItem.querySelector('.close-product-model');
                        if (getCloseButton) {
                            getCloseButton.dispatchEvent(new Event('click'));
                        }
                    });          
                }
            
            let id = element.getAttribute("href");
            Array.from(popupBody).forEach(function(bodyElement) {
                bodyElement.classList.remove("show");
                bodyElement.style.display = "none";
            });
            document.querySelector("body").classList.add("no-scroll");

            if(id == '#product-media-popup'){

                

                const mediaId = element.getAttribute("data-media-id");
                if (mediaId) {
                  const mediaPopup = document.querySelector(id);
                  if (mediaPopup) {
                    const mediaItems = mediaPopup.querySelectorAll('.product-media-popup-item');
                    mediaItems.forEach(media => media.classList.remove('active-media'));
                    const targetMedia = mediaPopup.querySelector(`#${mediaId}`);
                    if (targetMedia) {
                      targetMedia.classList.add('active-media');
                      setTimeout(function(){
                            targetMedia.scrollIntoView({
                                behavior: "smooth",
                                block: "center"  
                            });
                        }, 100);
                    }
                  } 
                }
            }
            if(id == '#sizeChart'){
                document.querySelector("body").classList.add("sizeChart-popup-open");
            }
            document.querySelector(id).style.display = "block";
            setTimeout(function() {
                document.querySelector(id).classList.add("show");
            }, 300)

        })
    })

    Array.from(closepopupElement).forEach(function(closeElement) {
        closeElement.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector("body").classList.remove("no-scroll","sizeChart-popup-open");
            // document.querySelector("body").classList.remove("sizeChart-popup-open");
            setTimeout(function() {
                closeElement.closest("[data-popup-body]").style.display = "none";
                if(closeElement.closest("[data-footer-newsletter-popup]")){
                   document.querySelector('[data-newsletter-target]').focus();
                }
            }, 200)
            setTimeout(function() {
                closeElement.closest("[data-popup-body]").classList.remove("show");
                closeElement.closest("[data-popup-body]").querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
                        video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
                });
                closeElement.closest("[data-popup-body]").querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
                        video.contentWindow.postMessage('{"method":"pause"}', "*");
                });
                closeElement.closest("[data-popup-body]").querySelectorAll("video").forEach((video) => {
                        video.pause();
                });
            }, 300)
        })
    });
}

function slideToggleInt(section = document) {
    let slideElements = section.querySelectorAll("[data-slide-toggle]");
    Array.from(slideElements).forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            let parent = element.closest('[data-slide-toggle-wrapper]');
            parent.classList.toggle('active');
            DOMAnimations.slideToggle(parent.querySelector("[data-slide-toggle-body]"), 300);
        })
    })
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
 
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function copyCouponcode() {
    let copyText = document.querySelector(".coupon-code-name-text");
    let textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    let copyelement = document.querySelector(".coupon-code-message");
    copyelement.textContent='Copied';
    setTimeout(function(){
        copyelement.textContent='';
    },1000)
  }

  /* hamburger nemu for mobile header */
function menuHamburgerEvent() {
    let hamburgerElements = document.querySelectorAll('[data-mobile-hamburger]');
    let bodyElement = document.querySelector('body');
    let dropdownChildrens = document.querySelectorAll('[data-children-menu]');
    let  menubarElement = document.querySelector('[data-menu-drawer]');
    Array.from(hamburgerElements).forEach(function(hamburgerElement) {
        hamburgerElement.addEventListener("click", function(event) {
            event.preventDefault();
            const getSearchBar = document.querySelector('[data-search-wrapper]');
            if (getSearchBar?.classList.contains('show')){
                document.querySelector("body").classList.remove("no-scroll", "search-drawer-open");
                getSearchBar.classList.remove('show');
            }
             if(hamburgerElement.classList.contains("mobile-menu-link-icon")){
               if(hamburgerElement.closest(".mobile-menu-item").classList.contains("has-children")){
                 hamburgerElement.closest(".mobile-menu-item").classList.add("show");
                }
             }
             if(hamburgerElement.classList.contains('hamburger-toggler')){
                if (bodyElement.classList.contains('menu-open')) {
                    bodyElement.classList.remove('no-scroll', 'menu-open');
                    menubarElement.classList.remove('show');
                    Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                        dropdownChildren.classList.remove('show');
                    })
                } else {
                    bodyElement.classList.add('no-scroll', 'menu-open');
                    menubarElement.classList.add('show');
                } 
             }
            
        });

        let closemobilemenu = document.querySelector("[data-mobile-hamburger-close]");
        closemobilemenu.addEventListener("click", function(event){
            bodyElement.classList.remove('no-scroll', 'menu-open');
            menubarElement.classList.remove('show');
            Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                dropdownChildren.classList.remove('show');
            })
        })
    })
    window.addEventListener("resize", function() {
        if (window.innerWidth > 991 && bodyElement.classList.contains('menu-open')) {
            bodyElement.classList.remove('menu-open', 'no-scroll');
            Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                dropdownChildren.classList.remove('show');
            })
            menubarElement.classList.remove('show');
        }
    })
}
function mobileMenuitemsEvent() {
    let navBarbackElemets = document.querySelectorAll("[data-menu-navback]");
    let submenuDropdowns= document.querySelectorAll("[data-submenu-dropdown]");
    Array.from(navBarbackElemets).forEach(function(navBarbackElement) {
        navBarbackElement.addEventListener("click", function(event) {
            event.target.closest('.mobile-menu-item.show').classList.remove('show');
        })
    })
    Array.from(submenuDropdowns).forEach(function(submenuDropdown){
        submenuDropdown.addEventListener("click", function(event) {
            let menuParent = event.target.closest('.mobile-submenu-item');
            let menuList = menuParent.querySelector(".mobile-grand-submenu");
            if (!menuParent.classList.contains('show')) {
                DOMAnimations.classToggle(menuParent, 'show');
                DOMAnimations.slideToggle(menuList);
            }else{                      
                setTimeout(function(){
                    DOMAnimations.classToggle(menuParent, 'show'); 
                },500)            
            }
            DOMAnimations.slideToggle(menuList);
        })
    })
    /* ---dropDown menu mobile---*/


}
function headerNavigationPosition(section = document) {

    const menuItems = document.querySelectorAll('[data-navigation-megamenu-item]');

    menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        document.body.classList.add('megamenu-active');
      });
  
      item.addEventListener('mouseleave', () => {
        document.body.classList.remove('megamenu-active');
      });
    });

    if (window.innerWidth < 992) return false;
    let allNavigations = section.querySelectorAll("[data-navigation-item]");
    Array.from(allNavigations).forEach(function(navItem) {
        navItem.classList.remove("left-menu");
        let windowSize = window.innerWidth - 200;
        let currentPosition = navItem.offsetLeft + navItem.clientWidth;
        if (navItem.querySelector(".nav-submenu.inner")) {
            currentPosition =currentPosition + navItem.querySelector(".nav-submenu.inner").clientWidth;
        }
        if (currentPosition >= windowSize) {
            navItem.classList.add("left-menu");
        }
    });
}

function productGiftOptions(section = document) {
    let giftCardWrappers = section.querySelectorAll('[data-gift-card-box]');
    Array.from(giftCardWrappers).forEach(function(giftCard) {
        let jsCheck = giftCard.querySelector('[data-js-gift-card-selector]')
        if (jsCheck) {
            jsCheck.disabled = false;
            Array.from(giftCard.querySelectorAll('[data-gift-input]')).forEach(function(input) {
              input.disabled = true;
            });
            jsCheck.addEventListener('click', function() {
                let giftCardContent = giftCard.querySelector('[data-gift-card-content]');
                if (jsCheck.checked) {
                    DOMAnimations.slideDown(giftCardContent, 500);
                    Array.from(giftCard.querySelectorAll('[data-gift-input]')).forEach(function(input) {
                      input.disabled = false;
                    });
                } else {
                    DOMAnimations.slideUp(giftCardContent, 500);
                    Array.from(giftCard.querySelectorAll('[data-gift-input]')).forEach(function(input) {
                      input.disabled = true;
                    });
                    let formErrorWrapper = giftCard.querySelector('.form-message__wrapper');
                    if (formErrorWrapper) {
                        formErrorWrapper.classList.add('hidden')
                        let formErrorMessage = formErrorWrapper.querySelector('.error-message');
                        if (formErrorMessage) {
                            formErrorMessage.innerHTML = '';
                        }
                    }
                }
            })
        }
        let noJsCheck = giftCard.querySelector('[data-no-js-gift-card-selector]')
        if (noJsCheck) {
            noJsCheck.disabled = true;
        }
    })
}


function MainContentClipPath(){
    const mainContent = document.querySelector('.scroll-animations-true'); 
  if(mainContent){
    function updateClipPath() {
        if (window.innerWidth > 767) {
        const rect = mainContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
            if (rect.bottom <= windowHeight && rect.bottom >= 0) {
                const progress = (windowHeight - rect.bottom) / windowHeight;
                const xValue = progress * 50; 
                const yValue = progress * 50; 
                mainContent.style.clipPath = `inset(0px ${xValue}px round ${yValue}px)`;
            }else{
                mainContent.style.clipPath = `inset(0px 0px round 0px)`;
            }
        }else{
        mainContent.style.clipPath = `inset(0px 0px round 0px)`;        
        }
    }
    window.addEventListener('scroll', updateClipPath);
    window.addEventListener('resize', updateClipPath);
    updateClipPath();
  } 
}

function productMediaHeight() {
    const productContentWrapper = document.querySelector('[data-product-content]');
    if (!productContentWrapper) return; 
    
    if (productContentWrapper.classList.contains('product-layout-grid')) {
        const mainMediaContainer = productContentWrapper.querySelector('[data-product-main-media]');
        if (!mainMediaContainer) return;

        const productMedia = mainMediaContainer.querySelector('.main-product-item');
        if (!productMedia) return;

        const mediaHeight = productMedia.offsetHeight;
        productContentWrapper.style.setProperty('--product-media-height', `${mediaHeight}px`);
    }
}

function mainProductStickyImage(){
    const productStickyImage = document.querySelector('[data-sticky-variant-image]');
    const productStickyMainWrapper = document.querySelector('[data-product-wrapper]');

    if (!productStickyImage || !productStickyMainWrapper) return;

    window.addEventListener('scroll', () => {
        const wrapperTop = productStickyMainWrapper.getBoundingClientRect().top + 300;
        if (wrapperTop <= 0) {
            productStickyImage.classList.add('active');
        } else {
            productStickyImage.classList.remove('active');
        }
    });
}

class VideoManager {
    constructor(mainWrapper) {
        this.main = mainWrapper;

        if (this.main) {
            this.init();
            this.isYouTubeAPIReady = false;
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.onload ? resolve() : existingScript.addEventListener('load', resolve);
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    init() {
        const vimeoElements = this.main.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']");
        const youtubeElements = this.main.querySelectorAll(".youtube_video,.youtube-video, iframe[src*='www.youtube.com']");
        const mp4Elements = this.main.querySelectorAll("video");

        this.loadYouTubeAPI()
            .then(() => {
                youtubeElements.forEach(element => {
                    this.setupYouTubePlayer(element);
                });
            })
            .catch(error => {
                console.warn('Failed to load YouTube API:', error);
            });

        this.loadVimeoAPI()
            .then(() => {
                vimeoElements.forEach(element => {
                    this.setupVimeoPlayer(element);
                });
            })
            .catch(error => {
                console.warn('Failed to load Vimeo API:', error);
            });

        mp4Elements.forEach(element => {
            this.setupMP4Player(element);
        });
    }

    loadYouTubeAPI() {
        return new Promise((resolve, reject) => {
            if (window.YT && YT.Player) {
                this.isYouTubeAPIReady = true;
                resolve();
                return;
            }
    
            if (this.isYouTubeAPIInProgress) {
                const checkAPIReady = setInterval(() => {
                    if (window.YT && YT.Player) {
                        this.isYouTubeAPIReady = true;
                        clearInterval(checkAPIReady);
                        resolve();
                    }
                }, 100);
                return;
            }
    
            this.isYouTubeAPIInProgress = true;
    
            this.loadScript('https://www.youtube.com/iframe_api')
                .then(() => {
                    window.onYouTubeIframeAPIReady = () => {
                        this.isYouTubeAPIReady = true;
                        resolve();
                    };
                })
                .catch(reject);
        });
    }
    
    setupYouTubePlayer(element) {
        if (!this.isYouTubeAPIReady) {
            console.warn('YouTube API not ready. Retrying...');
            const retryInterval = setInterval(() => {
                if (this.isYouTubeAPIReady) {
                    clearInterval(retryInterval);
                    this.initializeYouTubePlayer(element);
                }
            }, 100);
            return;
        }
        this.initializeYouTubePlayer(element);
    }
    
    initializeYouTubePlayer(element) {
        const player = new YT.Player(element, {
            events: {
                onStateChange: event => {
                    switch (event.data) {
                        case YT.PlayerState.PLAYING:
                            // console.log('YouTube video is playing.');
                            this.pauseOthers(element);
                            break;
                        case YT.PlayerState.PAUSED:
                            // console.log('YouTube video is paused.');
                            break;
                        case YT.PlayerState.ENDED:
                            // console.log('YouTube video has ended.');
                            break;
                        default:
                            // console.log('YouTube video state changed to:', event.data);
                            break;
                    }
                },
            },
        });
    }
    

    loadVimeoAPI() {
        return new Promise((resolve, reject) => {
            if (window.Vimeo && Vimeo.Player) {
                resolve();
                return;
            }
    
            this.loadScript('https://player.vimeo.com/api/player.js')
                .then(() => {
                    const checkVimeoReady = setInterval(() => {
                        if (window.Vimeo && Vimeo.Player) {
                            clearInterval(checkVimeoReady);
                            resolve();
                        }
                    }, 100);
                })
                .catch(error => {
                    console.error('Failed to load Vimeo API:', error);
                    reject(error);
                });
        });
    }
    

    setupVimeoPlayer(element) {
        if (!window.Vimeo || !Vimeo.Player) {
            console.warn('Vimeo API not ready. Retrying...');
            const retryInterval = setInterval(() => {
                if (window.Vimeo && Vimeo.Player) {
                    clearInterval(retryInterval);
                    this.initializeVimeoPlayer(element);
                }
            }, 100);
            return;
        }
        this.initializeVimeoPlayer(element);
    }

    initializeVimeoPlayer(element) {
        if (!element || !element.src || !element.src.includes('player.vimeo.com')) {
            console.warn('The player element passed isn’t a Vimeo embed.');
            return;
        }
    
        const player = new Vimeo.Player(element);
    
        player.on('play', () => {
            // console.log('Vimeo video is playing.');
            this.pauseOthers(element);
        });
        player.on('pause', () => {
            //  console.log('Vimeo video is pause.');
        });
    
        // console.log('Vimeo Player initialized:', player);
    }
    

    setupMP4Player(element) {
        element.addEventListener('play', () => {
            this.pauseOthers(element);
        });
    }

    pauseOthers(currentVideo) {
        this.main.querySelectorAll(".youtube_video,.youtube-video, iframe[src*='www.youtube.com']").forEach(video => {
            if (currentVideo !== video) {
                video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
            }
        });

        this.main.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach(video => {
            if (currentVideo !== video) {
                video.contentWindow.postMessage('{"method":"pause"}', "*");
            }
        });

        this.main.querySelectorAll("video").forEach(video => {
            if (currentVideo !== video) {
                video.pause();
            }
        });

        var modelItems = this.main.querySelectorAll(".product-model-item");
        if (modelItems.length > 0) {
            modelItems.forEach(function (modelItem) {
                modelItem.modelViewerUI.pause();  
                // var getCloseButton = modelItem.querySelector('.close-product-model');
                // if (getCloseButton) {
                //     getCloseButton.dispatchEvent(new Event('click'));
                // }
            });
        }
    }
}

document.querySelectorAll('[data-product-wrapper]').forEach(wrapper => {
    new VideoManager(wrapper);
});


window.addEventListener("resize", (event) => {
    productMediaHeight();
    var sliders = jQuery('body').find('[data-slick]');
    if (sliders.length > 0) {
        sliders.each(function(index) {
            jQuery(this).slick('resize');     
        });
    }
});

document.addEventListener("DOMContentLoaded", function(section = document ){
    if(document.querySelector('header')){
        stickyHeaderInit();
        menuHamburgerEvent();
    }
    productMediaHeight();
    mainProductStickyImage();
    sliders();
    customDropdownElements();
    countdownClock();
    videoPlayInit();
    tabbedCollection();
    detailDisclouserInit();
    quickViewElements();
    quantitySelectors();
    updateCartNote();
    cartItemRemoveElements();
    productVariantOption();
    getAddToCartElements();
    marqueeTextScroll();
    marqueeTextAutoplay();
    collapsiblecontentClose();
    textWithIcons();
    checkMapApi();
    initBeforeAfter();
    popupContentElements();
    collectionTableElements();
    colorSwatchesMediaChanged();
    productRecommendations();
    sideDrawerInt();
    filtersDesktopTrigger();
    cartDrawerNoteInit();
  
    slideToggleInt();
    recentlyViewedProducts();
    // shippingEstimates();
    mobileMenuitemsEvent();
    headerNavigationPosition();
    productGiftOptions();
    MainContentClipPath();
    AOS.init();
}, false);

window.addEventListener('scroll', function() {
    document.querySelectorAll(".youtube_video,.youtube-video,iframe[src*='www.youtube.com']").forEach((video) => {
        if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
            video.contentWindow.postMessage('{"event":"command","func":"' + "pauseVideo" + '","args":""}',"*");
        }
    });
    document.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach((video) => {
        if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
            video.contentWindow.postMessage('{"method":"pause"}', "*");
        }
    });
    document.querySelectorAll("video").forEach((video) => {
        if (!isOnScreen(video) && video.getAttribute('data-autoplay') == 'false') {
            video.pause();
        }
    });
});
