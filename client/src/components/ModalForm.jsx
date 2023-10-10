import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { selectCurrentUser, selectCurrentUserTeam } from '../slices/authSlice';
import { selectSelectedTaxonomyId } from '../slices/selectionsSlice';
import {
  useAddDataMutation,
  useAddTaxonomyMutation,
  useAssignDataMutation,
  useAssignTaxonomyMutation,
  useGetTeamUsersQuery,
  useGetTaxonomyUsersQuery
} from '../slices/apiSlice';

const ModalForm = ({ toggleModal, formType }) => {
  const [addTaxonomy] = useAddTaxonomyMutation();
  const [assignTaxonomy] = useAssignTaxonomyMutation();
  const [addData] = useAddDataMutation();
  const [assignData] = useAssignDataMutation();

  const { id: teamId } = useSelector(selectCurrentUserTeam);
  // const { selectedTaxonomyId } = useSelector(selectSelectedTaxonomyId);
  const selectedTaxonomyId = 14;
  const selectedDataId = 1;

  const { data: teamUsers, isSuccess: retrievedTeamUsers } =
    useGetTeamUsersQuery(teamId);

  const { data: taxonomyUsers, isSuccess: retrievedTaxonomyUsers } =
    useGetTaxonomyUsersQuery(selectedTaxonomyId);

  const users = formType.entity === 'Taxonomy' ? teamUsers : taxonomyUsers;

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
    formData.append('users', data.users);
    formData.append('new', formType.new);
    if (formType.entity === 'Taxonomy') {
      formData.append('teamId', teamId);
      if (!formType.new) {
        formData.append('taxonomyId', selectedTaxonomyId);
      }
    } else {
      formData.append('taxonomyId', selectedTaxonomyId);
      if (!formType.new) {
        formData.append('dataId', selectedDataId);
      }
    }
    console.log(data.users);

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
      if (formType.entity === 'Taxonomy') {
        const { data: taxonomyId } = await addTaxonomy(formData);
        Array.from(data.users).forEach(async (userId) => {
          await assignTaxonomy({ userId, taxonomyId });
        });
      } else {
        const { data: dataId } = await addData(formData);
        Array.from(data.users).forEach(async (userId) => {
          await assignData({ userId, dataId });
        });
      }
    } catch (error) {
      console.log(`request error: ${error}`);
    }

    toggleModal();
  };

  if (retrievedTeamUsers && retrievedTaxonomyUsers) {
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
