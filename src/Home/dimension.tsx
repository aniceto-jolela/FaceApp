import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../../style/dimensions";

export default function Dimensions() {
  return (
    <View style={styles.buttonContainerDimension}>
      <TouchableOpacity style={styles.buttonDimension}>
        <Text style={styles.text}>3:4</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonDimension}>
        <Text style={styles.text}>9:16</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonDimension}>
        <Text style={styles.text}>1:1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonDimension}>
        <Text style={styles.text}>Full</Text>
      </TouchableOpacity>
    </View>
  );
}
