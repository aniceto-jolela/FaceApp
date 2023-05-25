import { View } from "react-native";
import { styles } from "../../style/styles";
import { Camera } from "expo-camera";
import { useEffect } from "react";

export default function Home() {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} />
    </View>
  );
}
