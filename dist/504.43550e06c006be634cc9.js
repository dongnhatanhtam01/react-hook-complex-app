(self.webpackChunkcomplex_app_react_review=self.webpackChunkcomplex_app_react_review||[]).push([[504],{9504:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>m});var o=a(7294),l=a(9669),n=a.n(l),r=a(1203),s=a(7564),c=a(3983);const m=(0,a(5977).EN)((function(e){const t=(0,o.useContext)(s.Z),a=(0,o.useContext)(c.Z),[l,m]=(0,o.useState)(),[u,p]=(0,o.useState)();return o.createElement(r.Z,{title:"Create New Post"},o.createElement("form",{onSubmit:async function(o){o.preventDefault(),alert("You had clicked create-post, right?");try{const o=await n().post("/create-post",{token:t.user.token,title:l,body:u});console.log("Bạn đã tạo thành công 1 bài post mới..!"),o&&(a({type:"FLASH_MESSAGE_ACTION",value:"Congrats, you successful created a post!!"}),e.history.push(`/post/${o.data}`))}catch(o){console.log(o.response.data)}}},o.createElement("div",{className:"form-group"},o.createElement("label",{htmlFor:"post-title",className:"text-muted mb-1"},o.createElement("small",null,"Title")),o.createElement("input",{onChange:e=>m(e.target.value),autoFocus:!0,name:"title",id:"post-title",className:"form-control form-control-lg form-control-title",type:"text",placeholder:"",autoComplete:"off"})),o.createElement("div",{className:"form-group"},o.createElement("label",{htmlFor:"post-body",className:"text-muted mb-1 d-block"},o.createElement("small",null,"Body Content")),o.createElement("textarea",{onChange:e=>p(e.target.value),name:"body",id:"post-body",className:"body-content tall-textarea form-control",type:"text"})),o.createElement("button",{className:"btn btn-primary"},"Save New Post")))}))}}]);