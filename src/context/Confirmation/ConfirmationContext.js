import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

// Create Context
const ConfirmationContext = createContext();

// Provider Component
export const ConfirmationProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [yesText, setYesText] = useState('');
  const [noText, setNoText] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  // Show Confirmation Dialog
  const showConfirmation = useCallback((msg, onYes, yes, no) => {
    setMessage(msg);
    setOnConfirm(() => onYes);
    setYesText(yes);
    setNoText(no);
    setIsVisible(true);
  }, []);

  // Hide Confirmation Dialog
  const hideConfirmation = () => setIsVisible(false);

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      {isVisible && (
        <ConfirmationDialog
          message={message}
          onConfirm={() => {
            onConfirm();
            hideConfirmation();
          }}
          onCancel={hideConfirmation}
          yesText={yesText}
          noText={noText}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

// Hook to use the context
export const useConfirmation = () => useContext(ConfirmationContext);
