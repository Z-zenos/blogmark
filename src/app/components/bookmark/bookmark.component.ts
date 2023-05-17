import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  currentTab: any;

  constructor() { }

  async ngOnInit() {
    const data = await chrome.tabs.query({ active: true, currentWindow: true });
    [this.currentTab] = data;
  }

  /*
  * Add or remove the bookmark on the current page.
  */
  toggleBookmark(e: Event) {
    if (this.currentTab) {
      chrome.bookmarks.remove(this.currentTab?.id);
    } 
    else {
      chrome.bookmarks.create({
        title: this.currentTab?.title, 
        url: this.currentTab?.url
      });
    }
  }
}