import React, {useEffect} from "react"
import Container from "./Container"
function UseEffectPage(props) {
  useEffect(()=>{
    document.title=`${props.title} | ComplexApp`
    window.scrollTo(0,0)
  },[])
  return (
    <Container>
      {props.children}
    </Container>
  )
}
export default UseEffectPage