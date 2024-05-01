/*
Usage:

<div id="new-books-gallery" data-heading="New Acquisitions in Journalism" data-headinglevel="h2" data-subject="journalism" data-include-months="3"></div>
followed by reference to this script

*/

const permalink_root = ""; // Permalink string (example: https://onesearch.uark.edu/permalink/01UARK_INST/573n21/) -- be sure to include final slash

const api_connection = ""; // URL of api-connection.php on your web server

//----------------------

const newbooksgallery = document.getElementById('new-books-gallery');

if (permalink_root === '') {
  newbooksgallery.innerHTML = '<p><strong>Please define permalink variable at the top of your javascript file.</strong></p>';
  throw new Error();
}

if (api_connection === '') {
  newbooksgallery.innerHTML = '<p><strong>Please define permalink variable at the top of your javascript file.</strong></p>';
  throw new Error();
}

const subject = newbooksgallery.dataset.subject;

const monthsincluded = newbooksgallery.dataset.includemonths;

const style = document.createElement('style');

style.textContent = `
#new-books-gallery {
    display: flex;
    height: 430px;
  }
  #new-books-gallery #books-container {
    margin-top: 30px;
    text-align: center;
    min-height: 300px;
    width: 100%;
    position: relative;
  }
  
  #new-books-gallery .throbber {
    position: absolute;
    top: 210px;
    height: 4px;
    left: 30%;
    right: 30%;
    background-color: #999;
    overflow: hidden;
    border: 1px solid #333;
    --throb: 90%;
  }

  #new-books-gallery .throbber:after {
    content: '';  
    height: 4px;
    background: #333;
    position: absolute;
    top: 0;
    left: 0;
    right: var(--throb);
  }

  #new-books-gallery #books {
    display: flex;
    perspective: 1200px;
    transform-style: preserve-3d;  
    transform: translate3d(-30px, 0px, 0px);
  }
  #new-books-gallery #books div {
    flex: 0 0 16%;
    transform-style: preserve-3d;
    text-align: left;
    transition-property: transform, flex;
    display: none;
    transition-duration: 300ms;
  }
  #new-books-gallery #books div.left4, #books div.right4 {
    display: block;
    flex: 0 0 1%;
  }
  #new-books-gallery #books div.left4 img, #new-books-gallery #books div.right4 img, #new-books-gallery #books div p {
    display: none;
  }
  #new-books-gallery #books div.left3 {
    transform: translate3d(0px, 0px, -300px) rotateX(0deg) rotateY(90deg) scale(1);
    z-index: 0;
    display: block;
    flex: 0 0 10%;
  }
  #new-books-gallery #books div.left2 {
    transform: translate3d(0px, 0px, -118px) rotateX(0deg) rotateY(75deg) scale(1);
    z-index: 1;
    display: block;
  }
  #new-books-gallery #books div.left1 {
    transform: rotateX(0deg) rotateY(40deg) scale(1);
    z-index: 2;
    display: block;
  }
  #new-books-gallery #books div.center {
    z-index: 3;
    display: block;
    flex: 0 0 20%;
  }
  #new-books-gallery #books div p {
    text-align: center;
    font-weight: bold;
    font-family: lato, helvetica, sans-serif;
    font-size: 20px;
    line-height: 1.5em;
    margin-top: 10px;
    max-height: 92px;
    overflow: hidden;
  }
  #new-books-gallery #books div.center p {
    display: block;
    position: absolute;
    left: var(--p-offset);
    background: rgba(255,255,255,0.8);
    width: var(--p-width);
  }
  #new-books-gallery #books div.right1 {
    transform: rotateX(0deg) rotateY(-40deg) scale(1);
    z-index: 2;
    display: block;
  }
  #new-books-gallery #books div.right2 {
    transform: translate3d(0px, 0px, -118px) rotateX(0deg) rotateY(-75deg) scale(1);
    z-index: 1;
    display: block;
  }
  #new-books-gallery #books div.right3 {
    transform: translate3d(0px, 0px, -300px) rotateX(0deg) rotateY(-90deg) scale(1);
    z-index: 0;
    display: block;
    flex: 0 0 10%;
  }
  #new-books-gallery #books img {
    max-width: 100%;
    max-height: 300px;
  }
  #new-books-gallery #books div.right3 img, #books div.left3 img {
    opacity: .5;
    filter: blur(1px);
  }
  #new-books-gallery #books a {
    color: #333;
    text-decoration: none;
  }
  #new-books-gallery #books a:hover {
    color: #a00;
    text-decoration: underline;
  }
  #new-books-gallery #left-scroll, #new-books-gallery #right-scroll {
    flex-grow: 1;
    position: relative;
  }
  #new-books-gallery svg {
    position: absolute;
    top: 150px;
    z-index: 200;
    width: 46px;
    color: #333;
    overflow: visible;
    max-width: none;
  }
  #new-books-gallery svg:hover {
    cursor: pointer
  }
  #new-books-gallery #left-scroll svg {
    right: -60px;
  }
  #new-books-gallery #right-scroll svg {
    left: -60px;
  }
`;

