function getMessages() {
	var conversations = document.querySelectorAll('[id^="zli__CLV-main__"]');
	var messages = document.getElementsByClassName('Conv2MsgHeader');
	if (messages.length === 0) {
		//returns the messages from the first available conversation for testing purposes
		var firstConversation = conversations[0];
		firstConversation.click();
		var messages = document.getElementsByClassName('Conv2MsgHeader');
	}

	return messages;
}

/*

function getMessages(conversationId) {
	var conversations = document.querySelectorAll('[id^="zli__CLV-main__"]');
	var messages = document.getElementsByClassName('Conv2MsgHeader');
	if (messages.length == 0) {
		//returns the messages from the first available conversation for testing purposes
		firstConversation = conversations[0];
		firstConversation.click();
		var messages = document.getElementsByClassName('Conv2MsgHeader');
	}

	return messages;
}

*/

function fetchMessageHTML(messageUrl) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', messageUrl, false);
	xhr.send();
	var doc = xhr.responseText;
	var parser = new DOMParser();
	var mailPage = parser.parseFromString(doc, 'text/html');

	//remove JavaScript that starts print browser dialog
	var printDialog = mailPage.getElementsByTagName('script')[4];
	printDialog.parentNode.removeChild(printDialog);

	return mailPage;
}

function downloadMessage(messageHTML, filename) {
	var uriContent = 'data:application/octet-stream;filename=' + filename + '.html,' + encodeURIComponent('<!DOCTYPE html><html><head>' + messageHTML.head.innerHTML + '</head>' + '<body>' + messageHTML.body.innerHTML + '</body></html>');
	var a = document.createElement('a');
	a.download = filename + '.html';
	a.href = uriContent;
	a.style.display = 'hidden';
	document.body.appendChild(a);
	a.click();
	a.parentNode.removeChild(a);
}

function getFileName(messageHTML) {
	var messageTimes = messageHTML.querySelectorAll('[id^="messageDisplayTime"]');
	var messageTime = '';

	if (messageTimes)
		var messageTime = messageTimes[0];

	if (!messageTime)
		return;

	return messageTime.innerText.replace(/\s/g, '-').replace(/,/g, '').replace(/:/, '');
}

function generateURL(messageID) {
	var url = 'https://webmail.unseen.is/h/printmessage?id=' + messageID + '&tz=Europe/Athens';
	return url;
}

function getMessageIDs(messages) {
	var messageIDs = [];

	for (var i = 0; i <= messages.length; i++) {
		if (typeof messages[i].id !== 'undefined')
			continue;

		var rawID = messages[i].id;
		var msgID = rawID.match('[0-9]{3}')[0];
		messageIDs.push(msgID);
		console.log(typeof messages[i].id);

	}

	//sample id: main_MSGC918__header
	return messageIDs;
}

function main() {
	var messageList = getMessages();
	var messageIDs = getMessageIDs(messageList);

	var messageURLs = [];
	for (var msg in messageIDs) {
		var url = generateURL(messageIDs[msg]);
		console.log(url);
		messageURLs.push(url);
	}

	var messageCount = messageURLs.length;

	for (var id in messageURLs) {
		var messageHTML = fetchMessageHTML(messageURLs[id]);
		var fileName = getFileName(messageHTML);
		console.log(fileName);
		//http://stackoverflow.com/questions/7749090/how-to-use-setinterval-function-within-for-loop
		//setInterval('downloadMessage(messageHTML, fileName)', 1500);
	}

	/*
	var id = 0;

	setInterval(function() {
		if (id <= messageCount) {
			var messageHTML = fetchMessageHTML(messageURLs[id]);
			var fileName = getFileName(messageHTML);
			//downloadMessage(messageHTML, fileName);
			console.log(fileName);
			id += 1;
		} else return;
	}, 1500);
	*/

}

var URL = 'http://webmail.unseen.is';

function getSoAPIUrl() {
	return getWebMailURL() + '/service/soap/';
}

function getWebMailURL() {
	return URL;
}
