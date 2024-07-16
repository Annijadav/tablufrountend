import { Spinner } from '@nextui-org/react'
import React from 'react'

function ShowFullScreenLoading() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          {/* Overlay content */}
          <div className="bg-white p-10 rounded shadow-lg">
          <Spinner label="Loding" color="secondary" labelColor="secondary"/>
          </div>
        </div>
    </div>
  )
}

export default ShowFullScreenLoading
