import {AppImages} from './Assets/Images';
import {PermissionsAndroid} from 'react-native';

export const getWeatherIcon = conditions => {
  switch (conditions) {
    case 'Clear':
      return AppImages.sun;
    case 'Rain':
      return AppImages.umbrella;
    case 'Partially Cloud':
      return AppImages.sunSlowRain;
    default:
      return AppImages.start;
  }
};

export const getActualUnit = (temperatureValue, isForCelsius) => {
  if (isForCelsius) {
    return temperatureValue;
  } else {
    // Conversion required because default value is in Celsius
    return ((temperatureValue * 9) / 5 + 32).toFixed(2);
  }
};

export const getCityAndState = async (latitude, longitude) => {
  const apiKey = 'AIzaSyBvNX1xCYBkdxB0zKBGbbFRcPqcx__9Ckw';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const mainResponse = await response.json();

    if (mainResponse.status === 'OK') {
      const results = mainResponse.results[0].address_components;

      let city = '';
      let state = '';

      for (let component of results) {
        if (component.types.includes('locality')) {
          city = component.long_name; // City
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name; // State
        }
      }

      if (city && state) {
        return {city, state};
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const requestForLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'We need access to your location to get current location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted;
  } catch (err) {
    console.warn(err);
  }
};
