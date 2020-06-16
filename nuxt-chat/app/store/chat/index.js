// 読み込み
import firebase from '~/plugins/firebase'
import { firestoreAction } from 'vuexfire'
// データベースの定義
const db = firebase.firestore()
const usersRef = db.collection('users')
// var user = firebase.auth().currentUser;
// stateを定義
export const state = () => ({
  users: [],
  currentUser: {
    // name: "",
    email: ""
  }
})
export const mutations = {
  setCurrentUser(state, user) {
    // state.currentUser.name = user.displayName
    state.currentUser.email = user.email
    // state.currentUser = user
  },
}

export const actions = {
  initUsers: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('users', usersRef)// stateのtodoと関連付けさせる
  }),
  signUp: firestoreAction((_, user) => {
    try {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      usersRef.add({
        name: user.name,
        email: user.email,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
    } catch {
      console.log("新規登録に失敗しました！");
    }
  }),
  async login({commit}, user){
    const result = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    commit('setCurrentUser', result.user)
  },
  async logout() {
    await firebase.auth().signOut()
  },
  setCurrentUser({commit}, user){
    commit("setCurrentUser", user)
  }
  
}