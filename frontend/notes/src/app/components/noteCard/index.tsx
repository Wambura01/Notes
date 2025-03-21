import { TNote } from "@/shared/types";
import { format } from "date-fns";

export default function NoteCard({ note }: { note: TNote }) {
  return (
    <div className="relative">
      <div className="bg-[#181818] rounded-lg p-4 shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-white mb-2">{note.title}</h2>
        <p className="text-gray-300 mb-2">{note.content}</p>
        <div className="text-sm text-gray-400">
          <p>
            Updated At: {format(new Date(note.updatedAt), "MMM dd, yyyy HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
}
