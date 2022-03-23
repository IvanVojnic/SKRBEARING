<?php
echo <<<END
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Каталог</title>
    <link rel="stylesheet" href="style/bootstrap/bootstrap-grid.min.css">
    <link rel="stylesheet" href="style/bootstrap/bootstrap.css">
    <link rel="stylesheet" href="style/bootstrap/bootstrap-grid.css">
    <link rel="stylesheet" href="style/bootstrap/bootstrap-grid.css.map">
    <link rel="stylesheet" type="text/css" href="style/styleInd2.css">
    <link rel="stylesheet" type="text/css" href="style/otherStyle/nouislider.min.css">
</head>
<body>
<div class = "itemOverviewBowNotInserted"></div>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark" id="headerNavbar">
    <div class="container navMenuTEST" id="navigation_bar">
        <a class="navbar-brand" href="index.php">SKR Bearing</a>
        <a class="nav-item telNumber" href="index7.html"><img src="images/white_icons/telephone-callred.png">+375296300893</a>

        <div class="nav-item ml-lg-3 ml-md-3 ml-0 navBarItem cartMobile">
            <a class="nav-link cartLink" id="myCart" href="index5.html">Мои заказы<span class="popupCartBox" id="popupCartBoxMobile"><img src="images/whCart.svg" class="popupCartImg"><input class="countItemsCart" type="text" value="1" readonly></span></a>
            <span class="sr-only">(current)</span>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMainBlock" aria-expanded="true" aria-label="Toggle navigation" onclick='OpenNavBar()'>
                <span class="navbar-toggle-icon">
                    <img src="images/white_icons/icons8-меню.svg" >
                </span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMainBlock">
            <form action="index2.php" method="GET" class="form-inline mt-2 mt-md-0">
                <input class="form-control mr-sm-2" type="text" name="id_bearings" placeholder="Номер подшипника" aria-label="Номер подшипника">
                <button class="btn btn-outline-success my-sm-0" type="submit">Поиск</button>
            </form>
            <ul class="navbar-nav">
                <li class="nav-item ml-lg-3 ml-md-3 ml-0 navBarItem">
                        <span class="dropdownSearchButton" onclick="OpenSearch()">
                            Расширенный поиск
                        </span>
                </li>
                <li class="nav-item ml-lg-3 ml-md-3 ml-0 navBarItem cartComp">
                    <a class="nav-link cartLink" id="myCartMobileHide" href="index5.html">Мои заказы<span class="popupCartBox" id="popupCartBox"><img src="images/whCart.svg" class="popupCartImg"><input class="countItemsCart" type="text" value="1" readonly></span></a>
                    <span class="sr-only">(current)</span>
                </li>
            </ul>
        </div>
    </div>
</nav>

