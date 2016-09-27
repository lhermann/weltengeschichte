<?php

/**
 * Get events and look if one is taking place
 */
$on_air = false;
$events = json_decode( file_get_contents('events.json') );
$conf = json_decode( file_get_contents('conf.json') );

if( $conf->live ) {
	$on_air = true;
} else {
	foreach ($events as $i => $event) {
		$now = time();
		$eventtime = strtotime($event->time);
		$ninety_min = 90 * 60;
		if( $eventtime < $now && ($eventtime + $ninety_min) > $now ) {
			$on_air = true;
			break;
		}
	}
}


/**
 * Send Headers to prevent caching
 */
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.


/**
 * Assemble HTML Page
 */
require('partial-head.html');

if( $on_air ) {
	require('partial-cover-live.html');
} else {
	require('partial-cover-teaser.html');
}

require('partial-body.html');
