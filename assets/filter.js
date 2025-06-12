
let filterSortHtml = '';
var clearAllFilterButton = false,
    minPriceRange = '',
    maxPriceRang = '';  

window.addEventListener('load', (event) => {
    loadFiltercontent();
    window.addEventListener('scroll',(event) => {
        var scrollElement = document.querySelector("[data-scroll]");
        if (scrollElement) {
            infineScroll(scrollElement);
        }
    });

if(document.querySelector("[data-dropdown-close]")){
    document.querySelector("[data-dropdown-close]").addEventListener("click", function(event){
        event.preventDefault();
        document.querySelector('[data-dropdown-body]').classList.remove("is-open")
    })
}

});
function showMoreFilters() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        var showMoreFilters = filterForm.querySelectorAll('.filters-expand');
        if (showMoreFilters) {
            Array.from(showMoreFilters).forEach(function(showMoreFilter) {
                showMoreFilter.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (showMoreFilter.classList.contains('active')) {
                        showMoreFilter.classList.remove('active');
                        DOMAnimations.slideUp(showMoreFilter.parentNode.querySelector('.more-options'), 150);
                        showMoreFilter.querySelector('strong').textContent = showMoreText;
                    } else {
                        showMoreFilter.classList.add('active');
                        DOMAnimations.slideDown(showMoreFilter.parentNode.querySelector('.more-options'), 150);
                        showMoreFilter.querySelector('strong').textContent = showLessText;
                    }
                });
            });
        }
    }
}
function dropDownBar(sections = document) {
    if (document.querySelectorAll('[data-dropdown-head]')) {
        let dropdownHead = document.querySelectorAll('[data-dropdown-head]');
        Array.from(dropdownHead).forEach(function(dropdownHeadElement) {

            dropdownHeadElement.addEventListener("click", (e) => {
                e.preventDefault();
                let parent = dropdownHeadElement.closest('.shopify-section');
                if (parent.querySelector("[data-dropdown-body]").classList.contains("is-open")) {
                    parent.querySelector("[data-dropdown-body]").classList.remove("is-open");
                } else {
                    parent.querySelector("[data-dropdown-body]").classList.add("is-open");
                }
            })
        });
    }
}

