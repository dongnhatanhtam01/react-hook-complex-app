import React, { useEffect } from "react"
import { Link } from "react-router-dom"

function Post(props) {
  const {post}  = props
  const date = new Date(post.createdDate)
  // ngày date máy tính theo 0, tháng không có tháng 0
  const dateFomatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return ( 
    <Link onClick={props.onClick}  to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
      <span className="text-muted small"> {!props.noAuthor && (<>by {post.author.username}</>)} on {dateFomatted}{" "} </span>
    </Link>)
}

export default Post