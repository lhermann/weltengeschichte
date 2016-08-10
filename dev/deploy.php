<?php
    // Use in the "Post-Receive URLs" section of your GitHub repo.
    if ( $_POST['payload'] ) {
        file_put_contents('log/payload.txt', print_r($_POST['payload'], FILE_APPEND);

        $exec_string = 'cd /var/customers/webs/jmm/weltengeschichte.de.repo/ && git reset --hard HEAD && git pull';
        exec ( $exec_string, $output);
        file_put_contents('log/output.txt', $output, FILE_APPEND);
    }

    file_put_contents('log/post.txt', print_r($_POST), FILE_APPEND);
?>
