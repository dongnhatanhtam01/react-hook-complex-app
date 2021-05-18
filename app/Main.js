import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom"
// DAY 05.03.2021
import EditPost from "./components/EditPost"
//DAY 28
import Profile from "./components/Profile";
// DAY 27.02.2021 Thay vì dùng useReducer có npm hỗ trợ
import { useImmerReducer } from "use-immer"
// DAY 26.02.2021
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
// DAY 23.02.2021
// DAY 15.2.2021
import Axios from "axios"
// DAY 14.2.2021
import Home from "./components/Home"
// DAY 2
import { Route, BrowserRouter, Switch } from "react-router-dom";
import About from "./components/About"
import Terms from "./components/Terms"
// DAY 1
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages"
import NotFound from "./components/NotFound"
import Search from './components/Search'
import { CSSTransition } from "react-transition-group"
// import { NavLink, useHistory } from "react-router-dom"

// DAY 15.2.2021 Axios
Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
 const initialState = {
  loggedIn: Boolean(localStorage.getItem("complexappToken")),
  flashMessages: [],
  user: {
   token: localStorage.getItem("complexappToken"),
   username: localStorage.getItem("complexappUsername"),
   avatar: localStorage.getItem("complexappAvatar")
  },
  isSearchOpen: false
 }
 function ourReducer(draft, action) {
  switch (action.type) {
   case "LOG_IN_ACTION":
    draft.loggedIn = true
    draft.user = action.data
    return
   case "LOG_OUT_ACTION":
    draft.loggedIn = false
    // useHistory().goBack
    return
   case "FLASH_MESSAGE_ACTION":
    draft.flashMessages.push(action.value)
    return
   case "OPEN_SEARCH":
    draft.isSearchOpen = true
    return
   case "CLOSE_SEARCH":
    draft.isSearchOpen = false
    return
  }
 }
 const [state, dispatch] = useImmerReducer(ourReducer, initialState)

 useEffect(() => {
  if (state.loggedIn) {
   localStorage.setItem("complexappToken", state.user.token)
   localStorage.setItem("complexappUsername", state.user.username)
   localStorage.setItem("complexappAvatar", state.user.avatar)
  } else {
   localStorage.removeItem("complexappToken")
   localStorage.removeItem("complexappUsername")
   localStorage.removeItem("complexappAvatar")
  }
 }, [state.loggedIn])

 return (
  /** DAY 23.02.2021 adding Ex.., and distribute to particular
   component consuming the addFlashMessage trong value*/
  <StateContext.Provider value={state}>
   <DispatchContext.Provider value={dispatch}>
    <BrowserRouter>
     <FlashMessages messages={state.flashMessages} />
     <Header />
     <Switch>
      <Route path="/profile/:username">
       <Profile />
      </Route>
      <Route path="/post/:id" exact component={ViewSinglePost} />
      <Route path="/post/:id/edit" exact component={EditPost} />
      <Route path="/create-new-post" exact  >
       <CreatePost />
      </Route>
      <Route path="/about-us" exact component={About} />
      <Route path="/terms" exact component={Terms} />
      <Route path="/" exact  >
       {state.loggedIn ? <Home /> : <HomeGuest />}
      </Route>
      <Route>
       <NotFound />
      </Route>
     </Switch>
     <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
      <Search />
     </CSSTransition>
     <Footer />
    </BrowserRouter>
   </DispatchContext.Provider>
  </StateContext.Provider>
 )
}
ReactDOM.render(<Main />, document.querySelector("#app"))
// không cần refresh any more 
if (module.hot) {
 module.hot.accept()
}