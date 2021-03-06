<?php

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        /**
          * Get the form fields and remove whitespace.
          */
        $receiver = $_POST["receiver"] == 'fragen' ? 'fragen' : 'feedback';
        $name = strip_tags(trim($_POST["name"]));
        $name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);
        $captcha = $_POST["g-recaptcha-response"];

        /**
         * Validate Captcha
         */
        $secret = '6LfaTAcUAAAAAE1w3K_rUJj4SVkeX-yXbG3yF7FI';
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . $secret . "=&response=" . rawurlencode($captcha) . "&remoteip=" . rawurlencode($_SERVER['REMOTE_ADDR']));

        if ($response === FALSE) {
            $captcha_success = false;
        } else {
            $captcha_response = json_decode($response);
            $captcha_success = $captcha_response->success ? true : false;
        }

        /**
          * Check that data was sent to the mailer.
          */
        if ( empty($name)
            OR empty($message)
            OR !filter_var($email, FILTER_VALIDATE_EMAIL)
            OR !$captcha_success
            ) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Oops! There was a problem with your submission. Please complete the form and try again.";
            // print_r($response);
            // print_r($captcha_response);
            exit;
        }



        // Set the recipient email address.
        $recipient = $receiver . '@weltengeschichte.de';

        // Set the email subject.
        $subject = ucfirst( $receiver ) . " von $name";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From: Weltengeschichte <" . $receiver . "@weltengeschichte.de>";
        $email_headers .= "\r\n" ."Reply-To: " . $email;

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your message has been sent to " . $receiver . "@weltengeschichte.de";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>
