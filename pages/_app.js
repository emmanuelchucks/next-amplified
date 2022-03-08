import { Amplify } from "aws-amplify";
import config from "../aws-exports";
import "../styles/globals.css";

Amplify.configure({ ...config });

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
