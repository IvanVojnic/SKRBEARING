<?php
echo <<<END
<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SKR Bearing</title>

    <link rel="stylesheet" href="style/bootstrap/bootstrap-grid.min.css">
    <link rel="stylesheet" href="style/bootstrap/bootstrap.css">
    <link rel="stylesheet" href="style/bootstrap/bootstrap-grid.css">
    <link rel="stylesheet" href="style/bootstrap/bootstrap-grid.css.map">

    <link rel="stylesheet" type="text/css" href="style/styleInd1.css">

</head>

<body>
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

<section class="container mainBlock">

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
                <a href="index6.html" class="dropdown-itemInfo">Условия оплаты</a>
                <a href="index6.html" class="dropdown-itemInfo">Условия достаки</a>
            </div>
        </li>
        <li class="nav-item main-nav-item forthBlock" id="aboutPurchase">
            <a class="nav-link navInfoLink" href="index7.html">Контакты</a>
        </li>
    </ul>

    <div class="d-flex justify-content-center titleBox" id="firstTitle">
        <h3 class="BlockTitle">Категории</h3>
    </div>
    <div class="catalogScrollX catalogList" id="catalogListScroll">
        <button id="catalogPrev" class="arrow arrowPrev"><img src="images/arrow-left-circle.svg" alt="arrow"></button>
        <div class="galleryCatalog">
            <ul class="imagesCatalog d-flex">
            </ul>
        </div>
        <button id="catalogNext" class="arrow arrowNext"><img src="images/arrow-right-circle.svg" alt="arrow"></button>
    </div>

    <div class="d-flex justify-content-center titleBox" id="PopularTitle">
        <h3 class="BlockTitle">Популярные</h3>
    </div>
    <div class="catalogPopularScrollX catalogScrollX catalogList">
        <button id="catalogPrevPop" class="arrow arrowPrev"><img src="images/arrow-left-circle.svg" alt="arrow"></button>
        <div class="PopGalleryCatalog">
            <ul class="imagesCatalogS">
                <li class="PopImagesCatalogItem">
                    <span href="#" class="imageCatalogLink">
                        <img src="images/корпусный.jpg" alt="" class="PopularImageCatalog">
                        <span href="#" class="bearingType">Корпусные</span>
                    </span>
                </li>
                <li class="PopImagesCatalogItem">
                    <span href="#" class="imageCatalogLink">
                        <img src="images/роликовыеИгольчатые.jpg" alt="" class="PopularImageCatalog">
                        <span href="#" class="bearingType">Роликовые-игольчатые</span>
                    </span>
                </li>
                <li class="PopImagesCatalogItem">
                    <span href="#" class="imageCatalogLink">
                        <img src="images/роликовыеЦилиндрические.jpg" alt="" class="PopularImageCatalog">
                        <span href="#" class="bearingType">Роликовые-цилиндрические</span>
                    </span>
                </li>
                <li class="PopImagesCatalogItem">
                    <span href="#" class="imageCatalogLink">
                        <img src="images/роликовыйУпорный.jpg" alt="" class="PopularImageCatalog">
                        <span href="#" class="bearingType">Роликовые-упорные</span>
                    </span>
                </li>
                <li class="PopImagesCatalogItem">
                    <span href="#" class="imageCatalogLink">
                        <img src="images/ступицыПередней.jpg" alt="" class="PopularImageCatalog">
                        <span href="#" class="bearingType">Ступицы-передней</span>
                    </span>
                </li>
            </ul>
        </div>
        <button id="catalogNextPop" class="arrow arrowNext"><img src="images/arrow-right-circle.svg" alt="arrow"></button>
    </div>


    <div class="d-flex justify-content-center titleBox" id="AboutUsTitle">
        <h3 class="BlockTitle">О нас и нашей продукции</h3>
    </div>
    <div class="aboutUs album py-5" id="AboutUs">
        <div class="container">
            <div class="row aboutUsList">
                <div class="col-md-4" id="certificatesBox">
                    <div class="card mb-4 box-shadow">
                        <img class="card-img-top" alt="FirstCard" style="height: 225px; width: 100%; display: block;" src="images/примерОнас.jpg" data-holder-rendered="true">
                        <div class="card-body">
                            <p class="card-text">
                                Мы поставляем качественную продукцию по приемлемым ценам. Ознакомитесь с нашими сертификатами.
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                <form action="index8.html">
                                    <button class="btn btn-sm btn-outline-secondary">
                                        Подробнее
                                    </button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4" id="instructionBox">
                    <div class="card mb-4 box-shadow">
                        <img class="card-img-top" alt="FirstCard" style="height: 225px; width: 100%; display: block;" src="images/compilationBearing.jpg" data-holder-rendered="true">
                        <div class="card-body">
                            <p class="card-text">
                                Ознакомьтесь с нашей инструкцией и подберите оптимальное решение для Вашей задачи.
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <form action="index9.html">
                                    <button class="btn btn-sm btn-outline-secondary">
                                        Подробнее
                                    </button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card mb-4 box-shadow">
                        <img class="card-img-top" alt="FirstCard" style="height: 225px; width: 100%; display: block;" src="images/лупа.jpg" data-holder-rendered="true">
                        <div class="card-body">
                            <p class="card-text">
                                Используйте наш расширенный поиск для быстрой подборки нужного товара, достаточно ввести нужные данные.
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <a href="#search" class="btnLinkSearch">
                                        <button type="button" class="btn btn-sm btn-outline-secondary">
                                         Подробнее
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="d-flex justify-content-center titleBox" id="providersTitle">
        <h3 class="BlockTitle">Наши поставщики</h3>
    </div>
    <div class="providersList d-flex flex-row">
        <div class="provideImageBox d-flex align-items-stretch" id="FagBox"> <div class="blackBackground" id="FagBack"></div><img src="images/fag.svg" class="provideImage" id="Fag"></div>
        <div class="provideImageBox d-flex align-items-stretch" id="NmbBox"><div class="blackBackground" id="NmbBack"></div><img src="images/nmb.svg" class="provideImage" id="Nmb"></div>
        <div class="provideImageBox d-flex align-items-stretch" id="SnrBox"><div class="blackBackground" id="SnrBack"></div><img src="images/untitled.svg" class="provideImage" id="Snr"></div>
        <div class="provideImageBox d-flex align-items-stretch" id="UrbBox"><div class="blackBackground" id="UrbBack"></div><img src="images/urb.svg" class="provideImage" id="Urb"></div>
        <div class="provideImageBox d-flex align-items-stretch" id="SkfBox"><div class="blackBackground" id="SkfBack"></div><img src="images/skf-group-vector-logo.svg" class="provideImage" id="Skf"></div>
    </div>

    <div class="d-flex justify-content-center titleBox">
        <h3 class="BlockTitle mapTittle">Местоположение нашего склада</h3>
    </div>

    <div class="mapBox">
    <iframe class="map" src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae2bb78cdf5ef8eb5d02c799d3d14683ef4bba33130740868dd2ef6a5b3591178&amp;source=constructor" frameborder="0"></iframe>
    </div>

</section>
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
<script src="scripts/index1/ind1.js"></script>
<script src="scripts/index1/catalogScroll.js"></script>
</body>
</html>
END
;?>