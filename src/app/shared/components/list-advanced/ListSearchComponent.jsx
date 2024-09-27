import React, { useContext } from "react";
import { Input } from "../input/Input";
import { GridApiContext } from "./ListAdvancedComponent";

export const ListSearchComponent = () => {
  const { gridApi } = useContext(GridApiContext);

  const onFilterTextChange = (searchText) => {
    gridApi.setQuickFilter(searchText);
  };

  return (
    <div className="list-container__search-button">
      <Input
        type="text"
        placeholder={"Search"}
        onChange={(e) => onFilterTextChange(e.target.value)}
        hasIcon
        iconType={"search"}
        style={{
          border: " 1px solid #C6C6C6",
        }}
      />
    </div>
  );
};
