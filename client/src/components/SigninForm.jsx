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
    try {
      const { id, email, token, team } = await login(data).unwrap();
      // Being that the result is handled in extraReducers in authSlice,
      // we know that we're authenticated after this, so the user
      // and token will be present in the store
      localStorage.setItem('taxonomizeId', id);
      localStorage.setItem('taxonomizeEmail', email);
      localStorage.setItem('taxonomizeToken', token);
      localStorage.setItem('taxonomizeTeam', team);
      navigate('/');
    } catch (error) {
      console.log(`${error}`);
      navigate('/');
    }

    reset();
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
