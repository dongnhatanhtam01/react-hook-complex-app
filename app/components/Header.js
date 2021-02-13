import React, { useState } from "react"
import { NavLink } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn"


function Header() {
  const [loggedIn, setLoggedIn] = useState()

  return (
    <>
      <header className="header-bar bg-warning mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <NavLink to="/" activeClassName="text-white">
              ComplexApp
          </NavLink>
          </h4>
          {loggedIn ? <HeaderLoggedIn setLoggedIn={setLoggedIn} /> : <HeaderLoggedOut setLoggedIn={setLoggedIn}/>}
        </div>
      </header>

    </>
  )
}
export default Header