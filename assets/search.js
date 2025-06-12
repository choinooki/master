var selector = {
    searchButton: '[data-search-button]',
    searchBar: '[data-search-wrapper]',
    searchResult: '[data-search-body]',
    searchInput: '[data-search-input]',
    searchForm: '[data-search-form]',
    searchRecent: '[data-recent-search-result]',
    searchClose: '[data-search-close]',
    searchRecentSuggestion: '[data-recent-suggestion]',
    clearRecentSearch: '[data-clear-recent]',
    searchTabItems: '[data-search-tab]',
    clearInputContent:'[data-clear-input]'
};
let searchForm = document.querySelectorAll(selector.searchForm);
let searchRecentSuggestion = document.querySelector(selector.searchRecentSuggestion);
let formURl = searchurl;
Array.from(searchForm).forEach(function(form) {
    formURl = form.getAttribute('action');
    form.addEventListener("submit", function(event) {
        const form = event.target;
        const formFields = form.elements;
        const searchTerm = formFields.q.value;
        if (searchTerm.replace(/\s/g, '').length > 0) {
            setRecentSearch(searchTerm);
        }
    });
});

let searchSelectors = document.querySelectorAll(selector.searchButton);
var searchBar = document.querySelector(selector.searchBar);
if (searchSelectors) {
    Array.from(searchSelectors).forEach(function(element) {
        element.addEventListener("click", (e) => {
            e.preventDefault();
                let bodyElement = document.querySelector('body');
                let dropdownChildrens = document.querySelectorAll('[data-children-menu]');
                let  menubarElement = document.querySelector('[data-menu-drawer]');
                if (bodyElement.classList.contains('menu-open')) {
                bodyElement.classList.remove('no-scroll', 'menu-open');
                        menubarElement.classList.remove('show');
                        Array.from(dropdownChildrens).forEach(function(dropdownChildren){
                            dropdownChildren.classList.remove('show');
                        }) 
                }
            document.querySelector("body").classList.add("no-scroll", "search-drawer-open");
            searchBar.style.display = 'flex';
            setTimeout(() => {
                searchBar.classList.add('show'); 
            }, 300);
            if(document.querySelector(selector.searchInput)){
                setTimeout(() => {
                    document.querySelector(selector.searchInput).focus();
                },1000) 
            }
            if (document.querySelector(selector.searchRecent)) {
                let querySelectorForSearch = document.querySelector(selector.searchRecent);
                if (getRecentSearch() && querySelectorForSearch) {
                    querySelectorForSearch.innerHTML = getRecentSearch();
                    if (querySelectorForSearch.innerHTML.trim() === '') {
                        querySelectorForSearch.classList.add('hidden'); // Add 'hidden' class if blank
                    } else {
                        querySelectorForSearch.classList.remove('hidden'); // Remove 'hidden' class if not blank
                    }
                    clearRecentSearch();
                }
            }
            searchResult(document.querySelector(selector.searchInput).value = '');
            trapFocus(searchBar);
        });
    })
}
let searchCloses = document.querySelectorAll(selector.searchClose);

