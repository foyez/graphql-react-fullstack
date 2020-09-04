import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'
import { useMeQuery } from '../generated/graphql'

export const NavBar: React.FC = () => {
  const [{ data, fetching }] = useMeQuery()

  let body = null
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link">logout</Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tan" p={4}>
      <NextLink href="/">
        <Link>Home</Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
    </Flex>
  )
}
