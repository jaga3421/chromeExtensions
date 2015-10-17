<?php
$url = $_GET["url"];
$to = $_GET["email"];
$subject = "eMailing URL";

$message = "
<html>
<head>
<title>HTML email</title>
</head>
<body>
<p>Hi, I am sharing url to you</p>
".$_GET["url"]."
<br>
".$_GET["text"]."
</body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <urlSharing@sharing.com>' . "\r\n";

mail($to,$subject,$message,$headers);
?>

<p>Url shared to the email</p> <?php echo $_GET['email'] ?>