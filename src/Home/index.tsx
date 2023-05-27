import {
  ImageSourcePropType,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { styles } from "../../style/dimensions";
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

type PropsDimension = {
  width: number;
  height: number;
};

export default function Home() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [faceDetected, setFaceDetected] = useState(false);
  const [emoji, setEmoji] = useState<ImageSourcePropType>(neutralImg);
  const [dimension, setDimension] = useState<PropsDimension>({
    width: 500,
    height: 500,
  });

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
        face.leftEyeOpenProbability > 0.5 &&
        face.rightEyeOpenProbability < 0.5
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
    <View
      style={{
        marginTop: dimension.width === 700 ? 0 : 130,
        height: dimension.height,
        width: dimension.width,
      }}
    >
      {faceDetected && <Animated.Image style={animatedStyle} source={emoji} />}

      <View
        style={{
          position: "absolute",
          marginTop: dimension.width === 700 ? 65 : -65,
          zIndex: 1,
          flexDirection: "row",
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          style={styles.buttonDimension}
          onPress={() => setDimension({ width: 500, height: 640 })}
        >
          <Text style={styles.text}>3:4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDimension}
          onPress={() => setDimension({ width: 500, height: 715 })}
        >
          <Text style={styles.text}>9:16</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDimension}
          onPress={() => setDimension({ width: 500, height: 500 })}
        >
          <Text style={styles.text}>1:1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDimension}
          onPress={() => setDimension({ width: 700, height: 880 })}
        >
          <Text style={styles.text}>Full</Text>
        </TouchableOpacity>
      </View>

      <Camera
        style={{ flex: 1 }}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
      <View
        style={{
          marginTop: dimension.width === 700 ? 700 : 580,
          flexDirection: "row",
          position: "absolute",
        }}
      >
        <TouchableOpacity
          style={{
            marginLeft: 170,
            borderRadius: 50,
            borderRightWidth: 5,
            padding: 25,
          }}
          onPress={toggleCameraType}
        >
          <Text style={{ color: "orange", fontSize: 20 }}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
