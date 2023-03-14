import {
  Box, Heading, Link, Text,
} from '@codeday/topo/Atom';
import Opossum from '../components/Opossum';
import Page from '../components/Page';

export default function Unauthorized() {
  return (
    <Page title="Unauthorized">
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Opossum />
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Heading>Unauthorized</Heading>
        <Text>I'm sorry, but I'm not allowed to let you in here.
          <br />
          If you feel this is in error, please ask your CodeDay point of contact.
        </Text>
        <Link href="/">Go home</Link>
      </Box>
    </Page>
  );
}