document.head.appendChild(style);

if (newbooksgallery.dataset.heading !== '' && typeof newbooksgallery.dataset.heading !== 'undefined') {
  const headinglevel = newbooksgallery.dataset.headinglevel !== '' && typeof newbooksgallery.dataset.headinglevel !== 'undefined' ? newbooksgallery.dataset.headinglevel : 'h3';
  const heading = document.createElement(headinglevel);
  heading.textContent = newbooksgallery.dataset.heading;
  newbooksgallery.insertAdjacentElement("beforebegin", heading);
}

const leftscroll = document.createElement('div');
leftscroll.setAttribute('id', 'left-scroll');
leftscroll.setAttribute('aria-label', 'next book');
leftscroll.innerHTML = '<svg tabindex="0" xmlns="http://www.w3.org/2000/svg"  fill="currentColor" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM217.4 376.9L117.5 269.8c-3.5-3.8-5.5-8.7-5.5-13.8s2-10.1 5.5-13.8l99.9-107.1c4.2-4.5 10.1-7.1 16.3-7.1c12.3 0 22.3 10 22.3 22.3l0 57.7 96 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32l-96 0 0 57.7c0 12.3-10 22.3-22.3 22.3c-6.2 0-12.1-2.6-16.3-7.1z"/></svg>';

const bookscontainer = document.createElement('div');
bookscontainer.setAttribute('id', 'books-container');

const rightscroll = document.createElement('div');
rightscroll.setAttribute('id', 'right-scroll');
rightscroll.setAttribute('aria-label', 'previous book');
rightscroll.innerHTML = '<svg tabindex="0" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM294.6 135.1l99.9 107.1c3.5 3.8 5.5 8.7 5.5 13.8s-2 10.1-5.5 13.8L294.6 376.9c-4.2 4.5-10.1 7.1-16.3 7.1C266 384 256 374 256 361.7l0-57.7-96 0c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l96 0 0-57.7c0-12.3 10-22.3 22.3-22.3c6.2 0 12.1 2.6 16.3 7.1z"/></svg>';
newbooksgallery.append(leftscroll, bookscontainer, rightscroll);

const throbber = document.createElement('div');
throbber.setAttribute('class', 'throbber');
bookscontainer.append(throbber);

const booksdiv = document.createElement('div');
booksdiv.setAttribute('id', 'books');
bookscontainer.append(booksdiv);
booksdiv.style.setProperty('--p-width', booksdiv.offsetWidth * .3 + 'px');
booksdiv.style.setProperty('--p-offset', (booksdiv.offsetWidth * .15 - 80) * -1 + 'px');

const left1holder = document.createElement('div');
left1holder.classList.add('left1');
const left2holder  = document.createElement('div');
left2holder.classList.add('left2');
const left3holder  = document.createElement('div');
left3holder.classList.add('left3');
const left4holder  = document.createElement('div');
left4holder.classList.add('left4');

booksdiv.append(left4holder, left3holder, left2holder, left1holder);

const titles = [];

