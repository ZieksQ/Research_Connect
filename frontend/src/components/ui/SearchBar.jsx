import React from "react";

const SearchBar = ({ handleOnSubmit, handleOnChange, search }) => {
  return (
    <form
      action="#"
      onSubmit={handleOnSubmit}
<<<<<<< HEAD
      className=" hidden lg:flex"
=======
      className="mr-auto hidden lg:flex"
>>>>>>> b9e6eaf (optimizing react reusable components | needs more tailwind and component optimization)
    >
      <input
        type="text"
        id="search"
        placeholder="Search"
        onChange={handleOnChange}
<<<<<<< HEAD
        className="input-field w-[50vh]"
=======
        className="rounded-2xl bg-white px-2 py-1 ring-1 ring-black outline-0"
>>>>>>> b9e6eaf (optimizing react reusable components | needs more tailwind and component optimization)
      />
      <input type="submit" value={search} />
    </form>
  );
};

export default SearchBar;
