import {
  Box, Grid, Button, Spinner,
} from '@codeday/topo/Atom';
import { useSession } from 'next-auth/react';
import { TransportBusSchool, UiFolder, ToTheMoon } from '@codeday/topocons';
import React from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const session = useSession();
  const router = useRouter();
  if (session?.data && !session?.data?.isAdmin && typeof window !== 'undefined') router.push('/events');
  if (!session?.data || session.status === 'loading' || !session.data.isAdmin) {
    return (<Box textAlign="center"><Spinner /></Box>);
  }
  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={4}>
      <Button href="/events" as="a" fontSize="lg" h={24} textAlign="center" lineHeight={0.7}>
        <Box>
          <Box fontSize="4xl" mb={0}><TransportBusSchool /></Box><br />
          Events
        </Box>
      </Button>
      <Button href="/groups" as="a" fontSize="lg" h={24} textAlign="center" lineHeight={0.7}>
        <Box>
          <Box fontSize="4xl" mb={0}><UiFolder /></Box><br />
          Groups
        </Box>
      </Button>
      <Button href="/admin" as="a" fontSize="lg" h={24} textAlign="center" lineHeight={0.7}>
        <Box>
          <Box fontSize="4xl" mb={0}><ToTheMoon /></Box><br />
          Admin
        </Box>
      </Button>
    </Grid>
  );
}

export function getStaticProps() {
  return { props: { slug: '/' } };
}
