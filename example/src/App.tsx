import { View, StyleSheet } from 'react-native';
import TimePicker from "../../src/index.tsx"


export default function App() {
  return (
    <View style={styles.container}>
     <TimePicker radius={120} clockStyle={{backgroundColor:"gray"}} containerStyle={{backgroundColor:"red"}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
