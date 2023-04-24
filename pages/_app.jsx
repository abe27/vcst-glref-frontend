import "@/styles/globals.css";
import "sweetalert2/src/sweetalert2.scss";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_Thai } from "next/font/google";

const fonts = Noto_Sans_Thai({ weight: "400", subsets: ["latin"] });
// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { ChakraProvider } from "@chakra-ui/react";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <section className={fonts.className}>
      <SessionProvider session={session}>
        <NextUIProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </NextUIProvider>
      </SessionProvider>
    </section>
  );
};

export default App;
