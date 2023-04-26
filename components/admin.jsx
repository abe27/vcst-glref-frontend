import Head from "next/head";
import { Noto_Sans_Thai } from "next/font/google";

const fonts = Noto_Sans_Thai({ weight: "400", subsets: ["latin"] });

const SystemLayout = ({
  children,
  title = process.env.APP_NAME,
  description = process.env.APP_DESCRIPTION,
}) => {
  return (
    <div className={fonts.className}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pl-14 pr-14 my-6 pb-4 ">{children}</div>
    </div>
  );
};

export default SystemLayout;
