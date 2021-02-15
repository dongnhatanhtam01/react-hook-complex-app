import React, { useEffect, useState } from "react"
import Axios from "axios";
import UseEffectPage from "./UseEffectPage"

// watch component history, location by withRouter
import { withRouter } from "react-router-dom";

// lấy histỏy thông qua CreatePost(props)
function CreatePost(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    alert(true)
    try {
      const response = await Axios.post("/create-post", {
        token: localStorage.getItem("complexappToken"),
        title,
        body
      })
      console.log("Bạn đã tạo thành công 1 bài post mới...")
      // redirect to new post url...
      if (response) {debugger
        props.addFlashMessage("Congrats, you successful created a post")
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