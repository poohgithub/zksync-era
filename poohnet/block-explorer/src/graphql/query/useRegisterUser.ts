import { gql, useMutation } from '@apollo/client';

const REGISTER_USER = gql`
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export const useRegisterUserMutation = () => {
  const [registerUserMutation] = useMutation(REGISTER_USER);
  return { registerUserMutation };
};
