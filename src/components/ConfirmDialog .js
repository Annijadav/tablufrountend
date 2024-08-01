import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ConfirmDialog = ({
  setIsOpen,
  onConfirm,    
  message,
  actionType,
  title,
  confirmLabel
}) => {
  if (!isOpen) return null; // Do not render if dialog is not open

  // Set background color based on action type
  const getColor = (type) => {
    switch (type) {
      case "delete":
        return "bg-red-500";
      case "edit":
        return "bg-yellow-500";
      case "save":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const color = getColor(actionType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-4 sm:mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <XCircle
            className="text-gray-500 hover:text-gray-800 cursor-pointer"
            onClick={isOpen(false)}
          />
        </div>
        <div className="flex items-center">
          <div className={`${color} p-4 rounded-full mr-4`}>
            {actionType === "delete" ? (
              <XCircle className="text-white w-8 h-8" />
            ) : (
              <CheckCircle className="text-white w-8 h-8" />
            )}
          </div>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${color} rounded-md text-white hover:opacity-90 transition-opacity`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
