import Theme from '@codeday/topo/Theme';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { SessionProvider } from "next-auth/react"
import {QueryProvider} from '../providers/query';
// Antd styles for forms (only datetime picker that works in firefox)
import 'antd/dist/antd.css';

export default function CustomApp({Component, pageProps: {query, session, ...pageProps}}) {
    moment.tz.setDefault('Etc/UTC');

    return (
      <SessionProvider session={session} refetchInterval={15 * 60}>
        <Theme brandColor="red">
            <QueryProvider value={query || {}}>
                <Component {...pageProps} />
            </QueryProvider>
        </Theme>
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
