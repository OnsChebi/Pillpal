import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SplashScreen } from "./splashscreen";
import { VoiceRecord } from "./VoiceRecord";
//import { TranscriptionScreen } from "./TranscriptionScreen";
import { SummarizationScreen } from "./SummarizationScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isSplashShow, setSplashShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashShow(false);
    }, 2000);

    return () => clearTimeout(timer); // Clear timeout if the component is unmounted
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isSplashShow ? (
        <SplashScreen />
      ) : (
        
        <Stack.Navigator>
          <Stack.Screen
            name="VoiceRecord"
            component={VoiceRecord}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="Transcription" component={TranscriptionScreen} /> */}
          <Stack.Screen name="Summarization" component={SummarizationScreen} />
        </Stack.Navigator>
      )}
    </View>
  );
}
