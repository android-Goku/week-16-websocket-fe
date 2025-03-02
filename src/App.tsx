import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState();
  const [chat, setChat] = useState([]);
  const [serverMsg, setServerMsg] = useState();
  
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage(){
    if(!socket){return}
    //@ts-ignore
    const message = inputRef.current.value;
    const m = {
      value: message,
      id: "user"
    }
    //@ts-ignore
    setChat([...chat, JSON.stringify(m)])
        //@ts-ignore
    socket.send(message)
  }

  useEffect(() => {
    const ws = new WebSocket("ws://week-16-websocket-production.up.railway.app");
        //@ts-ignore
    setSocket(ws)

    ws.onmessage = (ev) => {
      console.log(ev.data)
      //alert(ev.data);
      //setChat([...chat, ev.data])
      const m = {
        value: ev.data,
        id: "server"
      }
    //@ts-ignore
      setServerMsg(JSON.stringify(m));
    }
  },[])

  useEffect(() => {
        //@ts-ignore
    setChat([...chat, serverMsg])
  },[serverMsg])

  return (
    <div style={{width: "600px", justifySelf: "center"}}>
      <ChatBox chat={chat} />
      <br />
      <br />
      <div style={{display: 'flex', justifyContent: "center", background:"red"}}>
        <input ref={inputRef} type="text" placeholder='Message...'></input>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default App
    //@ts-ignore
function ChatBox ({chat}) {
  return <div>
      <ul>
      
      {chat.map((msg: string , index: number) => (
        <div key={index} >
          <Message msg={msg} />
        </div>
      ))}
    </ul>
  </div>
}
    //@ts-ignore
function Message( { msg} ) {
  if(!msg){return}
  const message = JSON.parse(msg);
  return <div style={{display: "flex", background: message.id === "server" ? "yellow" : "pink" , justifyContent: message.id === "server" ? "flex-start" : "flex-end" }}>
    {message.value}
</div>
}