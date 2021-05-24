import React, { useContext, useEffect } from "react"
import UseEffectPage from "./UseEffectPage"
import StateContext from "../StateContext"
import { useImmer } from 'use-immer'
import axios from 'axios'
import LoadingDotsIcon from "./LoadingDotsIcon"
import { Link } from 'react-router-dom'
import Post from "./Post"

function Home() {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  })
  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await axios.post(`/getHomeFeed`, { token: appState.user.token })
        setState(draft => {
          draft.isLoading = false,
            draft.feed = response.data
        })
        console.log(response.data)
      }
      catch (e) {
        console.log("There were a problem");
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  // isLoading
  if (state.isLoading) {
    return <LoadingDotsIcon />
  }


  return (
    <UseEffectPage title="Your feed ">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The latest from those we follow </h2>
          <div className="list-group">
            {state.feed.map(post => {
              // const date = new Date(post.createdDate)
              // // ngày date máy tính theo 0, tháng không có tháng 0
              // const dateFomatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
              // return (
              //   <Link onClick={() => {
              //     appDispatch({ type: 'CLOSE_SEARCH' })
              //   }} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
              //     <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
              //     <span className="text-muted small">by {post.author.username} on {dateFomatted}{" "} </span>
              //   </Link>)
            return  <Post post={post} key={post._id} />
            })}
          </div>
        </>
      )}
      { state.feed.length == 0 && (
        <>
          <h2 className="text-center">Hello <strong>{appState.user.username}</strong>, your feed is empty.</h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
    </UseEffectPage>
  )
}

export default Home