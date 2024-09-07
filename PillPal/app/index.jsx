
import { Text, View } from 'react-native';
import {StatusBar} from 'expo-status-bar';
import { Link } from 'expo-router';

export default function App(){
    return (
      <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-4xl font-pblack">hello</Text>
            <StatusBar style="auto"/>
            <Link href="/VoiceRecord" style={{color:'blue'}}>Login</Link>
        </View>
    );
}




