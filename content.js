const TRELLO_APP_KEY = '0b15414357140fe88faecea94f0a22b1';
const TRELLO_BOARD_ID = '57a481755ab2c09495ba5c3b'; // TODO: allow user to select
const img = chrome.extension.getURL('icon.png');

const isReminder = (node) =>
  node.nodeName === 'DIV' &&
  /^qs\-thread\-a\-r/.test(node.getAttribute('data-item-id-qs') || '');

var showOptions = () => console.warn('showOptions is not ready yet...');

// Trello API helpers

function authorizeTrello(authenticationSuccess, authenticationFailure) {
  Trello.authorize({
    type: 'popup',
    name: 'Inbox Reminders to Trello',
    scope: {
      read: 'true',
      write: 'true' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
}

function fetchChecklists(boardId, callback) {
  const url = `boards/${boardId}/checklists`; //'members/me/boards'
  const options = {
    cards: 'all',
    card_fields: 'name,shortUrl',
  };
  Trello.rest('GET', url, options, callback, callback);
}

InboxSDK.loadScript('https://api.trello.com/1/client.js?key=' + TRELLO_APP_KEY);

// Main UI: move a reminder to Trello

InboxSDK.load('2', 'sdk_inbox-to-trello_97faaf3ffb').then(function(sdk){
  showOptions = function(reminderName) {
    const el = document.createElement('ul');
    el.appendChild(document.createTextNode('title: ' + reminderName));
    const btn = document.createElement('button');
    btn.appendChild(document.createTextNode('load checklists from trello'));

    function fetchAndAppendChecklists() {
      authorizeTrello(function() {
        console.log('trello is connected!');
        fetchChecklists(TRELLO_BOARD_ID, function(res) {
          if (!res.length) {
            console.error(res);
          } else {
            el.removeChild(el.getElementsByTagName('button')[0]);
            res.forEach((checklist) => {
              const li = document.createElement('li');
              li.appendChild(document.createTextNode(checklist.cards[0].name + ' - ' + checklist.name));
              el.appendChild(li);
            })
          }
        });
      }, console.error)
    }

    fetchAndAppendChecklists();

    btn.onclick = fetchAndAppendChecklists;
    el.appendChild(btn);
    sdk.Widgets.showModalView({
      el,
      title: 'Move Reminder to Trello Card',
    });
  };
});

// Add Trello button to all reminders from Google Inbox UI

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
    newLi.innerHTML = `<img src="${img}" alt="add to trello">`;
    newLi.title = 'Add to a Trello checklist';
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
