import React from 'react';
import {useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap'


const ModalWindow = (props) => {
  const modal = useSelector(state => state.modal)

  return (
    <>
      <Modal show={modal.isOpen} onHide={props.cancel}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={props.confirm}>
            {props.confirmButton}
          </Button>
          <Button variant="secondary" onClick={props.cancel}>
            {props.cancelButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalWindow;
