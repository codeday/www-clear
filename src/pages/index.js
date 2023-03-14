import {
  Box, Grid, Button, Spinner,
} from '@codeday/topo/Atom';
import { useSession } from 'next-auth/react';
import { TransportBusSchool, UiFolder, ToTheMoon } from '@codeday/topocons';
import Page from '../components/Page';

export default function Index() {
  const session = useSession();
  if (session?.data && !session?.data?.isAdmin && typeof window !== 'undefined') window.location = '/events';
  if (!session?.data || session.status === 'loading' || !session.data.isAdmin) {
    return (<Page slug="/"><Box textAlign="center"><Spinner /></Box></Page>);
  }
  return (
    <Page slug="/">
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={4}>
        <Button as="a" href="/events" fontSize="lg" h={24} textAlign="center" lineHeight={0.7}>
          <Box>
            <Box fontSize="4xl" mb={0}><TransportBusSchool /></Box><br />
            Events
          </Box>
        </Button>
        <Button as="a" href="/groups" fontSize="lg" h={24} textAlign="center" lineHeight={0.7}>
          <Box>
            <Box fontSize="4xl" mb={0}><UiFolder /></Box><br />
            Groups
          </Box>
        </Button>
        <Button as="a" href="/admin" fontSize="lg" h={24} textAlign="center" lineHeight={0.7}>
          <Box>
            <Box fontSize="4xl" mb={0}><ToTheMoon /></Box><br />
            Admin
          </Box>
        </Button>
      </Grid>
    </Page>
  );
}
