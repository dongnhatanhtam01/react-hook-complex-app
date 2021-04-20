import React, { useEffect, useState, useContext } from "react"
import UseEffectPage from "./UseEffectPage"
import Axios from "axios";
import { useParams, NavLink, withRouter } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkDown from "react-markdown"
import ReactToolTip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
 const appState = useContext(StateContext)
 const appDispatch = useContext(DispatchContext)
 const { id } = useParams()
 const [isLoading, setIsLoading] = useState(true)
 const [post, setPost] = useState()

 useEffect(() => {
  // nhớ là thông thường biến ngoài không truy nhập được vô scope trong axios
  // dùng của nó thì được :D
  const ourRequest = Axios.CancelToken.source()
  async function fetchPost() {
   try {
    const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
    setPost(response.data)
    setIsLoading(false)
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

 if (!isLoading && !post) {
  return (
   <NotFound />
  )
 }

 if (isLoading) return <UseEffectPage title="...">
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
 const date = new Date(post.createdDate)
 const dateFomatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

 function isOwner() {
  if (appState.loggedIn) {
   return appState.user.username == post.author.username
  }
  return false
 }

 // Xóa bài post - tính năng mới 04.2021
 async function deleteHandler(a) {
  console.log(a)
  const areYouSure = window.confirm("Do you really want to delete this post?")
  if (areYouSure) {
   try {
    const response = await Axios.delete(`/post/${id}`, {data: {token: appState.user.token}}) 
    if(response.data == "Success"){
     // .1 Display flash message
     appDispatch({type:'FLASH_MESSAGE_ACTION', value: `the post ${post.title} ${' '} - ${' '} has been deleted`})
     // .2 Return back to the current user's profile
     props.history.push(`/profile/${appState.user.username}`)
    }
    }
   catch (e) {
    console.log("There was a problem in delete function!");
   }
  }
 }

 return (
  <UseEffectPage title={post.title}>
   <div className="d-flex justify-content-between">
    <h2>{post.title}</h2>
    {isOwner() && (
     <span className="pt-2">
      <NavLink to={`/post/${id}/edit`} data-tip="Edit-marker" data-for="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></NavLink>
      <ReactToolTip id="edit" className="custom-tooltip" /> {" "}
      <a onClick={e => deleteHandler(e)} data-tip="delete-marker" data-for="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
      <ReactToolTip id="delete" className="custom-tooltip" />
     </span>
    )}
   </div>

   <p className="text-muted small mb-4">
    <NavLink to={`/profile/${post.author.username}`}>
     <img className="avatar-tiny" src={post.author.avatar} />
    </NavLink>
        Posted by <NavLink to={`/profile/${post.author.username}`}>{post.author.username}</NavLink> on {" "}{dateFomatted}
   </p>

   <div className="body-content">
    <ReactMarkDown children={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} />
   </div>
  </UseEffectPage>
 )
}

export default withRouter(ViewSinglePost)