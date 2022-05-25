import {Box, Grid, Button} from '@codeday/topo/Atom';
import { useSession } from 'next-auth/react';
import { TransportBusSchool, UiFolder, ToTheMoon } from '@codeday/topocons/Icon';
import Page from '../components/Page';
import { Icon } from '@chakra-ui/react';

export default function Index() {
    const session = useSession();
    if (!session?.data?.isAdmin) window.location = '/events';
    return (
        <Page slug="/">
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)'}} gap={4}>
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
