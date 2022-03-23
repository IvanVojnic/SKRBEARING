<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "skrbearingtest1";

function connect()
{
    $conn = new mysqli("localhost", "root", "", "skrbearingtest1");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function initCatalogDrop()
{
    $conn = connect();
    $sql = "SELECT * FROM goods_categories";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}
//function array_key_first(array $array) { foreach ($array as $key => $value) { return $key; } }

function initGoodsPage()
{
    $conn = connect();
    $gType = $_POST['gType'];
    $sql = "";
    switch ($gType) {
        case '1':
            $gCategType = $_POST['categName'];
            $sql = "SELECT * FROM bearings JOIN goods_categories ON id_category = '$gCategType' ";
            break;
        case '2':
            $gCategType = $_POST['categName'];
            $sql = "SELECT * FROM sepatar JOIN goods_categories ON id_category = '$gCategType' ";
            break;
        case '3':
            $gCategType = $_POST['categName'];
            $sql = "SELECT * FROM liquid JOIN goods_categories ON id_category = '$gCategType' ";
            break;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        $iterator = 0;
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
            $iterator++;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}

function rus2translit($string) {
    $converter = array(
        'a' => 'а',    'b' => 'б',    'v' => 'в',    'g' => 'г',    'd' => 'д',
        'e' => 'е',    '2' => 'ё',    '4' => 'ж',    'z' => 'з',    'i' => 'и',
        'j' => 'й',    'k' => 'к',    'l' => 'л',    'm' => 'м',    'n' => 'н',
        'o' => 'о',    'p' => 'п',    'r' => 'р',    's' => 'с',    't' => 'т',
        'u' => 'у',    'f' => 'ф',    'h' => 'х',    'c' => 'ц',    '9' => 'ч',
        'w' => 'ш',    '3' => 'щ',    '5' => 'ь',    '8' => 'ы',    'x' => 'ъ',
        '1' => 'э',    'q' => 'ю',    '6' => 'я',    '-' => ' ',

        'A' => 'А',    'B' => 'Б',    'V' => 'В',    'G' => 'Г',    'D' => 'Д',
        'E' => 'Е',    'E' => 'Ё',    'Zh'=> 'Ж',   'Z' => 'З',    'I' => 'И',
        'Y' => 'Й',    'K' => 'К',    'L' => 'Л',    'M' => 'М',    'H' => 'Н',
        'O' => 'О',    'P' => 'П',    'R' => 'Р',    'S' => 'С',    'T' => 'Т',
        'U' => 'У',    'F' => 'Ф',    'H' => 'Х',    'C' => 'Ц',    'Ch' => 'Ч',
        'Sh' => 'Ш',   'Sch'=> 'Щ',   'Y' => 'Ы',
        'E' => 'Э',    'Yu'=> 'Ю',    'Ya' => 'Я'
    );
    return strtr($string, $converter);
}



function initOverview(){
    $conn = connect();
    $goodsId = $_POST['goodsID'];
    $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id WHERE bearings.id = $goodsId";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $out = array();
        while($row = $result->fetch_assoc()){
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}

function initSelectedItem(){
    $conn = connect();
    $gType = $_GET['category'];
    $gType = rus2translit($gType);
    $gCode = $_GET['code'];
    $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name
                FROM bearings JOIN goods_categories ON goods_categories.category_name = '$gType' WHERE bearings.id_bearings = '$gCode'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}

function initSearchItems(){
    $conn = connect();
    $url = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    $query = parse_url($url,PHP_URL_QUERY);
    $queryArr = explode("&", $query);
    $reg = '/action/';
    if(preg_match($reg,$queryArr[0])){
        unset($queryArr[0]);
    }
    for ($i = array_key_first($queryArr), $size = count($queryArr); $i <= $size ; ++$i){
        if(preg_match("/\+/",$queryArr[$i])){
            $queryArr[$i] = preg_replace( "/\+/", ' ', $queryArr[$i]);
        }
        $tmp = explode("=", $queryArr[$i]);
        if($tmp[1] == null || $tmp[1] == ""){
            unset($queryArr[$i]);
        }
    }
    $sql = "SELECT * FROM bearings WHERE ";
    $counter = 1;
    $checkBearId = 0;
    $checkEmptyStr = 0;
    foreach ($queryArr as &$value){
        if($counter <= (count($queryArr) - 1)) {
            $str = explode("=", $value);
            switch ($str[0]){
                case "category":
                    if($counter == 1){
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON goods_categories.category_name = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "'";
                        $checkEmptyStr = 1;

                    } else {
                        $sql .= " OUTER JOIN goods_categories ON id_category = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "' ";
                        $checkEmptyStr = 1;
                    }
                    break;
                case "BearingProvider":
                    if($counter == 1){
                        $sql = "select bearings.*, providerstest.name_provider, goods_categories.category_name
                                 from bearings
                                 JOIN goods_categories ON bearings.id_category = goods_categories.id
                                join bearing_provider
                                 on bearing_provider.id_bearing = bearings.id
                                join providerstest
                                 on providerstest.id = bearing_provider.id_providers AND providerstest.name_provider = ";
                        $sql .= "'";
                        $sql .= $str[1];
                        $sql .= "' ";
                    } else {
                        $sql .= "LEFT JOIN providers ON id_providers = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "' ";
                    }
                    break;
                case "countries":
                    if($counter == 1){
                        $sql = "SELECT * FROM bearings JOIN countries ON id_countries = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "' ";
                    } else {
                        $sql .= "LEFT JOIN countries ON id_countries = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "' ";
                    }
                    break;
                case "id_bearings":
                    $arrKey = array_search($value, $queryArr);
                    $nextEl = $queryArr[$arrKey+1];
                    $str2 = explode("=", $nextEl);
                    if($str2[0] == "BearingGap"){
                        if($checkEmptyStr == 1){
                            $sql .= " AND ";
                        } else {
                            $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id AND bearings.";
                        }
                        $sql .= $str[0];
                        $sql .= " LIKE ";
                        $tmp = "'%";
                        $tmp .= $str[1];
                        $tmp .= "%";
                        $tmp .= $str2[1];
                        $tmp .= "%'";
                        $sql .= $tmp;

                        $checkBearId = 1;
                        break;
                    } else {
                        $sql = " AND ";
                        $sql .= $str[0];
                        $sql .= " LIKE ";
                        $tmp = "'%";
                        $tmp .= $str[1];
                        $tmp .= "%'";
                        $sql .= $tmp;

                        $checkBearId = 1;
                        break;
                    }
                case "BearingGap":
                    if($checkBearId == 1){
                        break;
                    } else {
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id AND bearings.";
                        $sql .= "id_bearings";
                        $sql .= " LIKE ";
                        $tmp = "'%";
                        $tmp .= $str[1];
                        $tmp .= "%'";
                        $sql .= $tmp;
                        break;
                    }
                default:
                    if($counter == 1){
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id WHERE $value";
                    } else {
                        $sql.= " AND ";
                        $sql .= $value;
                    }
            }
            $counter++;
        }
        else{
            $str = explode("=", $value);
            switch ($str[0]){
                case "category":
                    $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id AND goods_categories.category_name =";
                    $sql .= " '";
                    $sql .= rus2translit($str[1]);
                    $sql .= "' ";
                    break;
                case "BearingProvider":
                    if($counter == 1){
                        $sql = "select bearings.*, providerstest.name_provider, goods_categories.category_name
                                 from bearings
                                 JOIN goods_categories ON bearings.id_category = goods_categories.id
                                join bearing_provider
                                 on bearings.id = bearing_provider.id_bearing
                                join providerstest
                                 on bearing_provider.id_providers = providerstest.id WHERE providerstest.name_provider = ";
                        $sql .= "'";
                        $sql .= $str[1];
                        $sql .= "' ";
                    } else {
                        $sql .= " join bearing_provider
                                 on bearings.id = bearing_provider.id_bearing
                                join providerstest
                                 on bearing_provider.id_providers = providerstest.id WHERE providerstest.name_provider =  ";
                        $sql .= "'";
                        $sql .= $str[1];
                        $sql .= "' ";
                    }
                    break;
                case "countries":
                    if($counter == 0){
                        $sql = "SELECT * FROM bearings JOIN countries ON id_countries = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "' ";
                    } else {
                        $sql .= "LEFT JOIN countries ON id_countries = ";
                        $sql .= "'";
                        $sql .= rus2translit($str[1]);
                        $sql .= "' ";
                    }
                    break;
                case "id_bearings":
                    $nextEl = next($queryArr);
                    $str2 = explode("=", $nextEl);
                    if($str2[0] == "BearingGap"){
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id AND bearings.";
                        $sql .= $str[0];
                        $sql .= " LIKE ";
                        $tmp = "'%";
                        $tmp .= $str[1];
                        $tmp .= "%";
                        $tmp .= $str2[1];
                        $tmp .= "%'";
                        $sql .= $tmp;
                        $checkBearId = 1;
                        break;
                    } else {
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id AND bearings.";
                        $sql .= $str[0];
                        $sql .= " LIKE ";
                        $tmp = "'%";
                        $tmp .= $str[1];
                        $tmp .= "%'";
                        $sql .= $tmp;
                        $checkBearId = 1;
                        break;
                    }
                case "BearingGap":
                    if($checkBearId == 1){
                        break;
                    } else {
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id AND bearings.";
                        $sql .= "id_bearings";
                        $sql .= " LIKE ";
                        $tmp = "'%";
                        $tmp .= $str[1];
                        $tmp .= "%'";
                        $sql .= $tmp;
                        break;
                    }
                default:
                    if($counter == 1){
                        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id WHERE $value ";
                    } else {
                        $sql.= " AND ";
                        $sql .= $value;
                    }
            }
            break;
        }
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}

function getMaxVal(){
    $conn = connect();
    $gCategory = $_POST['categName'];
    $sql = "SELECT MAX($gCategory) AS max FROM bearings";
    $result=mysqli_query($conn,$sql);
    $out = "";
    while($row = mysqli_fetch_assoc($result))
    {
        $out = $row['max'];
    }
    echo $out;
    $conn->close();
}

function initProviders(){
    $conn = connect();
    $sql = "SELECT id, name_provider, img_main_logo FROM providers";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}

function initProvidersPage(){
    $conn = connect();
    $provider = $_GET['provider'];
    $sql = "SELECT * FROM providers WHERE name_provider = '$provider'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}

function initCartPage(){
    $conn = connect();
    $directions = json_decode($_POST['json'], true);
    $out = array();
    for($size = $directions["itemsCountInCart"][0], $counter = 0; $counter < $size; $counter++) {
        $tmp = $directions["bearings"][$counter]["itemCode"];
        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name
                    FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id WHERE id_bearings = '$tmp' ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $out[$row["id"]] = $row;
            }
        } else {
            echo "0 results";
        }
    }
    echo json_encode($out);
    $conn->close();
}

function filtersGoodsPage(){
    $conn = connect();
    $directions = json_decode($_POST['jsonFilter'], true);
    $category = '';
    if(array_key_exists('category', $directions)){
        $category = $directions['items'][0]['category'];
        $category = rus2translit($category);
    }

    $ANDcheck = 0;
    if($category != ''){
        $category = rus2translit($category);
        $sql = "SELECT bearings.id, bearings.id_bearings, bearings.id_category, bearings.innerDiam, bearings.outerDiam, bearings.height, bearings.mass, bearings.img, goods_categories.category_name 
                                FROM bearings JOIN goods_categories ON goods_categories.category_name = '$category' ";
    } else {
        $sql = "SELECT bearings.*, goods_categories.category_name FROM bearings JOIN goods_categories ON bearings.id_category = goods_categories.id WHERE ";
        $ANDcheck = 1;
    }
    if(count($directions["items"]) < 2){
        $ANDcheck = 0;
    }
    for($i = 0; $i < count($directions["items"]); $i++){
        $type = $directions['items'][$i]['type'];
        $begVal = $directions['items'][$i]['beginBorder'];
        $endVal = $directions['items'][$i]['endBorder'];
        if($i == 0 && $ANDcheck == 1){
            $sql .= "($type BETWEEN $begVal AND $endVal)";
        }
        else{
            $sql .= " AND ($type BETWEEN $begVal AND $endVal)";
        }
    }

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $out = array();
        while ($row = $result->fetch_assoc()) {
            $out[$row["id"]] = $row;
        }
        echo json_encode($out);
    } else {
        echo "0 results";
    }
    $conn->close();
}
?>
