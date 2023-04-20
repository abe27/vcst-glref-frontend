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
      <div className="h-screen bg-gray-300">
        <div className="bg-white h-14 shadow w-screen">vvv</div>
        <div className="flex justify-start">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
