import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import globalStyles from '../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';

const LoginTextField = ({
  text,
  position = 'static',
  onChangeText,
  value,
  suggestions,
}) => {
  const [passwordView, setPasswordView] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTranslation();

  const inputRef = useRef(null);

  console.log({ suggestions });

  useEffect(() => {
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  const handleTextChange = (text) => {
    onChangeText(text);
    if (suggestions) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion && suggestion.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && text.length > 0);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss(); // manually dismiss keyboard
  };
  const dismissKeyboardAndSuggestions = () => {
    Keyboard.dismiss();
    setShowSuggestions(false);
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardAndSuggestions}>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          secureTextEntry={text === 'password' && !passwordView}
          onChangeText={handleTextChange}
          onFocus={() => setShowSuggestions(true)}
          value={value}
          style={[styles.input, { position: position }]}
        />

        <View style={styles.overlap}>
          <GlobalText style={styles.text}> {t(text)} </GlobalText>
        </View>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ScrollView style={styles.suggestionsList} nestedScrollEnabled={true}>
            {filteredSuggestions.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => handleSuggestionSelect(item)}
                style={styles.suggestion}
              >
                <GlobalText style={globalStyles.text}>{item}</GlobalText>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

LoginTextField.propTypes = {
  text: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  position: PropTypes.string,
  suggestions: PropTypes.array,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 55,
    borderRadius: 7,
    borderColor: '#DADADA',
    borderWidth: 1.4,
    color: 'black',
    paddingLeft: 20,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  overlap: {
    top: -66,
    left: 13,
    backgroundColor: 'white',
  },
  text: {
    color: '#4D4639',
    paddingLeft: 2,
    fontFamily: 'Poppins-Regular',
    paddingRight: 2,
  },
  suggestionsList: {
    position: 'absolute',
    top: 55, // Adjust based on your input height
    width: '100%',
    left: 10,
    backgroundColor: '#F7ECDF',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 7,
    maxHeight: 160, // Set the maximum height
    overflow: 'scroll',
    elevation: 10, // for Android
    padding: 10,
  },
  suggestion: {
    padding: 15,
  },
});

export default LoginTextField;
