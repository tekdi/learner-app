import React from 'react';
import PropTypes, { bool } from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScrollViewLayout from '../Layout/ScrollViewLayout';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';

const ContentBox = ({
  horizontalView,
  ContentData,
  viewAllLink,
  style,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const handlePress = () => {
    console.log('Card pressed!');
    // navigation.navigate('Preference');
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View>
        {title && (
          <Text style={[styles.title, { color: style.titlecolor }]}>
            {t(title)}
          </Text>
        )}
        <View style={styles.view}>
          <Text style={[styles.description, { color: 'black' }]}>
            {t(description)}
          </Text>
          <View style={styles.view}>
            <TouchableOpacity onPress={viewAllLink}>
              <Text style={[styles.description, { color: '#0D599E' }]}>
                {t('view_all')}
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-right"
              style={{ marginHorizontal: 10 }}
              color={'#0D599E'}
              size={20}
            />
          </View>
        </View>
        <ScrollViewLayout horizontalScroll={true}>
          {ContentData?.map((item) => {
            return (
              <ContentCard
                key={item?.name}
                onPress={handlePress}
                title={item?.name}
                description={item?.mimeType}
                appIcon={item?.appIcon}
              />
            );
          })}
        </ScrollViewLayout>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    height: 300,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: 500,
    marginLeft: 10,
    // textAlign: 'center',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

ContentBox.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  description: PropTypes.string,
  horizontalView: PropTypes.bool,
};

export default ContentBox;
