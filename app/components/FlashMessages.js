import React, { useEffect } from "react"
import UseEffectPage from "./UseEffectPage"

function FlashMessages(props) {
  return (
   <div className="floating-alerts">
     {/* <div className="alert alert-success text-center floating-alert shadow-sm"></div> */}
     {props.messages.map((msg,index) => {
       return (<div key={index} className="alert alert-success text-center floating-alert shadow-sm">{msg}</div>)
     })}
   </div>
  )
}

export default FlashMessages