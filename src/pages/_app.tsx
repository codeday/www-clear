import { ThemeProvider, getServerSideProps } from '@codeday/topo/Theme';
import PropTypes from 'prop-types';
import { getSession, SessionProvider } from 'next-auth/react';
import { Provider as UrqlProvider } from 'urql';
import { client } from 'src/urqlclient';

export default function CustomApp({ Component, pageProps: { query, cookies, ...pageProps }, session }: any) {
  return (
    <SessionProvider session={session} refetchInterval={15 * 60}>
      <ThemeProvider useSystemColorMode brandColor="red" cookies={cookies}>
        <UrqlProvider value={client}>
          <Component {...pageProps} />
        </UrqlProvider>
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
CustomApp.getInitialProps = async ({ ctx }: any) => {
  return {
    session: await getSession(ctx),
    ...getServerSideProps({ req: ctx.req }).props,
  };
};
