<?php
	header('Content-Type: text/html; charset=utf-8');
	 
	if (isset($_POST['name'])) { $name = $_POST['name'];}
	if (isset($_POST['phone'])) { $phone = $_POST['phone'];}

	//fallback email number
	$file = $_SERVER['DOCUMENT_ROOT'] . 'secret_mail.num';
	if(!file_exists($file)){ 
		$fh = fopen($file, "w");
		if($fh==false)
		  die("unable to create file");
		fputs ($fh, 1); 
	  	fclose ($fh);
	}   
	    
	//fallback email copy
	$log = $_SERVER['DOCUMENT_ROOT'] . 'secret_mail.log';
	if(!file_exists($log)){
		$fh = fopen($log, "w");
		  if($fh==false)
		      die("unable to create file");
		  fputs ($fh, 1);
		fclose ($fh);
	}           

	//Parsing marketing info
	if (isset ($_COOKIE['http_referer'])) {
		$tracking .= "Referer: ".$_COOKIE['http_referer']."<br/>\n";
	}

	if (!empty($_COOKIE['utm_source'])) {
		$tracking .= "UTM Source: ".$_COOKIE['utm_source']."<br/>\n";
	}

	if (!empty($_COOKIE['utm_medium'])) {
		$tracking .= "UTM Medium: ".$_COOKIE['utm_medium']."<br/>\n";
	}

	if (!empty($_COOKIE['utm_campaign'])) {
		$tracking .= "UTM Capmaign: ".$_COOKIE['utm_campaign']."<br/>\n";
	}

	if (!empty($_COOKIE['utm_content'])) {
		$tracking .= "UTM Content: ".$_COOKIE['utm_content']."<br/>\n";
	}

	if (!empty($_COOKIE['utm_pic'])) {
		$tracking .= "UTM Pic: ".$_COOKIE['utm_pic']."<br/>\n";
	}


	if ($name) {trim($name);} else { $name = ""; }
	if ($phone) {trim($phone);} else { $phone = ""; }
	
	$mail = "user@example.com";
    
    $title_mass  = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=\"utf-8\"\r\n";
    $title_mass  .= "From: Some Page <no-reply@example.com>"; 
    $email = ( isset($_POST['email'])? $_POST['email']:'' ); 
    $title = "Your email title";
	$message = "\nName: ".$name."\nPhone/Email: ".$phone ."/  ".$email."\n";
	$message .= "\nTracking Info:\n".$tracking;			

	if (mail($mail,$title,$message, $title_mass) )    {	

	      $handle = fopen($file, "w");
	      $mailNum += 1;
	      $mailNum = fwrite($handle, $mailNum);
	      fclose($handle);

	      $text_mail_log = "$subject \r\n $message\r\n$_SERVER[HTTP_HOST]\r\n\r\n";
	      $log_fail = fopen($log, "a");
	      fwrite($log_fail, $text_mail_log);
	      fclose($log_fail);

	      echo json_encode(array('success' => 'Success!'));
	     
	      } 
	    
			
	else {
	 	echo json_encode(array('error' => 'Mail was not sent'));
	}

?>



