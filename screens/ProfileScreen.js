import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { db, timestamp } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");

  const incompleteForm = !image || !age || !job;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      timestamp,
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  return (
    <SafeAreaView style={tw.style("flex-1 mt-6")}>
      <View style={tw.style("flex-1 items-center pt-1")}>
        <Text style={tw.style("text-xl text-gray-500 p-2 font-bold")}>
          Welcome
        </Text>

        <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
          Step 1: The Profile Pic
        </Text>

        <TextInput
          placeholder="Enter a profile pic url"
          style={tw.style("text-center text-xl pb-2")}
          keyboardType="url"
          value={image}
          onChangeText={setImage}
        />
        <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
          Step 2: The Job
        </Text>

        <TextInput
          placeholder="Enter your occupation"
          style={tw.style("text-center text-xl pb-2")}
          onChangeText={setJob}
          value={job}
        />
        <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
          Step 3: The Age
        </Text>

        <TextInput
          placeholder="Enter your age"
          style={tw.style("text-center text-xl pb-2")}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          maxLength={2}
        />
        <TouchableOpacity
          disabled={incompleteForm}
          style={tw.style(
            "w-64 p-3 rounded-xl absolute bottom-10 bg-red-400",
            incompleteForm && "bg-gray-400"
          )}
          onPress={updateUserProfile}
        >
          <Text style={tw.style("text-center text-white text-xl")}>
            Update Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw.style("flex-1 items-center pt-1")}>
        <TouchableOpacity
          style={tw.style("w-64 p-3 rounded-xl bottom-10 bg-red-400 mt-2")}
          onPress={() => navigation.navigate("Modal")}
        >
          <Text style={tw.style("text-center text-white text-xl")}>
            Add pet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw.style("w-64 p-3 rounded-xl bottom-10 bg-red-400 mt-2")}
          onPress={logout}
        >
          <Text style={tw.style("text-center text-white text-xl")}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
