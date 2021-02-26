import React, { useState, useReducer } from "react"
import ReactDOM from "react-dom"

// DAY 23.02.2021
import ExampleContext from "./ExampleContext"
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
  function ourReducer(state, action) {
    switch (action.type) {
      case "LOG_IN_ACTION":
        return { loggedIn: true, flashMessages: state.flashMessages }
      case "LOG_OUT_ACTION":
        return { loggedIn: false, flashMessages: state.flashMessages }
      case "FLASH_MESSAGE_ACTION":
        return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) }
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState)
  dispatch({ "type": "LOG_IN_ACTION" })
  dispatch({ "type": "LOG_OUT_ACTION" })
  dispatch({ "type": "FLASH_MESSAGE_ACTION" })

  const [flashMessages, setFlashMessages] = useState([])
  function addFlashMessage(msg) {
    setFlashMessages(prev => prev.concat(msg))
  }
  // lift the state up to high level
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")))

  return (
    /** DAY 23.02.2021 adding Ex.., and distribute to particular
     component consuming the addFlashMessage trong value*/
    <ExampleContext.Provider value={{ addFlashMessage, setLoggedIn }}>
      <BrowserRouter>
        <FlashMessages messages={flashMessages} />
        <Header addFlashMessage={addFlashMessage} loggedIn={loggedIn} />
        <Switch>
          <Route path="/post/:id" exact component={ViewSinglePost} />
          <Route path="/create-new-post" exact  >
            <CreatePost />
          </Route>
          <Route path="/about-us" exact component={About} />
          <Route path="/terms" exact component={Terms} />
          <Route path="/" exact  >
            {loggedIn ? <Home /> : <HomeGuest />}
          </Route>
        </Switch>
        <Footer />
      </BrowserRouter>
    </ExampleContext.Provider>
  )
}
ReactDOM.render(<Main />, document.querySelector("#app"))
// không cần refresh any more 
if (module.hot) {
  module.hot.accept()
}