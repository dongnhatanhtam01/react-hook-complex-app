import React, { useState, useReducer } from "react"
import ReactDOM from "react-dom"

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

// DAY 15.2.2021 Axios
Axios.defaults.baseURL = "http://localhost:8080"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: []
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "LOG_IN_ACTION":
        draft.loggedIn = true
        return
      case "LOG_OUT_ACTION":
        draft.loggedIn = false
        return
      case "FLASH_MESSAGE_ACTION":
        draft.flashMessages.push(action.value)
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    /** DAY 23.02.2021 adding Ex.., and distribute to particular
     component consuming the addFlashMessage trong value*/
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/post/:id" exact component={ViewSinglePost} />
            <Route path="/create-new-post" exact  >
              <CreatePost />
            </Route>
            <Route path="/about-us" exact component={About} />
            <Route path="/terms" exact component={Terms} />
            <Route path="/" exact  >
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
          </Switch>
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