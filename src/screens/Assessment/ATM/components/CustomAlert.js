import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';

const { width } = Dimensions.get('window');

const CustomAlert = ({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
  showCloseButton = false,
  icon,
  iconColor = '#4D4639',
}) => {
  const { t } = useTranslation();

  const handleButtonPress = (button) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleBackdropPress = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.alertContainer}>
              {/* Header with optional close button */}
              {showCloseButton && (
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onDismiss}
                  >
                    <Icon name="x" size={20} color="#4D4639" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                {/* Icon */}
                {icon && (
                  <View style={styles.iconContainer}>
                    <Icon name={icon} size={32} color={iconColor} />
                  </View>
                )}

                {/* Title */}
                {title && <GlobalText style={styles.title}>{title}</GlobalText>}

                {/* Message */}
                {message && (
                  <GlobalText style={styles.message}>{message}</GlobalText>
                )}
              </View>

              {/* Buttons */}
              {buttons.length > 0 && (
                <View style={styles.buttonContainer}>
                  {buttons.length === 1 ? (
                    // Single button - full width
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.singleButton,
                        buttons[0].style === 'destructive' &&
                          styles.destructiveButton,
                        buttons[0].style === 'primary' && styles.primaryButton,
                      ]}
                      onPress={() => handleButtonPress(buttons[0])}
                    >
                      <GlobalText
                        style={[
                          styles.buttonText,
                          buttons[0].style === 'destructive' &&
                            styles.destructiveButtonText,
                          buttons[0].style === 'primary' &&
                            styles.primaryButtonText,
                        ]}
                      >
                        {buttons[0].text}
                      </GlobalText>
                    </TouchableOpacity>
                  ) : (
                    // Multiple buttons - side by side
                    <View style={styles.buttonRow}>
                      {buttons.map((button, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.button,
                            styles.multiButton,
                            button.style === 'destructive' &&
                              styles.destructiveButton,
                            button.style === 'primary' && styles.primaryButton,
                            index < buttons.length - 1 && styles.buttonMargin,
                          ]}
                          onPress={() => handleButtonPress(button)}
                        >
                          <GlobalText
                            style={[
                              styles.buttonText,
                              button.style === 'destructive' &&
                                styles.destructiveButtonText,
                              button.style === 'primary' &&
                                styles.primaryButtonText,
                            ]}
                          >
                            {button.text}
                          </GlobalText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(77, 70, 57, 0.1)',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#4D4639',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#7C766F',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  singleButton: {
    backgroundColor: '#4D4639',
    width: '100%',
  },
  multiButton: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0C5B4',
  },
  primaryButton: {
    backgroundColor: '#FDBE16',
  },
  destructiveButton: {
    backgroundColor: '#BA1A1A',
  },
  buttonMargin: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF', // White text for better contrast on dark backgrounds
  },
  primaryButtonText: {
    color: '#4D4639',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
};

CustomAlert.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func,
      style: PropTypes.oneOf(['default', 'primary', 'destructive']),
    })
  ),
  onDismiss: PropTypes.func,
  showCloseButton: PropTypes.bool,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
};

export default CustomAlert;
