import React, {useState} from "react"
import ReactDOM from "react-dom"

import Home from "./components/Home"
// DAY 2
import { Route, BrowserRouter, Switch } from "react-router-dom";
import About from "./components/About"
import Terms from "./components/Terms"
// DAY 1
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

function Main() {
    // lift the state up to high level
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")))

    return (
        <BrowserRouter>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Switch>
                <Route path="/about-us" exact component={About} />
                <Route path="/terms" exact component={Terms} />
                <Route path="/" exact  >
                    {loggedIn ? <Home />: <HomeGuest />}
                </Route>
            </Switch>
            <Footer />
        </BrowserRouter>
    )
}
ReactDOM.render(<Main />, document.querySelector("#app"))
// không cần refresh any more 
if (module.hot) {
    module.hot.accept()
}