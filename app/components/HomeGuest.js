import React, { useContext, useState } from "react"
import UseEffectPage from "./useEffectPage"
import Axios from "axios"
// import FlashMessages from "./FlashMessages"
// import DispatchContext from "../DispatchContext"
import { useImmerReducer } from 'use-immer'
import { CSSTransition } from 'react-transition-group'

function HomeGuest() {
  // const appDispatch = useContext(DispatchContext)
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "USERNAME_IMMEDIATELY":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot exceed 30 characters."
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Username can only contain letters and numbers."
        }
        return
      case "USERNAME_AFTER_DELAYED":
        return
      // check Username is unique after typing key-stroke 
      case "USERNAME_IS_UNIQUE_HAH":
        return
      case "EMAIL_IMMEDIATELY":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "EMAIL_AFTER_DELAYED":
        return
      // check EMAIL is unique after typing key-stroke 
      case "EMAIL_IS_UNIQUE_HAH":
        return
      case "PW_IMMEDIATELY":
        draft.password.hasErrors = false
        draft.password.value = action.value
        return
      case "PW_AFTER_DELAYED":
        return
      // dispatch submit
      case "SUBMIT_FORM_HAH":
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  // const [username, setUsername] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()

  function handleSubmit(e) {
    e.preventDefault()
  }
  // function handleSubmit(e) {
  //   e.preventDefault()
  // try {
  //   const res = await Axios.post("/register", { username, email, password })
  //   if (res) {
  //     console.log(res);
  //     appDispatch({ type: "FLASH_MESSAGE_ACTION", value: `${res.data.username}+ is just created.` })
  //   }
  // } catch (e) {
  //   // FlashMessages
  //   appDispatch({ type: "FLASH_MESSAGE_ACTION", value: `${e.response.data}` })
  // }
  // }
  return (
    <UseEffectPage title="Welcome!" wide={true} >
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              {/* <input onChange={e => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" /> */}
              <input onChange={(e) => dispatch({ type: "USERNAME_IMMEDIATELY", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              {/* <input onChange={e => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" /> */}
              <input onChange={(e) => dispatch({ type: "EMAIL_IMMEDIATELY", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              {/* <input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" /> */}
              <input onChange={(e) => dispatch({ type: "PW_IMMEDIATELY", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </UseEffectPage>
  )
}
export default HomeGuest