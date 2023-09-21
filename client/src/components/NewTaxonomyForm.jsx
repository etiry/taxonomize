import { useForm } from 'react-hook-form';
import styled from 'styled-components';

const NewTaxonomyForm = () => {
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
    <Form onSubmit={handleSubmit(onSubmit)}>
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
  );
};

export default NewTaxonomyForm;

const Form = styled.form``;
const FormGroup = styled.div``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const Button = styled.button``;
