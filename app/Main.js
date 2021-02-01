import React from "react"
import ReactDOM from "react-dom"

// DAY 2
import { Route, BrowserRouter, Switch } from "react-router-dom";
import About from "./components/About"
import Terms from "./components/Terms"
// DAY 1
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

function Main() {
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route path="/about-us" exact component={About} />
                <Route path="/terms" exact component={Terms} />
                <Route path="/" exact component={HomeGuest} />
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