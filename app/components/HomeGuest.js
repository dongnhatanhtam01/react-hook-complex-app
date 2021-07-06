import React, { useContext, useState, useEffect } from "react"
import UseEffectPage from "./UseEffectPage"
import Axios from "axios"
import FlashMessages from "./FlashMessages"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from 'use-immer'
import { CSSTransition } from 'react-transition-group'

function HomeGuest() {
  const appDispatch = useContext(DispatchContext)
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
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      // check Username is unique after typing key-stroke 
      case "USERNAME_IS_UNIQUE_HAH":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "That username has been taken already."
        } else {
          draft.username.isUnique = true
        }
        return
      case "EMAIL_IMMEDIATELY":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "EMAIL_AFTER_DELAYED":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      // check EMAIL is unique after typing key-stroke 
      case "EMAIL_IS_UNIQUE_HAH":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "That email is already used."
        } else {
          draft.email.isUnique = true
        }
        return
      case "PW_IMMEDIATELY":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 50 characters."
        }
        return
      case "PW_AFTER_DELAYED":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 12 characters."
        }
        return
      // dispatch submit && change noRequest value
      case "SUBMIT_FORM_HAH":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        }else{
          appDispatch({type:"FLASH_MESSAGE_ACTION", value:`${(draft.username.message)+(<br />)+draft.email.message+(<br/>)+draft.password.message}`})
        }
        return
    }
  }



  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  // const [username, setUsername] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()



  // timeour keystroke username    // /*|USEEFFECT WORKING change dependencies value|*/
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "USERNAME_AFTER_DELAYED" })
      }, 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  // timeour keystroke email
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "EMAIL_AFTER_DELAYED" })
      }, 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  // timeour keystroke password
  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "PW_AFTER_DELAYED" })
      }, 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])



  // USERNAME_CHECK_UNIQUE     /*|USEEFFECT WORKING BASED ON DEPENDENCIES|*/
  useEffect(() => {
    if (state.username.checkCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "USERNAME_IS_UNIQUE_HAH", value: response.data })
        }
        catch (err) {
          console.log("There was a problem or the request was cancelled.")
          appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "There was a problem or the request was cancelled." })
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.username.checkCount])

  // EMAIL_CHECK_UNIQUE
  useEffect(() => {
    if (state.email.checkCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { username: state.email.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "EMAIL_IS_UNIQUE_HAH", value: response.data })
        }
        catch (err) {
          console.log("There was a problem or the request was cancelled.")
          appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "There was a problem or the request was cancelled." })
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  // PW_CHECK_UNIQUE     /*|USEEFFECT WORKING BASED ON DEPENDENCIES|*/
  useEffect(() => {
    if (state.password.checkCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "USERNAME_IS_UNIQUE_HAH", value: response.data })
        }
        catch (err) {
          console.log("There was a problem or the request was cancelled.")
          appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "There was a problem or the request was cancelled." })
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.password.checkCount])

  // SUBMIT_CHECK     /*|USEEFFECT WORKING BASED ON DEPENDENCIES|*/
  useEffect(() => {
    if (state.submitCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
          appDispatch({ type: "LOG_IN_ACTION", data: response.data })
          appDispatch({ type: "FLASH_MESSAGE_ACTION", value: `Congrate, Welcome to your new account ${response.data.username}` })
        }
        catch (err) {
          console.log("There was a problem or the request was cancelled.")
          appDispatch({ type: "FLASH_MESSAGE_ACTION", value: `${err.response.data}` })
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.submitCount])
  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "USERNAME_IMMEDIATELY", value: state.username.value })
    dispatch({ type: "USERNAME_AFTER_DELAYED", value: state.username.value, noRequest: true })
    dispatch({ type: "EMAIL_IMMEDIATELY", value: state.email.value })
    dispatch({ type: "EMAIL_AFTER_DELAYED", value: state.email.value, noRequest: true })
    dispatch({ type: "PW_IMMEDIATELY", value: state.password.value })
    dispatch({ type: "PW_AFTER_DELAYED", value: state.password.value })
    dispatch({ type: "SUBMIT_FORM_HAH" })
  }
  /** function handleSubmit(e) {
    e.preventDefault()
  try {
    const res = await Axios.post("/register", { username, email, password })
    if (res) {
      console.log(res);
      appDispatch({ type: "FLASH_MESSAGE_ACTION", value: `${res.data.username}+ is just created.` })
    }
  } catch (e) {
    // FlashMessages
    appDispatch({ type: "FLASH_MESSAGE_ACTION", value: `${e.response.data}` })
  }
  }*/
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
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              {/* <input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" /> */}
              <input onChange={(e) => dispatch({ type: "PW_IMMEDIATELY", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
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