<div class="dropdownSearchBox d-flex col-12 flex-column" id="dropdownSearch">
    <div class="dropdownSearchTitleBox col-12 flex-wrap justify-content-center">
        <span class="dropdownSearchTitle d-flex justify-content-center">Поиск по параметрам</span>
    </div>
    <img src="images/wh-x-circle.svg" class="imgClose" onclick="CloseSearch()">
    <form action="index2.php" method="GET" class="formSearch d-flex flex-column">
        <div class="optionsBox">
            <div class="listParametrs d-flex flex-column align-content-around col-lg-4 col-12">
                <select id="BearingCategory" name="category" class="BearingCategoryList">
                    
                </select>
                <select id="BearingProvider" name="BearingProvider" class="BearingProviderList">
                    
                </select>
                <select id="BearingCountry" name="BearingCountry">
                    <option value="" disabled selected>Выберите страну</option>
                    <option value="Япония">Япония</option>
                    <option value="Франция">Франция</option>
                    <option value="Германия">Германия</option>
                </select>
            </div>

            <div class="InputParametrs d-flex justify-content-between flex-wrap col-lg-8 col-12">
                <div class="d-flex justify-content-end align-self-end col-xl-4 col-lg-4 col-md-6 col-12 order-md-1 order-4">
                    <label for="BearingNumber">Номер Подшипника</label>
                    <input type="text" id="BearingNumber" name="id_bearings" placeholder="6202">
                </div>

                <div class="d-flex justify-content-end align-self-end col-xl-4 col-lg-4 col-md-6 col-12 order-md-2 order-1">
                    <label for="BearingGap">Зазор</label>
                    <input type="text" id="BearingGap" name="BearingGap" placeholder="C3">
                </div>

                <div class="d-flex justify-content-end align-self-end col-xl-4 col-lg-4 col-md-6 col-12 order-md-3 order-5">
                    <label for="BearingInnerDiameter">Внутренний диаметр</label>
                    <input type="number" id="BearingInnerDiameter" name="innerDiam" placeholder="d, мм">
                </div>

                <div class="d-flex justify-content-end align-self-end col-xl-4 col-lg-4 col-md-6 col-12 order-md-4 order-2">
                    <label for="BearingMass">Масса</label>
                    <input type="number" id="BearingMass" name="mass" placeholder="m, грамм">
                </div>

                <div class="d-flex justify-content-end align-self-end col-xl-4 col-lg-4 col-md-6 col-12 order-md-5 order-6">
                    <label for="BearingOuterDiameter">Внешний диаметр</label>
                    <input type="number" id="BearingOuterDiameter"  name="outerDiam" placeholder="D, мм">
                </div>

                <div class="d-flex justify-content-end align-self-end col-xl-4 col-lg-4 col-md-6 col-12 order-md-6 order-3">
                    <label for="BearingB">Высота</label>
                    <input type="number" id="BearingB" name="height" placeholder="B, мм">
                </div>
            </div>
        </div>

        <div class="col-12 justify-content-end buttonSearchBox">
            <input type="submit" value="Поиск" id="buttonSearch"  class="mr-5 buttonToSendSearch">
            <input type="reset" id="buttonReset">
        </div>
    </form>
</div>

