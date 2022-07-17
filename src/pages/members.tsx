import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Members: NextPage = () => {
  const members = trpc.useQuery(["members.getAll"]);
  return (
    <>
      <Head>
        <title>Members</title>
      </Head>

      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-y-scroll">
        <h2 className="text-[3rem] lg:text-[5rem] md:text-[5rem] font-extrabold text-gray-700">
          Members
        </h2>
        {members.isLoading ? (
          <span className="text-gray-700">Loading...</span>
        ) : null}
        {members.data?.length ?? 0 > 0 ? (
          <table className="table-auto w-full max-w-2xl shadow-md rounded ">
            <thead className="bg-gray-50">
              <tr>
                <th>Name</th>
                <th>English CL</th>
                <th>
                  <span title="Hours available on regular week days">
                    Hours in RD
                  </span>
                </th>
                <th>
                  <span title="Hours available on regular weekends">
                    Hours in Weekend
                  </span>
                </th>
                <th>N.o. Interests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {members.data!.map((member) => {
                return (
                  <tr key={member.id}>
                    <td>
                      <Link href={`/profile/${member.id}`}>
                        <a className="underline">{member.name}</a>
                      </Link>
                    </td>
                    <td className="text-center">{member.englishConfidenceLevel}</td>
                    <td className="text-center">{member.hoursInWeek}</td>
                    <td className="text-center">{member.hoursInWeekend}</td>
                    <td className="text-center">{member.numberOfInterests}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </div>
    </>
  );
};

export default Members;
