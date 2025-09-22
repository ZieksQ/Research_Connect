 <div className={`hidden items-center lg:flex`}>
        {/* Navbar User Profile Menu */}
        <h4 className="cursor-pointer">User Name</h4>
        {/* Placeholder Image Only */}
        <img
          src="https://i.pinimg.com/736x/45/b0/4b/45b04b86cf94aff2581d510f83e3fef8.jpg"
          alt="user profile"
          className="size-10 cursor-pointer rounded-full"
        />

        
      </div>


<div>
        {/* Logo */}
        <h3>Research Connect</h3>
      </div>




Menu Bar for Mobile */}
      <input type="checkbox" id="menubar-active" className="hidden"/>
      <label htmlFor="menubar-active" className={`flex ${isMenuShown ? "" : "hidden"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
      </label>

      {/* Sidebar */}
      <div className="size-full flex flex-row items-center">
        <label htmlFor="menubar-active" className="hidden">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </label>


        {/* Links */}
        {navbarLinks.map((e, index) => (
          <li key={index} className={`h-full px-5 flex items-center text-gray-50 hover:text-gray-400 `}>
            <a href={e.link}>{e.title}</a>
          </li>
        ))}
       

        
      </div>



<div>
        {/* Profile Image*/}
        <button onClick={handleOpenMenu}>
          {isMenuShown ? 
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
        }
        </button>
        { isMenuShown ? <div className={`flex flex-col absolute top-15 right-4 w-[30dvh] h-auto bg-[#EEEEEE] rounded-md`}>
          {navbarLinks.map((e, index) => (
            <a key={index} href={e.link} className="text-black px-4 py-4 hover:bg-[#E1E1E1] rounded-md active:bg-[#E4E4E4]">{e.icon}{e.title}</a>
          ))}
        </div> : ""}
      </div>
