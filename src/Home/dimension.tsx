import { View,TouchableOpacity,Text } from "react-native";
import { styles } from "../../style/dimensions";


export default function Dimensions() {
  return (
    <View style={styles.buttonContainerDimension}>
    <TouchableOpacity style={styles.buttonDimension}>
        <Text style={styles.text}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

