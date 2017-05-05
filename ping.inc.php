<?php
/*
   Copyright 2017 Sefa Eyeoglu

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
require_once __DIR__ . "/config.inc.php";

function ping(string $host, int $timeout = 1)
{
	global $icmpMode;
	if (!function_exists($icmpMode))
		return phpRawICMP($host, $timeout);
	return $icmpMode($host, $timeout);
}

function phpRawICMP(string $host, int $timeout)
{
	/* ICMP ping packet with a pre-calculated checksum */
	$packet = "\x08\x00\x7d\x4b\x00\x00\x00\x00PingHost";
	$socket = socket_create(AF_INET, SOCK_RAW, 1);
	socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO, array('sec' => $timeout, 'usec' => 0));
	socket_connect($socket, $host, null);

	$ts = microtime(true);
	socket_send($socket, $packet, strLen($packet), 0);
	if (socket_read($socket, 255))
		$result = microtime(true) - $ts;
	else
		$result = -1;
	socket_close($socket);

	return $result;
}

function unixICMP(string $host, int $timeout)
{
	$lastLine = exec("/bin/ping -W " . $timeout . " -c 1 -n " . $host);
	// should be something like "rtt min/avg/max/mdev = 4.653/4.653/4.653/0.000 ms"
	if (!$lastLine)
		return -1;

	$times = explode("=", $lastLine)[1]; // " 4.653/4.653/4.653/0.000 ms"
	$times = trim($times); // "4.653/4.653/4.653/0.000 ms"
	$time = (float)explode("/", $times)[0]; // "4.653" (milliseconds)
	$time = $time / 1000;
	return $time;
}
