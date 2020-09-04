import { Button } from '@chakra-ui/core'
import { Form, Formik } from 'formik'

import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'

const Register: React.FC = () => {
  const [, register] = useRegisterMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values) => {
          const response = await register(values)
        }}
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
