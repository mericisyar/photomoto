import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import profileLogo from "../../images/profile-picture.jpg";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleLineIcons } from "@expo/vector-icons";

import "firebase/compat/firestore";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    console.log({ currentUser, posts });

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("mevcut degil");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          console.log(posts);
          setUserPosts(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <LinearGradient
          colors={[
            "#00FFFF",
            "#17C8FF",
            "#329BFF",
            "#4C64FF",
            "#6536FF",
            "#8000FF",
          ]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            padding: 2, 
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 100,
              backgroundColor: "#ecf0f1",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              style={styles.profilePic}
              source={profileLogo}
              alt="profile-pic"
            ></Image>
          </View>
        </LinearGradient>

        <Text style={styles.title}>{user.name}</Text>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <SimpleLineIcons
                name="user-unfollow"
                size={15}
                color="red"
                onPress={() => onUnfollow()}
              >
                Unfollow
              </SimpleLineIcons>
            ) : (
              <SimpleLineIcons
                name="user-follow"
                size={15}
                color="green"
                onPress={() => onFollow()}
              >
                Follow
              </SimpleLineIcons>
            )}
          </View>
        ) : (
          <MaterialIcons
            name="logout"
            size={24}
            color="black"
            onPress={() => onLogout()}
          />
        )}
      </View>
      <View
        style={{
          borderBottomColor: "grey",
          borderBottomWidth: 1,
        }}
      />
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    flex: 1 / 6,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 20,
  },
  title: {
    fontSize: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
    borderWidth: 1,
    borderColor: "grey",
  },
  profilePic: {
    width: 60,
    height: 60,
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
