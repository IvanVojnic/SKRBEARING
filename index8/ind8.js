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
    $('#fullpage').fullpage({
        menu: '#headerNavbar',
        anchors: ['page1','page2','page3'],
        scrollOverflow:true,
        scrollBar:false,
        loopTop:true,
        loopBottom:true
    });

    $.fn.fullpage.setAllowScrolling(true);
    elementList = document.querySelectorAll("div.fp-tableCell");
    for(let i = 0; i < elementList.length; i++){
        let tmp = elementList.item(i);
        tmp.classList.add("d-flex");
    }
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
        loadProviders
    );
}

function loadProviders(data){
    data = JSON.parse(data);
    showListDropProviders(data);
    showListInfoProviders(data);
}

function showListDropProviders(data){
    let out = '<option value="" disabled selected>Выберите производителя</option>';
    for(let id in data){
        let strValTmp = translit(data[id].name_provider.toLowerCase())
        out += ` <option value="${strValTmp}">${data[id].name_provider}</option>`
    }
    $('.BearingProviderList').html(out);
}

function showListInfoProviders(data){
    let out = ``;
    for(let id in data){
        out +=`
            <li><a href="index4.html?provider=${data[id].name_provider}">${data[id].name_provider}</a></li>`
    }
    $('.providersList').html(out);
}

myVar = new Array(5).toString();
console.log(myVar);

/*******************************/
let paragraph = document.getElementsByTagName('h1')[0];
let iterAnimLogo = 0;
function textEffect(animationName) {
    if(iterAnimLogo >= 2){
        return;
    }
    let text = paragraph.innerHTML,
        chars = text.length,
        newText = '',
        animation = animationName,
        char,
        i;

    for (i = 0; i < chars; i += 1) {
        newText += '<i>' + text.charAt(i) + '</i>';
    }

    paragraph.innerHTML = newText;

    let wrappedChars = document.getElementsByTagName('i'),
        wrappedCharsLen = wrappedChars.length,
        j = 0;

    function addEffect () {
        setTimeout(function () {
            wrappedChars[j].className = animation;
            j += 1;
            if (j < wrappedCharsLen) {
                addEffect();
            }
        }, 100)
    }
    addEffect();
    iterAnimLogo++
};

textEffect('fly-in-out');
/*******************************/


/*****************************/

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