import {
  Box,
  Spinner,
  Heading,
  Text,
  TextInput,
} from '@codeday/topo/Atom';
import { useSession } from 'next-auth/react';
import Page from '../components/Page';

export default function Token() {
  const session = useSession();
  if (!session?.data || session.status === 'loading') {
    return (
      <Box textAlign="center">
        <Spinner />
      </Box>
    );
  }
  return (
    <Box textAlign="center">
      <Heading fontSize="2xl">Clear Authorization Token</Heading>
      <Text mb={4}>
        Set the header "X-Clear-Authorization" to "Bearer [TOKEN]" on
        graph.codeday.org.
      </Text>
      <TextInput
        fontSize="xs"
        value={session?.data?.clearAuthToken}
        onClick={(e) => e.target.select()}
      />
      <Text mt={4}>
        Tokens expire every ~30min. You can refresh this page to get a new
        one.
      </Text>
    </Box>
  );
}

export function getStaticProps() {
  return { props: { slug: '/', title: '' } };
}
