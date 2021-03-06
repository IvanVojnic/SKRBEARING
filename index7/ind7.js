initMainPage();
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

$(document).ready(function() {
    const form = document.getElementById('feedbackFormID');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);

        if(error === 0){
            form.classList.add('_sending');
            let formData = new FormData(form);
            formData.append("action", "message");
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
                alert("????????????");
                form.classList.remove('_sending');
            }

        } else{
            alert('?????????????????? ?????????????????????? ????????');
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
});

function showListDropProviders(data){
    data = JSON.parse(data);
    let out = '<option value="" disabled selected>???????????????? ??????????????????????????</option>';
    for(let id in data){
        let strValTmp = translit(data[id].name_provider.toLowerCase())
        out += ` <option value="${strValTmp}">${data[id].name_provider}</option>`
    }
    $('.BearingProviderList').html(out);
}

function showListToSearchCategory(data){
    let out = '<option value="" disabled selected>???????????????? ??????????????????</option>';
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
        '??': 'a',    '??': 'b',    '??': 'v',    '??': 'g',    '??': 'd',
        '??': 'e',    '??': '2',    '??': '4',    '??': 'z',    '??': 'i',
        '??': 'j',    '??': 'k',    '??': 'l',    '??': 'm',    '??': 'n',
        '??': 'o',    '??': 'p',    '??': 'r',    '??': 's',    '??': 't',
        '??': 'u',    '??': 'f',    '??': 'h',    '??': 'c',    '??': '9',
        '??': 'w',    '??': '3',    '??': '5',    '??': '8',    '??': 'x',
        '??': '1',    '??': 'q',    '??': '6',    ' ': '-',

        '??': 'A',    '??': 'B',    '??': 'V',    '??': 'G',    '??': 'D',
        '??': 'E',    '??': 'E',    '??': 'Zh',   '??': 'Z',    '??': 'I',
        '??': 'Y',    '??': 'K',    '??': 'L',    '??': 'M',    '??': 'N',
        '??': 'O',    '??': 'P',    '??': 'R',    '??': 'S',    '??': 'T',
        '??': 'U',    '??': 'F',    '??': 'H',    '??': 'C',    '??': 'Ch',
        '??': 'Sh',   '??': 'Sch',  '??': '',     '??': 'Y',    '??': '',
        '??': 'E',    '??': 'Yu',   '??': 'Ya'
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