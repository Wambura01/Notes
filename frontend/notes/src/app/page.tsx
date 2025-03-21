import CreateNote from "./components/createNote";
import ListNotes from "./components/listNotes";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const userProfileCookie = (await cookieStore).get("user");

  const userProfile = userProfileCookie
    ? JSON.parse(userProfileCookie.value)
    : null;

  return (
    <div className="flex justify-between w-full h-screen bg-[#0F0F0F] p-6">
      <ListNotes ownerId={userProfile?.id} />
      <CreateNote />
    </div>
  );
}
