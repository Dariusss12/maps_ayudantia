import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, View, Dimensions, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_KEY } from '@env';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function App() {

  const [origin, setOrigin] = useState({
    latitude: -23.679136, 
    longitude: -70.409701,
  });

  const [destination, setDestination] = useState({
    latitude: -23.668929, 
    longitude: -70.404881,
  });

  useEffect(() => {
    getLocationPermission();
  }, [])

  async function getLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      alert('Permiso denegado');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude,
    }
    setDestination(current);
  }

  return (
    
    <View style={styles.container}>

      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}  
      >
        <GooglePlacesAutocomplete
          placeholder='Busca tu dirección de entrega'
          query={{
              key: GOOGLE_MAPS_KEY,
              language: 'es'
          }}
          debounce={300}
          fetchDetails={true}
          onPress={(data, details = null) => {
              const destination = {
                latitude: details.geometry?.location.lat, 
                longitude: details.geometry?.location.lng,
              }
              setDestination(destination);
          }}
          styles={{
            textInputContainer: {
              backgroundColor: '#fff',
              top: '15%'
            },
            textInput: {
              top: '15%'
            },
            listView:{
              top: '6%'
            }
          }}
        />
        <Marker 
          coordinate={origin}
          draggable
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
        />
        <Marker
          coordinate={destination}
          draggable
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
        />

        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_KEY}
          strokeColor='red'
          strokeWidth={6}
        />
        
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
