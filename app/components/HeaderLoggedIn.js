import React, { useEffect, useContext } from "react"
import { NavLink, useHistory } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedIn(props) {
 const appHistory = useHistory()
 const appDispatch = useContext(DispatchContext)
 const appState = useContext(StateContext)
 // const { addFlashMessage, setLoggedIn } = useContext(ExampleContext)
 function handleLogout() {
  appDispatch({ type: "LOG_OUT_ACTION" })
  if (!localStorage.getItem("complexappToken")) {
   appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "See you again..." })
   // addFlashMessage("You successful logged out your account!")
   appHistory.goBack()
  }
 }
 function handleSearchIcon(e) {
  e.preventDefault()
  appDispatch({ type: "OPEN_SEARCH" })
 }
 return (
  <div className="flex-row my-3 my-md-0">
   <a data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
    <i className="fas fa-search"></i>
   </a>
   <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
   {" "}<span className="mr-2 header-chat-icon text-white">
    <i className="fas fa-comment"></i>
    <span className="chat-count-badge text-white"> </span>
   </span>
   {" "}<NavLink to={`/profile/${appState.user.username}`} className="mr-2">
    <img className="small-header-avatar" src={appState.user.avatar} />
   </NavLink>
   {" "}<NavLink className="btn btn-sm btn-outline-warning mr-2" to="/create-new-post">
    Create Post
          </NavLink>
   <button onClick={() => handleLogout()} className="btn btn-sm btn-secondary">
    Sign Out
          </button>
  </div>
 )
}

export default HeaderLoggedIn