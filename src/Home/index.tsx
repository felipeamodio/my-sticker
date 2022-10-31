import { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View, Text } from 'react-native';

import {Camera, CameraType} from 'expo-camera';
import {captureRef} from 'react-native-view-shot'; //capturar a screenshot
import * as Sharing from 'expo-sharing';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';

export function Home() {
  const [photo, setPhotoURI] = useState<null | string>(null);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const cameraRef = useRef<Camera>(null); //anotar a referência da câmera
  const screenShotRef = useRef(null); //mostrar a ref da area q vai ser capturada

  async function handleTakePicture(){
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri)
  }

  async function shareScreenShot(){
    const screenshot = await captureRef(screenShotRef);
    await Sharing.shareAsync('file://' + screenshot);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync() //primeira coisa permitir que o app utilize a câmera
    .then(response => setHasCameraPermission(response.granted))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

           {
            hasCameraPermission && !photo ? 
            <Camera
              ref={cameraRef} 
              style={styles.camera}
              type={CameraType.front}
            /> 
            :
            <Image 
            source={{ uri: photo ? photo : 'https://filestore.community.support.microsoft.com/api/images/354ad963-3130-4924-b870-71a46b54fb4a?upload=true' }} 
            style={styles.camera}
            onLoad={shareScreenShot} //garantir q a imagem foi carregada
            />
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

        <TouchableOpacity onPress={() => setPhotoURI(false)}>
          <Text style={styles.retry}>
            Nova foto
          </Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}