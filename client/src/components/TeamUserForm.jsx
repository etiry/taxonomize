import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { selectCurrentUserTeam } from '../slices/authSlice';
import {
  useLazyFindUserQuery,
  useAddTeamMutation,
  useAssignTeamMutation
} from '../slices/apiSlice';

const TeamUserForm = ({ toggleModal, formType }) => {
  const dispatch = useDispatch();
  const [findUser] = useLazyFindUserQuery();
  const [addTeam] = useAddTeamMutation();
  const [assignTeam] = useAssignTeamMutation();
  const { id: teamId, name: teamName } = useSelector(selectCurrentUserTeam);

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
      await assignTeam({ team, name: data.name, users: usersToAdd });
      localStorage.setItem('taxonomizeTeam', JSON.stringify(team));
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
  padding: 2em;
`;
const FormGroup = styled.div`
  padding: 0.5em;
`;
const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-right: 0.5rem;
`;
const FormInput = styled.input`
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  border: ${(props) => (props.$noBorder ? null : 'solid 1px gray')};
  margin-right: 0.5rem;
`;
const Button = styled.button`
  margin: 0.5em;
  background: ${(props) => (props.$delete ? '#d11a2a' : null)};
  color: ${(props) => (props.$delete ? '#fff' : null)};
`;
const IconWrapper = styled.div`
  align-self: end;
`;

const Heading = styled.h3`
  margin-bottom: 1em;
`;
