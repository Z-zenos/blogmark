import { Injectable } from '@angular/core';
import { IBookmark } from '../models/bookmark.interface';
import {
  CollectionReference,
  DocumentData,
  collection,
} from '@firebase/firestore';
import { Firestore, addDoc, collectionData, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  
  private readonly _bookmarks: CollectionReference<DocumentData>;

  constructor(private readonly _firestore: Firestore) {
    this._bookmarks = collection(this._firestore, 'bookmarks');
  }

  async add(bookmark: IBookmark) {
    try {
      await addDoc(this._bookmarks, bookmark);
    } catch(err) {
      await addDoc(this._bookmarks, bookmark)
    }
  }

  remove(name: string) {
    const appQuery = query(this._bookmarks, where('name', '==', name));
    (collectionData(appQuery, {
      idField: 'id'
    }) as Observable<IBookmark[]>).subscribe(async (data: any) => {
      console.log("remove data: ", data);
      
      if(data[0]?.id) {
        const bookmarkDocRef = doc(this._firestore, `bookmarks/${data[0].id}`);
        deleteDoc(bookmarkDocRef).catch(() => deleteDoc(bookmarkDocRef));
      }
    });
  }
}
