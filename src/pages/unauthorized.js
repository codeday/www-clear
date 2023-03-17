import {
  Box, Heading, NextLink, Text,
} from '@codeday/topo/Atom';
import React from 'react';
import Opossum from '../components/Opossum';

export default function Unauthorized() {
  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Opossum />
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Heading>Unauthorized</Heading>
        <Text>I'm sorry, but I'm not allowed to let you in here.
          <br />
          If you feel this is in error, please ask your CodeDay point of contact.
        </Text>
        <NextLink href="/">Go home</NextLink>
      </Box>
    </>
  );
}

export function getStaticProps() {
  return { props: { slug: '', title: 'Unauthorized' } };
}
