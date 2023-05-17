import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  currentTab: any;
  currentBookmark: any;

  constructor() { }

  async ngOnInit() {
    const tabData = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabData.length ? tabData[0] : undefined;
    
    const bookmarkData = await chrome.bookmarks.search(this.currentTab.title);
    this.currentBookmark = bookmarkData.length ? bookmarkData[0] : undefined;
  }

  /*
  * Add or remove the bookmark on the current page.
  */
  async addBookmark() {
    await chrome.bookmarks.create({
      title: this.currentTab?.title, 
      url: this.currentTab?.url
    });
  }

  async removeBookmark() {
    await chrome.bookmarks.remove(this.currentBookmark?.id);
  }

  close() { window.close(); }
}