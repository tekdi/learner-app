import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import GlobalText from '@components/GlobalText/GlobalText';

const ATMTabView = ({
  tabs,
  activeTabIndex = 0,
  onTabChange,
  activeTabStyle,
  inactiveTabStyle,
  tabTextStyle,
  activeTextStyle,
  t,
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTabIndex);

  // Update internal state when external activeTabIndex changes
  useEffect(() => {
    setSelectedTab(activeTabIndex);
  }, [activeTabIndex]);

  const handleTabPress = (index) => {
    setSelectedTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

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
              onPress={() => handleTabPress(index)}
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

        {/* Tab Content - Scrollable */}
        <View style={styles.tabContentWrapper}>
          <ScrollView
            style={styles.tabContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Assessment Count Display - Inside Scrollable Area */}
            <View style={styles.countContainer}>
              {tabs[selectedTab]?.count && (
                <GlobalText style={styles.countText}>
                  {tabs[selectedTab].count || 0}{' '}
                  {tabs[selectedTab].count === 1
                    ? t('Total_Assessment')
                    : t('Total_Assessments')}
                </GlobalText>
              )}
            </View>

            <View style={{ paddingBottom: 30 }}>
              {tabs[selectedTab].content}
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    marginTop: 0,
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontWeight: 600,
  },
  countContainer: {
    // paddingVertical: 5,
    paddingBottom: 0,
    paddingTop: 15,
    paddingHorizontal: 0,
    borderBottomWidth: 0,
    borderColor: '#E5E5E5',
  },
  countText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabContentWrapper: {
    flex: 1,
  },
  tabContentContainer: {
    flex: 1,
  },
});

export default ATMTabView;
