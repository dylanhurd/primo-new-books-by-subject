<?php

// If you're using the carousel on a domain other than the one where this script runs, you'll likely get a CORS error. To fix this, uncomment the block below and replace "??" in the first line with the calling domain (example: https://uark.libapps.com)
/*
header('Access-Control-Allow-Origin: ??');
header('Access-Control-Allow-Methods: GET');
header("Access-Control-Allow-Headers: X-Requested-With");
*/

$subject = $_GET["subject"];
$from = $_GET["from"];
$fromdate = date("Ymd", strtotime("-" . $from . " months")) . "000000";

// Parameters from your Primo API URL
$vid = "";
$tab = "";
$scope = "";
$apikey = "";

$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api-na.hosted.exlibrisgroup.com/primo/v1/search?vid=" . $vid . "&tab=" . $tab . "&scope=" . $scope . "&q=sub,contains," . $subject . "&sort=date_d&apikey=" . $apikey . "&qInclude=facet_rtype,exact,books&limit=30&fromDate=" . $fromdate . "&sortby=date_d",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Accept: application/json',
    ': '
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;