/*
$('.Conv2MsgHeader').each(function(key, value) {
    element = $('.Conv2MsgHeader')[key];
    $(element).click();
    setTimeout(function(){console.log('ok')}, 10000);
});
*/

var url = 'https://webmail.unseen.is/h/printmessage?id=281&tz=Europe/Athens'

function fetchMessage(messageUrl) {

	xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.send();
	doc = xhr.responseText;
	parser = new DOMParser();
	mailPage = parser.parseFromString(doc, 'text/html');

	//remove JavaScript that starts print dialog
	printDialog = mailPage.getElementsByTagName('script')[4];
	printDialog.parentNode.removeChild(printDialog);

	return mailPage;

}

function downloadMessage(messageHTML, filename) {

	uriContent = "data:application/octet-stream;filename=" + filename + ".html," + encodeURIComponent(messageHTML.head + messageHTML.body);
	a = document.createElement('a');
	a.download = filename + '.html';
	a.href = uriContent;
	a.style.display = 'hidden';
	document.body.appendChild(a);
	a.click();
	a.parentNode.removeChild(a);

}

function getFileName(messageHTML) {
	messageTime = messageHTML.querySelector('[id^="messageDisplayTime"]');
	messageTime = messageTime.innerText;
	messageTime = messageTime.replace(/\s/g, '-');
	messageTime = messageTime.replace(/,/g, '');
	return messageTime;
}

function main() {
	messageHTML = fetchMessage(url);
	fileName = getFileName(messageHTML);
	downloadMessage(messageHTML, fileName);
}

main();
