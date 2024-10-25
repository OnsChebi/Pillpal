import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "./splashscreen";
import { VoiceRecord } from "./VoiceRecord";
import { Summarization } from "./SummarizationScreen";
import { Transcription } from "./TranscriptionScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isSplashShow, setSplashShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isSplashShow ? (
        <SplashScreen />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="VoiceRecord" // Ensure this matches your component
            component={VoiceRecord}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Transcription"
            component={Transcription} // Register the Transcription component
            options={{ title: "Transcription" }} // Optional: Customize title
          />
          <Stack.Screen
            name="Summarization"
            component={Summarization}
          />
        </Stack.Navigator>
      )}
    </View>
  );
}
