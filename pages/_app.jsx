import "@/styles/globals.css";
import "sweetalert2/src/sweetalert2.scss";
import { SessionProvider } from "next-auth/react";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { ChakraProvider } from "@chakra-ui/react";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default App;
