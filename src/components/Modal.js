import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap'
import { closeModal } from '../redux/slices/modalSlice';
import './Modal.sass'

const ModalWindow = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch()
  const modal = useSelector(state => state.modal)

  const handleClose = () => {
    dispatch(closeModal())
  };

  return (
    <>
      <Modal show={modal.isOpen} onHide={handleClose}>
        <Modal.Header className='modal-header' closeButton>
        </Modal.Header>
        <Modal.Body closeButton className='modal-body'>Are you sure you want to send this message?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Send
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalWindow;
