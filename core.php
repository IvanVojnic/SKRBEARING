<?php

require_once 'functionTest.php';

if(isset($_POST["action"])) {
    $action = $_POST["action"];
    switch ($action) {
        case 'initCatalogDrop':
            initCatalogDrop();
            break;
        case 'initGoodsPage':
            initGoodsPage();
            break;
        case 'initOverview':
            initOverview();
            break;
        case 'getMaxValue':
            getMaxVal();
            break;
        case 'initProviders':
            initProviders();
            break;
        case 'initCartPage':
            initCartPage();
            break;
        case 'filtersGoodsPage':
            filtersGoodsPage();
            break;
    }
}
?>