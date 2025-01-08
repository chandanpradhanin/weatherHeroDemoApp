import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import strings from '../localizations';
import {COLORS} from '../Assets/theme/COLOR';

const LanguageSelector = props => {
  const {onClose, modalVisible} = props;

  const changeLanguage = lang => {
    strings.setLanguage(lang);
    onClose && onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        onClose && onClose();
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          onClose && onClose();
        }}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{strings.language}</Text>

              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => changeLanguage('en')}>
                <Text style={styles.languageText}>{'English'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => changeLanguage('es')}>
                <Text style={styles.languageText}>{'Español'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  languageButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  languageText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LanguageSelector;
