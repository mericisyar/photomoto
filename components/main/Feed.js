import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { FontAwesome } from "@expo/vector-icons";
import profileLogo from "../../images/profile-picture.jpg";
import { LinearGradient } from "expo-linear-gradient";
function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  margin: 10,
                }}
              >
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
                    width: 40,
                    height: 40,
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
                <Text
                  onPress={() => {
                    console.log(item.id);
                    props.navigation.navigate("Profile", {
                      uid: item.user.uid,
                    });
                  }}
                  style={{ marginLeft: 10 }}
                >
                  {item.user.name}
                </Text>
              </View>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              {item.currentUserLike ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    margin: 10,
                  }}
                >
                  <FontAwesome
                    name="heart"
                    size={24}
                    color="red"
                    style={{
                      marginRight: 20,
                    }}
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  />
                  <FontAwesome
                    name="comments-o"
                    size={24}
                    color="black"
                    onPress={() => {
                      props.navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      });
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    margin: 10,
                  }}
                >
                  <FontAwesome
                    name="heart-o"
                    size={24}
                    color="black"
                    style={{
                      marginRight: 20,
                    }}
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  />
                  <FontAwesome
                    name="comments-o"
                    size={24}
                    color="black"
                    onPress={() => {
                      props.navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      });
                    }}
                  />
                </View>
              )}
              <View
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: 1,
                }}
              />
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
    margin: 20,
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
  },
  profilePic: {
    width: 40,
    height: 40,
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
