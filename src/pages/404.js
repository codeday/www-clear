import {
  Box, Heading, NextLink, Text,
} from '@codeday/topo/Atom';
import { NextSeo } from 'next-seo';
import React from 'react';
import Opossum from '../components/Opossum';
import Page from '../components/Page';

export default function NotFound() {
  return (
    <>
      <NextSeo
        title="404 Not Found"
      />
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Opossum />
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Heading>Oh no! Error 404</Heading>
        <Text>There seems to be nothing here. </Text>
        <NextLink href="/">Go home</NextLink>
      </Box>
    </>
  );
}
export function getStaticProps() {
  return { props: { title: '404 Not Found' } };
}
