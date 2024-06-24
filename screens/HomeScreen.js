import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { db, timestamp } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import generateId from "../lib/generateId";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    getDoc(doc(db, "users", user.uid)).then((snapShot) => {
      if (!snapShot.exists()) {
        navigation.navigate("Modal");
      }
    });
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData.role === "adopter") {
        unsub = onSnapshot(
          query(collection(db, "pets"), where("status", "==", "available")),
          (snapShot) => {
            setProfiles(
              snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );
          }
        );
      } else if (userData.role === "owner") {
        // Paso 1: Obtener todas las mascotas con ownerId igual a user.uid
        const petsQuery = query(
          collection(db, "pets"),
          where("ownerId", "==", user.uid)
        );
        const petsSnapshot = await getDocs(petsQuery);
        const petIds = petsSnapshot.docs.map((doc) => doc.id);

        // Paso 2: Obtener los swipes de cada mascota
        let allSwipes = [];
        for (const petId of petIds) {
          const swipesSnapshot = await getDocs(
            collection(db, "pets", petId, "swipes")
          );
          const swipes = swipesSnapshot.docs.map((doc) => doc.id);
          allSwipes = [...allSwipes, ...swipes];
        }

        // Eliminar duplicados
        allSwipes = [...new Set(allSwipes)];

        // Paso 3: Obtener los perfiles de los usuarios que hicieron swipe
        if (allSwipes.length > 0) {
          const q = query(
            collection(db, "users"),
            where(documentId(), "in", allSwipes)
          );
    
          unsub = onSnapshot(q, (snapShot) => {
            setProfiles(
              snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );
          });
        }
      }
    };

    fetchCards();

    return unsub;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) {
      return;
    }

    const swipedProfile = profiles[cardIndex];
    setDoc(
      doc(db, "users", user.uid, "passes", swipedProfile.id),
      swipedProfile
    );
  };

  const swipeRight = async (cardIndex) => {
    try {
      if (!profiles[cardIndex]) {
        return;
      }

      const swipedProfile = profiles[cardIndex];
      const loggedInProfile = await (
        await getDoc(doc(db, "users", user.uid))
      ).data();

      if (loggedInProfile.role === "adopter") {
        getDoc(
          doc(db, "users", swipedProfile.ownerId, "swipes", user.uid)
        ).then((docSnap) => {
          if (docSnap.exists()) {
            // Crear subcolección en la colección pets
            setDoc(doc(db, "pets", swipedProfile.id, "swipes", user.uid), {
              user: user.uid,
              loggedInProfile,
            });
            // Guardar el swipe en el perfil del usuario
            setDoc(
              doc(db, "users", user.uid, "swipes", swipedProfile.id),
              swipedProfile
            );
            setDoc(
              doc(db, "matches", generateId(user.uid, swipedProfile.ownerId)),
              {
                users: {
                  [user.uid]: loggedInProfile,
                  [swipedProfile.ownerId]: swipedProfile,
                },
                usersMatched: [user.uid, swipedProfile.ownerId],
                timestamp,
              }
            );

            navigation.navigate("Match", {
              loggedInProfile,
              swipedProfile,
            });
          } else {
            setDoc(
              doc(db, "users", user.uid, "swipes", swipedProfile.id),
              swipedProfile
            );
            setDoc(doc(db, "pets", swipedProfile.id, "swipes", user.uid), {
              user: user.uid,
              loggedInProfile,
            });
          }
        });
      } else if (loggedInProfile.role === "owner") {
        // Verificar en la colección pets que tienen el campo ownerId igual al userId del owner
        getDocs(
          query(collection(db, "pets"), where("ownerId", "==", user.uid))
        ).then((querySnapshot) => {
          querySnapshot.forEach((petDoc) => {
            // Verificar si ya existe el swipe
            getDoc(doc(db, "pets", petDoc.id, "swipes", swipedProfile.id)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  setDoc(
                    doc(db, "users", user.uid, "swipes", swipedProfile.id),
                    swipedProfile
                  );
                  setDoc(
                    doc(db, "matches", generateId(user.uid, swipedProfile.id)),
                    {
                      users: {
                        [user.uid]: loggedInProfile,
                        [swipedProfile.id]: swipedProfile,
                      },
                      usersMatched: [user.uid, swipedProfile.id],
                      timestamp,
                    }
                  );

                  navigation.navigate("Match", {
                    loggedInProfile,
                    swipedProfile,
                  });
                } else {
                  setDoc(
                    doc(db, "users", user.uid, "swipes", swipedProfile.id),
                    swipedProfile
                  );
                }
              }
            );
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={tw.style("flex-1 mt-6")}>
      <View style={tw.style("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            style={tw.style("h-10 w-10 rounded-full")}
            source={{
              uri: "https://img.freepik.com/free-icon/user_318-159711.jpg",
            }}
          />
        </TouchableOpacity>
        <View>
          <Image
            style={tw.style("h-14 w-14")}
            source={require("../assets/logo.png")}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={tw.style("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{
            backgroundColor: "transparent",
          }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe Pass");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("Swipe Match");
            swipeRight(cardIndex);
          }}
          backgroundColor="#4FD0E9"
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) => {
            if (!card)
              return (
                <View
                  style={tw.style(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl"
                  )}
                >
                  <Text style={tw.style("font-bold pb-5")}>
                    No more profiles
                  </Text>
                  <Image
                    style={tw.style("h-20 w-20")}
                    height={100}
                    width={100}
                    source={{
                      uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037",
                    }}
                  />
                </View>
              );

            return (
              <View
                key={card.id}
                style={tw.style("bg-white h-3/4 rounded-xl relative")}
              >
                <Image
                  style={tw.style("absolute top-0 h-full w-full rounded-xl")}
                  source={{ uri: card.imageUrl }}
                />
                <View
                  style={tw.style(
                    "absolute bottom-0 bg-white w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl shadow-xl"
                  )}
                >
                  <View>
                    <Text style={tw.style("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                  </View>
                  <Text style={tw.style("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>

      <View style={tw.style("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw.style(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw.style(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <Entypo name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
