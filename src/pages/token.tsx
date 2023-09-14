import { Box, Grid, Button, Spinner, Heading, Text, TextInput, Code } from '@codeday/topo/Atom';
import { useSession } from 'next-auth/react';
import { Page } from 'src/components/Page';

export default function Token() {
  const session = useSession();

  if (!session.data) {
    return (
      <Page slug="/">
        <Box textAlign="center">
          <Spinner />
        </Box>
      </Page>
    );
  }
  return (
    <Page slug="/">
      <Box textAlign="center">
        <Heading fontSize="2xl">Clear Authorization Token</Heading>
        <Text mb={4}>
          Set the header <Code>X-Clear-Authorization</Code> to <Code>Bearer [TOKEN]</Code> on graph.codeday.org.
        </Text>
        <TextInput fontSize="xs" value={session.data.clearAuthToken} onClick={(e) => e.currentTarget.select()} />
        <Text mt={4}>Tokens expire every ~30min. You can refresh this page to get a new one.</Text>
      </Box>
    </Page>
  );
}
