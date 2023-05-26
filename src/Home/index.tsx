import {
  ImageSourcePropType,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { styles } from "../../style/styles";
import { Camera, CameraType, FaceDetectionResult } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

import smilingImg from "../../assets/emojis/smiling.png";
import winkingImg from "../../assets/emojis/winking.png";
import neutralImg from "../../assets/emojis/neutral.png";
import Dimensions from "./dimension";

export default function Home() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [faceDetected, setFaceDetected] = useState(false);
  const [emoji, setEmoji] = useState<ImageSourcePropType>(neutralImg);

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  function handleFacesDetected({ faces }: FaceDetectionResult) {
    const face = faces[0] as any;

    if (face) {
      const { size, origin } = face.bounds;
      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y,
      };
      setFaceDetected(true);
      if (face.smilingProbability > 0.5) {
        setEmoji(smilingImg);
      } else if (
        face.leftEyeOpenProbability < 0.5 &&
        face.rightEyeOpenProbability > 0.5
      ) {
        setEmoji(winkingImg);
      } else {
        setEmoji(neutralImg);
      }
    } else {
      setFaceDetected(false);
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
  }));

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return null;
  }

  return (
    <View style={styles.container}>
      {faceDetected && <Animated.Image style={animatedStyle} source={emoji} />}

      <Dimensions />
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      ></Camera>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
