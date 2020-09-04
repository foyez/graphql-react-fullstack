import { Formik, Form } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  // FormErrorMessage,
} from '@chakra-ui/core'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'

const Register: React.FC = () => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={(values) => console.log(values)}
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
