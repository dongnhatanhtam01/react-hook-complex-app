import React, {useEffect} from "react"
import Container from "./Container"

function UseEffectPage(props) {
  // do mỗi lần thay đổi cơ chế
  // của thằng react sẽ tự chạy lại page này
  // thế nên nếu để (,[]) là khi nó load lại title không đổi
  // nên phải [props.title]
  useEffect(()=>{
    document.title=`${props.title} | ComplexApp`
    window.scrollTo(0,0)
    console.log(props.children);
  },[props.title])
  return (
    <Container wide={props.wide}>
      {props.children}
    </Container>
  )
}
export default UseEffectPage