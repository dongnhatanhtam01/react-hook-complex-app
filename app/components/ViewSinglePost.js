import React, { useEffect, useState } from "react"
import UseEffectPage from "./UseEffectPage"
import Axios from "axios";
import { useParams, NavLink } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon";
// DAY 03.03.2021

function ViewSinglePost(props) {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    // nhớ là thông thường biến ngoài không truy nhập được vô scope trong axios
    // dùng của nó thì được :D
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
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

  return (
    <UseEffectPage title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit"><i className="fas fa-edit"></i></a>
          <a className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"></i></a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <NavLink to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </NavLink>
        Posted by <NavLink to={`/profile/${post.author.username}`}>{post.author.username}</NavLink> on {" "}{dateFomatted}
      </p>

      <div className="body-content">
        {post.body}
      </div>
    </UseEffectPage>
  )
}

export default ViewSinglePost