import Theme from '@codeday/topo/Theme';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {QueryProvider} from '../providers/query';
// Antd styles for forms (only datetime picker that works in firefox)
import 'antd/dist/antd.css';

export default function CustomApp({Component, pageProps: {query, ...pageProps}}) {
    moment.tz.setDefault('Etc/UTC');

    return (
        <Theme>
            <QueryProvider value={query || {}}>
                <Component {...pageProps} />
            </QueryProvider>
        </Theme>
    );
}
CustomApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};
CustomApp.defaultProps = {
    pageProps: {},
};
