import Head from "next/head";
import React from "react";
import AppLayout from "../components/AppLayout";

const Profile = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <div>프로필</div>
      </AppLayout>
    </>
  );
};

export default Profile;
