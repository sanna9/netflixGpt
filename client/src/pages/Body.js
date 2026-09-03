import React from "react";
import { Routes, Route } from "react-router-dom";
import Error from "./Error";

const Body = ({ config }) => {
  return (
    <div>
      <Routes>
        {config?.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default Body;
