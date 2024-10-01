import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextField from '../../../components/TextField/TextField';
import { courseDetails } from '../../../utils/API/ApiCalls';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from '@ui-kitten/components';
import globalStyles from '../../../utils/Helper/Style';
import DownloadCard from '../../../components/DownloadCard/DownloadCard';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import FastImage from '@changwoolab/react-native-fast-image';
import UnitCard from './UnitCard';
import ContentCard from '../ContentCard';

const UnitList = ({ route }) => {
  const { children, name } = route.params;
  const navigation = useNavigation();
  const [coursesContent, setCoursesContent] = useState();
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null); // State to track which item is expanded

  const handlePress = (data) => {
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier,
      content_mime_type: data?.mimeType,
      isOffline: false,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader />
      {loading ? (
        <ActivityIndicator style={{ top: 300 }} />
      ) : (
        <ScrollView>
          <View style={{ padding: 20, paddingBottom: 10 }}>
            <Text
              style={[globalStyles.heading, { marginBottom: 10 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
          </View>
          <View
            style={{
              padding: 20,
              backgroundColor: '#F7ECDF',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
          >
            {children?.map((item, index) => {
              if (
                item?.mimeType === 'application/vnd.ekstep.content-collection'
              ) {
                return (
                  item?.children.length > 0 && (
                    <UnitCard key={item?.name} item={item} />
                  )
                );
              } else {
                return (
                  <ContentCard key={item?.name} index={index} item={item} />
                );
              }
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: '#D0C5B4',
  },
  subview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#e9e8d9',
    marginVertical: 20,
  },
  cardContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    height: 200,
  },
});

UnitList.propTypes = {
  route: PropTypes.any,
};

export default UnitList;
