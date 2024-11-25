import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import HorizontalLine from '../HorizontalLine/HorizontalLine';

import GlobalText from "@components/GlobalText/GlobalText";

const CustomTabView = ({
  tabs,
  activeTabStyle,
  inactiveTabStyle,
  tabTextStyle,
  activeTextStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <View style={styles.container}>
        {/* Tab Headers */}
        <View style={styles.tabHeaderContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabHeader,
                selectedTab === index ? activeTabStyle : inactiveTabStyle,
              ]}
              onPress={() => setSelectedTab(index)}
            >
              <GlobalText
                style={[
                  styles.tabText,
                  selectedTab === index ? activeTextStyle : tabTextStyle,
                ]}
              >
                {tab.title}
              </GlobalText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.tabContentContainer}>
          <View style={{ paddingBottom: 30 }}>{tabs[selectedTab].content}</View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabHeaderContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 20,
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontWeight: 600,
  },
  tabContentContainer: {
    // padding: 10,
    // borderWidth: 1,
    height: '75%',
  },
});

export default CustomTabView;
