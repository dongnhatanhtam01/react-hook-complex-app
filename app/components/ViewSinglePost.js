import React, { useEffect, useState, useContext } from "react"
import UseEffectPage from "./UseEffectPage"
import Axios from "axios";
import { useParams, NavLink } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkDown from "react-markdown"
import ReactToolTip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"

function ViewSinglePost(props) {
 const appState = useContext(StateContext)
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
  if(appState.loggedIn) {
   return appState.user.username == post.author.username
  }
  return false
 }
 return (
  <UseEffectPage title={post.title}>
   <div className="d-flex justify-content-between">
    <h2>{post.title}</h2>
    {isOwner() && (
     <span className="pt-2">
     <NavLink to={`/post/${id}/edit`} data-tip="Edit-marker" data-for="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></NavLink>
     <ReactToolTip id="edit" className="custom-tooltip" /> {" "}
     <a data-tip="delete-marker" data-for="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
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

export default ViewSinglePost