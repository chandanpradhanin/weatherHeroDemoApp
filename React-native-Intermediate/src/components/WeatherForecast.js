import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../Assets/theme/COLOR';
import {request_weather_data} from '../Redux/Actions/publicDataActions';
import {
  getActualUnit,
  getCityAndState,
  getWeatherIcon,
  requestForLocationPermission,
} from '../utils';
import CityInfo from './CityInfo';
import CurrentWeather from './CurrentWeather';
import HourlyInfo from './HourlyInfo';
import strings from '../localizations';
import LanguageSelector from './LanguageSelector';
import {AppImages} from '../Assets/Images';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const WeatherForecast = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isInCelsius, setIsInCelsius] = useState(true);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  const [selectedDayDate, setSelectedDayDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const {weather_data, weather_loading, languageCode} = useSelector(
    state => state.params,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedCity !== '') {
      dispatch(request_weather_data(selectedCity));
    }
  }, [dispatch, selectedCity]);

  useEffect(() => {
    strings.setLanguage(languageCode ? languageCode : 'en');
  }, [languageCode]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getCurrentLocation();
    } else {
      async function fetchData() {
        const permissionResult = await requestForLocationPermission();
        if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setDefaultCityValues();
          // permission denied
        }
      }
      fetchData();
    }
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        console.log('position:', position);
        const {latitude, longitude} = position.coords;
        const result = await getCityAndState(latitude, longitude);
        if (result != null) {
          const {city, state} = result;
          setSelectedCity(city);
          setSelectedState(state);
        } else {
          setDefaultCityValues();
        }
        // Use the coordinates as needed
      },
      error => {
        console.warn(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const setDefaultCityValues = () => {
    // If geolocation API is not working then we can set with default values

    setSelectedCity('Surat');
    setSelectedState('Gujarat');
  };

  const renderCurrentWeatherCards = ({item}) => {
    const today = new Date();
    const cardDate = new Date(item?.datetime);

    let dateString = cardDate.toLocaleDateString();
    if (cardDate.getDate() === today.getDate()) {
      dateString = strings.today;
    } else if (cardDate.getDate() === today.getDate() + 1) {
      dateString = strings.tomorrow;
    }

    const weatherIcon = getWeatherIcon(item.conditions);

    return (
      <TouchableOpacity
        style={[
          styles.forecastCard,
          item.datetime === selectedDayDate
            ? {backgroundColor: COLORS.primary}
            : {},
        ]}
        onPress={() => {
          setSelectedDayDate(item.datetime);
        }}>
        <Text
          style={[
            styles.forecastDate,
            item.datetime === selectedDayDate
              ? {color: COLORS.light_shade}
              : {},
          ]}>
          {dateString}
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image source={weatherIcon} style={styles.forecastCondition} />
        </View>
        <Text
          style={[
            styles.forecastTempText,
            item.datetime === selectedDayDate
              ? {color: COLORS.light_shade}
              : {},
          ]}>
          {getActualUnit(item.temp, isInCelsius)}° {isInCelsius ? 'C' : 'F'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHourlyInfo = ({item, index}) => {
    return <HourlyInfo data={item} isDataShowingInCelsius={isInCelsius} />;
  };

  const getSelectedDateHours =
    weather_data?.days?.filter(a => a.datetime == selectedDayDate)?.[0]
      ?.hours || [];
  const getSelectedDay =
    weather_data?.days?.filter(a => a.datetime == selectedDayDate)?.[0] || [];

  const toggleSwitch = () => setIsInCelsius(previousState => !previousState);
  const onLanguageChange = () => setIsLanguageModalVisible(true);

  return (
    <View>
      {selectedCity && selectedCity !== '' ? (
        <CityInfo
          city={selectedCity}
          state={selectedState}
          callback={(city, state) => {
            setSelectedState(state);
            setSelectedCity(city);
          }}
        />
      ) : null}

      <View style={styles.optionView}>
        <Text style={styles.leftTitleText}>{strings.currentlyShowingIn}: </Text>
        <View style={styles.rightView}>
          <Text style={styles.switchText}>{strings.fahrenheit}</Text>
          <Switch
            trackColor={{false: COLORS.windSpeedText, true: COLORS.primary}}
            onValueChange={toggleSwitch}
            value={isInCelsius}
          />
          <Text style={styles.switchText}>{strings.celsius}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.optionView} onPress={onLanguageChange}>
        <Text style={styles.leftTitleText}>{strings.currentLanguage}: </Text>
        <View style={styles.rightView}>
          <Text style={styles.languageText}>{strings.languageName}</Text>
          <Image source={AppImages.next} style={styles.nextImage} />
        </View>
      </TouchableOpacity>
      <LanguageSelector
        languageCode={languageCode}
        modalVisible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
      />
      <ScrollView>
        {weather_loading ? (
          <ActivityIndicator size={'small'} color={COLORS.primary} />
        ) : (
          <>
            {weather_data && (
              <View style={styles.scrollFlat}>
                <FlatList
                  data={weather_data?.days}
                  renderItem={renderCurrentWeatherCards}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.datetime}
                  horizontal
                />
              </View>
            )}

            {getSelectedDay && (
              <CurrentWeather
                currentWeather={getSelectedDay}
                isDataShowingInCelsius={isInCelsius}
              />
            )}

            <FlatList
              data={getSelectedDateHours}
              renderItem={renderHourlyInfo}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.datetime}
              style={styles.list}
              contentContainerStyle={{alignItems: 'center'}}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    width: windowWidth * 0.9,
    alignSelf: 'center',
    marginTop: 12,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    color: COLORS.dark_shade,
  },
  selectCity: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    width: windowWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  selectCityText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weatherCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 8,
  },
  forecastCard: {
    // width: (windowWidth * 0.4) / 2,
    height: (windowWidth * 0.65) / 2,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 7,
    alignSelf: 'center',
  },
  forecastDate: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
  },
  forecastCondition: {width: 50, height: 60},

  forecastTempText: {
    color: COLORS.temp,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollFlat: {
    marginTop: 22,
    width: windowWidth,
    alignSelf: 'center',
    marginBottom: (windowWidth * 0.2) / 2,
    marginLeft: 14,
  },
  selectCityHeaderText: {
    color: COLORS.windSpeedText,
    fontStyle: 'italic',
  },
  list: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    marginBottom: 70,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftTitleText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: COLORS.primary,
  },
  switchText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: COLORS.primary,
  },
  optionView: {
    marginTop: 10,
    flexDirection: 'row',
    marginHorizontal: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderColor: COLORS.tempText,
    borderWidth: 3,
    borderRadius: 5,
  },
  nextImage: {
    height: 15,
    width: 15,
    marginLeft: 10,
  },
});

export default WeatherForecast;
