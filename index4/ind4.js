$(document).ready(function() {
    initMainPage();
    let winSize = window.innerWidth;
    let checkResize = 0;
    let resizeFlag = JSON.parse(localStorage.getItem('resizeFlag'));
    if(resizeFlag == null){
        if(winSize <= 992){
            checkResize = 1;
            localStorage.setItem('resizeFlag', JSON.stringify(1));
        } else {
            checkResize = 0;
            localStorage.setItem('resizeFlag', JSON.stringify(0));
        }
    } else{
        checkResize = resizeFlag;
    }
    window.onresize = function() {
        winSize = window.innerWidth;
        if (winSize<=991.98 && checkResize == 0){
            winSize = window.innerWidth;
            localStorage.setItem('resizeFlag', JSON.stringify(1));
            window.location.reload();
        } else if(winSize >= 991.98 && checkResize == 1) {
            winSize = window.innerWidth;
            localStorage.setItem('resizeFlag', JSON.stringify(0));
            window.location.reload();
        }
    };
})

function initMainPage(){
    let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
    if(itemsInCart != null){
        let countItemsInCart = itemsInCart.itemsCountInCart;
        let cartElem = null;
        if(window.innerWidth <= 992){
            cartElem = document.getElementById("popupCartBoxMobile");
        } else {
            cartElem = document.getElementById("popupCartBox");
        }
        cartElem.style.visibility = "visible";
        let cartField = cartElem.childNodes[1];
        cartField.value = countItemsInCart;
    }
    let xhttp = new XMLHttpRequest();
    let url = window.location.href;
    let re = /index4.html\?/gi;
    let newstr = url.replace(re, 'coreGET.php?action=initProvidersPage&');
    xhttp.open("GET", newstr, true);
    xhttp.send();
    xhttp.onreadystatechange = function (){
        if(this.status == 200 && this.readyState == 4){
            loadInterface(this.responseText);
        }
    }
    $.post(
        "core.php",
        {
            "action":"initCatalogDrop"
        },
        loadInterfaceList
    );
    $.post(
        "core.php",
        {
            "action":"initProviders"
        },
        showListDropProviders
    );
}

function showListDropProviders(data){
    data = JSON.parse(data);
    let out = '<option value="" disabled selected>Выберите производителя</option>';
    for(let id in data){
        let strValTmp = translit(data[id].name_provider.toLowerCase())
        out += ` <option value="${strValTmp}">${data[id].name_provider}</option>`
    }
    $('.BearingProviderList').html(out);
}

function loadInterface(data){
    data = JSON.parse(data);
    let outTitle = '';
    let outMainBl1 = '';
    let outMainBl2 = '';
    for (let id in data){
        outTitle +=`
    <div class="providerImgBox col-lg-6 col-12 d-flex justify-content-center align-items-center">
        <img src="images/${data[id].img_certain_p_logo}">
    </div>
    <div class="providerDescrBox col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center">
        <h3 class="providerPreviewTitle">ПОДШИПНИКИ ${data[id].name_provider}</h3>
        <div class="providerPreviewDescript">${data[id].title_text}</div>
    </div>`
    outMainBl1 +=`
        <div class="card flex-md-row mb-4 box-shadow h-md-250">
            <div class="card-body d-flex flex-column align-items-center col-12 col-md-5">
                <h3 class="mb-0">${data[id].name_provider}</h3>
                <p class="card-text mb-auto">${data[id].text_bl1}</p>
            </div>
            <div class="flipImgBox col-7 d-flex align-items-center flip-box">
                <div class="flip-box-inner">
                    <div class="flip-box-front d-flex align-items-center justify-content-center">
                        <img class="flipImgFront card-img-right flex-auto d-none d-md-block" src="images/${data[id].img_descr1}">
                    </div>
                    <div class="flip-box-back d-flex align-items-center justify-content-center">
                        <img class="flipImgBack card-img-right flex-auto d-none d-md-block" src="images/${data[id].img_certain_p_logo}">
                    </div>
                </div>
            </div>
        </div>`
    outMainBl2 +=`
        <div class="card flex-md-row box-shadow">
            <div class="imgDescrBox">
                <img src="images/${data[id].img_descr2}" alt="Avatar" class="imgDescrSecond">
                <div class="imgDescrSecondTextBox">
                    <div class="imgDescrSecondText">${data[id].text_bl2}</div>
                </div>
            </div>
        </div>`
    }
    $('.providerParallax').html(outTitle);
    $('.block1').html(outMainBl1);
    $('.block2').html(outMainBl2);
}

