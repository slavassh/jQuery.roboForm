<?php

//User tracking
if (!empty($_SERVER['HTTP_REFERER'])) {
        setcookie("http_referer", $_SERVER['HTTP_REFERER']);
}

if (!empty($_GET['utm_source'])) {
        setcookie("utm_source", $_GET['utm_source']);
}

if (!empty($_GET['utm_medium'])) {
        setcookie("utm_medium", $_GET['utm_medium']);
}

if (!empty($_GET['utm_term'])) {
        setcookie("utm_term", $_GET['utm_term']);
}

if (!empty($_GET['utm_content'])) {
        setcookie("utm_content", $_GET['utm_content']);
}

if (!empty($_GET['utm_campaign'])) {
        setcookie("utm_campaign", $_GET['utm_campaign']);
}

if (!empty($_GET['utm_pic'])) {
        setcookie("utm_pic", $_GET['utm_pic']);
}
?>

<!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="UTF-8">
	<title></title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script type="text/javascript" src="jQuery.roboForm.min.js"></script>
	<link rel="stylesheet" href="style.css"/>

	<script type="text/javascript">
		$(function(){

			$.roboForm()

			$('.roboForm')
					.on('roboForm.valid.false', function(){
						$('.status').html('Not valid')
					})
					.on('roboForm.valid.true', function () {
						$('.status').html('Valid!')
					})
		})
	</script>
</head>
<body>
<div class="status"></div>
<form class="roboForm" action="test.php" method="post">
	<label>E-mail</label><br/>
	<input data-roborules="email required" type="email" name="email" />
	<div class="roboForm_error"></div>
	<br /><br/>

	<label>Phone</label><br/>
	<input data-roborules="phone" type="tel" name=""/>
	<br /><br/>

	<label>Not empty</label><br/>
	<input data-roborules="required" data-robomessage="Поле не может быть пустым" type="text" name=""/>
	<br /><br/>

	<label>Integer only</label><br/>
	<input data-roborules="integer" type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Integer only and float</label><br/>
	<input data-roborules="float" type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Cyrillic only</label><br/>
	<input data-roborules="cyrillic required" type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Symbol range - accurate</label><br/>
	<input data-roborules="range required" data-range="5" type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Symbol range - accurate or accurate etc</label><br/>
	<input data-roborules="range required" data-range="5|10" type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Symbol range - range</label><br/>
	<input data-roborules="range required" data-range="5-7" type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Match RegExp: 544 - 433 (true) 4544 (false)</label><br/>
	<input data-roborules="pattern" data-robopattern='^[\d\-\s]{4,}\d$' type="text" name=""/>
	<div class="roboForm_error"></div>
	<br/><br/>

	<label>Not empty</label><br/>
	<textarea data-roborules="required" name="" cols="30" rows="2"></textarea>
	<div class="roboForm_error"></div>
	<br/><br/>

	<input class="roboForm_send" type="submit" value="SEND"/>
</form>

</body>
</html>
