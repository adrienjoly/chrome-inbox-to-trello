function attachLinks(messageView) {
  var url = 'https://mail.google.com/mail/#all/' + messageView.getMessageID();
  var threadView = messageView.getThreadView();
  var div = document.createElement('div');
  var link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.innerHTML = 'Permalink to this email';
  div.appendChild(link);
  var res = threadView.addSidebarContentPanel({
    el: div,
    title: 'Permalink: ' + url,
    iconUrl: chrome.extension.getURL('icon.png'),
  });
}

InboxSDK.load('2', 'sdk_inbox-to-trello_97faaf3ffb').then(function(sdk){
  sdk.Conversations.registerMessageViewHandler(attachLinks);
});
