import React, { useState, useContext } from "react"
import { NavLink } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext";


function Header(props) {
  const appState = useContext(StateContext)
  // const [loggedIn, setLoggedIn] = useState() Không dùng useState nữa mà xét thêm điều kiện dưới local
  // Xem account có được đăng nhập từ trước hay chưa
  // Nếu có rồi (localStorage thì) thì loggIn = true

  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <NavLink to="/" activeClassName="text-white">
              ComplexApp
            </NavLink>
          </h4>
          {appState.loggedIn ? <HeaderLoggedIn  /> : <HeaderLoggedOut  />}
        </div>
      </header>
    </>
  )
}
export default Header