import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$!: Observable<any | null>
  constructor(private auth: Auth, private firestore: Firestore) { }

  async login(user: any): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
    .then(response => {
      console.log(response.user);
      this.sendVerificationEmail(response.user)
      return this.updateUserData({
        uid: response.user.uid,
        email: response.user.email!
      })
    }).catch(e => e as string)
  }
  updateUserData(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email
    }
    return setDoc(userRef, data);
  }

  async sendVerificationEmail(user: any) {
    await sendEmailVerification(user);
  }
  sendVerification() {
    return this.auth.currentUser?.emailVerified;
  }   
}