getnewbooks()
  .then(data => {
  
    if (data.docs.length === 0) {
      console.log('no results')
    }

    const htmlstring = ''; 
    var hits = 0;
    var misses = 0;

    data.docs.forEach((doc, index) => {

    if( typeof doc.pnx.addata.isbn !== 'undefined' && !titles.includes(doc.pnx.display.title[0]) ){
      let bookdiv = document.createElement('div');
      checkimage('https://syndetics.com/index.php?client=primo&isbn=' + doc.pnx.addata.isbn[0] + '/lc.jpg')
        .then(
          (imgurl) => {
            bookdiv.innerHTML = '<a href="' + permalink_root + doc.pnx.control.recordid[0] + '" aria-hidden="true"><img src="' + imgurl + '" alt=""></a>';
            bookdiv.innerHTML += '<p><a href="' + permalink_root + doc.pnx.control.recordid[0] + '">' + doc.pnx.display.title[0] + '</a></p>';
            booksdiv.appendChild(bookdiv);
            bookdiv = null; // prevent other isbn matches from making a div --  assumes ISBNs at the top of the list are more likely correct
            hits++;
            throbber.style.setProperty('--throb', data.docs.length * 3 - hits * 3 - 4 + '%'); //lol
            if (hits + misses === data.docs.length) {
                init()
            }
          }
        )
        .catch(() => {
          hits++;
          if (hits + misses === data.docs.length) {
            init()
          }
        });
  } else {
        misses++
        
        if (misses === data.docs.length) {
            console.log('no matching book jackets')
        } else if (hits + misses === data.docs.length) {
          init()
        }
      }
      
    titles.push(doc.pnx.display.title[0]);

    })
  });

async function getnewbooks() {
  const response = await fetch(api_connection + '?subject=' + subject + '&from=' + monthsincluded);
  return response.json();
}

async function checkimage(imageurl) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = function () {
        resolve(imageurl);
    };
    img.onerror = function () {
        reject();
    };
    img.src = imageurl;
  });
}

function init() {

  throbber.remove();

  const leftscroll =  document.getElementById('left-scroll');
  const rightscroll =  document.getElementById('right-scroll');

  booksdiv.getElementsByClassName('left1')[0].nextElementSibling.classList.add('center');
  
  if(booksdiv.getElementsByClassName('center')[0].nextElementSibling !== null) {
    booksdiv.getElementsByClassName('center')[0].nextElementSibling.classList.add('right1');
  }
  
  if(booksdiv.getElementsByClassName('right1').length !== 0 && booksdiv.getElementsByClassName('right1')[0].nextElementSibling !== null) {
    booksdiv.getElementsByClassName('right1')[0].nextElementSibling.classList.add('right2');
  }
  
  if(booksdiv.getElementsByClassName('right2').length !== 0 && booksdiv.getElementsByClassName('right2')[0].nextElementSibling !== null) {
    booksdiv.getElementsByClassName('right2')[0].nextElementSibling.classList.add('right3');
  }
  
  if(booksdiv.getElementsByClassName('right3').length !== 0 && booksdiv.getElementsByClassName('right3')[0].nextElementSibling !== null) {
    booksdiv.getElementsByClassName('right3')[0].nextElementSibling.classList.add('right4');
  }

  rightscroll.addEventListener('click', (e) => {
    scrollRight()
  });
  
  rightscroll.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
      scrollRight()
    }
  });
  
  leftscroll.addEventListener('click', (e) => {
    scrollLeft()
  });

  leftscroll.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
      scrollLeft()
    }
  });
  
  let touchstart = null;
 
  booksdiv.addEventListener('touchstart', (e) => {
    touchstart = e.changedTouches[0].pageX;
  });

  booksdiv.addEventListener('touchend', (e) => {
    if(touchstart > e.changedTouches[0].pageX){
      scrollRight()
    } else if (touchstart < e.changedTouches[0].pageX) {
      scrollLeft()
    }
  });

}

