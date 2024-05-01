# Primo New Books by Subject Carousel

## Edit new-books-by-subject-carousel.js

At the top of this script are two constants, permalink\_root and api\_connection.

Assign permalink\_root your Primo permalink string (example: https://onesearch.uark.edu/permalink/01UARK_INST/573n21/) -- be sure to include final slash.

Assign api_connection the URL of the api-connection.php script.


## Edit api-connection.php
 
At the top of this script is a set of empty variables. You'll get all of the values from your Primo search API URL.

Example URL:

```
https://api-na.hosted.exlibrisgroup.com/primo/v1/search?vid=01UARK_INST:01UARK&tab=COMBINED&scope=MyInst_and_CI&apikey=****************
```

## HTML

Place the carousel on a page with a div constructed thusly:

```
<div id="new-books-gallery" data-heading="New Acquisitions in Journalism" data-headinglevel="h2" data-subject="journalism" data-include-months="3"></div>
```

The id should remain new-books-gallery, unless you edit the reference in the javascript. data-include-months is the number of months before today from which you wish to pull data.

After the div, reference new-books-by-subject-carousel.js. (The script must be called after the div.)


## CORS errors


If using the carousel cross-domain, you'll likely get a CORS error. At the top of api-connection.php is a commented block of code you can use to provide an Access-Control-Allow-Origin header.


**Note that this carousel only includes books for which there are book covers.**
