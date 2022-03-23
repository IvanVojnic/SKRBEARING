<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\POP3;
use PHPMailer\PHPMailer\OAuth;
require 'phpMailer/src/Exception.php';
require 'phpMailer/src/PHPMailer.php';
require 'phpMailer/src/SMTP.php';
require 'phpMailer/src/OAuth.php';
require 'phpMailer/src/POP3.php';
require_once('phpMailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$name = $_POST['userName'];
$phone = $_POST['userTelNumber'];
$UserMail = $_POST['userEmail'];
$userMessage = $_POST['userMessage'];

$mail->isSMTP();
$mail->Host = 'smtp.mail.ru';
$mail->SMTPAuth = true;
$mail->Username = 'ivan_vojnic@mail.ru';
$mail->Password = '5UiACLjaT7CcRDey3EQv';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;

try {
    $mail->setFrom('ivan_vojnic@mail.ru');
} catch (Exception $e) {
    echo json_encode("error setForm");
}
try {
    $mail->addAddress('ivojnic44@gmail.com');
} catch (Exception $e) {
    echo json_encode("add address");
}

$mail->isHTML(true);                                  // Set email format to HTML
$mail->Subject = 'Заявка с тестового сайта';
if($_POST['action'] == "order"){
    $mail->Body = '' . $name . ' оставил заявку, его телефон ' . $phone . '<br>Почта этого пользователя: ' . $UserMail . ' <br>Сообщение пользователя: ' . $userMessage . '<br> Заказаные товары: ';
    $goods = json_decode($_POST['goodsList'],true);
    $itemsInCart = json_decode($_POST['itemsInOrder']);
    for($i = 0; $i < (integer)$itemsInCart; $i++)
    {
        $mail->Body .= '<br>Код подшипника ' . $goods[$i]['itemCode'];
        $mail->Body .= '<br>Количество выбранного товара ' . $goods[$i]['itemsCount'];
        $mail->Body .= '<br>ID товара ' . $goods[$i]['itemID'];
        $mail->Body .= '<br>';
    }

} else if($_POST['action'] == "message"){
    $mail->Body = '' . $name . ' оставил заявку, его телефон ' . $phone . '<br>Почта этого пользователя: ' . $UserMail . ' <br>Сообщение пользователя: ' . $userMessage;
}
$mail->AltBody = '';
try {
    if (!$mail->send()) {
        echo json_encode("Error");
    } else {
        echo json_encode("Сообщение отправлено");
    }
} catch (Exception $e) {
    echo json_encode("global Error");
}
?>