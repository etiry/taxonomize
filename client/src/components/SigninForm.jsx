import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSigninMutation } from '../slices/apiSlice';

const SigninForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm();
  const [login, { isLoading }] = useSigninMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    reset();

    try {
      await login(data).unwrap();
      // Being that the result is handled in extraReducers in authSlice,
      // we know that we're authenticated after this, so the user
      // and token will be present in the store
      navigate('/');
    } catch (error) {
      console.log(`request error: ${error}`);
      navigate('/');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading>Sign in</Heading>
      <FormGroup>
        <FormLabel>Email:</FormLabel>
        <FormInput type="text" {...register('email', { required: true })} />
        {errors.email && <span>This field is required</span>}
      </FormGroup>
      <FormGroup>
        <FormLabel>Password:</FormLabel>
        <FormInput
          type="password"
          {...register('password', { required: true })}
        />
        {errors.password && <span>This field is required</span>}
      </FormGroup>
      <Button>Submit</Button>
    </Form>
  );
};

export default SigninForm;

const Form = styled.form``;
const Heading = styled.h2``;
const FormGroup = styled.div``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const Button = styled.button``;
