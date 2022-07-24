import { Injectable } from '@angular/core';
import { setDoc, docData, Firestore, doc, collection } from '@angular/fire/firestore';
import { getDocs, query, where } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  createDoc(data: any, path: string, id: string) {
    return setDoc(doc(this.firestore, path, id), data);
  }

  getID() {
    return doc(collection(this.firestore, 'id')).id;
  }

  getDataIsUnic<type>(path: string, condition: string, value: string) {
    return query(collection(this.firestore, path), where(condition, "==", value));
  }

}
