import Head from "next/head";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { trpc } from "../../utils/trpc";

const ProfilePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const profile = trpc.useQuery(["members.getProfile", Number(props.id)]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-4 overflow-y-scroll">
        <h2 className="text-[3rem] lg:text-[5rem] md:text-[5rem] font-extrabold text-gray-700">
          Profile
        </h2>
        {profile.isLoading ? (
          <span className="text-gray-700">Loading...</span>
        ) : null}
        {profile.data ? (
          <>
            <h3 className="text-[2rem] lg:text-[3rem] text-primary">
              {profile.data.name}
            </h3>
            <p>
              English confidence level: {profile.data.englishConfidenceLevel}
            </p>
            <p>
              Week day availability: {profile.data.weekAvailabilityStart}:00 -{" "}
              {profile.data.weekAvailabilityEnd}:00 UTC
            </p>
            <p>
              Weekend availability: {profile.data.weekendAvailabilityStart}:00 -{" "}
              {profile.data.weekendAvailabilityEnd}:00 UTC
            </p>
            <p className="text-left">Interests
            <ul>
              {profile.data.interests.map(({ name }) => (
                <li key="name">{name}</li>
              ))}
            </ul></p>
          </>
        ) : null}
      </div>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  return {
    props: {
      id: context.params!.id,
    },
  };
}

export default ProfilePage;
