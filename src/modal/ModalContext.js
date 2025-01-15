// src/modal/ModalContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a Context for the Modal
const ModalContext = createContext();

// Custom hook to use modal context
export const useModal = () => useContext(ModalContext);

// ModalProvider to wrap around your app
export const ModalProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const showModal = (content) => {
    setModalContent(content); // Set the modal content
    setIsModalVisible(true);  // Show the modal
  };

  const hideModal = () => {
    setIsModalVisible(false); // Hide the modal
  };

  return (
    <ModalContext.Provider value={{ isModalVisible, modalContent, showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};
