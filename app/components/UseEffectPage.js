import React, {useEffect} from "react"
import Container from "./Container"

function UseEffectPage(props) {
  useEffect(()=>{
    document.title=`${props.title} | ComplexApp`
    window.scrollTo(0,0)
    console.log(props.children);
  },[])
  return (
    <Container wide={props.wide}>
      {props.children}
    </Container>
  )
}
export default UseEffectPage