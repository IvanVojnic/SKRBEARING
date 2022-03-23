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
    $.post(
        "core.php",
        {
            "action":"initCatalogDrop"
        },
        loadInterface
    );
    $.post(
        "core.php",
        {
            "action":"initProviders"
        },
        loadProviders
    );
}

function loadInterface(data){
    data = JSON.parse(data);
    showScrollListCategory(data);
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

function showScrollListCategory(data){
    let out = '';
    for (let id in data){
        out += `<li class="imagesCatalogItem d-flex align-items-center">
                    <a href="index2.php?action=searchItems&category=${translit(data[id].category_name)}">
                        <span class="imageCatalogLink" data-type-id="${data[id].id_goods_type}" data-categ-name="${data[id].category_name}">
                            <img src="images/bearingsImg/${data[id].category_img}" data-categ-name="${data[id].category_name}" alt="" class="imageCatalog">
                            <span class="bearingType" data-goods-type="${data[id].id_goods_type}" data-catagory_name="${data[id].category_name}">${data[id].category_name}</span>
                        </span>
                    </a>
                </li>`
    }
    $('.imagesCatalog').html(out);
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

function loadProviders(data){
    data = JSON.parse(data);
    showProvidersBlock(data);
    showListDropProviders(data);
}

function showListDropProviders(data){
    let out = '<option value="" disabled selected>Выберите производителя</option>';
    for(let id in data){
        let strValTmp = translit(data[id].name_provider.toLowerCase())
        out += ` <option value="${strValTmp}">${data[id].name_provider}</option>`
    }
    $('.BearingProviderList').html(out);

}

function showProvidersBlock(data){
    let out = '';
    for(let id in data){
        out += `<a href="index4.html?provider=${data[id].name_provider}" class="provideImageBox d-flex align-items-stretch" id="${data[id].name_provider}Box">
                    <div class="blackBackground" id="${data[id].name_provider}Back"></div>
                    <img src="images/${data[id].img_main_logo}" class="provideImage" id="${data[id].name_provider}">
                </a>`
    }
    $('.providersList').html(out);
    jQuery('.provideImageBox').hover(
        function () {
            let provImgBox = jQuery(this).get(0);
            let mainBlockPropert = getComputedStyle(provImgBox);
            let mainBlockWidth = mainBlockPropert.width;
            mainBlockWidth = mainBlockWidth.slice(0, mainBlockWidth.length - 2);
            mainBlockWidth = Number(mainBlockWidth);
            let provImgBoxProperties = getComputedStyle(provImgBox,':before');
            let boxProp = provImgBox.getBoundingClientRect();
            let provImgBoxWidth = provImgBoxProperties.width;
            let provImgBoxHeight = provImgBoxProperties.height;
            provImgBoxWidth = provImgBoxWidth.slice(0, provImgBoxWidth.length - 2);
            provImgBoxWidth = Number(provImgBoxWidth);
            provImgBoxHeight = provImgBoxHeight.slice(0, provImgBoxHeight.length - 2);
            provImgBoxHeight = Number(provImgBoxHeight);
            let borderTang = provImgBoxHeight/provImgBoxWidth;
            provImgBox.onmouseover = provImgBox.onmousemove = provImgBox.onmouseout = handler;
            function handler(event)
            {
                let coordY =  boxProp.y + provImgBoxHeight - event.clientY;
                let coordX = event.clientX + provImgBoxWidth -  boxProp.left;
                let pointTang = coordY / coordX;
                pointTang = Number(pointTang);
                let RecWidth = mainBlockWidth + provImgBoxWidth;
                let lineWidth = coordX - coordY/borderTang;
                if(Math.abs(pointTang) <= Math.abs(borderTang) && (event.type == "mousemove" || event.type == "mouseover") && (lineWidth <= RecWidth))  //МОДУЛЬ ИЗ-ЗА ПОГРЕШНОСТИ
                {
                    let tmpElem = provImgBox.firstElementChild;
                    let idTmpElem = tmpElem.id;
                    document.getElementById(idTmpElem).style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    document.getElementById(idTmpElem).style.boxShadow = "0 0 7px 3px";
                    document.getElementById(idTmpElem).style.transition = ".5s";
                }
                else{
                    let tmpElem = provImgBox.firstElementChild;
                    let idTmpElem = tmpElem.id;
                    document.getElementById(idTmpElem).style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    document.getElementById(idTmpElem).style.boxShadow = "0 0 0px 0px";
                }
            }
        }
    );
}

function OpenNavBar() {
    let displayValue = document.getElementById("navbarMainBlock").style.display;
    if (displayValue == "none" || displayValue == "") {
        document.getElementById("navbarMainBlock").style.display = "block";
    } else {
        document.getElementById("navbarMainBlock").style.display = "none";
        CloseSearch();
    }
}

$('.btnLinkSearch').click(function (){
    OpenSearch()
})

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
