import React from "react";

const SearchBar = ({ handleOnSubmit, handleOnChange, search }) => {
  return (
    <form
      action="#"
      onSubmit={handleOnSubmit}
      className=" hidden lg:flex"
    >
      <input
        type="text"
        id="search"
        placeholder="Search"
        onChange={handleOnChange}
        className="input-field w-[50vh]"
      />
      <input type="submit" value={search} />
    </form>
  );
};

export default SearchBar;
