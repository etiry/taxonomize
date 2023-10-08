import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Modal from 'styled-react-modal';
import { selectIsOpen, setIsOpen } from '../slices/selectionsSlice';

const FormModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpen);
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

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file[0]);

    const file = data.file[0];
    if (file.type !== 'text/csv') {
      setError('file', {
        type: 'filetype',
        message: 'Only CSVs are valid.'
      });
      return;
    }
    reset();

    const requestOptions = {
      method: 'POST',
      body: formData
    };

    try {
      const response = await fetch('/api/taxonomy', requestOptions);
    } catch (error) {
      console.log(`request error: ${error}`);
    }
  };

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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <IconWrapper onClick={toggleModal}>
          <FontAwesomeIcon icon={faXmark} />
        </IconWrapper>
        <FormGroup>
          <FormLabel>Taxonomy name:</FormLabel>
          <FormInput type="text" {...register('name', { required: true })} />
          {errors.taxonomyName && <span>This field is required</span>}
        </FormGroup>
        <FormGroup>
          <FormLabel>Upload file:</FormLabel>
          <FormInput type="file" {...register('file', { required: true })} />
          {errors.file && <span>File must be of type CSV</span>}
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    </StyledModal>
  );
};

export default FormModal;

const StyledModal = Modal.styled`
  width: 20rem;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  opacity: ${(props) => props.opacity};
  transition : all 0.3s ease-in-out;`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const FormGroup = styled.div``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const Button = styled.button``;
const IconWrapper = styled.div`
  align-self: end;
`;
