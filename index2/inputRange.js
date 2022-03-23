const sliderInner = document.getElementById('rangeSliderInputDiam');
const sliderOuter = document.getElementById('rangeSliderOutDiam');
const sliderHeight = document.getElementById('rangeSliderHeight');
const sliderMass = document.getElementById('rangeSliderMass');

const sliderInnerObj = {
    sliderElem : sliderInner,
    beginVal : 'innerDiamBeginVal',
    endVal : 'innerDiamEndVal',
    typeOfFilter : 'innerDiam'
}

const sliderOuterObj = {
    sliderElem : sliderOuter,
    beginVal : 'outerDiamBeginVal',
    endVal : 'outerDiamEndVal',
    typeOfFilter : 'outerDiam'
}

const sliderHeightObj = {
    sliderElem : sliderHeight,
    beginVal : 'HeightBeginVal',
    endVal : 'HeightEndVal',
    typeOfFilter : 'height'
}

const sliderMassObj = {
    sliderElem : sliderMass,
    beginVal : 'MassBeginVal',
    endVal : 'MassEndVal',
    typeOfFilter : 'mass'
}



$(document).ready(function() {
    initSliders(sliderInnerObj);
    initSliders(sliderOuterObj);
    initSliders(sliderHeightObj);
    initSliders(sliderMassObj);
    let sliders = new Array();
    function initSliders(sliderObj) {
        if (sliderObj.sliderElem) {
            function getMax(gCategName){
                let maxValue;
                $.post(
                    "core.php",
                    {
                        "action": "getMaxValue",
                        "categName": gCategName
                    },
                    getDataMaxVal,
                );
            }
            getMax(sliderObj.typeOfFilter);
            function getDataMaxVal(data){
                let maxValue = JSON.parse(data);
                noUiSlider.create(sliderObj.sliderElem, {
                    start: [0, Number(maxValue)],
                    connect: true,
                    step: 1,
                    range: {
                        'min': 0,
                        'max': Number(maxValue)
                    }
                });
                sliders.push(sliderObj);
                const inputBegin = document.getElementById(sliderObj.beginVal);
                const inputEnd = document.getElementById(sliderObj.endVal);
                const inputs = [inputBegin, inputEnd];

                sliderObj.sliderElem.noUiSlider.on('update', function (values, handle) {
                    inputs[handle].value = Math.round(values[handle]);
                });
                sliderObj.sliderElem.noUiSlider.on('change', function (values, handle) {
                    getCertainElements(sliders);
                });
                /* sliderObj.sliderElem.noUiSlider.on('click', );*/
                const setRangeSlider = (i, value) => {
                    let arr = [null, null];
                    arr[i] = value;
                    sliderObj.sliderElem.noUiSlider.set(arr);
                    getCertainElements(sliders);
                };
                inputs.forEach((el, index) => {
                    el.addEventListener('change', (e) => {
                        setRangeSlider(index, e.currentTarget.value);
                    });
                    el.addEventListener('click', (e)=>{
                        getCertainElements(sliders);
                    })
                });
            }

        }
    }
});

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



function getCertainElements(sliders){
    let result = window.location.search.match(new RegExp("[\?\&]" + "category" + "=([^\&]+)", "i"));
    $('.ItemGoods').remove();
    let sliderJson = {
        items : [],
    }
    let tmpArr = [];
    if(result != null){
        for(let i = 0 ; i < sliders.length; i++) {
            let elemBeginInput = document.getElementById(sliders[i].beginVal);
            let elemEndInput = document.getElementById(sliders[i].endVal);
            tmpArr.push({
                type: sliders[i].typeOfFilter,
                category: result[1],
                beginBorder: elemBeginInput.value,
                endBorder:elemEndInput.value
            })
        }
    } else {
        for(let i = 0 ; i < sliders.length; i++) {
            let elemBeginInput = document.getElementById(sliders[i].beginVal);
            let elemEndInput = document.getElementById(sliders[i].endVal);
            tmpArr.push({
                type: sliders[i].typeOfFilter,
                beginBorder: elemBeginInput.value,
                endBorder:elemEndInput.value
            })
        }
    }
    sliderJson.items = tmpArr;
    console.log(tmpArr);
    $.ajax({
        url: "core.php",
        type: "POST",
        async: false,
        data: {jsonFilter: JSON.stringify(sliderJson), action: "filtersGoodsPage"}
    })
        .done( function(data,  textStatus, jqXHR) {
            showCertainElements(data);
        })
        .fail( function( data ) {
            console.log('fail');
            console.log(data);
        })
}



function showCertainElements(data) {
    /* let ItemGoods = {
         itemGoodsType: val1,
         itemCategoryType : val2
     }
     data-type-id="${data[id].id_goods_type}" data-categ-name="${data[id].category_name}"
     localStorage.setItem('goodsTypeCatalog', JSON.stringify(ItemGoods));*/
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
                    <span class="goodsItemCodeBox"><span>Номер: </span><span class="goodsItemCode" data-code="${data[id].id_bearings}" data-categ-name="${data[id].category_name}">${data[id].id_bearings}<img src="../../images/white_icons/info-circle.svg" class="moreInfoIcon"></span></span>
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
        category = translit(category);
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