import { ThemeProvider, getServerSideProps } from '@codeday/topo/Theme';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { getSession, SessionProvider } from 'next-auth/react';
import { QueryProvider } from '../providers/query';

export default function CustomApp({ Component, pageProps: { query, cookies, ...pageProps }, session }) {
  moment.tz.setDefault('Etc/UTC');

  return (
    <SessionProvider session={session} refetchInterval={15 * 60}>
      <ThemeProvider brandColor="red" cookies={cookies}>
        <QueryProvider value={query || {}}>
          <Component {...pageProps} />
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
CustomApp.getInitialProps = async ({ ctx }) => ({
  session: await getSession(ctx),
  ...getServerSideProps({ req: ctx.req }).props,
});
