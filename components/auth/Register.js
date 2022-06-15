import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import firebase from "firebase/compat/app";
import { Dimensions } from "react-native";
import logo from "../../images/logo.png";

const windowHeight = Dimensions.get("window").height;
export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }
  onSignUp() {
    const { email, password, name } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#FF9629",
          height: windowHeight,
        }}
      >
        <Image
          style={{ width: 150, height: 150, marginTop: 100 }}
          source={logo}
        ></Image>
        <TextInput
          style={{
            fontSize: 12,
            margin: 10,
            backgroundColor: "white",
            color: "black",
            borderRadius: 10,
            width: 150,
          }}
          placeholder=" name"
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          style={{
            fontSize: 12,
            margin: 10,
            backgroundColor: "white",
            color: "black",
            borderRadius: 10,
            width: 150,
          }}
          placeholder=" email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={{
            fontSize: 12,
            margin: 10,
            backgroundColor: "white",
            color: "black",
            borderRadius: 10,
            width: 150,
          }}
          secureTextEntry={true}
          placeholder=" password"
          onChangeText={(password) => this.setState({ password })}
        />
        <TouchableOpacity
          style={{
            alignItems: "center",
            backgroundColor: "#0cc9c0",
            borderRadius: 15,
            padding: 2,
            margin: 10,
            width: 100,
          }}
          title="Login"
          onPress={() => this.onSignUp()}
        >
          <Text
            style={{
              fontSize: 19,
              margin: 10,
              color: "white",
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Register;
