import { useEffect } from 'react';
import ReactGA from 'react-ga4';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ReactGA.initialize('G-TY8P792MKT');
    ReactGA.send('pageview');
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;