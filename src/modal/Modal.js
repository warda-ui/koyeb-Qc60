// src/modal/Modal.js
import React from 'react';
import { useModal } from './ModalContext';
import './Modal.css';  // Importing custom CSS for the modal

const Modal = () => {
  const { isModalVisible, modalContent, hideModal } = useModal();

  if (!isModalVisible) return null; // Don't render the modal if it's not visible

  return (
    <div className="modal-overlay" onClick={hideModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={hideModal}>X</button>
        </div>
        <div className="modal-body">
          {modalContent}
        </div>
        <div className="modal-footer">
          <button className="close-btn" onClick={hideModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
