import React, { useEffect, useState, useContext  } from "react"
import Axios from "axios";
import UseEffectPage from "./UseEffectPage"

import StateContext  from "../StateContext";
/** 23.02.2021
 * Muốn truyền hàm thông qua context của provider
thay vì (props)
import thằng context vô, là thằng #ExampleContext.js
*/
import DispatchContext from "../DispatchContext"

// watch component history, location by withRouter
import { withRouter } from "react-router-dom";

// lấy histỏy thông qua CreatePost(props)
function CreatePost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  // const { addFlashMessage } = useContext(ExampleContext) 
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    alert("You had clicked create-post, right?")
    try {
      const response = await Axios.post("/create-post", {
        token: appState.user.token,
        title,
        body
      })
      console.log("Bạn đã tạo thành công 1 bài post mới..!")
      // redirect to new post url...
      if (response) {
        appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "Congrats, you successful created a post!!" })
        // addFlashMessage("Congrats, you successful created a post!!")
        props.history.push(`/post/${response.data[0]._id}`)
      }
    }
    catch (e) {
      console.log(e.response.data);
    }
  }
  return (
    <UseEffectPage title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </UseEffectPage>
  )
}

export default withRouter(CreatePost)