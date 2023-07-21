import {Box, Grid, Button, Spinner, Heading, Text} from '@codeday/topo/Atom';
import { useSession } from 'next-auth/react';
import { TextInput } from '@codeday/topo/Atom';
import Page from '../components/Page';

export default function Token() {
    const session = useSession();

    // @ts-expect-error TS(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
    if (!session?.data || session.status === "loading") {
      return (<Page slug="/"><Box textAlign="center"><Spinner /></Box></Page>);
    }
    return (
      <Page slug="/">
        <Box textAlign="center">
          <Heading fontSize="2xl">Clear Authorization Token</Heading>
          <Text mb={4}>Set the header "X-Clear-Authorization" to "Bearer [TOKEN]" on graph.codeday.org.</Text>
          // @ts-expect-error TS(2322): Type 'unknown' is not assignable to type 'string |... Remove this comment to see the full error message
          // @ts-expect-error TS(2322) FIXME: Type 'unknown' is not assignable to type 'string |... Remove this comment to see the full error message
          <TextInput fontSize="xs" value={session?.data?.clearAuthToken} onClick={(e) => e.target.select()} />
          <Text mt={4}>Tokens expire every ~30min. You can refresh this page to get a new one.</Text>
        </Box>
      </Page>
    );
}
