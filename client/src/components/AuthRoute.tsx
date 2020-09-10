import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useMeQuery } from '../generated/graphql'

export const AuthRoute: React.FC = ({ children }) => {
  const [{ data, fetching }] = useMeQuery()
  const router = useRouter()

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace('/login?next=' + router.pathname)
    }
  }, [data, fetching])

  return !fetching && data?.me ? <>{children}</> : <div>Loading...</div>
}
