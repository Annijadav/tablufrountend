import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { ChevronDown } from "lucide-react";

const DropDown = ({ 
  keyToDisplay,
  defaultSelectedKey, // Default selected key
  onChangeFilter // Function to handle filter change
}) => {
  // Define selectedKeys and setSelectedKeys within the component
  const [selectedKeys, setSelectedKeys] = useState(new Set([defaultSelectedKey]));

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="p-2 z-0">
          {keyToDisplay[selectedKeys.values().next().value]}
          <ChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onAction={(key) => onChangeFilter(key)} // Call onChangeFilter with selected key
        aria-label="Static Actions"
      >
        {Object.entries(keyToDisplay).map(([key, value]) => (
          <DropdownItem key={key}>{value}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
