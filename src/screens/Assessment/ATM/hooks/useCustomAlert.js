import { useState } from 'react';
import { useTranslation } from '../../../../context/LanguageContext';

const useCustomAlert = () => {
  const { t } = useTranslation();

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    icon: null,
    iconColor: '#4D4639',
    showCloseButton: false,
  });

  const showAlert = ({
    title,
    message,
    buttons = [],
    icon,
    iconColor = '#4D4639',
    showCloseButton = false,
  }) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
      icon,
      iconColor,
      showCloseButton,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // Predefined alert types for common use cases
  const showConfirmAlert = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = t('confirm'),
    cancelText = t('cancel'),
    icon = 'alert',
  }) => {
    showAlert({
      title,
      message,
      icon,
      buttons: [
        {
          text: cancelText,
          onPress: onCancel,
          style: 'default',
          textColor: '#000000',
        },
        {
          text: confirmText,
          onPress: onConfirm,
          style: 'primary',
        },
      ],
    });
  };

  const showDeleteAlert = ({
    title = t('delete_item'),
    message = t('are_you_sure_you_want_to_delete_this_item'),
    onConfirm,
    onCancel,
    confirmText = t('delete'),
    cancelText = t('cancel'),
  }) => {
    showAlert({
      title,
      message,
      icon: 'trash',
      iconColor: '#BA1A1A',
      buttons: [
        {
          text: cancelText,
          onPress: onCancel,
          style: 'default',
          textColor: '#000000',
        },
        {
          text: confirmText,
          onPress: onConfirm,
          style: 'destructive',
        },
      ],
    });
  };

  const showSuccessAlert = ({
    title = t('success'),
    message,
    onOk,
    okText = t('OK'),
  }) => {
    showAlert({
      title,
      message,
      icon: 'check-circle',
      iconColor: '#28A745',
      buttons: [
        {
          text: okText,
          onPress: onOk,
          style: 'primary',
        },
      ],
    });
  };

  const showErrorAlert = ({
    title = t('error'),
    message,
    onOk,
    okText = t('OK'),
  }) => {
    showAlert({
      title,
      message,
      icon: 'alert',
      iconColor: '#BA1A1A',
      buttons: [
        {
          text: okText,
          onPress: onOk,
          style: 'default',
        },
      ],
    });
  };

  const showWarningAlert = ({
    title = t('warning'),
    message,
    onOk,
    okText = t('OK'),
  }) => {
    showAlert({
      title,
      message,
      icon: 'alert',
      iconColor: '#FFA500',
      buttons: [
        {
          text: okText,
          onPress: onOk,
          style: 'default',
        },
      ],
    });
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
    showConfirmAlert,
    showDeleteAlert,
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
  };
};

export default useCustomAlert;
