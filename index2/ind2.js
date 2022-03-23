function initGoodsPage(){
    let url = window.location.href;
    /* let re = new RegExp("[\?]");
     let tmp = re.exec(url);
     if(tmp != null){*/
    let xhttp = new XMLHttpRequest();
    let re = /index2.php\?/gi;
    let newstr = url.replace(re, 'coreGET.php?action=searchItems&');
    console.log(newstr);
    xhttp.open("GET", newstr,true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            showCertainElements(this.responseText);
        }
    }
    $.post(
        "core.php",
        {
            "action": "initCatalogDrop"
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

$('.cartLink').click(function (){
    let link = String(window.location.href);
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
    let linkCatalogParams = {
        options: [
            {
                category: params['category'],
                id_bearings: params['id_bearings'],
                inner_diam: params['inner_diam'],
                BearingGap: params['BearingGap'],
                mass: params['mass'],
                outer_diam: params['outer_diam'],
                height: params['height']
            }
        ]
    }
    localStorage.setItem('linkParamsToCatalog', JSON.stringify(linkCatalogParams));
});

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
    showListCategory(data);
    showListToSearchCategory(data);
}

function showListToSearchCategory(data){
    data = JSON.parse(data);
    let out = '<option value="" disabled selected>Выберите категорию</option>';
    for (let id in data){
        out += ` <option value="${translit(data[id].category_name)}">${data[id].category_name}</option>`
    }
    $('.BearingCategoryList').html(out);
}

function loadInterfaceGoods(data){
    data = JSON.parse(data);
    if(data!=''){
        let emptyCartBl = document.querySelector(".emptyCatalogBox");
        emptyCartBl.style.display = "none";
        emptyCartBl.style.visibility = "hidden";
        emptyCartBl.style.opacity = "0";
    }
    let out = '';
    let counter = 0;
    for (let id in data){
        out += `<div class="ItemGoods col-xl-3 col-lg-4 col-md-4 col-sm-6">
            <div class="product-wrap">
                <div class="imgGoodsBox Goods${data[id].id}">
                    <div class="img-wrap GoodsBoxImages">
                        <span class="goodsOverviewButton"><img src="images/bearingsImg/шариковыйРадиальный.jpg"></span>
                    </div>
                    <div class="goodsItem_Loop-action">
                        <span class="goodsOverviewButton" data-idElem="${data[id].id}">Быстрый просмотр</span>
                    </div>
                </div>
                <div class="goodsItemList">
                    <h3 class="goodsItemTitle">${data[id].category_name}</h3>
                    <span class="goodsItemCodeBox"><span>Номер: </span><span class="goodsItemCode" data-categ-name="${data[id].category_name}">${data[id].id_bearings}</span></span>
                    <div class="goodsItemActions row d-flex justify-content-between ">
                        <div class="add-to-cart col-6">
                            <span class="cart-button" data-elem-id="${data[id].id}" id="buttonAddCart${++counter}" data-elem-code="${data[id].id_bearings}">В корзину</span>
                        </div>
                        <div class="buttonBox d-flex row col-6 justify-content-between">
                            <span class="minus" id="buttonMinus${counter}">-</span>
                            <input type="number" class="countOfItems_input" value="1" id="countOfItems${counter}">
                            <span class="plus" id="buttonPlus${counter}">+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }
    $('.goods').html(out);
    let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
    if(itemsInCart != null){
        for(let id in data){
            let inCartBoxOut = '';
            for (let i = 0; i < Number(itemsInCart.itemsCountInCart); i++) {
                if (data[id].id_bearings == itemsInCart.bearings[i].itemCode) {
                    let tmpClass = ".Goods" + data[id].id;
                    inCartBoxOut += `<div class="GoodsCartFlag" data-id-elem="Flag${data[id].id}">Товар добавлен в корзину</div>`
                    $(tmpClass).append(inCartBoxOut);
                }
            }

        }
    }
    jQuery('.goodsItemCode').click(function (){
        let category = $(this).attr('data-categ-name');
        let code = $(this).attr('data-code');
        console.log(category);
        console.log(code);
        window.location.href = 'index3.php?code='+code+'&category='+category;
    });
    jQuery('.plus').click(function (){
        let buttonID = $(this).attr('id');
        let re = new RegExp("[0-9]");
        let idOfElem = re.exec(buttonID);
        let tmpStrId = "countOfItems" + idOfElem;
        let inputField = document.getElementById(tmpStrId);
        inputField.value++;
    });
    jQuery('.minus').click(function (){
        let buttonID = $(this).attr('id');
        let re = new RegExp("[0-9]");
        let idOfElem = re.exec(buttonID);
        let tmpStrId = "countOfItems" + idOfElem;
        let inputField = document.getElementById(tmpStrId);
        if(inputField.value > 0){
            inputField.value--;
        }
    });
    jQuery('.cart-button').click(function (){
        let elemID = $(this).attr('data-elem-id');
        let cartFlagCheck = document.getElementById("Flag"+elemID);
        if(cartFlagCheck == null){
            let tmpClass = ".Goods" + elemID;
            let inCartBoxOut = `<div class="GoodsCartFlag">Товар добавлен в корзину</div>`
            $(tmpClass).append(inCartBoxOut);
        }
        let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
        let buttonID = $(this).attr('id');
        let re = new RegExp("[0-9]");
        let idOfElem = re.exec(buttonID);
        let tmpStrId = "countOfItems" + idOfElem;
        let inputField = document.getElementById(tmpStrId);
        let countSelectedItems = inputField.value;
        let itemSelectedCode = $(this).attr('data-elem-code');
        if(itemsInCart == null){
            let itemToCart = {
                bearings: [
                    {
                        itemCode: itemSelectedCode,
                        itemsCount: countSelectedItems,
                        itemID: idOfElem[0]
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
                    itemID: idOfElem[0]
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
                    itemID: idOfElem[0]
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
    jQuery('.goodsOverviewButton').click(function(){
        let bodyElem = document.querySelector('body');
        bodyElem.style.overflowY = "hidden";
        let tmpID = $(this).attr('data-idElem')
        $.post(
            "core.php",
            {
                "action":"initOverview",
                "goodsID" : tmpID
            },
            loadOverview,
        );
        let counterT = 0;
        let overviewOut = '';
        function loadOverview(dataOverview){
            console.log(dataOverview);
            dataOverview = JSON.parse(dataOverview);
            for (let id in dataOverview){
                overviewOut += `<div class="itemOverviewBox">
                <div class="itemOverview">
                    <div class="d-flex row titleItemOverview">
                        <div class="ItemCategoryOverview col-md-8 col-12 d-flex align-items-center">${dataOverview[id].category_name}
                        </div>
                        <div class="ItemCodeOverview col-md-3 col-12 d-flex align-items-center justify-content-center">${dataOverview[id].id_bearings}</div>
                        <div class="closeImgOverviewBox">
                            <img class="closeImgOverview" src="images/x-circle.svg">
                        </div>
                    </div>
                    <div class="ItemInfoOverview d-flex row">
                        <div class="ItemImgOverview col-md-6 col-12">
                            <img src="images/bearingsImg/шариковыйРадиальный.jpg">
                        </div>
                        <div class="itemTextOverviewCardBox col-md-6 col-12">
                            <div class="itemTextOverviewCard dx flex-column">
                                <div class="addItemToCardOverview">
                                    <div class="buttonAddToCardBox d-flex flex-column align-items-center">
                                        <button class="buttonAddToCard" data-elem-id="${data[id].id}" data-elem-code="${data[id].id_bearings}" id="buttonAddCart${++counterT}" >
                                            <span class="cartButtonOverview">ДОБАВИТЬ В КОРЗИНУ</span>
                                        </button>
                                        <div class="buttonBox d-flex row col-6 justify-content-between buttonBoxOverview">
                                            <span class="minusOverview" id="buttonMinus${counterT}">-</span>
                                            <input type="number" class="countOfItems_input" value="1" id="countOfItemsOverview${counterT}">
                                            <span class="plusOverview" id="buttonPlus${counterT}">+</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="itemTextOverviewBox">
                                    <div class="itemTextOverview d-flex flex-column ">
                                        <div class="itemTextOverviewListElemBox d-flex row justify-content-between">
                                            <span>Внутренний диаметр</span>
                                            <span>${dataOverview[id].inner_diam}</span>
                                        </div>
                                        <div class="itemTextOverviewListElemBox d-flex row justify-content-between">
                                            <span>Внешний диаметр</span>
                                            <span>${dataOverview[id].outer_diam}</span>
                                        </div>
                                        <div class="itemTextOverviewListElemBox d-flex row justify-content-between">
                                            <span>Высота</span>
                                            <span>${dataOverview[id].height}</span>
                                        </div>
                                        <div class="itemTextOverviewListElemBox d-flex row justify-content-between">
                                            <span>Масса</span>
                                            <span>${dataOverview[id].mass}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>` }
            $('.itemOverviewBowNotInserted').html(overviewOut);
            jQuery('.closeImgOverview').click(function (){
                let bodyElem = document.querySelector('body');
                bodyElem.style.overflowY = "auto";
                $('.itemOverviewBox').remove();
            });
            jQuery('.plusOverview').click(function (){
                let buttonID = $(this).attr('id');
                let re = new RegExp("[0-9]");
                let idOfElem = re.exec(buttonID);
                let tmpStrId = "countOfItemsOverview" + idOfElem;
                let inputField = document.getElementById(tmpStrId);
                inputField.value++;
            });
            jQuery('.minusOverview').click(function (){
                let buttonID = $(this).attr('id');
                let re = new RegExp("[0-9]");
                let idOfElem = re.exec(buttonID);
                let tmpStrId = "countOfItemsOverview" + idOfElem;
                let inputField = document.getElementById(tmpStrId);
                if(inputField.value > 0){
                    inputField.value--;
                }
            });
            jQuery('.buttonAddToCard').click(function (){
                let elemID = $(this).attr('data-elem-id');
                let cartFlagCheck = document.getElementById("Flag"+elemID);
                if(cartFlagCheck == null){
                    let tmpClass = ".Goods" + elemID;
                    let inCartBoxOut = `<div class="GoodsCartFlag">Товар добавлен в корзину</div>`
                    $(tmpClass).append(inCartBoxOut);
                }
                let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
                let buttonID = $(this).attr('id');
                let re = new RegExp("[0-9]");
                let idOfElem = re.exec(buttonID);
                let tmpStrId = "countOfItemsOverview" + idOfElem;
                let inputField = document.getElementById(tmpStrId);
                let countSelectedItems = inputField.value;
                let itemSelectedCode = $(this).attr('data-elem-code');
                if(itemsInCart == null){
                    let itemToCart = {
                        bearings: [
                            {
                                itemCode: itemSelectedCode,
                                itemsCount: countSelectedItems,
                                itemID: idOfElem[0]
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
                            itemID: idOfElem[0]
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
                            itemID: idOfElem[0]
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
        }
    });
}

function OpenNavBar() {
    let displayValue = document.getElementById("navbarMainBlock").style.display;
    if (displayValue == "none" || displayValue == "") {
        document.getElementById("navbarMainBlock").style.display = "block";
    } else {
        document.getElementById("navbarMainBlock").style.display = "none";
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

function showListCategory(data){
    data = JSON.parse(data);
    let out = '';
    for (let id in data){
        out += `<a href="index2.php?action=searchItems&category=${translit(data[id].category_name)}" class="dropdown-item">${data[id].category_name}</a>`
    }
    let menuBlock = document.getElementById("CatalogList");
    menuBlock.style.width = "auto";
    $('.dropdown-menu').html(out);
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

function openGoodsPage(){
    let val1 = $(this).attr('data-type-id');
    let val2 = $(this).attr('data-categ-name');
    let ItemGoods = {
        itemGoodsType: val1,
        itemCategoryType : val2
    }
    localStorage.setItem('goodsTypeCatalog', JSON.stringify(ItemGoods));
    window.location.href = 'index2.php';
}

function CloseSearch(){
    let searchBox = document.getElementById("dropdownSearch");
    searchBox.style.visibility = "hidden";
    searchBox.style.opacity = "0";
}

$(document).ready(function() {
    initGoodsPage();
})

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



