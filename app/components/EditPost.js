import React, { useEffect, useState } from "react"
import { useImmerReducer } from "use-immer";
import UseEffectPage from "./UseEffectPage"
import Axios from "axios";
import { useParams, NavLink } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkDown from "react-markdown"
import ReactToolTip from "react-tooltip"

function ViewSinglePost(props) {
  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0
  }
  function ourReducer (draft, action) {
    switch (action.type) {
      case "fetchComplete": 
      draft.title.value = action.value.title
      draft.body.value = action.value.body
      draft.isFetching = false
      return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)


  useEffect(() => {
    // nhớ là thông thường biến ngoài không truy nhập được vô scope trong axios
    // dùng của nó thì được :D
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        dispatch({type:"fetchComplete", value:response.data})
      }
      catch (e) {
        console.log("There was a problem or the request was cancel");
      }
    }
    fetchPost()
    // clean up + cancle request
    // fix unmount component bug
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (state.isFetching) return <UseEffectPage title="...">
    <LoadingDotsIcon />
  </UseEffectPage>

  const _showDetailPost = {}
  async function GetSinglePost() {
    try {
      const response = await Axios.get(`${props.location.pathname}`)
      _showDetailPost[createDate] = response.createDate
      console.log(_showDetailPost);
    }
    catch (error) {
      // console.log(error.reponse.data);
    }
  }
  GetSinglePost()

  // Xử lý data ngày tháng năm 
  // const date = new Date(post.createdDate)
  // const dateFomatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  return (
    <UseEffectPage title="Edit Post">
      <form >
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={state.title.value}  autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={state.body.value}  name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </UseEffectPage>
  )
}

export default ViewSinglePost