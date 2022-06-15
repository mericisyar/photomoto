import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import profileLogo from "../../images/profile-picture.jpg";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export default function Search(props) {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search) //aratılan ismin içindeki harfleri yakalayıp full aynı olmasa bile göster
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <View>
      <TextInput
        style={{
          fontSize: 12,
          margin: 10,
          backgroundColor: "white",
          color: "black",
          borderRadius: 10,
        }}
        placeholder="Search Someone"
        onChangeText={(search) => fetchUsers(search)}
      />

      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
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
                {item.name}
              </Text>
              <Text style={{ marginLeft: 10 }}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
