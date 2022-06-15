import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import firebase from "firebase/compat/app";
import logo from "../../images/logo.png";
import { Dimensions } from "react-native";
const windowHeight = Dimensions.get("window").height;

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }
  onSignUp() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
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
            Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Login;
