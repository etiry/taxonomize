import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSignupMutation } from '../slices/apiSlice';

const SignupForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm();
  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (data) => {
    try {
      await signup(data).unwrap();
      // Being that the result is handled in extraReducers in authSlice,
      // we know that we're authenticated after this, so the user
      // and token will be present in the store
      navigate('/');
    } catch (error) {
      console.log(`request error: ${error}`);
    }

    reset();
  };

  return (
    <SignupContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Heading>Sign up</Heading>
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
    </SignupContainer>
  );
};

export default SignupForm;

const SignupContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

const Form = styled.form``;
const Heading = styled.h2``;
const FormGroup = styled.div``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const Button = styled.button``;
