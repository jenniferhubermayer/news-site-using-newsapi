// VARIABLES ##############################################
// ########################################################
let keywordSearchInput = "tesla";
let sortByInput = "published-at";
let setLanguageInput = "de";
let articleCountText = document.querySelector(`#article-count-num`);

// FUNCTIONS ##############################################
// ########################################################

let clearArticlesSection = () => {
    document.querySelector(`main`).innerText = "";
};

let clearKeywordInput = () => {
    document.querySelector(`#keyword-search`).value = "";
};

let srollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

let getSearchValues = () => {
    keywordSearchInput = document.querySelector(`#keyword-search`).value;
    sortByInput = document.querySelector(`#sort-by`).value;
    setLanguageInput = document.querySelector(`#set-language`).value;
    if (keywordSearchInput == 0){
        keywordSearchInput = "tesla";
    }
};

// WRITE MAIN SECTION #####################################
// ########################################################

let writeHtml = (data) => {

    clearArticlesSection();
    srollToTop();

    // VAR 1: WRITE IF SEARCH IS ERROR ##########################
    if (data.status == "error"){

        // WRITES SEARCH RESULTS COUNT
        articleCountText.innerText = "0";

        // WRITES WARNING
        let articleWarnungElement = document.createElement(`h2`);
        articleWarnungElement.id = "warning-text";
        articleWarnungElement.innerHTML = `WARNING!!!<br><br>Required parameters are missing, the scope of your search is too broad. Please set a keyword and try again.`;
        document.querySelector(`main`).appendChild(articleWarnungElement);
    }

    // VAR 2: WRITE IF SEARCH RESULTS IS 0 ######################
    else if (data.totalResults == 0){

        // WRITES SEARCH RESULTS COUNT 
        articleCountText.innerText = "0";

        // WRITES WARNING
        let articleWarnungElement = document.createElement(`h2`);
        articleWarnungElement.id = "warning-text";
        articleWarnungElement.innerHTML = `No news for your keyword<br><br>"${keywordSearchInput}"`;
        document.querySelector(`main`).appendChild(articleWarnungElement);
    }

    // VAR 3: WRITE ELSE ########################################
    else{

        // WRITES SEARCH RESULTS
        articleCountText.innerText = data.articles.length;

        // WRITES ARTICLES
            for (let i = 0; i < data.articles.length; i++) {
            // VARIABLES
            let articleImage = data.articles[i].urlToImage;
            let articleSource = data.articles[i].source.name;
            let articleHeadline = data.articles[i].title;
            let articleDescription = data.articles[i].content;
            let articleDescriptionSliced = articleDescription.slice(0, articleDescription.indexOf(`[`));
            let articlePublishingDate = data.articles[i].publishedAt;
            let articlePublishingDateSliced = articlePublishingDate.slice(0, -10);
            let articleOrigin = data.articles[i].url;

            //ARTICLE WRAPPER
            let articleWrapperElement = document.createElement(`article`);
            articleWrapperElement.lang = setLanguageInput;
            document.querySelector(`main`).appendChild(articleWrapperElement);

            // ARTICLE IMAGE AND PLACEHOLDER FOR ARTICLES WITHOUT AN IMAGE
            let articleFigureElement = document.createElement(`figure`);
            let articleImageElement = document.createElement(`img`);
            articleImageElement.src = articleImage;
            articleImageElement.onerror = function(){
                articleImageElement.src = `https://images.unsplash.com/photo-1497005367839-6e852de72767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1734&q=80`;
            };
            articleWrapperElement.appendChild(articleFigureElement);
            articleFigureElement.appendChild(articleImageElement);

            // ARTICLE SOURCE
            let articleSourceElement = document.createElement(`figcaption`);
            articleSourceElement.innerText = articleSource;
            articleFigureElement.appendChild(articleSourceElement);

            // ARTICLE HEADLINE
            let articleHeadlineElement = document.createElement(`h2`);
            articleHeadlineElement.className = `article-inner-text`;
            articleHeadlineElement.innerText = articleHeadline;
            articleWrapperElement.appendChild(articleHeadlineElement);

            // ARTICLE DESCRIPTION
            let articleDescriptionElement = document.createElement(`p`);
            articleDescriptionElement.className = `article-inner-text`;
            articleDescriptionElement.innerHTML = `${articleDescriptionSliced}`;
            articleWrapperElement.appendChild(articleDescriptionElement);

            // ARTICLE DATE WITHOUT TIMESTAMP
            let articleDateElement = document.createElement(`h3`);
            articleDateElement.innerText = articlePublishingDateSliced;
            articleWrapperElement.appendChild(articleDateElement);

            // ARTICLE LINK TO ORIGIN
            let articleOriginBtn = document.createElement(`a`);
            articleOriginBtn.href = articleOrigin;
            articleOriginBtn.innerText = `READ MORE`;
            articleOriginBtn.target = `blank`;
            articleWrapperElement.appendChild(articleOriginBtn);
        }
    }
};

// CALL SCROLLTOTOP FUNCTION ON BUTTON CLICK ##############
// ########################################################
document.querySelector(`#to-top-image`).addEventListener(`click`, () => {
    srollToTop();
});

// FETCH CALL ON SUBMIT ###################################
// ########################################################
searchForKeyword = (event) => {
    event.preventDefault();

    getSearchValues();
    showNews(keywordSearchInput, sortByInput, setLanguageInput);
};

const form = document.querySelector('form');
form.addEventListener('submit', searchForKeyword);

// FETCH CALL ON SELECT CHANGE ###############################
// ###########################################################
document.querySelectorAll(`select`).forEach(btn => {
    btn.addEventListener(`change`, (event) => {
    event.preventDefault();
    getSearchValues();
    showNews(keywordSearchInput, sortByInput, setLanguageInput);
    });
});

// FETCH ON SIDE LOAD (WITH KEYWORD "TESLA" ONLY) #########
// ########################################################
let showNews = (keywordSearchInput, sortByInput, setLanguageInput) =>{
    fetch(`https://newsapi.org/v2/everything?q=${keywordSearchInput}&sortby=${sortByInput}&language=${setLanguageInput}&apiKey=API_KEY`)
    .then((response) => response.json())
    .then((data) => {
        writeHtml(data);
    });
};
showNews(keywordSearchInput, sortByInput, setLanguageInput);

// CLEAR SEARCH ON DOCUMENT LOAD ##########################
// ########################################################
clearKeywordInput();
