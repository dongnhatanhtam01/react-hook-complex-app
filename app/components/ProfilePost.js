import Axios from "axios"
import React, { useEffect, useState } from "react"

import { useParams, Link } from "react-router-dom"

function ProfilePost() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)
        setPosts(response.data)
        setIsLoading(false)
      }
      catch (e) {
        console.log("There was a problem.");
      }
    }
    fetchPost()
  }, [])

  if (isLoading) { return <div>Loading...</div> }

  return (
    <div className="list-group">
      {posts.map((post, index) => {
        // string to Date()
        const date = new Date(post.createdDate)
        // ngày date máy tính theo 0, tháng không có tháng 0
        const dateFomatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
            <span className="text-muted small">{dateFomatted} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePost