import React, { useState, useReducer, useEffect, Suspense } from "react"
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
const CreatePost = React.lazy(() => import("./components/CreatePost")) // Lazyload app_component_CreatPost.bundled.js
// import CreatePost from "./components/CreatePost";
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost")) // app_component_ViewSinglePost
// import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages"
import NotFound from "./components/NotFound"
const Search = React.lazy(() => import("./components/Search"))
// import Search from './components/Search'
import { CSSTransition } from "react-transition-group"
const Chat = React.lazy(() => import("./components/Chat"))
// import Chat from "./components/Chat";
import { NavLink, useHistory } from "react-router-dom"
import LoadingDotsIcon from "./components/LoadingDotsIcon";

// DAY 15.2.2021 Axios
Axios.defaults.baseURL = "http://localhost:8080"

function Main(props) {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "LOG_IN_ACTION":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "LOG_OUT_ACTION":
        draft.loggedIn = false
        draft.user.token = ""
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
      case "TOOGLE_CHAT":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "CLOSE_CHAT":
        draft.isChatOpen = false
        return
      case "INCREMENT_UNREAD_CHATCOUNT":
        draft.unreadChatCount++
        return
      case "CLEAR_UNREAD_CHATCOUNT":
        draft.unreadChatCount = 0
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


  // check if token expired in first render
  useEffect(() => {
    if (state.loggedIn) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          if (!response.data) {
            alert("The session has expired, please log in again.")
            setTimeout(() => {
              dispatch({ type: "FLASH_MESSAGE_ACTION", value: "The session has expired, please log in again." })
              dispatch({ type: "LOG_OUT_ACTION" })
            }, 500)
          }
        }
        catch (err) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchResults()
      return () => {
        ourRequest.cancel()
      }
    } else {
      dispatch({ type: "FLASH_MESSAGE_ACTION", value: "The session has expired, please log in again. Or you didn't have any account." })
    }
  }, [])

  return (
    /** DAY 23.02.2021 adding Ex.., and distribute to particular
     component consuming the addFlashMessage trong value */
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={LoadingDotsIcon}>
            <Switch>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact  >
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/post/:id" exact component={ViewSinglePost} />
              <Route path="/post/:id/edit" exact component={EditPost} />
              <Route path="/create-new-post" exact  >
                <CreatePost />
              </Route>
              <Route path="/about-us" exact component={About} />
              <Route path="/terms" exact component={Terms} />

              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
            {/* <Search /> */}
          </CSSTransition>
          <Suspense fallback="">
            {state.loggedIn && <Chat />}
          </Suspense>
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