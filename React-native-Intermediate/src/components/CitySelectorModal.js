import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import {COLORS} from '../Assets/theme/COLOR';
import {cities, states} from '../Assets/theme/appDataConfig';
import strings from '../localizations';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CitySelectorModal = props => {
  const {visible, onClose} = props;
  const [searchText, setSearchText] = useState('');

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderStates = ({item}) => {
    const actualCities = filteredCities.filter(
      city => city.stateId === item.id,
    );
    let name = item?.name;

    return (
      <View>
        <Text style={styles.stateName}>{item?.name}</Text>
        <View style={styles.cityInfoContent}>
          {actualCities.length > 0 ? (
            <FlatList
              data={actualCities}
              renderItem={obj => renderCities(obj, name)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>No cities available</Text>
          )}
        </View>
      </View>
    );
  };

  const renderCities = (item, state) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props?.callback(item.item?.name, state);
          onClose && onClose();
        }}>
        <Text style={styles.cityName}>{item?.item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.regionInfoContent}>
          <Text style={styles.modalHeaderText}>{strings.selectYourCity}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={strings.searchCity}
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={states}
            renderItem={renderStates}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CitySelectorModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  regionInfoContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: windowWidth * 0.9,
    height: windowHeight * 0.6,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  stateName: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: COLORS.dark_shade,
  },
  cityName: {
    fontSize: 14,
    marginBottom: 10,
    color: COLORS.windSpeedText,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.temp,
    marginTop: 10,
  },
  cityInfoContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 9,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
