/**
 * Created by Nicu on 4/30/17.
 */
// import {Injectable} from "@angular/core";
// import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase/app';
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
@Injectable()
export class AF{

user: Observable<firebase.User>;
    constructor(public af: AngularFireAuth) {
        this.user = af.authState;
    }
    login() {
        return this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
    logout() {
        return this.af.auth.signOut();
    }
}
// export class AF {
//     constructor(public af: AngularFire) {}
//     /**
//      * Logs in the user
//      * @returns {firebase.Promise<FirebaseAuthState>}
//      */
//     loginWithGoogle() {
//         return this.af.auth.login({
//             provider: AuthProviders.Google,
//             method: AuthMethods.Popup,
//         });
//     }
//     /**
//      * Logs out the current user
//      */
//     logout() {
//         return this.af.auth.logout();
//     }
// }