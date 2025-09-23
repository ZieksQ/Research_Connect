import React from "react";

const SearchBar = ({ handleOnSubmit, handleOnChange, search }) => {
  return (
    <form
      action="#"
      onSubmit={handleOnSubmit}
      className="mr-auto hidden lg:flex"
    >
      <input
        type="text"
        id="search"
        placeholder="Search"
        onChange={handleOnChange}
        className="rounded-2xl bg-white px-2 py-1 ring-1 ring-black outline-0"
      />
      <input type="submit" value={search} />
    </form>
  );
};

export default SearchBar;
