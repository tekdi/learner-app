import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import HeaderComponent from '../../components/CustomHeaderComponent/customheadercomponent';
import { ages } from './RegisterScreenData/ages';
import CustomButton from '../../components/CustomButton/CustomButton';
import { languages } from '../LanguageScreen/Languages';
import CustomCard from '../../components/CustomCard/CustomCard';
import { gender } from './RegisterScreenData/gender';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import { Card } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { preferredlanguages } from './RegisterScreenData/languages';

//multi language
import { useTranslation } from '../../context/LanguageContext';

const RegistrationFlow = ({ config }) => {
  //multi language setup
  const { t } = useTranslation();

  const navigation = useNavigation();
  const [formData, setFormData] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState({});

  const handleItemPress = (listId, item) => {
    console.log(listId);
    if (listId === 'list1') {
      handleChange('Age Group', item.title);
    } else if (listId === 'list2') {
      handleChange('Gender', item.title);
    } else if (listId === 'list3') {
      handleChange('Language of Learning', item.title);
    }
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [listId]: item.id,
    }));
  };

  const renderItem = listId => ({ item }) => {
    const isSelected = selectedIds[listId] === item.id;
    const backgroundColor = isSelected ? '#FFEFD5' : 'white';
    const bold = isSelected ? 'bold' : 'medium';
    return (
        <CustomCard bold={bold} title={item.title} style={{ backgroundColor }} clickEvent={()=> handleItemPress(listId, item)} />
    );
  };

  const handleChange = (question, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [question]: value,
    }));
  };
  const renderQuestionContent = () => {
    switch (currentQuestionIndex) {
      case 0:
        return (
          <View style={styles.containerswitch}>
            <CustomTextField
              text={t('lb_first_name')}
              onChangeText={(text) => handleChange('First Name', text)}
              value={formData['First Name'] || ''}
            />
            <CustomTextField
              text={t('lb_last_name')}
              onChangeText={(text) => handleChange('Last Name', text)}
              value={formData['Last Name'] || ''}
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.containerswitch}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={ages}
              renderItem={renderItem('list1')}
              keyExtractor={(item) => item.id}
              extraData={selectedIds}
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.containerswitch}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={gender}
              renderItem={renderItem('list2')}
              keyExtractor={(item) => item.id}
              extraData={selectedIds}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.containerswitch}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={preferredlanguages}
              renderItem={renderItem('list3')}
              keyExtractor={(item) => item.id}
              extraData={selectedIds}
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.containerswitch}>
            <View style={{ flexDirection: 'row' }}>
              <Card style={{ width: '53%', margin: 5 }}></Card>
              <Card style={{ width: '25%', margin: 5 }}></Card>
              <Card style={{ width: '12%', margin: 5 }}></Card>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Card style={{ width: '20%', margin: 5 }}></Card>
              <Card style={{ width: '20%', margin: 5 }}></Card>
            </View>
            <Card style={{ width: '20%', margin: 5 }}></Card>
            <Card style={{ width: '45%', margin: 5 }}></Card>
            <Card style={{ width: '50%', margin: 5 }}></Card>
            <Card style={{ width: '60%', margin: 5 }}></Card>
          </View>
        );
      case 5:
        return (
          <View style={styles.containerswitch}>
            <CustomTextField
              text="Customize your username"
              onChangeText={(text) => handleChange('Username', text)}
              value={formData['Username'] || ''}
            />
            <CustomTextField
              text="Password"
              onChangeText={(text) => handleChange('Password', text)}
              value={formData['Password'] || ''}
            />
            <CustomTextField
              text="Confirm Password"
              onChangeText={(text) => handleChange('Confirm Password', text)}
              value={formData['Confirm Password'] || ''}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < config.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    console.warn('Form Data:', formData);
  };

  const currentQuestion = config[currentQuestionIndex];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Back Button** */}
      <TouchableOpacity style={styles.backbutton} onPress={handlePrevious}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <HeaderComponent
        question={currentQuestion['question']}
        questionIndex={currentQuestionIndex + 1}
      />
      {renderQuestionContent()}
      <View style={styles.buttonContainer}>
        {currentQuestionIndex < config.length - 1 ? (
          <View style={styles.buttonWrapper}>
            <CustomButton text="Continue" onPress={handleNext} />
          </View>
        ) : (
          <View style={styles.buttonWrapper}>
            <CustomButton text="Finish" onPress={handleSubmit} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
  },
  backbutton: {
    // Add specific styles if needed
  },
  containerswitch: {
    flex: 1,
    marginTop: 30,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonWrapper: {
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegistrationFlow;
