import React, { useContext, useEffect } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer";
import Axios from "axios"
import { Link } from "react-router-dom"
import Post from "./Post";

function Search() {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: '',
    results: [],
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
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = 'loading'
      })
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++
        })
      }, 750)
      return () => clearTimeout(delay)
    } else {
      setState(draft => {
        draft.show = 'neither'
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
          setState(draft => {
            draft.results = response.data
            draft.show = "results"
          })
          // console.log(response.data)
        }
        catch (err) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
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
          <div className={"circle-loader " + (state.show == "loading" ? 'circle-loader--visible' : '')}></div>
          <div className={"live-search-results " + (state.show == "results" ? 'live-search-results--visible' : '')}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active bg-success "><strong>Search Results</strong>({state.results.length}  {state.results.length > 1 ? "items" : "item"}) found</div>
                { state.results.map(post => {
                 return <Post post={post} key={post._id} onClick={()=> appDispatch({ type: "CLOSE_SEARCH" })}/>
                })}
              </div>
            )}
            {!Boolean(state.results.length)&& <p className="alert alert-danger text-center shadow-sm">Sorry, we could not find results for that search.</p>}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Search