import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, Text, Image, View, Button } from "react-native";
import logo from "../../images/logo.png";
import { Dimensions } from "react-native";
const windowHeight = Dimensions.get("window").height;
export default function Landing({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF9629",
        height: windowHeight,
      }}
    >
      <Image
        style={{ width: 150, height: 150, marginTop: 100 }}
        source={logo}
      ></Image>
      <TouchableOpacity
        style={{
          alignItems: "center",
          backgroundColor: "#0cc9c0",
          borderRadius: 15,
          padding: 2,
          width: 100,
        }}
        title="Register"
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{ fontSize: 19, margin: 10, color: "white" }}>
          Sign Up
        </Text>
      </TouchableOpacity>
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
        onPress={() => navigation.navigate("Login")}
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
