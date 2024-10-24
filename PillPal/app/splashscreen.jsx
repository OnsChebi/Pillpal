import React from "react";
import { View, StyleSheet, Image } from "react-native";
import splash from "../assets/images/splash.png";  // Ensure the path is correct

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={splash} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27bd81",  // Make sure this is a valid hex color
  },
  image: {
    width: 200,   // Adjusted size for better visibility
    height: 200,  // Adjusted size for better visibility
    resizeMode: "contain",  // Changed to 'contain' for better image rendering
  },
});
