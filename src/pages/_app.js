import Theme from '@codeday/topo/Theme'
import PropTypes from 'prop-types'
import { QueryProvider} from "../providers/query";

export default function CustomApp({Component, pageProps: {query, ...pageProps} }) {
    return (
        <Theme>
            <QueryProvider value={query || {}}>
                <Component {...pageProps} />
            </QueryProvider>
        </Theme>
    )
}
CustomApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object,
};
CustomApp.defaultProps = {
    pageProps: {},
};
