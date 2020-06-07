// 学習用のサンプルコード
import firebase from '~/plugins/firebase'
const db = firebase.firestore();
const usersRef = db.collection('users');
// console.log(usersRef)

var messageRef = db.collection('rooms').doc('roomA')
  .collection('messages');
messageRef.add({
  name: "Tokyo",
  country: "Jan"
})

// for (let i = 0; i < 1800; i++) {
//   messageRef.add({
//     id: i,
//     name: 'hoge',
//   });
// }

//firebaseのサイトにあるコード（少し改修）
const deleteCollection = (db, collectionRef, batchSize) => {
    const query = collectionRef.orderBy('__name__').limit(batchSize);
    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

//削除のメインコード
const deleteQueryBatch = (db, query, batchSize, resolve, reject) => {
    query.get()
        .then((snapshot) => {
             //検索結果が0件なら処理終わり
            if (snapshot.size == 0) {
                return 0;
            }
             //削除のメイン処理
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
             //一旦処理サイズをreturn
            return batch.commit().then(() => {
                return snapshot.size;
            })
        })
        .then((numDeleted) => {
             //もう対象のデータが0なら処理終わり
            if (numDeleted == 0) {
                resolve();
                return;
            }
             //あだあるなら、再度処理
            process.nextTick(() => {
                deleteQueryBatch(db, query, batchSize, resolve, reject);
            });
        })
        .catch(reject);
}

//実行
// const colRef = db.collection("members");
deleteCollection(db, messageRef, 500);