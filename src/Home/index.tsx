import { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import {Camera, CameraType} from 'expo-camera';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';

export function Home() {
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const cameraRef = useRef<Camera>(null) //anotar a referência da câmera

  async function handleTakePicture(){
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync() //primeira coisa permitir que o app utilize a câmera
    .then(response => setHasCameraPermission(response.granted))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View>
          <Header position={positionSelected} />

          <View style={styles.picture}>

           {
            hasCameraPermission ? 
            <Camera
              ref={cameraRef} 
              style={styles.camera}
              type={CameraType.front}
            /> 
            :
            <Image source={{ uri: 'https://filestore.community.support.microsoft.com/api/images/354ad963-3130-4924-b870-71a46b54fb4a?upload=true' }} style={styles.camera} />
           }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}