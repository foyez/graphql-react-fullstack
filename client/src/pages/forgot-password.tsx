import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Wrapper } from '../components/Wrapper'
import { Formik, Form } from 'formik'
import login from './login'
import { toErrorMap } from '../utils/toErrorMap'
import { InputField } from '../components/InputField'
import { Flex, Link, Button, Box } from '@chakra-ui/core'
import { useForgotPasswordMutation } from '../generated/graphql'

const ForgotPassword: React.FC = () => {
  const [{ data }, forgotPassword] = useForgotPasswordMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword(values)
        }}
      >
        {({ isSubmitting }) =>
          data?.forgotPassword ? (
            <Box>
              If an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
              <Button
                isLoading={isSubmitting}
                type="submit"
                variantColor="teal"
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
