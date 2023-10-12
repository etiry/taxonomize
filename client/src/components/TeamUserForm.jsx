import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { selectCurrentUser, selectCurrentUserTeam } from '../slices/authSlice';
import {
  apiSlice,
  useLazyFindUserQuery,
  useAddTeamMutation,
  useAssignTeamMutation
} from '../slices/apiSlice';

const TeamUserForm = ({ toggleModal, formType }) => {
  const [findUser] = useLazyFindUserQuery();
  const [addTeam] = useAddTeamMutation();
  const [assignTeam] = useAssignTeamMutation();
  const { id: teamId, name: teamName } = useSelector(selectCurrentUserTeam);
  const { data: users } = apiSlice.endpoints.getTeamUsers.useQueryState(teamId);

  const [name, setName] = useState(teamName || '');
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [emailToCheck, setEmailToCheck] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm();

  const checkUser = async (event) => {
    event.preventDefault();
    const result = await findUser(emailToCheck);
    if (!result.data) {
      setError('email', {
        type: 'email',
        message: 'User not found'
      });
      return;
    }
    setUsersToAdd([result.data[0], ...usersToAdd]);
    setEmailToCheck('');
  };

  const onSubmit = async (data) => {
    try {
      const { data: team } = await addTeam({
        name: data.name,
        new: formType.new,
        teamId
      });
      console.log(team);
      await assignTeam({ team, users: usersToAdd });
    } catch (error) {
      console.log(`${error}`);
    }

    reset();
    toggleModal();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <IconWrapper onClick={toggleModal}>
        <FontAwesomeIcon icon={faXmark} />
      </IconWrapper>
      <Heading>
        {formType.new ? 'Add a ' : 'Edit '} {formType.entity}
      </Heading>
      <FormGroup>
        <FormLabel>{formType.entity} name:</FormLabel>
        <FormInput
          type="text"
          {...register('name', { required: true })}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && <span>This field is required</span>}
      </FormGroup>
      <FormGroup>
        {usersToAdd.map((user) => (
          <FormLabel key={user.id}>{user.email}</FormLabel>
        ))}
      </FormGroup>
      <FormGroup>
        <FormLabel>Enter the email of a user you would like to add:</FormLabel>
        <FormInput
          type="email"
          {...register('email')}
          value={emailToCheck}
          onChange={(event) => setEmailToCheck(event.target.value)}
        />
        {errors.email && <span>User not found</span>}
        <Button onClick={checkUser}>Add</Button>
      </FormGroup>

      <Button>Submit</Button>
    </Form>
  );
};

TeamUserForm.propTypes = {
  toggleModal: PropTypes.func,
  formType: PropTypes.shape({
    entity: PropTypes.string,
    new: PropTypes.bool
  })
};

export default TeamUserForm;

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
