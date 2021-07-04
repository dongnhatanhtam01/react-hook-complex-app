import React, { useContext, useEffect, useRef, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import io from 'socket.io-client'
import { Link } from "react-router-dom"

// const socket = io("http://localhost:8080")

function Chat() {
<<<<<<< HEAD
  const socket = useRef(null)
=======
  // khai báo socket
  const socket = useRef(null)

>>>>>>> 583789c4c5853ef8ffe039c640d9b72564f8f269
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
      appDispatch({ type: "CLEAR_UNREAD_CHATCOUNT" })
    }
  }, [appState.isChatOpen])

  // setup socket 
  useEffect(() => {
<<<<<<< HEAD
    socket.current = io("http://localhost:8080")
=======
    // mở socket.io mỗi lần nhắc tới component Chat
    // socket.current = io("http://localhost:8080")
    socket.current = io(process.env.BACKENDURL || "https://tongxinbackendformyreactapp123.herokuapp.com")
>>>>>>> 583789c4c5853ef8ffe039c640d9b72564f8f269
    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })
<<<<<<< HEAD

    return () => socket.current.disconnect()
=======
    // Đóng socket.io khi chyạ lại component
    return () => socket.current.current.disconnect()
>>>>>>> 583789c4c5853ef8ffe039c640d9b72564f8f269
  }, [])

  // set scrollTop theo chatLog
  // chatLog.current = DOM 
  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "INCREMENT_UNREAD_CHATCOUNT" })
    }
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
    socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })
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
          return (<div key={index} className="chat-other">
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