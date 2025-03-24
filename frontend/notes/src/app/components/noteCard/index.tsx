import { TNote } from "@/shared/types";
import { format } from "date-fns";
import parse from "html-react-parser";

export default function NoteCard({ note }: { note: TNote }) {
  return (
    <div className="flex flex-col flex-wrap bg-[#181818] rounded-lg p-4 shadow-lg w-full md:w-[45%] h-auto max-w-md">
      <h2 className="text-xl font-semibold text-white mb-2">{note.title}</h2>
      <div className="text-gray-300 mb-2 w-full [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_a]:break-all [&_a]:underline [&_.ql-ui]:hidden">
        {parse(note.content)}
      </div>
      <div className="text-sm text-gray-400">
        <p>
          Updated At: {format(new Date(note.updatedAt), "MMM dd, yyyy HH:mm")}
        </p>
      </div>
    </div>
  );
}
