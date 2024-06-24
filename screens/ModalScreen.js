import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { collection, addDoc } from "firebase/firestore"; // Cambiado a addDoc y collection
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select'; // Importa el componente RNPickerSelect

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");

  const incompleteForm = !image || !age || !name || !description || !type;

  const createPetProfile = () => {
    addDoc(collection(db, "pets"), {
      ownerId: user.uid,
      displayName: name,
      description,
      imageUrl: image,
      type,
      age,
      status: 'available',
      timestamp: new Date(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  return (
    <View style={tw.style("flex-1 items-center pt-1")}>
      <Text style={tw.style("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 1: Pet Name
      </Text>

      <TextInput
        placeholder="Enter the pet's name"
        style={tw.style("text-center text-xl pb-2")}
        value={name}
        onChangeText={setName}
      />
      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 2: Description
      </Text>

      <TextInput
        placeholder="Enter a description"
        style={tw.style("text-center text-xl pb-2")}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 3: Image URL
      </Text>

      <TextInput
        placeholder="Enter an image URL"
        style={tw.style("text-center text-xl pb-2")}
        keyboardType="url"
        value={image}
        onChangeText={setImage}
      />
      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 4: Type
      </Text>

      <RNPickerSelect
        onValueChange={(value) => setType(value)}
        items={[
          { label: 'Dog', value: 'dog' },
          { label: 'Cat', value: 'cat' },
          { label: 'Bird', value: 'bird' },
          { label: 'Rabbit', value: 'rabbit' },
          { label: 'Other', value: 'other' },
        ]}
        placeholder={{ label: "Select pet type", value: null }}
        style={{
          inputIOS: tw.style("text-center text-xl pb-2"),
          inputAndroid: tw.style("text-center text-xl pb-2"),
        }}
      />

      <Text style={tw.style("text-center p-4 font-bold text-red-400")}>
        Step 5: Age
      </Text>

      <TextInput
        placeholder="Enter the pet's age"
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
        onPress={createPetProfile}
      >
        <Text style={tw.style("text-center text-white text-xl")}>
          Create Pet Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
