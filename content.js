/*
InboxSDK.load('2', 'sdk_inbox-to-trello_97faaf3ffb').then(function(sdk){
  sdk.Conversations.registerMessageViewHandlerAll(function(view) {
    console.log('MessageViewHandlerAll', view);
  });
  sdk.Lists.registerThreadRowViewHandler(attachLinks);
});
*/

const isReminder = (node) =>
  node.nodeName === 'DIV' &&
  /^qs\-thread\-a\-r/.test(node.getAttribute('data-item-id-qs') || '');

//document.querySelector('.scroll-list-section-body')
document.body.addEventListener('DOMSubtreeModified', function (ev) {
  if (isReminder(ev.target) && !ev.target.getElementsByClassName('aj-to-trello').length) {
    //console.log('DOM', ev);
    const node = ev.target;
    const title = node.getElementsByTagName('span')[1].innerHTML;
    console.log('New Reminder:', title);
    const ul = node.getElementsByTagName('ul')[0];
    /*
    ul.innerHTML = `
      <li jstcache="1781" aria-disabled="false" aria-pressed="true" data-action-data="[null,[&quot;#thread-a:1ea13f984661e296/master&quot;,13]]" tabindex="0" jsaction="click:list.show_date_time_picker;mousedown:list.show_date_time_picker;mouseup:list.show_date_time_picker" title="COUCOU..." role="button" jsinstance="0" class="dU action actionIcon AK ew ds qt itemIconSnoozed ar" jsan="7.dU,t-eZ5y5M-z5wc,7.action,7.actionIcon,7.AK,7.ew,7.ds,7.qt,7.itemIconSnoozed,7.ar,0.aria-disabled,0.aria-pressed,0.data-action-data,0.tabindex,0.jsaction,0.title,0.role"><img srcset="//ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/ic_mark-upcoming_clr_24dp_r5_2x.png 2x" aria-hidden="true" jstcache="1555" src="//ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/1x/ic_mark-upcoming_clr_24dp_r5.png"></li>
    ` + ul.innerHTML;
    */
    const firstLi = ul.getElementsByTagName('li')[0];
    const newLi = document.createElement('li');
    newLi.className = firstLi.className + ' aj-to-trello';
    newLi.style.fontSize = '6px';
    newLi.innerHTML = 'Click me!'; // TODO: chrome.extension.getURL('icon.png'),
    newLi.onclick = function() {
      alert('clicked reminder: ' + title);
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
