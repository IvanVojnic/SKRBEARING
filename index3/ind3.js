initGoodsPage();

function initGoodsPage(){
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
    let params = window
        .location
        .search
        .replace('?','')
        .split('&')
        .reduce(
            function(p,e){
                var a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );
    let gCode = params['code'];
    let gCategory = params['category'];
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "coreGET.php?action=selectedItem&code="+gCode+"&category="+gCategory,true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            magnify("myimage", 2, this.responseText)
            showSelectedGoods(this.responseText);
        }
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
        showListDropProviders
    );
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
}

function loadInterface(data){
    data = JSON.parse(data);
    showListCategory(data);
    showListToSearchCategory(data);
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

function showListToSearchCategory(data){
    let out = '<option value="" disabled selected>Выберите категорию</option>';
    for (let id in data){
        let strValTmp = translit(data[id].category_name.toLowerCase())
        out += ` <option value="${strValTmp}">${data[id].category_name}</option>`
    }
    $('.BearingCategoryList').html(out);
}

function showSelectedGoods(data){
    data = JSON.parse(data);
    let counter = 0;
    let out = '';
    for (let id in data){
        out+=`<div class="col-12 ItemBox d-flex row">
                <div class="imgBox col-12 col-md-6 col-lg-5 d-flex justify-content-center align-items-center">
                    <img src="https://sun9-35.userapi.com/impg/3lDeuChgdKsLR49F81V0djQUmmCVl_tlx-B2cw/-sdKZ3TqHBM.jpg?size=350x350&quality=96&sign=c25885ea85ff552f50fc218e894ede70&type=album" class="itemImg" id="myimage">
                </div>
                <div class="infoBox col-12 col-md-6 col-lg-7">
                    <div class="infoParamBox d-flex flex-column">
                        <div class="infoParamTabs col-12">
                            <button class="tabLinks tabLinksDecr">Описание</button>
                            <button class="tabLinks tabLinksParam" id="defaultOpen">Характеристика</button>
                        </div>
                        <div id="describe" class="tabContent">
                            <img src="images/x-circle.svg" onclick="this.parentElement.style.display='none'" class="topRight">
                            <div class="titleItem d-flex row justify-content-around">
                                <h3 class="category">${data[id].category_name}</h3>
                                <h3 class="code">${data[id].id_bearings}</h3>
                            </div>
                            <div class="description">

                            </div>
                        </div>
                        <div id="parametrs" class="tabContent">
                            <img src="images/x-circle.svg" onclick="this.parentElement.style.display='none'" class="topRight">
                            <div class="titleItem d-flex row justify-content-around">
                                <h3 class="category">${data[id].category_name}</h3>
                                <h3 class="code">${data[id].id_bearings}</h3>
                            </div>
                            <div class="InfoSizeBox col-12 d-flex flex-column align-content-around">
                                <div class="certainInfoSizeBox col-lg-6 col-md-12 d-flex justify-content-between">
                                    <span class="certainGoodsInfoSizeTitle">Внутренний диаметр</span>
                                    <span class="certainInfoSize">${data[id].innerDiam}</span>
                                </div>
                                <div class="certainInfoSizeBox col-lg-6 col-md-12 d-flex justify-content-between">
                                    <span class="certainGoodsInfoSizeTitle">Внешний диаметр</span>
                                    <span class="certainInfoSize">${data[id].outerDiam}</span>
                                </div>
                                <div class="certainInfoSizeBox col-lg-6 col-md-12 d-flex justify-content-between">
                                    <span class="certainGoodsInfoSizeTitle">Высота</span>
                                    <span class="certainInfoSize">${data[id].height}</span>
                                </div>
                                <div class="certainInfoSizeBox col-lg-6 col-md-12 d-flex justify-content-between">
                                    <span class="certainGoodsInfoSizeTitle">Масса</span>
                                    <span class="certainInfoSize">${data[id].mass}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="buttonAddToCardBox col-12 d-flex flex-row align-items-center justify-content-between">
                        <div class="d-flex col-6">
                            <div class="buttonBox d-flex row justify-content-between">
                                <span class="minus" id="buttonMinus${counter}">-</span>
                                <input type="number" class="countOfItems_input" value="1" id="countOfItems">
                                <span class="plus" id="buttonPlus${counter}">+</span>
                            </div>
                        </div>
                        <button class="buttonAddToCard add-to-cart col-6" id="buttonAddCart${++counter}" data-elem-code="${data[id].id_bearings}">
                            <span class="buttonAddToCardTitle cart-button">ДОБАВИТЬ В КОРЗИНУ</span>
                        </button>
                    </div>
                </div>
            </div>`
    }
    $('.mainBox').html(out);
    document.getElementById("defaultOpen").click();
    jQuery('.plus').click(function (){
        let inputField = document.getElementById("countOfItems");
        inputField.value++;
    });
    jQuery('.minus').click(function (){
        let inputField = document.getElementById("countOfItems");
        if(inputField.value > 0){
            inputField.value--;
        }
    });
    jQuery('.buttonAddToCard').click(function (){
        let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));

        let inputField = document.getElementById("countOfItems");
        let countSelectedItems = inputField.value;
        let itemSelectedCode = $(this).attr('data-elem-code');
        if(itemsInCart == null){
            let itemToCart = {
                bearings: [
                    {
                        itemCode: itemSelectedCode,
                        itemsCount: countSelectedItems,
                        itemID: '1'
                    }
                ],
                itemsCountInCart: "1"
            }
            localStorage.setItem('ItemCart', JSON.stringify(itemToCart));
            let cartElem = null;
            if(window.innerWidth <= 992){
                cartElem = document.getElementById("popupCartBoxMobile");
            } else {
                cartElem = document.getElementById("popupCartBox");
            }
            cartElem.style.visibility = "visible";
            let cartField = cartElem.childNodes[1];
            cartField.value = 1;
        }
        else {
            let countItemsInCart = itemsInCart.itemsCountInCart;
            let itemsArr = itemsInCart.bearings;
            console.log(itemsArr);
            let boolItemInCart = 0;
            let countSelectedItemsInCart;
            for(let i = 0; i < itemsArr.length; i++){
                if(itemsArr[i].itemCode == itemSelectedCode)
                {
                    boolItemInCart = 1;
                    countSelectedItemsInCart = itemsArr[i].itemsCount;
                    itemsArr.splice(i,1);
                }
            }
            if(boolItemInCart == 1){
                console.log(countSelectedItemsInCart);
                countSelectedItemsInCart = Number(countSelectedItemsInCart);
                countSelectedItems = Number(countSelectedItems);
                let resultCount = countSelectedItemsInCart + countSelectedItems;
                console.log(resultCount);
                itemsArr.push({
                    itemCode: itemSelectedCode,
                    itemsCount: String(resultCount),
                    itemID: '1'
                });
                let itemToCart = {
                    bearings: itemsArr,
                    itemsCountInCart: String(countItemsInCart)
                };
                localStorage.removeItem("ItemCart");
                localStorage.setItem('ItemCart', JSON.stringify(itemToCart));
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
            else {
                countItemsInCart = Number(countItemsInCart) + 1;
                itemsArr.push({
                    itemCode: itemSelectedCode,
                    itemsCount: countSelectedItems,
                    itemID: '1'
                });
                let itemToCart = {
                    bearings: itemsArr,
                    itemsCountInCart: String(countItemsInCart)
                }
                localStorage.removeItem("ItemCart");
                console.log(itemsArr);
                console.log(itemToCart);
                localStorage.setItem('ItemCart', JSON.stringify(itemToCart));
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
        }
    });
    openDescr('parametrs');
    jQuery('.tabLinksDecr').click(function (){
        openDescr('describe');
    });
    jQuery('.tabLinksParam').click(function () {
        openDescr('parametrs');
    });
    let glassItem = document.querySelector('div.img-magnifier-glass');
    if (glassItem != null) {
        glassItem.remove();
    }

    $(window).resize(function() {
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
            let glassItem = document.querySelector('div.img-magnifier-glass');
            if(glassItem != null){
                glassItem.remove();
            }
            magnify("myimage", 2);
        }
    })
    return true;
}

