import React, { useEffect, useContext, useState } from "react"
import UseEffectPage from "./UseEffectPage"
import { useParams } from "react-router-dom"
import StateContext from "../StateContext"
import axios from "axios"
import { useImmer } from "use-immer"

import ProfilePost from "./ProfilePost"

function Profile() {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      "isFollowing": false,
      "profileAvatar": "https://gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=128",
      "profileUsername": "...",
      "counts": {
        followerCount: "",
        followingCount: "",
        postCount: ""
      }
    }
  })
  // const [userProfileData, setUserProfileData] = useState({
  //   "isFollowing": false,
  //   "profileAvatar": "https://gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=128",
  //   "profileUsername": "...",
  //   "counts": {
  //     followerCount: "",
  //     followingCount: "",
  //     postCount: ""
  //   }
  // })
  useEffect(() => {
    const ourRequest = axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await axios.post(`/profile/${username}`, { token: appState.user.token })
        setState(draft => {
          draft.profileData = response.data
        })
        // setUserProfileData(response.data)
      }
      catch (e) {
        console.log("There were a problem");
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = axios.CancelToken.source()
      async function fetchData() {
        try {
          const response = await axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token })
          setState(draft => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
            draft.followActionLoading = false
          })
          // setUserProfileData(response.data)
        }
        catch (e) {
          console.log("There were a problem");
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.startFollowingRequestCount])
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const ourRequest = axios.CancelToken.source()
      async function fetchData() {
        try {
          const response = await axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token })
          setState(draft => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
            draft.followActionLoading = false
          })
          // setUserProfileData(response.data)
        }
        catch (e) {
          console.log("There were a problem");
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.stopFollowingRequestCount])
  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }
  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }
  return (
    <UseEffectPage title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Stop Following <i className="fas fa-user-times"></i></button>
        )}
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePost />
    </UseEffectPage>
  )
}

export default Profile