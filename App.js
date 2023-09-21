import Paho from 'paho-mqtt';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

client = new Paho.Client('broker.emqx.io', 8083, 'clientId-1');

export default function App() {
  const [suhu, setSuhu] = useState(0);
  const [lembab, setLembab] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const onMessage = (message) => {
    console.log('message', message);
    if (message.topic === '/topik/rapli/iot/suhu') {
      setSuhu(message.payloadString);
    } else if (message.topic === '/topik/rapli/iot/lembab') {
      setLembab(message.payloadString);
    }
  }

  useEffect(() => {
    client.connect({ 
    onSuccess: () => {
      console.log('connected');
      setIsConnected(true);
      client.subscribe('/topik/rapli/iot/suhu');
      client.onMessageArrived = onMessage;
      client.subscribe('/topik/rapli/iot/lembab');
    },

    onFailure: (e) => {
      console.log('error', e);
    }


  });


  }, []);


  return (
    <View style={styles.container}>
      {
        isConnected ? <Text>Connected</Text> : <Text>Not Connected</Text>
      }
      <Text>Suhu: {suhu} </Text>
      <Text>Lembab: {lembab} </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