if (searchCloses) {
    Array.from(searchCloses).forEach(function(searchClose) {
        searchClose.addEventListener("click", (e) => {
            e.preventDefault();
            
            if (searchBar.classList.contains('show')) {
                // Remove the no-scroll and search-drawer-open classes from body
                document.querySelector("body").classList.remove("no-scroll", "search-drawer-open");

                // Wait for transitions before removing the show class and hiding the search bar
                setTimeout(() => {
                    searchBar.classList.remove('show');
                }, 500);
                setTimeout(() => {
                    searchBar.style.display = "none";
                }, 700);
                document.querySelector('[data-search-button]').focus();
                // trapFocus(searchBar);               
            }
        }); 
    });
}
// search input 
var searchTyping;
if (document.querySelector(selector.searchInput)) {
    document.querySelector(selector.searchInput).addEventListener("keyup", (event) => {
        event.preventDefault();
        clearTimeout(searchTyping);
        if (searchRecentSuggestion) {
            searchRecentSuggestion.classList.add("hidden");
        }
        searchTyping = setTimeout(function() {
            let searchTerm = document.querySelector(selector.searchInput).value;
            if (searchTerm.replace(/\s/g, '').length > 0) {
                setRecentSearch(searchTerm);
            }
            searchResult(searchTerm);
        }, 500)

    });
}
if(document.querySelector(selector.clearInputContent)){
    document.querySelector(selector.clearInputContent).addEventListener("click", (event) => {
        document.querySelector(selector.searchInput).value=''
        let searchTerm = document.querySelector(selector.searchInput).value;
        searchResult(searchTerm);
    })
}
// searchResult funtion
var searchResult = function(searchTerm) {
        let resultContainer = document.querySelector(selector.searchResult);
        let recentContainer = document.querySelector(selector.searchRecent);
        if (searchTerm == '' && searchRecentSuggestion) {
            searchRecentSuggestion.classList.remove("hidden")
        }
        if (searchTerm.replace(/\s/g, '').length > 0) {
            resultContainer.innerHTML = preLoaderIcon;
            fetch(formURl + "/suggest?section_id=predictive-search&q=" + encodeURIComponent(searchTerm) + "&resources[type]=product,article,query,collection,page&resources[limit]=8&resources[limit_scope]=each")
                .then((response) => {
                    return response.text();
                })
                .then((result) => {
                    let searchresults = new DOMParser().parseFromString(result, 'text/html');
                    resultContainer.innerHTML = searchresults.querySelector('#shopify-section-predictive-search').innerHTML;
                    if (getRecentSearch() && resultContainer) {
                        if (recentContainer) {
                            recentContainer.innerHTML = getRecentSearch();
                            if (recentContainer.innerHTML.trim() === '') {
                                recentContainer.classList.add('hidden'); 
                            } else {
                                recentContainer.classList.remove('hidden');
                            }
                        }
                        clearRecentSearch();
                        searchTabs();
                    }
                   
                })
        } else {
            resultContainer.innerHTML = '';
            if (getRecentSearch() && recentContainer) {
                recentContainer.innerHTML = getRecentSearch();
                if (recentContainer.innerHTML.trim() === '') {
                    recentContainer.classList.add('hidden'); 
                } else {
                    recentContainer.classList.remove('hidden');
                }
                searchTabs();
                clearRecentSearch();
            }

        }
    }
    // set recent search item in the local storage
var setRecentSearch = function(sarchItem) {
    var localStorageValue = JSON.parse(localStorage.getItem("recent-search-items")) || [];
    if (localStorageValue.length > 0) {
        if (localStorageValue.indexOf(sarchItem) < 0) {
            if (localStorageValue.length >= 20) {
                localStorageValue.shift();
            }
            localStorageValue.push(sarchItem)
            localStorage.setItem("recent-search-items", JSON.stringify(localStorageValue));
        }
    } else {
        localStorageValue.push(sarchItem);
        localStorage.setItem("recent-search-items", JSON.stringify(localStorageValue));
    }
}
var clearRecentSearch = function() {
        let clearButton = document.querySelector(selector.clearRecentSearch);
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                localStorage.removeItem("recent-search-items");
                document.querySelector(selector.searchRecent).innerHTML = '';
                document.querySelector(selector.searchRecent).classList.add('hidden'); 
            })
        }

    }
// get recent search name;
var getRecentSearch = function() {
    let recentHtml = '';
    if (localStorage.getItem("recent-search-items")) {
        let localStorageValue = JSON.parse(localStorage.getItem("recent-search-items"));
        if (localStorageValue.length > 0) {
            recentHtml = '<h6 class="predictive-search-heading">Recent Search <button type="button" class="clear-search" data-clear-recent>Clear</button></h6> <ul class="predictive-search-popular-list">'
            localStorageValue.reverse();
            Array.from(localStorageValue).forEach(function(recent, index) {
                if (recent != '') {
                    recentHtml += '<li class="predictive-search-popular-item"><a class="predictive-search-popular-link" href="'+searchurl+'?q=' + recent + '">' + recent + '</a></li>'
                }
            })
            recentHtml += '</ul>';
        }
    }

    return recentHtml;
}

function searchTabs() {
    var bindAll = function() {
        var menuElements = document.querySelectorAll(selector.searchTabItems);
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].addEventListener('click', change, false);
        }
    }

    var clear = function() {
        var menuElements = document.querySelectorAll(selector.searchTabItems);
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].classList.remove('active');
            var id = menuElements[i].getAttribute('data-results');
            document.getElementById(id).classList.remove('active');
        }
    }

    var change = function(e) {
        clear();
        e.target.closest(selector.searchTabItems).classList.add('active');
        var id = e.currentTarget.getAttribute('data-results');
        document.getElementById(id).classList.add('active');
    }
    bindAll();
}


// var searchTab = function(){
//     let seacrhTabs = document.querySelectorAll(selector.searchTabItems);
//     Arr
// }
