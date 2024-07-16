"use client";
import React, { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import {Flex, Image, Upload, Spin } from 'antd';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const LeaveTracker = () => {
  const [leaveCounts, setLeaveCounts] = useState({});
  const [newLeave, setNewLeave] = useState("");

  const handleAddLeave = () => {
    if (newLeave.trim() !== "") {
      setLeaveCounts((prevCounts) => ({
        ...prevCounts,
        [newLeave]: 0,
      }));
      setNewLeave("");
    }
  };

  const handleAddCount = (type) => {
    setLeaveCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1,
    }));
  };

  const handleSubtractCount = (type) => {
    if (leaveCounts[type] > 0) {
      setLeaveCounts((prevCounts) => ({
        ...prevCounts,
        [type]: prevCounts[type] - 1,
      }));
    }
  };


  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    console.log("filefile", file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) =>{ setFileList(newFileList),console.log("newFileList", newFileList)};
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className="container mx-auto mt-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center">Manage Leave</h1>

        <div className="flex items-center mb-4">
          <input
            type="text"
            value={newLeave}
            onChange={(e) => setNewLeave(e.target.value)}
            placeholder="Enter Leave Name"
            className="px-4 py-2 mr-2 border rounded"
          />
          <button
            onClick={handleAddLeave}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add Leave
          </button>
        </div>

        <table className="min-w-full border rounded">
          <thead className="bg-blue-300 text-white">
            <tr>
              <th className="py-2 px-4">Leave Name</th>
              <th className="py-2 px-4">Leave Count</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          {Object.entries(leaveCounts).map(([type, count]) => (
            <tbody className="bg-gray-100" key={type}>
              <tr className="border-b">
                <td className="py-2 px-4">
                  <h2 className="text-lg font-semibold mr-2">{type}</h2>
                </td>
                <td className="py-1 px-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleSubtractCount(type)}
                      className="px-3 py-2 bg-red-500 text-white rounded mr-2"
                    >
                      -
                    </button>
                    <p className="text-lg font-semibold">{count}</p>
                    <button
                      onClick={() => handleAddCount(type)}
                      className="px-3 py-2 bg-green-500 text-white rounded ml-2"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-1 px-1">
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>

        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
            Save
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
        </div>
      </div>


      <Flex gap="middle" wrap>
      {/* <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload> */}
     <Upload
        action="http://localhost:3000/"
        listType="picture-circle"
        fileList={fileList}
        accept=".png ,.jpg, jpeg"
        onPreview={handlePreview}
        onChange={handleChange}
        iconRender={()=> {
        return <Spin tip="Loading..."></Spin>;
        }}
      >
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </Flex>
    </div>
  );
};

export default LeaveTracker;
