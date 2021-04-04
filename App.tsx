import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {pexels_key} from './config.json';

const {width, height} = Dimensions.get('screen');

const WIDTH = width * 0.7;
const HEIGHT = WIDTH * 1.54;

export default function App() {
  const [images, setImages] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  const fetchImages = async () => {
    const response = await axios.get(
      'https://api.pexels.com/v1/search?query=statue',
      {
        headers: {
          Authorization: pexels_key,
        },
      },
    );

    setImages(response.data.photos);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const LoadingComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  if (images && images.length < 1) {
    return <LoadingComponent />;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <StatusBar hidden />
      <View style={[StyleSheet.absoluteFillObject]}>
        {images.map((image: any, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });

          return (
            <Animated.Image
              source={{uri: image.src.portrait}}
              style={[StyleSheet.absoluteFillObject, {opacity}]}
              key={index}
              blurRadius={20}
            />
          );
        })}
      </View>
      <Animated.FlatList
        data={images}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        keyExtractor={(item: any) => item.id.toString()}
        pagingEnabled
        horizontal
        renderItem={({item, index}: any) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });

          return (
            <Animated.View
              style={{
                width,
                height,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{scale}],
                opacity: scale,
              }}>
              <View style={{width: WIDTH, height: HEIGHT, elevation: 20}}>
                <Image
                  source={{uri: item.src.portrait}}
                  style={{width: '100%', height: '100%', borderRadius: 12}}
                />
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
