import React, { useEffect,useContext } from "react"
import { Link } from "react-router-dom"

import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function Post(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { post } = props
  const date = new Date(post.createdDate)
  // ngày date máy tính theo 0, tháng không có tháng 0
  const dateFomatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  useEffect(() => {
    if (!appState.user.token) {
      appDispatch({ type: "LOG_OUT_ACTION" })
      appDispatch({ type: "FLASH_MESSAGE_ACTION", value: "The session has expired, please log in again." })
    }
  }, [appState.user.token])

  return (
    <Link onClick={props.onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
      <span className="text-muted small"> {!props.noAuthor && (<>by {post.author.username}</>)} on {dateFomatted}{" "} </span>
    </Link>)
}

export default Post