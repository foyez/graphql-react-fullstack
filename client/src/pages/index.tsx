import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'

import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'
import { Link } from '@chakra-ui/core'

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  })

  return (
    <Layout variant="regular">
      <NextLink href="/create-post">
        <Link>Create post</Link>
      </NextLink>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data?.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
