<?php
    // Parse the json payload from github
    $json = file_get_contents('php://input');
    $obj = json_decode($json);

    // If there is a playload, deploy the website
    if ( $obj ) {
        // Log the payload
        file_put_contents('log/payload.txt', date("\n[d M Y H:i:s]\n").print_r($obj, true), FILE_APPEND);

        // perform the deploy
        $exec_string = 'cd /var/customers/webs/jmm/weltengeschichte.de.repo/ && git reset --hard HEAD && git pull && grunt deploy';
        exec ( $exec_string, $output);

        // Log the output
        file_put_contents('log/output.txt', date("\n[d M Y H:i:s]\n").print_r($output, true), FILE_APPEND);
    }
?>
