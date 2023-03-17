import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
  getServerSideProps as topoGetServerSideProps,
} from '@codeday/topo/Theme';
import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { Box, Spinner } from '@codeday/topo/Atom';
import { Router } from 'next/router';
import App from 'next/app';
import Page from '../components/Page';
import { nextAuthOptions } from './api/auth/[...nextauth]';
import { QueryProvider } from '../providers/query';

export default function CustomApp({
  Component,
  pageProps: {
    query, cookies, title, slug, ...pageProps
  },
  session,
}) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true));
    Router.events.on('routeChangeComplete', () => setLoading(false));
    Router.events.on('routeChangeError', () => setLoading(false));
    return () => {
      Router.events.off('routeChangeStart', () => setLoading(true));
      Router.events.off('routeChangeComplete', () => setLoading(false));
      Router.events.off('routeChangeError', () => setLoading(false));
    };
  }, [Router.events]);

  return (
    <SessionProvider session={session} refetchInterval={15 * 60}>
      <ThemeProvider brandColor="red" cookies={cookies}>
        <QueryProvider value={query || {}}>
          {loading ? (
            <Page>
              <Box textAlign="center">
                <Spinner />
              </Box>
            </Page>
          ) : (
            <Page slug={slug} title={title}><Component {...pageProps} /></Page>
          )}
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
CustomApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
CustomApp.defaultProps = {
  pageProps: {},
};
export async function getServerSideProps({ req, res }) {
  return {
    session: await getServerSession(req, res, nextAuthOptions),
    props: {
      ...topoGetServerSideProps({ req, res }).props,
    },
  };
}