function applyFilters() {
    if( document.querySelector('[data-products-container]')){
        var section = document.querySelector('[data-products-container]');
        var parentSection=section.closest('.shopify-section');
        if (section) {
            var sectionId = section.dataset.id;
            const filterForm = document.getElementById('filterForm');
            if (!filterForm) {
                return false;
            }
            let rangeInput = document.querySelectorAll(".filter-option-range-input input"),
                priceInput = document.querySelectorAll(".filter-option-price-input input"),
                range = document.querySelector("#price-silder-progress");
                if(rangeInput.length > 0){
                    let priceGap = rangeInput[0].getAttribute('step');
                    priceInput.forEach((input) => {
                        input.addEventListener("change", (e) => {
                            let minPrice = parseInt(priceInput[0].value),
                                maxPriceRange = parseInt(priceInput[1].getAttribute("data-max-value"));
                            if (minPrice > maxPriceRange) {
                                minPrice = maxPriceRange;
                                priceInput[0].value = minPrice;
                            }
    
                            getFilterData(input, sectionId)
            
                        });
                    });
                    rangeInput.forEach((input) => {
                        input.addEventListener("change", (event) => {
                            rangeSlider(input, event);
                            getFilterData(input, sectionId);
            
                        });
                        input.addEventListener("input", (event) => {
                            rangeSlider(input, event);
                        
                        });
                    });
                    var rangeSlider = function(input, event) {
                        let minVal = parseInt(rangeInput[0].value),
                            maxVal = parseInt(rangeInput[1].value);
                        minPriceRange = (minVal / rangeInput[0].max) * 100 + "%";
                        maxPriceRang = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                        if (maxVal - minVal < priceGap) {
                            if (event.target.className === "price-slider-range-min") {
                                rangeInput[0].value = maxVal - priceGap;
                            } else {
                                rangeInput[1].value = minVal + priceGap;
                            }
                        } else {
                            priceInput[0].value = minVal;
                            priceInput[1].value = maxVal;
                            range.style.left = minPriceRange;
                            range.style.right = maxPriceRang; 
                        }
                    }
                }
            if (window.innerWidth > 767) {
                let inputs = filterForm.querySelectorAll('input[type=checkbox]');
                Array.from(inputs).forEach(function(input) {
                    input.addEventListener("click", () => {
                        if (window.innerWidth > 767) {
                            getFilterData(input, sectionId)
                        }
                    });
                });
    
                let applyButton = parentSection.querySelector("#applyFilter");
                applyButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (window.innerWidth > 767) {
                        setTimeout(function(){
                            if( parentSection.querySelector("[data-dropdown-body]")){
                                parentSection.querySelector("[data-dropdown-body]").classList.remove("is-open");
                            }
                            if( parentSection.querySelector("[data-filter-drawer]")){
                                parentSection.querySelector("[data-filter-drawer]").classList.remove("show");
                                
                            }
                        },300);
                        setTimeout(function(){
                           // parentSection.querySelector("[data-filter-drawer]").style.display='none';
                        },500)
                        document.querySelector('body').classList.remove('no-scroll');
                      
                    }
                })
    
            } else {
                let inputs = filterForm.querySelectorAll('input[type=checkbox]');
                Array.from(inputs).forEach(function(input) {
                    input.addEventListener("click", () => {
                        if(input.parentNode.classList.contains("active"))
                        {
                            input.parentNode.classList.remove("active");
                            input.removeAttribute("checked");
                        }
                    });
                });
                filterForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    getFilterData(filterForm,sectionId);
                    setTimeout(function(){
                        if( parentSection.querySelector("[data-dropdown-body]")){
                            parentSection.querySelector("[data-dropdown-body]").classList.remove("is-open");
                        }
                        if( parentSection.querySelector("[data-filter-drawer]")){
                            parentSection.querySelector("[data-filter-drawer]").classList.remove("show");
                            
                        }
                    },300);
                    setTimeout(function(){
                       parentSection.querySelector("[data-filter-drawer]").style.display='none';
                    },500)
                    document.querySelector('body').classList.remove('no-scroll');
                }); 
            }
    
            // filterForm.addEventListener("submit", (e) => {
            //     e.preventDefault();
            //     getFilterData(sectionId);
            //     filterForm.closest("[data-drawer-content]").classList.remove("sl-drawer-visible");
            //     document.querySelector('body').classList.remove('sl-no-scroll');
            // });
    
        }
    }
}

function removeFilter(parentSection,sectionId){
    var removeFilters = parentSection.querySelectorAll('a.applied-filter-remove');
    Array.from(removeFilters).forEach(function(removeFilter) {
        removeFilter.addEventListener("click", (e) => {
            e.preventDefault();
            if (removeFilter.hasAttribute('applied-filter-cross-all')) {
                var _url = removeFilter.getAttribute('href');
                getFilterData(removeFilter, sectionId, _url);
                return false;
            } else {
                var _url = removeFilter.getAttribute('href');
                getFilterData(removeFilter, sectionId, _url);
            }

        });

    });
}
function sortByOptions() {
    const sortByOptionsMainwrapper =  document.querySelector('[data-filter-sort-main]');
    if(sortByOptionsMainwrapper){
        const shortFilterHeight = sortByOptionsMainwrapper.getBoundingClientRect().height.toFixed(2);
        document.querySelector('body').style.setProperty('--collection-nav-height', `${shortFilterHeight}px`);   
    }
    var section = document.querySelector('[data-products-container]');
    var sortBy = document.querySelectorAll('[name="sort_by"]');
    if (section) {
        var sectionId = section.dataset.id;
        Array.from(sortBy).forEach(function(sort) {
            const parentLi = sort.closest('li');
            sort.addEventListener("change", (e) => {
                let value = sort.getAttribute("data-name");
                Array.from(sortBy).forEach(function(sort) {
                    sort.parentNode.classList.remove('selected');
                })
                sort.parentNode.classList.add('selected');
                getFilterData(sort, sectionId); 
                document.querySelector(".sort-by-name-value").innerHTML = `<strong>${value}</strong>`;
            });
            if (parentLi) {
                parentLi.setAttribute('tabindex', '0'); 
                parentLi.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        sort.click();
                    }
                });
            }
        });
    }
}

