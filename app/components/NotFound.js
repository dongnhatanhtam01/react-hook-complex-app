import React from "react"
import UseEffectPage from "./UseEffectPage"
import { Link } from "react-router-dom"
function NotFound() {
 return (
  <UseEffectPage title="Not Found">
   <div className="text-center">
    <h2>Whoops, we can not find this page!</h2>
    <p className="lead text-muted">You can visit <Link to="/">homepage</Link> to get a fresh start.</p>
   </div>
  </UseEffectPage>
 )
}

export default NotFound