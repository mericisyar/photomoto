//user getir user kaydet ve post kaydetme
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE } from "../constants/index";
import firebase from "firebase/compat/app";

export function clearData(){
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return((dispacth) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) =>{
                if(snapshot.exists){
                    dispacth({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                }
                else{
                    console.log('mevuct degil')
                }
            })
    })
}

export function fetchUserPosts(){
    return((dispacth) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot) =>{
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                
                dispacth({type: USER_POSTS_STATE_CHANGE, posts})
            
            })
    })
}

export function fetchUserFollowing(){
    return((dispacth) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")           
            .onSnapshot((snapshot) =>{
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                
                dispacth({type: USER_FOLLOWING_STATE_CHANGE, following});
                for(let i = 0; i < following.length; i++){
                    dispacth(fetchUsersData(following[i], true));
                }
            })
    })
}

export function fetchUsersData(uid, getPosts){
    return((dispacth, getState)=>{
        const found = getState().usersState.users.some(el => el.uid === uid); //element.. some sadece true false döndürür
        if(!found){
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) =>{
                    if(snapshot.exists){
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        dispacth({type: USERS_DATA_STATE_CHANGE, user});                        
                    }
                    else{
                        console.log('mevuct degil')
                    }
                })
                if(getPosts){
                    dispacth(fetchUsersFollowingPosts(uid)); //burası oynandı
                }
        }
    })
}
export function fetchUsersFollowingPosts(uid){
    return((dispacth,getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot) =>{
                console.log(snapshot)
                const uid = snapshot.docs[0].ref.path.split('/')[1] //burası oynandı
                console.log({snapshot,uid})
                const user = getState().usersState.users.find(el => el.uid === uid); //element
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data,user}
                })
                for(let i = 0; i< posts.length; i++){
                    dispacth(fetchUsersFollowingLikes(uid,posts[i].id))
                }
                dispacth({type: USERS_POSTS_STATE_CHANGE, posts,uid})
                console.log(getState())
            })
    })
}

export function fetchUsersFollowingLikes(uid, postId){
    return((dispacth,getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) =>{
                console.log(snapshot)
                const postId = snapshot.ref.path.split("/")[3]; //burası oynandı
                console.log({snapshot,uid})
                let currentUserLike = false;
                if(snapshot.exists){
                    currentUserLike=true;
                }
                dispacth({type: USERS_LIKES_STATE_CHANGE, postId,currentUserLike})
                console.log(getState())
            })
    })
}