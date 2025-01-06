import { View, StyleSheet } from 'react-native';
import TimePicker from 'rn-time-picker';


export default function App() {
  return (
    <View style={styles.container}>
     <TimePicker radius={120} clockStyle={{backgroundColor:"black"}} containerStyle={{backgroundColor:"gray",padding:10}}  />
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