async function magnify(imgID, zoom , data) {
    let result = await showSelectedGoods(data);
    setTimeout(calcZoom, 3000, imgID, zoom);
    function calcZoom(imgID, zoom) {
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && result == true) {
            var img, glass, w, h, bw;
            img = document.getElementById(imgID);
            glass = document.createElement("DIV");
            glass.setAttribute("class", "img-magnifier-glass");
            img.parentElement.insertBefore(glass, img);
            glass.style.backgroundImage = "url('" + img.src + "')";
            glass.style.backgroundRepeat = "no-repeat";
            glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
            bw = 3;
            w = glass.offsetWidth / 2;
            h = glass.offsetHeight / 2;
            glass.addEventListener("mousemove", moveMagnifier);
            img.addEventListener("mousemove", moveMagnifier);
            glass.addEventListener("touchmove", moveMagnifier);
            img.addEventListener("touchmove", moveMagnifier);

            function moveMagnifier(e) {
                let pos, x, y;
                e.preventDefault();
                pos = getCursorPos(e);
                x = pos.x;
                y = pos.y;
                if (x > img.width - (w / zoom)) {
                    x = img.width - (w / zoom);
                }
                if (x < w / zoom) {
                    x = w / zoom;
                }
                if (y > img.height - (h / zoom)) {
                    y = img.height - (h / zoom);
                }
                if (y < h / zoom) {
                    y = h / zoom;
                }
                glass.style.left = (x - w) + "px";
                glass.style.top = (y - h) + "px";
                glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
            }

            function getCursorPos(e) {
                let a, x = 0, y = 0;
                e = e || window.event;
                a = img.getBoundingClientRect();
                x = e.pageX - a.left;
                y = e.pageY - a.top;
                x = x - window.pageXOffset;
                y = y - window.pageYOffset;
                return {x: x, y: y};
            }
        }
    }

}

function OpenNavBar() {
    let displayValue = document.getElementById("navbarMainBlock").style.display;
    if (displayValue == "none" || displayValue == "") {
        document.getElementById("navbarMainBlock").style.display = "block";
    } else {
        document.getElementById("navbarMainBlock").style.display = "none";
    }
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



function openDescr(decrType) {
    let i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    document.getElementById(decrType).style.display = "block";
    //evt.currentTarget.className += " active";
}

function translit(word){
    let answer = '';
    let converter = {
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