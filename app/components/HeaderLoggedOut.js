import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import { withRouter } from "react-router-dom"

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext)
  // const {addFlashMessage, setLoggedIn} = useContext(ExampleContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username, password })
      // Kiểm tra token authen sau khi log in thành công
      if (response.data) {
        appDispatch({ type: "LOG_IN_ACTION", data: response.data })
        appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "Congrats, You have logged in successfully..!" })
        props.history.push(`/profile/${response.data.username}`)
      }
      else {
        appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "Wrong password or username..." })
      }
    }
    catch (e) {
      console.log(e.response.data)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default withRouter(HeaderLoggedOut)
