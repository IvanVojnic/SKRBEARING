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
    const form = document.getElementById('feedbackFormID');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);

        if(error === 0){
            form.classList.add('_sending');
            let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
            let formData = new FormData(form);
            formData.append("action", "order");
            formData.append("goodsList", JSON.stringify(itemsInCart.bearings));
            formData.append("itemsInOrder", JSON.stringify(itemsInCart.itemsCountInCart));
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if(response.ok){
                let result = await response.json();
                alert(result);
                form.reset();
                form.classList.remove('_sending');

            } else {
                alert("Ошибка");
                form.classList.remove('_sending');
            }

        } else{
            alert('Заполните необходимые поля');
        }
    }

    function formValidate(form){
        let error = 0;
        let formReq = document.querySelectorAll('._req');
        for( let i = 0; i < formReq.length; i++)
        {
            const input = formReq[i];
            formRemoveError(input);

            if(input.classList.contains('_email')){
                if(emailTest(input)){
                    formAddError(input);
                    error++;
                }
            } else {
                if(input.value === ''){
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }
    function formAddError(input){
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input){
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    function emailTest(input){
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
})



function sendRequest(method, url, body){
    const headers = {
        'Content-type' : 'application/json'
    }
    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers
    }).then(response => {
        if(response.ok) {
            return response.json();
        }
        return  response.json().then(error => {
            const e = new Error('smths wrong')
            e.data = error;
            throw e;
        })
    })

}

function viewEmptyCart(toCheck){
    if(toCheck == true){
        let form = document.getElementById("feedbackFormID");
        form.style.marginTop = "0px";
        let nav = document.querySelector(".toDeleteAllItems");
        nav.style.padding = "0px";
        let emptyCartBl = document.querySelector(".emptyCartBox");
        emptyCartBl.style.display = "flex";
        emptyCartBl.style.visibility = "visible";
        emptyCartBl.style.opacity = "1";
    }
}

function initMainPage(){
    let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
    if(itemsInCart != null){
        let goodsBox = document.querySelector(".goodsCartList");
        goodsBox.style.visibility = "visible";
        goodsBox.style.opacity = "1";
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
        $.ajax({
            url: "core.php",
            type: "POST",
            async: false,
            data: {json: JSON.stringify(itemsInCart), action: "initCartPage"}
        })
            .done( function(data, textStatus, jqXHR) {
                initGoodsInCart(data, itemsInCart);
            })
            .fail( function( data ) {
                console.log('fail');
                console.log(data);
            })
    } else {
        viewEmptyCart(true)
        let goodsBox = document.querySelector(".goodsCartList");
        goodsBox.remove();
    }
    $.post(
        "core.php",
        {
            "action":"initCatalogDrop"
        },
        loadListInterface
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

function loadCountInCart(itemsInCart){
    let linkParams = JSON.parse(localStorage.getItem('linkParamsToCatalog'))
    let link = '';
    link = "index2.php?";
    let counter = 1;
    $.each(linkParams.options[0], function (key, val){
        if(counter == Object.keys(linkParams.options[0]).length){
            link += key + "=" + val;
        }
        else {
            link += key + "=" + val + "&";
            counter++;
        }
    });
    if(itemsInCart == undefined || itemsInCart == null){
        itemsInCart = 0;
    }
    let outCount = `
    <div class="linksToPrevPages">
        <a href="index.php">Главная</a> <img src="images/white_icons/arrow-right-short.svg"> 
        <a href="${link}">Обратно к каталогу</a>
    </div>
    <div class="d-flex row col-md-8 col-xl-7 justify-content-between align-items-center cartMainButtons">
        <div class="countOfItemsInCartBox">Товаров в корзине: ${itemsInCart}<span class="countOfItemsInCart"></span></div>
        <span class="openForm d-flex">Оформить заказ</span>
        <span class="deleteButton d-flex">Очистить</span>
    </div>`
    $('.toDeleteAllItems').html(outCount);
    jQuery('.openForm').click(function (){
        let formElem = document.getElementById("feedbackFormID");
        formElem.style.visibility = "visible"
        formElem.style.opacity = "1";
        formElem.style.height = "auto";
        formElem.style.padding = "3% 1%";
    });
}

function initGoodsInCart(data, itemsCart){
    data = JSON.parse(data);
    loadCountInCart(itemsCart.itemsCountInCart);
    let out = '';
    let counterT = 0;
    for(let id in data){
        let countItems = null;
        for(let i = 0; i < itemsCart.bearings.length; i++){
            if(data[id].id_bearings == itemsCart.bearings[i].itemCode){
                countItems = itemsCart.bearings[i].itemsCount;
            }
        }
        out += `
        <div class="item col-12 cartBox">
            <div class="buttons col-1 d-flex align-items-center">
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="deleteItem" data-deleteItem="Удалить" data-code-elem="${data[id].id_bearings}"><path d="M 12 0 z z m 0 10.293 l 5.293 -5.293 l 0.707 0.707 l -5.293 5.293 l 5.293 5.293 l -0.707 0.707 l -5.293 -5.293 l -5.293 5.293 l -0.707 -0.707 l 5.293 -5.293 l -5.293 -5.293 l 0.707 -0.707 l 5.293 5.293 z"/>
                </svg>
            </div>
     
            <div class="image col-md-2 col-3">
              <img src="images/bearingsImg/шариковыйРадиальный.jpg" alt="" />
            </div>
     
            <div class="description col-sm-5 col-4 d-flex flex-column justify-content-around">
              <span>${data[id].category_name}</span>
              <span>Номер: ${data[id].id_bearings}</span>
            </div>
            
             <div class="quantityBox d-flex flex-column col-lg-4 col-sm-3 col-4 align-items-center justify-content-center">
                <div class="quantity col-xl-6 col-lg-8 col-sm-12 d-flex flex-column align-items-center">
                    <div class="d-flex row justify-content-around countItemsBox">
                        <span class="minusOverview" data-elem-id="${data[id].id}" data-elem-code="${data[id].id_bearings}" id="buttonMinus${counterT}">-</span>
                        <input type="number" class="countOfItems_input" value="${countItems}" id="countOfItemsOverview${counterT}">
                        <span class="plusOverview" data-elem-id="${data[id].id}" data-elem-code="${data[id].id_bearings}" id="buttonPlus${counterT}">+</span>
                    </div>
                    <div class="btnBox d-flex row justify-content-center">
                        <button class="btn btn-link myBtnLink" type="button" data-code-item="${data[id].id_bearings}"  data-goods-type="${data[id].category_name}"><img src="images/white_icons/caret-right.svg">Подробнее</button>
                    </div>
                </div>
            </div>
        </div>`
    }
    $('.goodsCartList').html(out);
    jQuery('.plusOverview').click(function (){
        let buttonID = $(this).attr('id');
        let re = new RegExp("[0-9]");
        let idOfElem = re.exec(buttonID);
        let tmpStrId = "countOfItemsOverview" + idOfElem;
        let inputField = document.getElementById(tmpStrId);
        inputField.value++;
        let itemSelectedCode = $(this).attr('data-elem-code');
        let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
        let countItemsInCart = itemsInCart.itemsCountInCart;
        let itemsArr = itemsInCart.bearings;
        for(let i = 0; i < itemsArr.length; i++){
            if(itemsArr[i].itemCode == itemSelectedCode)
            {
                itemsArr[i].itemsCount = inputField.value;
            }
        }
        let itemToCart = {
            bearings: itemsArr,
            itemsCountInCart: String(countItemsInCart)
        }
        localStorage.removeItem("ItemCart");
        localStorage.setItem('ItemCart', JSON.stringify(itemToCart));
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
        let itemSelectedCode = $(this).attr('data-elem-code');
        let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
        let countItemsInCart = itemsInCart.itemsCountInCart;
        let itemsArr = itemsInCart.bearings;
        for(let i = 0; i < itemsArr.length; i++){
            if(itemsArr[i].itemCode == itemSelectedCode)
            {
                if(inputField.value != 0){
                    itemsArr[i].itemsCount = inputField.value;
                } else {
                    itemsArr.splice(i, 1);
                }
            }
        }
        let itemToCart = {
            bearings: itemsArr,
            itemsCountInCart: String(countItemsInCart)
        }
        localStorage.removeItem("ItemCart");
        localStorage.setItem('ItemCart', JSON.stringify(itemToCart));
    });
    jQuery('.myBtnLink').click(function (){
        let code = $(this).attr('data-code-item');
        let category = $(this).attr('data-goods-type');
        let ItemSelected = {
            itemCode: code,
            itemCategory: category
        }
        localStorage.setItem('selectedItem', JSON.stringify(ItemSelected));
        window.location.href = 'index3.php?code='+code+'&category='+category;
    });
    jQuery('.deleteButton').click(function (){
        let arr = document.querySelectorAll('div.cartBox');
        for(let i = 0; i < arr.length; i++)
        {
            arr[i].style.visibility = "hidden";
        }
        localStorage.removeItem("ItemCart");
        let cartElem = null;
        if(window.innerWidth <= 992){
            cartElem = document.getElementById("popupCartBoxMobile");
        } else {
            cartElem = document.getElementById("popupCartBox");
        }
        cartElem.style.visibility = "visible";
        let cartField = cartElem.childNodes[1];
        cartField.value = 0;
        loadCountInCart(0);
        let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
        let goodsBox = document.querySelector(".goodsCartList");
        goodsBox.remove();
        if(itemsInCart == null){
            viewEmptyCart(true);
        }
    });
    jQuery('.deleteItem').click(function (){
        let elemClose = jQuery(this).get(0);
        let mainBox = elemClose.parentNode;
        mainBox = mainBox.parentElement;
        mainBox.remove();
        let itemsInCart = JSON.parse(localStorage.getItem('ItemCart'));
        let countItemsInCart = itemsInCart.itemsCountInCart;
        let itemsArr = itemsInCart.bearings;
        let itemSelectedCode = $(this).attr('data-code-elem');
        console.log(itemsArr);
        for(let i = 0; i < itemsArr.length; i++){
            if(itemsArr[i].itemCode == itemSelectedCode)
            {
                itemsArr.splice(i,1);
            }
        }
        countItemsInCart = Number(countItemsInCart) - 1;
        if(countItemsInCart == 0){
            let goodsBox = document.querySelector(".goodsCartList");
            goodsBox.remove();
            viewEmptyCart(true);
            localStorage.removeItem("ItemCart");
            let cartElem = null;
            if(window.innerWidth <= 992){
                cartElem = document.getElementById("popupCartBoxMobile");
            } else {
                cartElem = document.getElementById("popupCartBox");
            }
            cartElem.style.visibility = "visible";
            let cartField = cartElem.childNodes[1];
            cartField.value = countItemsInCart;
            loadCountInCart(countItemsInCart);
        } else {
            let itemToCart = {
                bearings: itemsArr,
                itemsCountInCart: String(countItemsInCart)
            };
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
            loadCountInCart(countItemsInCart);
        }
    });
    jQuery('.closeForm').click(function (){
        let formElem = document.getElementById("feedbackFormID");
        formElem.style.visibility = "hidden";
        formElem.style.opacity="0";
        formElem.style.height = "0";
        formElem.style.padding = "0";
    });
}



function loadListInterface(data){
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
