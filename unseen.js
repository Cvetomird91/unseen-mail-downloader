function getMessages() {
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

function fetchMessageHTML(messageUrl) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', messageUrl, false);
	xhr.send();
	doc = xhr.responseText;
	parser = new DOMParser();
	mailPage = parser.parseFromString(doc, 'text/html');

	//remove JavaScript that starts print browser dialog
	printDialog = mailPage.getElementsByTagName('script')[4];
	printDialog.parentNode.removeChild(printDialog);

	return mailPage;
}

function downloadMessage(messageHTML, filename) {
	uriContent = 'data:application/octet-stream;filename=' + filename + '.html,' + encodeURIComponent('<!DOCTYPE html><html><head>' + messageHTML.head.innerHTML + '</head>' + '<body>' + messageHTML.body.innerHTML + '</body></html>');
	a = document.createElement('a');
	a.download = filename + '.html';
	a.href = uriContent;
	a.style.display = 'hidden';
	document.body.appendChild(a);
	a.click();
	a.parentNode.removeChild(a);
}

function getFileName(messageHTML) {
	var messageTimes = messageHTML.querySelectorAll('[id^="messageDisplayTime"]');
	var messageTime = messageTimes[0];
	messageTime = messageTime.innerText;
	messageTime = messageTime.replace(/\s/g, '-');
	messageTime = messageTime.replace(/,/g, '');
	messageTime = messageTime.replace(/:/, '');
	return messageTime;
}

function generateURL(messageID) {
	var url = 'https://webmail.unseen.is/h/printmessage?id=' + messageID + '&tz=Europe/Athens';
	return url;
}

function getMessageIDs(messages) {
	messageIDs = [];
	for (var i in messages) {
		if (typeof messages[i].id !== 'undefined') {
			rawID = messages[i].id;
			messageIDs.push(rawID.match('[0-9]{3}')[0]);
		} else {
			continue;
		}
	}

	//sample id: main_MSGC918__header
	return messageIDs;
}

function main() {
	var messageList = getMessages();

	var messageIDs = getMessageIDs(messageList);

	messageURLs = [];
	for (var msg in messageIDs) {
		url = generateURL(messageIDs[msg]);
		console.log(url);
		messageURLs.push(url);
	}

	for (var id in messageURLs) {
		var messageHTML = fetchMessageHTML(messageURLs[id]);
		var fileName = getFileName(messageHTML);
		//downloadMessage(messageHTML, fileName);
	}

}

main();