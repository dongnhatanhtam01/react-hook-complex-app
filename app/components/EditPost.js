import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import UseEffectPage from "./UseEffectPage"
import NotFound from "./NotFound"

function EditPost(props) {
 const appState = useContext(StateContext)
 const appDispatch = useContext(DispatchContext)

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
  sendCount: 0,
  notFound: false
 }

 function ourReducer(draft, action) {
  switch (action.type) {
   case "fetchComplete":
    draft.title.value = action.value.title
    draft.body.value = action.value.body
    draft.isFetching = false
    return
   case "titleChange":
    draft.title.hasErrors = false
    draft.title.value = action.value
    return
   case "bodyChange":
    draft.body.hasErrors = false
    draft.body.value = action.value
    return
   case "submitRequest":
    if (!draft.title.hasErrors && !draft.body.hasErrors) {
     draft.sendCount++
    }
    return
   case "saveRequestStarted":
    draft.isSaving = true
    return
   case "saveRequestFinished":
    draft.isSaving = false
    return
   case "titleRules":
    if (!action.value.trim()) {
     draft.title.hasErrors = true
     draft.title.message = "You must provide title."
    }
    return
   case "bodyRules":
    if (!action.value.trim()) {
     draft.body.hasErrors = true
     draft.body.message = "You must provide title."
    }
    return
   case "noteFound":
    draft.notFound = true
    return
  }
 }

 const [state, dispatch] = useImmerReducer(ourReducer, originalState)

 function submitHandler(e) {
  e.preventDefault()
  // validate onBlur có lỗ hổng, khắc phục bằng cách thêm rule bắt nếu không có title
  dispatch({ type: "titleRules", value: state.title.value })
  dispatch({ type: "bodyRules", value: state.body.value })
  dispatch({ type: "submitRequest" })
 }

 useEffect(() => {
  const ourRequest = Axios.CancelToken.source()
  async function fetchPost() {
   try {
    const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
    if (response.data) {
     dispatch({ type: "fetchComplete", value: response.data })
    } else {
     dispatch({ type: "noteFound" })
    }
   } catch (e) {
    console.log("There was a problem or the request was cancelled.")
   }
  }
  fetchPost()
  return () => {
   ourRequest.cancel()
  }
 }, [])

 useEffect(() => {
  if (state.sendCount) {
   dispatch({ type: "saveRequestStarted" })
   const ourRequest = Axios.CancelToken.source()
   async function fetchPost() {
    try {
     const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token })
     // alert("congrat, post data complete...")
     dispatch({ type: "saveRequestFinished" })
     appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "Post was updated." })
     props.history.push(`/post/${state.id}`)
    } catch (e) {
     console.log("There was a problem or the request was cancelled.")
    }
   }
   fetchPost()
   return () => {
    ourRequest.cancel()
   }
  }
 }, [state.sendCount])


 if (state.notFound) {
  return (
   <NotFound></NotFound>
  )
 }

 if (state.isFetching)
  return (
   <UseEffectPage title="...">
    <LoadingDotsIcon />
   </UseEffectPage>
  )

 return (
  <UseEffectPage title="Edit Post">
   {/* thêm vào đường dẫn nhỏ quay về danh sách bài post */}
   <Link className="small font-weight-bold" to={`/post/${state.id}`}>&laquo;Back to post permanlink</Link>
   <form className="mt-3" onSubmit={submitHandler}>
    <div className="form-group">
     <label htmlFor="post-title" className="text-muted mb-1">
      <small>Title</small>
     </label>
     <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
     {state.title.hasErrors && <div className="alert alert-danger small invalidFeedback">{state.title.message}</div>}
    </div>

    <div className="form-group">
     <label htmlFor="post-body" className="text-muted mb-1 d-block">
      <small>Body Content</small>
     </label>
     <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
     {state.body.hasErrors && <div className="alert alert-danger small invalidFeedback">{state.body.message}</div>}
    </div>

    <button className="btn btn-primary" disabled={state.isSaving}>
     Save Updates
        </button>
   </form>
  </UseEffectPage>
 )
}

export default EditPost