function fetchFilterData(url) {
    return fetch(url)
        .then(response => response.text())
}

function getFilterData(input, sectionId, remove) {
    let filterForm = document.getElementById('filterForm');
    let parentSection=filterForm.closest(".shopify-section")
    const formData = new FormData(filterForm);
    let searchParameters = new URLSearchParams(formData).toString();
    let url = window.location.pathname + '?section_id=' + sectionId + '&' + searchParameters;
    let _updateUrl = window.location.pathname + '?' + searchParameters
    if (remove) {
        url = remove;
        _updateUrl = remove;
    }
    const html = fetchFilterData(url).then((responseText) => {
        const resultData = new DOMParser().parseFromString(responseText, 'text/html');
        
        var produtsHtml = resultData.querySelector('[data-products-container]');
        var produtsElement = document.querySelector('[data-products-container]');



        /* Result for the collection and search page */
        if (produtsHtml) {

            const resultProductsWrapper = produtsHtml.querySelector('[data-products]');
            const mainProductsWrapper = produtsElement.querySelector('[data-products]');
            if(resultProductsWrapper && mainProductsWrapper){
              mainProductsWrapper.innerHTML = resultProductsWrapper.innerHTML
            }

            const resultActiveFiltersWrapper = produtsHtml.querySelector('[data-active-filters]');
            const mainActiveFiltersWrapper = produtsElement.querySelector('[data-active-filters]');
            
            if (resultActiveFiltersWrapper && mainActiveFiltersWrapper) {
                if (resultActiveFiltersWrapper.classList.contains('hidden')) {
                    mainActiveFiltersWrapper.classList.add('hidden');
                    mainActiveFiltersWrapper.innerHTML = '';
                } else {
                    mainActiveFiltersWrapper.classList.remove('hidden');
                    mainActiveFiltersWrapper.innerHTML = resultActiveFiltersWrapper.innerHTML;
                }
            }

            // produtsElement.innerHTML = produtsHtml.innerHTML
            let quickviewElements = produtsElement.querySelectorAll("[data-quickview-action]");
            Array.from(quickviewElements).forEach(function (element) {
                initQuickView(element);
            });
            colorSwatchesMediaChanged(produtsElement);
    
        }
        if(resultData.querySelector('[data-search-result-count]')){
            document.querySelector("[data-search-result-count]").textContent =resultData.querySelector('[data-search-result-count]').textContent;
        }

 
       /*------------ update filter sidebar --------------*/
       var currentFilterItems = document.querySelector(".filter-columns");
       var resultFilterItems = resultData.querySelector(".filter-columns");
       
       if (currentFilterItems && resultFilterItems) {
           currentFilterItems.innerHTML = resultFilterItems.innerHTML;
       }

       var currentFilterItemsButton = document.querySelector(".filter-buttons");
       var resultFilterItemsButton = resultData.querySelector(".filter-buttons");
       
       if (currentFilterItemsButton && resultFilterItemsButton) {
        currentFilterItemsButton.innerHTML = resultFilterItemsButton.innerHTML;
       }
       
       
        // Array.from(resultFilterItems).forEach(function(filterItem,index) {
        //     console
        //     let matchItem = currentFilterItems[index];
        //     if(matchItem.querySelector(".price-slider-range-min")){    
        //         matchItem.querySelector(".filter-option-range-input").innerHTML=filterItem.querySelector('.filter-option-range-input').innerHTML;
        //         matchItem.querySelector(".filter-option-price-input").innerHTML=filterItem.querySelector('.filter-option-price-input').innerHTML;
        //         let rangeInput = matchItem.querySelectorAll(".filter-option-range-input input")
        //         minVal = parseInt(rangeInput[0].value),
        //         rangeselector=filterItem.querySelector('#price-silder-progress')
        //         maxVal = parseInt(rangeInput[1].value);
        //         minPriceRange=(minVal / rangeInput[0].max) * 100 + "%";
        //         maxPriceRange=100 - (maxVal / rangeInput[1].max) * 100 + "%";
        //         rangeselector.style.left = minPriceRange;
        //         rangeselector.style.right = maxPriceRange;
        //         matchItem.querySelector(".filter-option-price-slider").innerHTML=filterItem.querySelector('.filter-option-price-slider').innerHTML;
        //     }
        //     else{
        //         matchItem.querySelector('.filter-option-list').innerHTML = filterItem.querySelector('.filter-option-list').innerHTML;
        //     }
        // }); 
        removeFilter(parentSection,sectionId);
        applyFilters();
        showMoreFilters();
        sideDrawerInt();
        loadMoreCollection();
        clearAllFilter();
        triggered = false
        history.pushState({}, null, _updateUrl);
        
    });
}
let triggered = false;
function infineScroll(scrollElement) {
    if (scrollElement && scrollElement.querySelector("a")) {
        var nextUrl = scrollElement.querySelector("a").getAttribute("href");
        if (isOnScreen(scrollElement) && (triggered == false)) {
            triggered = true;
            scrollElement.querySelector("a").remove();
            scrollElement.querySelector('.load').classList.remove('hidden');
            fetchFilterData(nextUrl).then((responseText) => {
                scrollElement.remove();
                const resultData = new DOMParser().parseFromString(responseText, 'text/html');
                var html = resultData.querySelector('[data-products-container]');
                // if(html.querySelector('.applied-filters')){
                //     html.removeChild(html.querySelector('.applied-filters'))
                // } 
                var elmnt = document.querySelector('[data-products-container]');
                /* Result for the collection and search page */
                if (html) {
                    const resultProductsWrapper = html.querySelector('[data-products]');
                    const mainProductsWrapper = elmnt.querySelector('[data-products]');
                    if(resultProductsWrapper && mainProductsWrapper){
                      mainProductsWrapper.innerHTML += resultProductsWrapper.innerHTML
                    }
        
                    // elmnt.innerHTML += html.innerHTML
                    let quickviewElements = elmnt.querySelectorAll("[data-quickview-action]");
                    Array.from(quickviewElements).forEach(function(element) {
                        initQuickView(element);
                    });
                    colorSwatchesMediaChanged(elmnt);
                    triggered = false
                    loadMoreCollection();
                }
            })
        }
    }
}

function loadMoreCollection() {
    var loadmoreButton = document.querySelector(".collection-load-more");
    if (loadmoreButton) {
        loadmoreButton.addEventListener("click", (event) => {
            event.preventDefault();
            var scrollElement = document.querySelector("[data-load-more]");
            if (scrollElement) {
                infineScroll(scrollElement);
            }
        })
    }
}

function clearAllFilter(){
    var clearAllfilter=document.getElementById("clearAllFilterData");
    if(clearAllfilter){
        clearAllfilter.addEventListener("click", (e) => {
        e.preventDefault();
        var section = document.querySelector('[data-products-container]');
        if (section) {
            var sectionId = section.dataset.id;
            var _url = clearAllfilter.getAttribute('href');
            getFilterData(clearAllfilter,sectionId, _url);
        } 
        });
    }
}

function loadFiltercontent(){
    applyFilters();
    sortByOptions();
    showMoreFilters();
    dropDownBar();
    loadMoreCollection();
    clearAllFilter();
}

if(Shopify.designMode){
  
    document.addEventListener('shopify:section:load', loadFiltercontent, false);
}
