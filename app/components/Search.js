import React, { useContext, useEffect } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer";
function Search() {
 const appDispatch = useContext(DispatchContext)

 const [state, setState] = useImmer({
  searchTerm: '',
  result: [],
  show: 'neither',
  requestCount: 0
 })

 function handleTimeCircleIcon(e) {
  e.preventDefault()
  appDispatch({ type: "CLOSE_SEARCH" })
 }
 // execute after each render
 useEffect(() => {
  // do side-effect here
  document.addEventListener("keyup", searchKeyPressHandler)
  // clean up here...
  // execute before the next render or unmount
  return () => document.removeEventListener("keyup", searchKeyPressHandler)
 }, [])



 useEffect(() => {
  const delay = setTimeout(() => {
   console.log(state.searchTerm);
   setState(draft => {
    draft.requestCount++
   })
  }, 3000)
  return () => clearTimeout(delay)
 }, [state.searchTerm])

 useEffect(() => {
  if (state.requestCount) {
   // Send axios request here
   console.log(state.requestCount);
  }
 }, [state.requestCount])

 function searchKeyPressHandler(e) {
  if (e.keyCode == 27) {
   appDispatch({ type: "CLOSE_SEARCH" })
  }
 }
 function handleInputField(e) {
  const value = e.target.value
  setState(draft => {
   draft.searchTerm = value
  })
 }

 return (
  <div className="search-overlay">
   <div className="search-overlay-top shadow-sm bg-dark">
    <div className="container container--narrow">
     <label htmlFor="live-search-field" className="search-overlay-icon">
      <i className="fas fa-search" />
     </label>
     <input onChange={handleInputField} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
     <span onClick={handleTimeCircleIcon} className="close-live-search">
      <i className="fas fa-times-circle" />
     </span>
    </div>
   </div>
   <div className="search-overlay-bottom">
    <div className="container container--narrow py-3">
     <div className="live-search-results live-search-results--visible">
      <div className="list-group shadow-sm">
       <div className="list-group-item active bg-success "><strong>Search Results</strong> (3 items found)</div>
       <a href="#" className="list-group-item list-group-item-action">
        <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
        <span className="text-muted small">by brad on 2/10/2020 </span>
       </a>
       <a href="#" className="list-group-item list-group-item-action">
        <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" /> <strong>Example Post #2</strong>
        <span className="text-muted small">by barksalot on 2/10/2020 </span>
       </a>
       <a href="#" className="list-group-item list-group-item-action">
        <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
        <span className="text-muted small">by brad on 2/10/2020 </span>
       </a>
      </div>
     </div>
    </div>
   </div>
  </div>

 )
}

export default Search