import React, { useContext, useEffect, useRef, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import io from 'socket.io-client'
import {Link} from "react-router-dom"

const socket = io("http://localhost:8080")

function Chat() {
  const chatField = useRef(null)
  const chatLog = useRef(null)
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    fieldValue: '',
    chatMessages: []
  })

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus()
    }
  }, [appState.isChatOpen])

  // setup socket 
  useEffect(() => {
    socket.on("chatFromServer",message => {
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })
  }, [])
  
  // set scrollTop theo chatLog
  // chatLog.current = DOM 
  useEffect(() => {
   chatLog.current.scrollTop = chatLog.current.scrollHeight
  }, [state.chatMessages])

  function handleFieldChange(e) {
    const value = e.target.value
    setState((draft) => {
      // draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
      draft.fieldValue = value
    })
  }


  function handleSubmit(e) {
    e.preventDefault()
    // alert(state.fieldValue)
    // send messages to chat server
    socket.emit("chatFromBrowser",{message: state.fieldValue, token: appState.user.token})
    setState(draft => {
      // Add messages to state collection of messages
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar })
      draft.fieldValue = ''
    })

  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper  shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-success">
        Chat
        <span
          onClick={() => appDispatch({ type: "CLOSE_CHAT" })}
          className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
            <div key={index} className="chat-self">
              <div className="chat-message">
                <div className="chat-message-inner">{message.message}</div>
              </div>
              <img className="chat-avatar avatar-tiny" src={message.avatar} />
            </div>
            )
          }
          return (<div key={index}  className="chat-other">
            <Link to={`/profile/${message.username}`}>
              <img className="avatar-tiny" src={message.avatar} />
            </Link>
            <div className="chat-message">
              <div className="chat-message-inner">
                <Link to={`/profile/${message.username}`}>
                  <strong>{message.username}: </strong>
                </Link>
              {message.message}
            </div>
            </div>
          </div>)
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input
          value={state.fieldValue}

          onChange={handleFieldChange}
          ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  )
}

export default Chat