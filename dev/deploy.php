<?php
    // Use in the "Post-Receive URLs" section of your GitHub repo.
    if ( $_POST['payload'] && false ) {
        file_put_contents('log/payload.txt', print_r($_POST['payload']), FILE_APPEND);

        $exec_string = 'cd /var/customers/webs/jmm/weltengeschichte.de.repo/ && git reset --hard HEAD && git pull';
        exec ( $exec_string, $output);
        file_put_contents('log/output.txt', $output, FILE_APPEND);
    }
    $json = file_get_contents('php://input');
    $obj = json_decode($json);
    print_r($obj);
    file_put_contents('log/post.txt', print_r($obj, true));
?>
