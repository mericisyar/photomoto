import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, Button, TextInput } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
import { FontAwesome } from "@expo/vector-icons";
import profileLogo from "../../images/profile-picture.jpg";
import { LinearGradient } from "expo-linear-gradient";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            {item.user !== undefined ? (
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
                    padding: 2, // This should be the border width you want to have
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
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={profileLogo}
                      alt="profile-pic"
                    ></Image>
                  </View>
                </LinearGradient>
                <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
                  {item.user.name}:
                </Text>
                <Text style={{ marginLeft: 10 }}>{item.text}</Text>
              </View>
            ) : null}
          </View>
        )}
      />
      <View
        style={{
          flex: 1 / 6,
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
        }}
      >
        <TextInput
          style={{ width: 300, fontSize: 20 }}
          placeholder="Yorumunuzu girin"
          onChangeText={(text) => setText(text)}
        />
        <FontAwesome
          name="send-o"
          size={24}
          style={{ marginLeft: 10 }}
          color="black"
          onPress={() => onCommentSend()}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Comment);
