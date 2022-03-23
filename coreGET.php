<?php
require_once 'functionTest.php';
if(isset($_GET['action'])){
    $action = $_GET['action'];
    switch ($action) {

        case 'selectedItem':
            initSelectedItem();
            break;
        case 'searchItems':
            initSearchItems();
            break;
        case 'initProvidersPage':
            initProvidersPage();
    }
}
?>