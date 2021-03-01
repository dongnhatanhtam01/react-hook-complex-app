import React, { useEffect, useContext, useState } from "react"
import UseEffectPage from "./UseEffectPage"
import { useParams } from "react-router-dom"
import StateContext from "../StateContext"
import axios from "axios"

import ProfilePost from "./ProfilePost"

function Profile() {
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [userProfileData, setUserProfileData] = useState({
    "isFollowing": false,
    "profileAvatar": "https://gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=128",
    "profileUsername": "...",
    "counts": {
      followerCount: "",
      followingCount: "",
      postCount: ""
    }
  })
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`/profile/${username}`, { token: appState.user.token })
        setUserProfileData(response.data)
      }
      catch (e) {
        console.log("There were a problem");
      }
    }
    fetchData()
  }, [])

  return (
    <UseEffectPage title="Profile Screen">
      <h2>
        <img className="avatar-small" src={userProfileData.profileAvatar} /> {userProfileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {userProfileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {userProfileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {userProfileData.counts.followingCount}
        </a>
      </div>

      <ProfilePost />
    </UseEffectPage>
  )
}

export default Profile