import { Button } from '@chakra-ui/core'
import { Form, Formik } from 'formik'

import { InputField } from '../components/InputField'
import { useCreatePostMutation } from '../generated/graphql'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'
import { AuthRoute } from '../components/AuthRoute'

const CreatePost: React.FC = () => {
  const router = useRouter()
  const [, createPost] = useCreatePostMutation()

  return (
    <AuthRoute>
      <Layout variant="small">
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values) => {
            const { error } = await createPost({ postInput: values })
            if (!error) {
              router.push('/')
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="title" label="Title" />
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
              <Button
                isLoading={isSubmitting}
                type="submit"
                variantColor="teal"
              >
                Create post
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </AuthRoute>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
