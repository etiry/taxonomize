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
      navigate('/');
    } catch (error) {
      console.log(`request error: ${error}`);
    }

    reset();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Heading>Sign up</Heading>
        <FormGroup>
          <FormLabel>Full name:</FormLabel>
          <FormInput type="text" {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </FormGroup>
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
    </Container>
  );
};

export default SignupForm;

const Container = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

const Form = styled.form``;
const Heading = styled.h2``;
const FormGroup = styled.div`
  padding: 0.2rem;
`;
const FormLabel = styled.label`
  font-weight: 500;
  margin-right: 0.5rem;
`;
const FormInput = styled.input`
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  border: solid 1px gray;
`;
const Button = styled.button``;
