/* eslint-disable prefer-destructuring */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import debounce from 'debounce';
import { selectCurrentUser, selectCurrentUserTeam } from '../slices/authSlice';
import {
  selectSelectedTaxonomyId,
  selectSelectedDataId,
  setSelectedTaxonomyId
} from '../slices/selectionsSlice';
import {
  apiSlice,
  useAddDataMutation,
  useAddTaxonomyMutation,
  useAssignDataMutation,
  useAssignTaxonomyMutation,
  useGetTeamUsersQuery,
  useGetTaxonomyUsersQuery,
  useDeleteTaxonomyMutation
} from '../slices/apiSlice';
import { useGetPredictionsMutation } from '../slices/rotaSlice';

const ModalForm = ({ toggleModal, formType }) => {
  const dispatch = useDispatch();
  const [addTaxonomy] = useAddTaxonomyMutation();
  const [assignTaxonomy] = useAssignTaxonomyMutation();
  const [addData] = useAddDataMutation();
  const [assignData] = useAssignDataMutation();
  const [deleteTaxonomy] = useDeleteTaxonomyMutation();
  const [getPredictions] = useGetPredictionsMutation();

  const userId = useSelector(selectCurrentUser);
  const { id: teamId } = useSelector(selectCurrentUserTeam);
  const selectedTaxonomyId = useSelector(selectSelectedTaxonomyId);
  const selectedTaxonomy = apiSlice.endpoints.getTaxonomies.useQueryState(
    userId,
    {
      selectFromResult: ({ data }) =>
        data?.find((d) => d.taxonomy_id === parseInt(selectedTaxonomyId))
    }
  );
  const selectedDataId = useSelector(selectSelectedDataId);
  const selectedData = apiSlice.endpoints.getDataByTaxonomy.useQueryState(
    selectedTaxonomyId,
    {
      selectFromResult: ({ data }) =>
        data?.nodes.find((d) => d.id === parseInt(selectedDataId))
    }
  );

  const { data: teamUsers, isSuccess: retrievedTeamUsers } =
    useGetTeamUsersQuery(teamId);

  const { data: taxonomyUsers, isSuccess: retrievedTaxonomyUsers } =
    useGetTaxonomyUsersQuery(selectedTaxonomyId);

  const dataUsers = apiSlice.endpoints.getDataByTaxonomy.useQueryState(
    selectedTaxonomyId,
    {
      selectFromResult: ({ data }) => {
        try {
          return data?.nodes
            .find((d) => d.id === parseInt(selectedDataId))
            .users.map((user) => ({
              id: user
            }));
        } catch (error) {
          return [];
        }
      }
    }
  );

  const users = formType.entity === 'Taxonomy' ? teamUsers : taxonomyUsers;

  const setFormValues = () => {
    let selectedName = '';
    let assignedUsers = [];

    if (
      !formType.new &&
      selectedTaxonomy &&
      taxonomyUsers &&
      formType.entity === 'Taxonomy'
    ) {
      selectedName = selectedTaxonomy.name || '';
      assignedUsers = taxonomyUsers || [];
    } else if (
      !formType.new &&
      formType.entity === 'Dataset' &&
      selectedData &&
      dataUsers
    ) {
      selectedName = selectedData.name || '';
      assignedUsers = dataUsers || [];
    }

    return [selectedName, assignedUsers];
  };

  const [initialName, initialAssignedUsers] = setFormValues();

  const [name, setName] = useState(initialName);

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

    // const testFunc = async (file) => {
    //   const attachPreds = async () => {
    //     const rows = [
    //       ...new Set(fr.result.replace(/\r|"/g, '').split(/\n/).slice(1))
    //     ];
    //     const preds = await getPredictions({
    //       inputs: rows.slice(-2),
    //       options: { wait_for_model: true }
    //     });
    //     rowsWithPreds = rows.slice(-2).map((ob, index) => ({
    //       text: ob,
    //       pred_category_name: preds.data[index][0].label,
    //       pred_category_conf: preds.data[index][0].score
    //     }));
    //   };

    //   const fr = new FileReader();
    //   let rowsWithPreds;

    //   fr.addEventListener('load', attachPreds);

    //   if (file) {
    //     fr.readAsText(file);
    //   }

    //   return rowsWithPreds;
    // };

    // console.log(await testFunc(data.file[0]));

    const file = data.file[0];
    if (file && file.type !== 'text/csv') {
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

  const handleDeleteTaxonomy = async () => {
    await deleteTaxonomy(selectedTaxonomyId);
    dispatch(setSelectedTaxonomyId(null));
  };

  if (
    (formType.entity === 'Taxonomy' && retrievedTeamUsers) ||
    (formType.entity === 'Dataset' && retrievedTaxonomyUsers)
  ) {
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
          <FormLabel>Upload file:</FormLabel>
          <FormInput
            type="file"
            {...register('file', { required: formType.new })}
            $noBorder
          />
          {errors.file && <span>File must be of type CSV</span>}
        </FormGroup>
        <FormGroup>
          <FormLabel>Assign team members:</FormLabel>
          {users.map((user) => (
            <FormGroup key={user.id}>
              <FormInput
                type="checkbox"
                {...register('users')}
                value={user.id}
                defaultChecked={initialAssignedUsers.find(
                  (assignedUser) => assignedUser.id === user.id
                )}
              />
              <FormLabel $inline>{user.name}</FormLabel>
            </FormGroup>
          ))}
        </FormGroup>
        <Button>Submit</Button>
        {!formType.new && formType.entity === 'Taxonomy' ? (
          <Button onClick={handleDeleteTaxonomy} $delete>
            Delete {formType.entity}
          </Button>
        ) : null}
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
  padding: 2em;
  width: 90%;
`;
const FormGroup = styled.div`
  padding: 0.5em;
`;
const FormLabel = styled.label`
  display: ${(props) => (props.$inline ? 'inline' : 'block')};
  font-weight: 500;
  margin-right: 0.5rem;
`;
const FormInput = styled.input`
  padding: 0.25rem;
  border-radius: 1rem;
  border: ${(props) => (props.$noBorder ? null : 'solid 1px gray')};
  margin-right: 0.5rem;
`;
const Button = styled.button`
  margin: 0.5em;
  background: ${(props) => (props.$delete ? '#d11a2a' : '#ffbd54')};
  color: ${(props) => (props.$delete ? '#fff' : null)};
`;
const IconWrapper = styled.div`
  align-self: end;
`;

const Heading = styled.h3`
  margin-bottom: 1em;
`;
