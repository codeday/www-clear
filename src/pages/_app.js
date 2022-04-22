import {ThemeProvider} from '@codeday/topo/Theme';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {getSession, SessionProvider} from "next-auth/react"
import {QueryProvider} from '../providers/query';
// Antd styles for forms (only datetime picker that works in firefox)
import 'antd/dist/antd.css';

export default function CustomApp({ Component, pageProps: {query, ...pageProps}, session }) {
    moment.tz.setDefault('Etc/UTC');

    return (
      <SessionProvider session={session} refetchInterval={15 * 60}>
        <ThemeProvider brandColor="red">
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
CustomApp.getInitialProps = async ({ ctx }) => {
	const session = await getSession(ctx);
	return { session };
};

