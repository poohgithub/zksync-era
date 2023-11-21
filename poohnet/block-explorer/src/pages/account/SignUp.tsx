import React from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Logo } from '../../components/layout/Logo';
import { PasswordField } from '../../components/authentication/PasswordField';
import OAuthButtonGroup from '../../components/authentication/OAuthButtonGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterUserMutation } from '../../graphql/query/useRegisterUser';

function SignUp() {
  const navigate = useNavigate();
  const { registerUserMutation } = useRegisterUserMutation();
  const toast = useToast({
    position: 'bottom-right',
    variant: 'variant',
  });
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .matches(passwordRules, {
          message: 'Please create a stronger password',
        })
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));

      const params = {
        email: values.email,
        password: values.password,
      };
      registerUserMutation({
        variables: params,
        onCompleted(data: any) {
          console.debug('registerUserMutation > Compete:', data);
          toast({
            title: 'Successfully register user.',
            status: 'success',
          });
          navigate('/signin');
        },
        onError(err: any) {
          console.debug('registerUserMutation > Error:', err);
          toast({
            title: 'Create failed to register user.',
            status: 'error',
          });
        },
      });
    },
  });

  return (
    <Stack spacing="8">
      <Stack spacing="6">
        <Logo />
        <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
          <Heading size={{ base: 'xs', md: 'sm' }}>Create an account</Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Already have an accountt?</Text>
            <Button as={Link} to="/signin" variant="link" colorScheme="blue">
              Log in
            </Button>
          </HStack>
        </Stack>
      </Stack>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={{ base: 'transparent', sm: 'bg-surface' }}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing="6">
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="5">
              <FormControl
                id="email"
                isInvalid={!!formik.errors.email && !!formik.touched.email}
              >
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
              {!!formik.errors.email && !!formik.touched.email ? (
                <div>{formik.errors.email}</div>
              ) : null}
              <PasswordField
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!formik.errors.password && !!formik.touched.password
                }
              />
              {!!formik.errors.password && !!formik.touched.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!formik.errors.confirmPassword &&
                  !!formik.touched.confirmPassword
                }
              />
              {!!formik.errors.confirmPassword &&
              !!formik.touched.confirmPassword ? (
                <div>{formik.errors.confirmPassword}</div>
              ) : null}
            </Stack>
            <Stack spacing="6">
              <Button type="submit" variant="primary">
                Sign Up
              </Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </form>
        </Stack>
      </Box>
    </Stack>
  );
}

export default SignUp;
