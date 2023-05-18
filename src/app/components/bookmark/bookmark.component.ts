import { Component, OnInit } from '@angular/core';
import { BookmarkService } from 'src/app/services/bookmark.service';

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

  constructor(private _bookmarkService: BookmarkService) { }

  async ngOnInit() {
    const tabData = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabData.length ? tabData[0] : undefined;
    
    const bookmarkData = await chrome.bookmarks.search(this.currentTab.title);
    this.currentBookmark = bookmarkData.length ? bookmarkData[0] : undefined;

    const treeData = await chrome.bookmarks.getTree();
    // @ts-ignore
    const bookmarkTree: any = treeData[0]?.children[0]?.children;
    this.recusifyBookmarkFolder(bookmarkTree);
  }

  recusifyBookmarkFolder(folder: any) {
    folder.forEach((f: any) => {
      if(f.children) {
        this.bookmarkFolderList.push({
          title: f.title,
          id: f.id
        });

        this.recusifyBookmarkFolder(f.children);
      }
    });
  }

  /*
  * Add or remove the bookmark on the current page.
  */
  async addBookmark() {
    await chrome.bookmarks.create({
      parentId: this.selectedFolderId ? (this.selectedFolderId + "") : "1",
      title: this.currentTab?.title, 
      url: this.currentTab?.url
    });

    await this._bookmarkService.add({
      name: this.currentTab?.title,
      url: this.currentTab?.url,
      location: this.bookmarkFolderList.find(f => f.id === this.selectedFolderId)?.title ?? 'Favorites bar',
      favicon: this.currentTab?.favIconUrl
    });

    this.close();
  }

  async removeBookmark() {
    await chrome.bookmarks.remove(this.currentBookmark?.id).then((res) => {
      this._bookmarkService.remove(this.currentTab?.title);
    });
    this.close();
  }

  close() { window.close(); }
}