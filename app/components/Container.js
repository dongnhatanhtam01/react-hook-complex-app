import React from "react"
/**
 * Container để chứa các reusabled component
 */
function Container (props) {
  return (
    <div className={"container py-md-5"+ (props.wide ? '': ' container--narrow')} style={{marginTop:"5rem"}}>
      {props.children}
    </div>
  )
}
export default Container