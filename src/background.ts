const browser = chrome;
let currentTab: any;
let currentBookmark: any;

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  browser.action.setIcon({
    path: currentBookmark ? {
      19: "assets/icons/bookmark-fill1x.png",
      38: "assets/icons/bookmark-fill2x.png"
    } : {
      19: "assets/icons/bookmark-empty1x.png",
      38: "assets/icons/bookmark-empty1x.png"
    },
    tabId: currentTab.id
  });

  browser.action.setTitle({
    // Screen readers can see the title
    title: currentBookmark ? 'Unbookmark it!' : 'Bookmark it!',
    tabId: currentTab.id
  }); 
}

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateActiveTab() {  
  function isSupportedProtocol(urlString: string) {
    let supportedProtocols = ["https:", "http:", "ftp:", "file:"];
    const url = new URL(urlString);
    url.href = urlString;
    
    // Get protocol of url by creating a tag and retieve protocol by protocol property of a.
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  function updateTab(tabs: any) {
    if (tabs[0]) {
      currentTab = tabs[0];
      if (isSupportedProtocol(currentTab.url)) {
        // Determines if the tab's URL is already bookmarked
        // Search bookmark by url
        let searching = browser.bookmarks.search({url: currentTab.url});
        searching.then((bookmarks) => {
          currentBookmark = bookmarks[0];
          updateIcon();
        });
      } else {
        console.log(`Bookmark it! does not support the '${currentTab.url}' URL.`)
      }
    }
  }

  // Get Tabs object for current tab
  let gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
}

// listen for bookmarks being created
browser.bookmarks.onCreated.addListener(updateActiveTab);

// listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(updateActiveTab);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();