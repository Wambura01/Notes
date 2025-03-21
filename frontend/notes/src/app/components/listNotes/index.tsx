import { TNote } from "@/shared/types";
import apiCall from "@/utils/apiCall";
import NoteCard from "../noteCard";

async function ListNotes({ ownerId }: { ownerId: string | undefined }) {
  let notes: TNote[] = [];

  try {
    const response = await apiCall(
      "/notes/get-notes",
      "GET",
      { owner: ownerId },
      true
    );

    notes = response.data;
  } catch (error) {
    console.log("Error fetching notes: ", error);
  }

  console.log("notes", notes);

  return (
    <div>
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}

export default ListNotes;
