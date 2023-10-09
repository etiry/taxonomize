import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { selectCurrentUser, selectCurrentUserTeam } from '../slices/authSlice';
import { selectIsOpen, setIsOpen } from '../slices/selectionsSlice';
import {
  useAddTaxonomyMutation,
  useAssignTaxonomyMutation,
  useGetUsersQuery
} from '../slices/apiSlice';

const ModalForm = ({ toggleModal, formType }) => {
  const dispatch = useDispatch();

  const [addTaxonomy] = useAddTaxonomyMutation();
  const [assignTaxonomy] = useAssignTaxonomyMutation();

  const { id: teamId } = useSelector(selectCurrentUserTeam);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery(teamId);

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
    formData.append('teamId', teamId);
    formData.append('users', data.users);

    const file = data.file[0];
    if (file.type !== 'text/csv') {
      setError('file', {
        type: 'filetype',
        message: 'Only CSVs are valid.'
      });
      return;
    }

    reset();

    try {
      const { data: taxonomyId } = await addTaxonomy(formData);
      data.users.forEach(async (userId) => {
        await assignTaxonomy({ userId, taxonomyId });
      });
    } catch (error) {
      console.log(`request error: ${error}`);
    }

    toggleModal();
  };

  if (isSuccess) {
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <IconWrapper onClick={toggleModal}>
          <FontAwesomeIcon icon={faXmark} />
        </IconWrapper>
        <Heading>Add a Taxonomy</Heading>
        <FormGroup>
          <FormLabel>Taxonomy name:</FormLabel>
          <FormInput type="text" {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </FormGroup>
        <FormGroup>
          <FormLabel>Upload file:</FormLabel>
          <FormInput type="file" {...register('file', { required: true })} />
          {errors.file && <span>File must be of type CSV</span>}
        </FormGroup>
        <FormLabel>Assign team members:</FormLabel>
        <FormGroup>
          {users.map((user) => (
            <FormLabel key={user.id}>
              {' '}
              <FormInput
                type="checkbox"
                {...register('users')}
                value={user.id}
              />
              {user.name}
            </FormLabel>
          ))}
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
};

ModalForm.propTypes = {
  toggleModal: PropTypes.func,
  formType: PropTypes.shape({
    entity: PropTypes.string,
    new: PropTypes.bool
  })
};

export default ModalForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const FormGroup = styled.div``;
const FormLabel = styled.label`
  display: block;
`;
const FormInput = styled.input``;
const Button = styled.button``;
const IconWrapper = styled.div`
  align-self: end;
`;

const Heading = styled.h3``;
