import { StyleSheet , View } from 'react-native';
import BasicTimePickerExample from './components/basicComponent';
import CustomizedTimePickerExample from './components/customizedComponent';

export default function App() {
  return (
    <View style={styles.container} >
    <BasicTimePickerExample/>
    <CustomizedTimePickerExample/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 50
  },
});
