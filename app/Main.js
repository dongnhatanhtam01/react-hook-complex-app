import React from "react"
import ReactDOM from "react-dom"

import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

function ExampleComponent() {
    return (
        <div>
            <Header />
            <HomeGuest />
            <Footer />
        </div>
    )
}
ReactDOM.render(<ExampleComponent />, document.querySelector("#app"))
// không cần refresh any more 
if (module.hot) {
    module.hot.accept()
}