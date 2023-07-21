import {
  Box, Heading, Link, Text,
} from '@codeday/topo/Atom';
import Opossum from '../components/Opossum';
import Page from '../components/Page';

export default function NotFound() {
  return (
    <Page title="404 Not Found">
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Opossum />
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Heading>Oh no! Error 404</Heading>
        <Text>There seems to be nothing here. </Text>
        <Link href="/">Go home</Link>
      </Box>
    </Page>
  );
}
