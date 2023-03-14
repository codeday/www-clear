import {
  Box, Heading, Link, Text,
} from '@codeday/topo/Atom';
import Opossum from '../components/Opossum';
import Page from '../components/Page';

export default function ServerError() {
  return (
    <Page title="Error 500">
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Opossum />
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Heading>Oh no! Error 500</Heading>
        <Text>There seems to have been an error on our part. </Text>
        <Link href="/">Go home</Link>
      </Box>
    </Page>
  );
}
