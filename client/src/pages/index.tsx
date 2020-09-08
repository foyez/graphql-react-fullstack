import { withUrqlClient } from 'next-urql'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'

const Index = () => {
  const [{ data }] = usePostsQuery()

  return (
    <Layout>
      <div>Hello World</div>
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