<div class="pl-5 pr-5 wrappedSection">
<section class="container-fluid mainBlock">
    <ul class="nav nav-pills nav-fill" id="SiteBlockNavigate">
        <li class="nav-item main-nav-item" id="buttonCatalogOpen">
            <span class="nav-link dropdown-toggle" id="catalogDropdown" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onclick='OpenCatalogList()'>Каталог</span>
            <div class="dropdown-menu" id="CatalogList">
            </div>
        </li>
        <li class="nav-item main-nav-item">
            <a class="nav-link navInfoLink" href="index8.html">О нас</a>
        </li>
        <li class="nav-item main-nav-item thirdBlock" id="buttonInfoOpen">
            <span class="nav-link dropdown-toggle" id="infoDropdown" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onclick='OpenInfoList()'>Как купить</span>
            <div class="dropdownListInfo" id="InfoList">
                <a href="index7.html" class="dropdown-itemInfo">Условия оплаты</a>
                <a href="index6.html" class="dropdown-itemInfo">Условия достаки</a>
            </div>
        </li>
        <li class="nav-item main-nav-item forthBlock" id="aboutPurchase">
            <a class="nav-link navInfoLink" href="index7.html">Контакты</a>
        </li>
    </ul>
    <!--Блок с фильтрами, должен открываться по нажатию кнопки. Фильры: масса, высоты, внутренний диамер, внешний диаметр-->
    <div class="filters p-2">
        <form class="col-xl-12 row bearingsFilters">
            <div class="filtersBox col-xl-3 col-lg-4 col-md-6 p-3">
            <h3 class="filtersTitle">Внутренний диаметр</h3>
                <div class="filtersSlider" id="rangeSliderInputDiam">

                </div>
                <div class="filtersInputs d-flex justify-content-between">
                    <label class="filtersLabel">
                        <span class="filtersText">от</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="innerDiamBeginVal">
                        <span class="filtersText">mm</span>
                    </label>
                    <label class="filtersLabel">
                        <span class="filtersText">до</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="innerDiamEndVal">
                        <span class="filtersText">mm</span>
                    </label>
                </div>
            </div>
            <div class="filtersBox col-xl-3 col-lg-4 col-md-6 p-3">
                <h3 class="filtersTitle">Внешний диаметр</h3>
                <div class="filtersSlider" id="rangeSliderOutDiam">

                </div>
                <div class="filtersInputs d-flex justify-content-between">
                    <label class="filtersLabel">
                        <span class="filtersText">от</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="outerDiamBeginVal">
                        <span class="filtersText">mm</span>
                    </label>
                    <label class="filtersLabel">
                        <span class="filtersText">до</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="outerDiamEndVal">
                        <span class="filtersText">mm</span>
                    </label>
                </div>
            </div>
            <div class="filtersBox col-xl-3 col-lg-4 col-md-6 p-3">
                <h3 class="filtersTitle">Высота</h3>
                <div class="filtersSlider" id="rangeSliderHeight">

                </div>
                <div class="filtersInputs d-flex justify-content-between">
                    <label class="filtersLabel">
                        <span class="filtersText">от</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="HeightBeginVal">
                        <span class="filtersText">mm</span>
                    </label>
                    <label class="filtersLabel">
                        <span class="filtersText">до</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="HeightEndVal">
                        <span class="filtersText">mm</span>
                    </label>
                </div>
            </div>
            <div class="filtersBox col-xl-3 col-lg-4 col-md-6 p-3">
                <h3 class="filtersTitle">Масса</h3>
                <div class="filtersSlider" id="rangeSliderMass">

                </div>
                <div class="filtersInputs d-flex justify-content-between">
                    <label class="filtersLabel">
                        <span class="filtersText">от</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="MassBeginVal">
                        <span class="filtersText">g</span>
                    </label>
                    <label class="filtersLabel">
                        <span class="filtersText">до</span>
                        <input type="number" min="1" max="1000" class="filtersInput" id="MassEndVal">
                        <span class="filtersText">g</span>
                    </label>
                </div>
            </div>
        </form>
    </div>
    <!-- секция с каталогом товаров -->
    <div class="noGoods">
        <div class="emptyCatalogBox col-12">
            <img src="images/white_icons/emptyCart3.svg" class="col-lg-4 col-sm-6">
            <div class="BoxInfoButReturn d-flex flex-column align-items-center col-lg-8 col-sm-6">
                <div class="textInfo mainTextBlEmptyCart d-flex flex-column align-items-start">
                    <p>Мы только запустили наш интернет магазин.</p>
                    <p>Данного товара пока нет в базе данных нашего магазина.</p>
                    <p>Но он может быть у нас на складе.</p>
                </div>
                <div class="textInfo addInfoTextBlEmptyCart">
                    <p>Вы можете связаться с нашим специалистом но номеру телефона <span class="textToBold">+375296300893</span>.</p>
                    <p>Либо оставьте информацию о вашем заказе на странице <a href="index7.html">Контакты</a></p>
                    <form action="index.php">
                        <button class="ButReturn">На главную</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="goods row d-flex align-content-around justify-content-around flex-wrap">

    </div>
</section>
</div>
<footer class="container-fluid footer">
    <div class="d-flex flex-column">
        <div class="d-flex justify-content-around NavRow">
            <span class="CompanyName">SKR Bearing</span>
            <div class="footNav d-flex flex-row">
                <a href="index7.html" class="footNavItem d-flex flex-column" id="locationBox"><img src="images/whLocation.svg" class="footNavItemImg"><span class="footNavItemDescript">Местоположение</span></a>
                <a href="index5.html" class="footNavItem d-flex flex-column" id="cartBox"><img src="images/whCart.svg" class="footNavItemImg"><span class="footNavItemDescript">Корзина</span></a>
                <a href="index6.html" class="footNavItem d-flex flex-column" id="deliveryBox"><img src="images/whTruck.svg" class="footNavItemImg"><span class="footNavItemDescript"  >Доставка</span></a>
            </div>
        </div>
    </div>
</footer>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="scripts/index2/ind2.js" charset="UTF-8"></script>
<script src="scripts/others/nouislider.min.js"></script>
<script src="scripts/index2/inputRange.js" charset="UTF-8"></script>
</body>
</html>
END
;?>