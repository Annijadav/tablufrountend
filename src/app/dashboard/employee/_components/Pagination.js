import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";
const Pagination = ({
  currentPage,
  postPerPage,
  empCount,
  pageCount,
  chanagePage,
  chanagePostPerPage,
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set([postPerPage])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const [pageJumper, setPageJumper] = useState("");
  const handlePageJump = (e) => {
    const input = e.target.value;
    if (input === "") {
      setPageJumper("");
      return;
    }
    const num = parseInt(input);
    if (!isNaN(num) && num >= 1 && num <= pageCount) {
      setPageJumper(num);
    }
  };
  const handleLeavePageJumper = async (e) => {
    if (pageJumper == "") {
      setPageJumper(currentPage);
    } else if (pageJumper != currentPage) {
      chanagePage(pageJumper);
    }
  };
  useEffect(() => {
    setPageJumper(currentPage);
  }, []);
  return (
    <div  style={{
      overflow: 'auto',
      scrollbarWidth: 'none', // For Firefox
      msOverflowStyle: 'none', // For IE and Edge
    }} className="flex justify-between mt-4 overflow-auto">
      <div>
        <div className="flex items-center">
          <span className="pl-2 pr-2">Show </span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="capitalize">
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              onAction={(key) => chanagePostPerPage(key)}
            >
              <DropdownItem key="5">5</DropdownItem>
              <DropdownItem key="10">10</DropdownItem>
              <DropdownItem key="15">15</DropdownItem>
              <DropdownItem key="20">20</DropdownItem>
              <DropdownItem key="50">50</DropdownItem>
              <DropdownItem key="100">100</DropdownItem>
            </DropdownMenu>
          </Dropdown>{" "}
          <span className="pl-2 pr-2">Entries</span>
        </div>
      </div>
      <div className="flex w-auto whitespace-nowrap items-center gap-1">
        <label className="input input-bordered flex items-center">
          <input
            type="text"
            className="grow border-none"
            name="pageJumper"
            onBlur={handleLeavePageJumper}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleLeavePageJumper();
              }
            }}
            value={pageJumper}
            onChange={handlePageJump}
            style={{ width: "4ch" }}
          />
          / {pageCount}
        </label>

        <div className="join border">
          <button onClick={() => chanagePage(1)} className="join-item btn">
            «
          </button>

          {currentPage > 1 && (
            <button
              onClick={() => chanagePage(currentPage - 1)}
              className="join-item btn"
            >
              Prev
            </button>
          )}

          {[currentPage - 1, currentPage, currentPage + 1].map(
            (page) =>
              page > 0 &&
              page <= pageCount && (
                <button
                  key={page}
                  onClick={() => chanagePage(page)}
                  className={`join-item pr-4 pl-4 hover:bg-gray-200 rounded ${
                    page == currentPage && "bg-blue-300"
                  }`}
                >
                  {page}
                </button>
              )
          )}

          {currentPage < pageCount && (
            <button
              onClick={() => chanagePage(currentPage + 1)}
              className="join-item btn"
            >
              Next
            </button>
          )}
          <button
            onClick={() => chanagePage(pageCount)}
            className="join-item btn"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
