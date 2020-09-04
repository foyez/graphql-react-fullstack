import { Formik, Form } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  // FormErrorMessage,
} from '@chakra-ui/core'
import { useMutation } from 'urql'

import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'

const REGISTER_MUTATION = `
mutation Register($username: String!, $email: String!, $password: String!) {
  register(credentials: {username: $username, email: $email, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      username
      email
    }
  }
}
`

const Register: React.FC = () => {
  const [, register] = useMutation(REGISTER_MUTATION)

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={(values) => register(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <InputField name="email" placeholder="email" label="Email" />
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Button isLoading={isSubmitting} type="submit" variantColor="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register
