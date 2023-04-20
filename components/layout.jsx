/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";

const MainLayout = ({
  children,
  title = process.env.APP_NAME,
  description = process.env.APP_DESCRIPTION,
}) => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-no-wrap h-screen"></div>
      {children}
    </>
  );
};

export default MainLayout;
