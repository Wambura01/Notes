import React from "react";

function ErrorMessage({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-start w-full">
      <p className="text-red-500 text-sm">{message}</p>
    </div>
  );
}

export default ErrorMessage;
