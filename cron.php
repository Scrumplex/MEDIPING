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
require_once __DIR__ . "/ping.inc.php";

$collectedDataFile = __DIR__ . "/collectedData.json";

if (!file_exists($collectedDataFile) || filesize($collectedDataFile) == 0) {
    $data = array();
} else {
    $fileObject = new SplFileObject($collectedDataFile, "r");
    $currentData = $fileObject->fread(filesize($collectedDataFile));
    $data = json_decode($currentData, true);
}
$fileObject = null;
$fileObject = new SplFileObject($collectedDataFile, "w");

foreach ($hosts as $host) {
    $entry = array(
        "timestamp" => time(),
        "time" => ping($host, 10)
    );
    if (!isset($data[$host]))
        $data[$host] = array();
    array_push($data[$host], $entry);
}

$fileObject->fwrite(json_encode($data));
$fileObject = null;
