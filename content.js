const img = chrome.extension.getURL('icon.png');

const isReminder = (node) =>
  node.nodeName === 'DIV' &&
  /^qs\-thread\-a\-r/.test(node.getAttribute('data-item-id-qs') || '');

var showOptions = () => console.warn('showOptions is not ready yet...');

InboxSDK.load('2', 'sdk_inbox-to-trello_97faaf3ffb').then(function(sdk){
  /*
  sdk.Conversations.registerMessageViewHandlerAll(function(view) {
    console.log('MessageViewHandlerAll', view);
  });
  sdk.Lists.registerThreadRowViewHandler(attachLinks);
  */
  showOptions = function(reminderName) {
    const el = document.createElement('div');
    el.innerHTML = reminderName;
    sdk.Widgets.showModalView({
      el,
      title: 'Move Reminder to Trello Card',
    });
  };
});

//document.querySelector('.scroll-list-section-body')
document.body.addEventListener('DOMSubtreeModified', function (ev) {
  if (isReminder(ev.target) && !ev.target.getElementsByClassName('aj-to-trello').length) {
    const node = ev.target;
    const title = node.getElementsByTagName('span')[1].innerHTML;
    //console.log('New Reminder:', title);
    const ul = node.getElementsByTagName('ul')[0];
    const firstLi = ul.getElementsByTagName('li')[0];
    const newLi = document.createElement('li');
    newLi.setAttribute('role', 'button');
    newLi.className = firstLi.className + ' aj-to-trello';
    newLi.innerHTML = `<img src="${img}" title="click!">`;
    newLi.onclick = function() {
      showOptions(title);
    };
    ul.insertBefore(newLi, firstLi);
  }
}, false);

/*
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    console.log(mutation.type);
    for (var i = 0; i < mutation.addedNodes.length; i++)
      //insertedNodes.push(mutation.addedNodes[i]);
      //if (isReminder(mutation.addedNodes[i])) {
        console.log('reminder:', mutation.addedNodes[i]);
      //}
  })
});
observer.observe(document.body, { attributes: true, childList: true });
*/
