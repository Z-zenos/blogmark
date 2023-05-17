import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'blogmark';
  // color = '#ffffff';

  ngOnInit(): void {
    // chrome.storage.sync.get('color', ({ color }) => {
    //   this.color = color;
    // });
  }
  // public colorize() {
  //   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //     chrome.scripting.executeScript({
  //       target: { tabId: tabs[0].id! },
  //       func: updateBackgroundColor,
  //       args: [this.color]
  //     });
  //   });
  // }

  // public updateColor(color: string) {
  //   chrome.storage.sync.set({ color});
  // }
}
