import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Button,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export default function Save(props) {
  console.log(props);
  const [caption, setCaption] = useState("");
  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);
    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,

        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{ uri: props.route.params.image }}
        style={{
          width: 300,
          height: 300,
          transform: [{ rotate: "270deg" }],
        }}
      />
      <TextInput
        style={{
          fontSize: 12,
          margin: 10,
          backgroundColor: "white",
          color: "black",
          borderRadius: 10,
          width: 250,
        }}
        placeholder=" Başlık girin"
        onChangeText={(caption) => setCaption(caption)}
      />
      <View style={{ flex: 1 / 6, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "#0cc9c0",
            borderRadius: 15,
            padding: 10,
            margin: 10,
            width: 100,
          }}
          title="Login"
          onPress={() => props.navigation.navigate("Add")}
        >
          <Text
            style={{
              fontSize: 12,
              color: "white",
            }}
          >
            Retake
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "#0cc9c0",
            borderRadius: 15,
            padding: 10,
            margin: 10,
            width: 100,
          }}
          title="Login"
          onPress={() => uploadImage()}
        >
          <Text
            style={{
              fontSize: 12,
              color: "white",
            }}
          >
            Kaydet
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
