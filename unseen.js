
/*
$('.Conv2MsgHeader').each(function(key, value) {
    element = $('.Conv2MsgHeader')[key];
    $(element).click();
    setTimeout(function(){}, 10000);
});
*/

/* Save file in JS 
http://stackoverflow.com/questions/7717851/save-file-javascript-with-file-name
*/

url = 'https://webmail.unseen.is/h/printmessage?id=281&tz=Europe/Athens'
xhr = new XMLHttpRequest();
xhr.open('GET', url, false);
xhr.send();
xhr.responseText;
doc = xhr.responseText;
parser = new DOMParser();
mailPage = parser.parseFromString(doc, 'text/html');

//remove JavaScript that starts print dialog
printDialog = mailPage.getElementsByTagName('script')[4];
printDialog.parentNode.removeChild(printDialog);

//download file
//uriContent = "data:application/octet-stream;filename=filename.html," + encodeURIComponent(mailPage.head.innerHTML + mailPage.body.innerHTML);
//newWindow = window.open(uriContent, 'filename.html');

//blob
var blob = new Blob([mailPage.head.innerHTML + mailPage.body.innerHTML], {type: 'octet/stream'});

/*
var anchor = document.createElement('a');
document.body.appendChild(anchor);
anchor.style = 'display:none';
url = window.URL.createObjectUrl(blob);
anchor.download = 'mail-message.html';
anchor.click();
window.URL.revokeObjectURL(url);
*/