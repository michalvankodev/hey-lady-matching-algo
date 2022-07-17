import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hey lady interview assesment</title>
        <meta
          name="description"
          content="Assesment for Hey-lady built by Michal Vanko"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-y-scroll">
        <h2 className="text-[3rem] lg:text-[5rem] md:text-[5rem] font-extrabold text-gray-700">
          Hey Lady!
        </h2>
        <p>
          This is a solution for an{" "}
          <a
            href="https://github.com/mmmenglish/interview/blob/main/README.md"
            target="_blank"
            rel="noreferrer"
          >
            interview assignment
          </a>
          .
        </p>
        <h3 className="text-lg">Instructions</h3>
        <p className="max-w-lg">
          1. Seed database with random data:{" "}
          <code>npx prisma migrate reset</code>. This will generate a handful of
          members and events that they attend. Check out the{" "}
          <Link href="/members">
            <a className="text-blue-500">List of members</a>
          </Link>
          {" "} and <strong>select a member</strong> for which you want to see his best to follow matches.
          </p><p>
          See <code>README.md</code> for more details.
        </p>
        <h3 className="text-2xl text-gray-700">List of members</h3>
        <p>Choose a member to list their profile and matching profiles</p>
      </div>
    </>
  );
};

export default Home;