function scrollLeft() {
    if (booksdiv.getElementsByClassName('left1')[0].children.length !== 0) {
      let left1 = booksdiv.getElementsByClassName('left1').length !== 0 ? booksdiv.getElementsByClassName('left1') : '';
      let left2 = booksdiv.getElementsByClassName('left2').length !== 0 ? booksdiv.getElementsByClassName('left2') : '';
      let left3 = booksdiv.getElementsByClassName('left3').length !== 0 ? booksdiv.getElementsByClassName('left3') : '';
      let left4 = booksdiv.getElementsByClassName('left4').length !== 0 ? booksdiv.getElementsByClassName('left4') : '';
      let center = booksdiv.getElementsByClassName('center');
      let right1 = booksdiv.getElementsByClassName('right1').length !== 0 ? booksdiv.getElementsByClassName('right1') : '';
      let right2 = booksdiv.getElementsByClassName('right2').length !== 0 ? booksdiv.getElementsByClassName('right2') : '';
      let right3 = booksdiv.getElementsByClassName('right3').length !== 0 ? booksdiv.getElementsByClassName('right3') : '';
      let right4 = booksdiv.getElementsByClassName('right4').length !== 0 ? booksdiv.getElementsByClassName('right4') : '';
      if (right4 !== '') {
        right4[0].classList.remove('right4');
      }
      if (right3 !== '') {
        right3[0].classList.replace('right3', 'right4');
      }
      if (right2 !== '') {
        right2[0].classList.replace('right2', 'right3');
      }
      if (right1 !== '') {
        right1[0].classList.replace('right1', 'right2');
      }
      center[0].classList.replace('center', 'right1');
      if (left1 !== '') {
        left1[0].classList.replace('left1', 'center');
      }
      if (left2 !== '') {
        left2[0].classList.replace('left2', 'left1');
      }
      if (left3 !== '') {
        left3[0].classList.replace('left3', 'left2');
      }
      if (left4 !== '') {
        left4[0].classList.replace('left4', 'left3');
        if(left3[0].previousElementSibling !== null) {
          left3[0].previousElementSibling.classList.add('left4'); 
        }
      }
    }
}


function scrollRight() {
      if(booksdiv.getElementsByClassName('center')[0].nextElementSibling !== null) {
      let left1 = booksdiv.getElementsByClassName('left1').length !== 0 ? booksdiv.getElementsByClassName('left1') : '';
      let left2 = booksdiv.getElementsByClassName('left2').length !== 0 ? booksdiv.getElementsByClassName('left2') : '';
      let left3 = booksdiv.getElementsByClassName('left3').length !== 0 ? booksdiv.getElementsByClassName('left3') : '';
      let left4 = booksdiv.getElementsByClassName('left4').length !== 0 ? booksdiv.getElementsByClassName('left4') : '';
      let center = booksdiv.getElementsByClassName('center');
      let right1 = booksdiv.getElementsByClassName('right1').length !== 0 ? booksdiv.getElementsByClassName('right1') : '';
      let right2 = booksdiv.getElementsByClassName('right2').length !== 0 ? booksdiv.getElementsByClassName('right2') : '';
      let right3 = booksdiv.getElementsByClassName('right3').length !== 0 ? booksdiv.getElementsByClassName('right3') : '';
      let right4 = booksdiv.getElementsByClassName('right4').length !== 0 ? booksdiv.getElementsByClassName('right4') : '';
      if (left4 !== '') {
        left4[0].classList.remove('left4');
      }
      if (left3 !== '') {
        left3[0].classList.replace('left3', 'left4');
      }
      if (left2 !== '') {
        left2[0].classList.replace('left2', 'left3');
      }
      if (left1 !== '') {
        left1[0].classList.replace('left1', 'left2');
      }
      center[0].classList.replace('center', 'left1');
      if (right1 !== '') {
        right1[0].classList.replace('right1', 'center');
      }
      if (right2 !== '') {
        right2[0].classList.replace('right2', 'right1');
      }
      if (right3 !== '') {
        right3[0].classList.replace('right3', 'right2');
      }
      if (right4 !== '') {
        right4[0].classList.replace('right4', 'right3');
        if(right3[0].nextElementSibling !== null) {
          right3[0].nextElementSibling.classList.add('right4'); 
        }
      }
    }
}
