import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  currentTab: any;
  currentBookmark: any;
  bookmarkFolderList: any[] = [
    {
      title: "Favorites bar",
      id: "1"
    }
  ];

  selectedFolderId: any;

  constructor() { }

  async ngOnInit() {
    const tabData = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabData.length ? tabData[0] : undefined;
    
    const bookmarkData = await chrome.bookmarks.search(this.currentTab.title);
    this.currentBookmark = bookmarkData.length ? bookmarkData[0] : undefined;

    const treeData = await chrome.bookmarks.getTree();
    // @ts-ignore
    const bookmarkTree: any = treeData[0]?.children[0]?.children;
    bookmarkTree.forEach((f: any) => {
      if(f.children) {
        this.bookmarkFolderList.push({
          title: f.title,
          id: f.id
        });

        for(let i = 0; i < f.children.length; i++) {
          if(f.children[i].children) {
            this.bookmarkFolderList.push({
              title: f.children[i].title,
              id: f.children[i].id
            });
          }
        }
      }
    });
  }

  /*
  * Add or remove the bookmark on the current page.
  */
  addBookmark() {
    chrome.bookmarks.create({
      parentId: this.selectedFolderId ? (this.selectedFolderId + "") : "1",
      title: this.currentTab?.title, 
      url: this.currentTab?.url
    });
    this.close();
  }

  removeBookmark() {
    chrome.bookmarks.remove(this.currentBookmark?.id);
    this.close();
  }

  close() { window.close(); }
}