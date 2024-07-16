import { Progress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

function FullScreenLoading() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white p-10 rounded shadow-lg">
          <img src="/assets/images/logo.png" width="180" alt="" />
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
}

export default FullScreenLoading;