function loadInterfaceList(data){
    data = JSON.parse(data);
    showListCategory(data);
    showListToSearchCategory(data);
}

function showListToSearchCategory(data){
    let out = '<option value="" disabled selected>Выберите категорию</option>';
    for (let id in data){
        let strValTmp = translit(data[id].category_name.toLowerCase())
        out += ` <option value="${strValTmp}">${data[id].category_name}</option>`
    }
    $('.BearingCategoryList').html(out);
}

function showListCategory(data){
    let out = '';
    for (let id in data){
        out += `<a href="index2.php?action=searchItems&category=${translit(data[id].category_name)}" class="dropdown-item">${data[id].category_name}</a>`
    }
    let menuBlock = document.getElementById("CatalogList");
    menuBlock.style.width = "auto";
    $('.dropdown-menu').html(out);
}



function OpenNavBar() {
    let displayValue = document.getElementById("navbarMainBlock").style.display;
    if (displayValue == "none" || displayValue == "") {
        document.getElementById("navbarMainBlock").style.display = "block";
    } else {
        document.getElementById("navbarMainBlock").style.display = "none";
    }
}

function OpenCatalogList() {
    let displayValue = document.getElementById("CatalogList").style.display;
    if (displayValue == "none" || displayValue == "") {
        let navbarHigh = document.getElementById("SiteBlockNavigate").style.height;
        let navbarWidth = document.getElementById("SiteBlockNavigate").style.width;
        document.getElementById("buttonCatalogOpen").style.position = "relative";
        document.getElementById("CatalogList").style.display = "block";
        document.getElementById("CatalogList").style.top = navbarHigh;
        document.getElementById("CatalogList").style.minWidth = navbarWidth;
        document.getElementById("CatalogList").style.left = "none";
    } else {
        document.getElementById("CatalogList").style.display = "none";
    }
    if (document.getElementById("CatalogList").style.display == "block") {
        document.getElementById("buttonCatalogOpen").style.background = "#a7a7a7";
        document.getElementById("catalogDropdown").style.color = "#3B56B3";
    } else {
        document.getElementById("buttonCatalogOpen").style.background = "#B7B7B7";
        document.getElementById("catalogDropdown").style.color = "#00f";
    }
}

function OpenInfoList() {
    let displayValue = document.getElementById("InfoList").style.display;
    if (displayValue == "none" || displayValue == "") {
        let navbarHigh = document.getElementById("SiteBlockNavigate").style.height;
        let navbarWidth = document.getElementById("SiteBlockNavigate").style.width;
        document.getElementById("buttonInfoOpen").style.position = "relative";
        document.getElementById("InfoList").style.display = "block";
        document.getElementById("InfoList").style.top = navbarHigh;
        document.getElementById("InfoList").style.minWidth = navbarWidth;
        document.getElementById("InfoList").style.left = "none";
    } else {
        document.getElementById("InfoList").style.display = "none";
    }
    if (document.getElementById("InfoList").style.display == "block") {
        document.getElementById("buttonInfoOpen").style.background = "#a7a7a7";
        document.getElementById("infoDropdown").style.color = "#3B56B3";
    } else {
        document.getElementById("buttonInfoOpen").style.background = "#B7B7B7";
        document.getElementById("infoDropdown").style.color = "#00f";
    }
}


function OpenSearch(){
    let headerNav = document.getElementById("headerNavbar");
    let searchBox = document.getElementById("dropdownSearch");
    let headerNavProperties = getComputedStyle(headerNav);
    let headerNavHeight = headerNavProperties.height;
    searchBox.style.top = headerNavHeight;
    searchBox.style.visibility = "visible";
    searchBox.style.opacity = "100%";
}

function CloseSearch(){
    let searchBox = document.getElementById("dropdownSearch");
    searchBox.style.visibility = "hidden";
    searchBox.style.opacity = "0";
}

function translit(word){
    var answer = '';
    var converter = {
        'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
        'е': 'e',    'ё': '2',    'ж': '4',    'з': 'z',    'и': 'i',
        'й': 'j',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
        'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
        'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': '9',
        'ш': 'w',    'щ': '3',    'ь': '5',    'ы': '8',    'ъ': 'x',
        'э': '1',    'ю': 'q',    'я': '6',    ' ': '-',

        'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
        'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
        'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
        'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
        'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
        'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
        'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
    };

    for (let i = 0; i < word.length; ++i ) {
        if (converter[word[i]] == undefined){
            answer += word[i];
        } else {
            answer += converter[word[i]];
        }
    }

    return answer;
}