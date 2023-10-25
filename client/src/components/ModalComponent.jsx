import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'styled-react-modal';
import {
  selectIsOpen,
  setIsOpen,
  selectFormType
} from '../slices/selectionsSlice';
import ModalForm from './ModalForm';
import TeamUserForm from './TeamUserForm';

const ModalComponent = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpen);
  const formType = useSelector(selectFormType);
  const [opacity, setOpacity] = useState(0);

  const toggleModal = () => {
    setOpacity(0);
    dispatch(setIsOpen());
  };

  const afterOpen = () => {
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  };

  const beforeClose = () =>
    new Promise((resolve) => {
      setOpacity(0);
      setTimeout(resolve, 300);
    });

  return (
    <StyledModal
      isOpen={isOpen}
      afterOpen={afterOpen}
      beforeClose={beforeClose}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
      opacity={opacity}
      backgroundProps={{ opacity }}
    >
      {formType.entity === 'Team' ? (
        <TeamUserForm toggleModal={toggleModal} formType={formType} />
      ) : (
        <ModalForm toggleModal={toggleModal} formType={formType} />
      )}
    </StyledModal>
  );
};

export default ModalComponent;

const StyledModal = Modal.styled`
  min-width: 25%;
  min-height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  opacity: ${(props) => props.opacity};
  transition : all 0.3s ease-in-out;
  border-radius: 1rem;
`;
