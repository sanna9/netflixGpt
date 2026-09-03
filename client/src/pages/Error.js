import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-gray-300">The page you requested does not exist.</p>
      <Link className="rounded bg-red-700 px-5 py-2 hover:bg-red-600" to="/browse">
        Back to movies
      </Link>
    </main>
  );
};

export default Error;
