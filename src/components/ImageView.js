import React from "react";

const ImageView = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
      <div className="relative max-w-screen-lg w-full h-full">
        <button
          className="absolute top-4 right-4 text-white text-xl focus:outline-none"
          onClick={onClose}
        >
          Close
        </button>
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={imageUrl}
            alt="Full Screen"
            className="max-w-full max-h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageView;
