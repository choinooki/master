document.addEventListener("shopify:section:load", function(section) { 
    let target = section.target;
    // let bodyElement = document.querySelector('body');
    // let sliders = target.querySelectorAll('[data-slick]')
    // Array.from(sliders).forEach(function(slider) {
    //     if (!slider.classList.contains('slick-initialized')) {
    //         slickSlider($(slider));
    //     }
    // })
    
    // if(document.querySelector("[data-dropdown-close]")){
    //     document.querySelector("[data-dropdown-close]").addEventListener("click", function(event){
    //         event.preventDefault();
    //         document.querySelector('[data-dropdown-body]').classList.remove("is-open")
    //     })
    // }
    // if(target.classList.contains('header')){
    //     if (bodyElement.classList.contains('menu-open')) {
    //         bodyElement.classList.remove('no-scroll', 'menu-open'); 
    //     } 
    // }
    
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
});
document.addEventListener("shopify:section:unload", function(section) {
    let target = section.target;
    if(document.querySelector('header')){
        stickyHeaderInit();
        // menuHamburgerEvent();
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
});


document.addEventListener("shopify:block:select", function(block) {

    if(document.querySelector('header')){
        stickyHeaderInit();
        // menuHamburgerEvent();
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


    let target = block.target;
    let slider = target.closest('.slick-initialized');
    if (slider) {
        let slidesLength = parseInt(slider.dataset.slidesLength);
        let slidesToShow = $(slider).slick("slickGetOption","slidesToShow");
        let leastValue =  slidesLength - slidesToShow;
        let indexValue = parseInt(target.getAttribute("data-slide"));
        if(slidesToShow > 1 & indexValue > leastValue & window.innerWidth > 767){
            indexValue = Math.ceil(leastValue) 
        }
        $(slider).slick('slickGoTo', indexValue);
    }
    // animated-slideshow
    if(target.classList.contains('animated-slideshow-item')){
        const animatedSlideshow =  target.closest('animated-slideshow');
        if(animatedSlideshow){
        const getIndex = target.dataset.itemSlideIndex;
        animatedSlideshow.activateSlide(getIndex);
        }
    }
     /*---------tabbedCollection---------*/
    if (target.closest("collection-tabs-content-list")) {
        target.trigger("click");
    }
    
    if (target.closest("tabs-wrapper")) {
        const clickEvent = new Event("click", { bubbles: true, cancelable: true });
        target.dispatchEvent(clickEvent); 
    }

});

document.addEventListener("shopify:block:deselect", function(block) {
  
    if(document.querySelector('header')){
        stickyHeaderInit();
        // menuHamburgerEvent();
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
});


document.addEventListener('shopify:section:select', (event) => {
    let _target = event.target;
    if (_target.querySelector('[data-quickview-drawer]')) {
        _target.querySelector('[data-quickview-drawer]').classList.add('show');
        document.body.classList.add('no-scroll');
        setTimeout(() => {
          _target.querySelector('[data-quickview-drawer]').style.display = 'block';
        }, 200);
      }
});
document.addEventListener('shopify:section:deselect', (event) => {
    let _target = event.target;
    if (_target.querySelector('[data-quickview-drawer]')) {
        _target.querySelector('[data-quickview-drawer]').classList.remove('show');
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
          _target.querySelector('[data-quickview-drawer]').style.display = 'none';
        }, 200);
      }
});
