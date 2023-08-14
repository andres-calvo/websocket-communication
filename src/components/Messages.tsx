import {  createSignal, onCleanup, onMount } from 'solid-js';
import {io,Socket} from "socket.io-client"
import {messagesSignal} from "../store"


const Messages = ({room}:{room:string}) => {
  const [messages,setMessages] = messagesSignal
  const [socket,setSocket] = createSignal<Socket>()
  onMount(()=>{
    const socket = io("ws://localhost:4000");
    socket.emit("joinRoom",room)
    socket.on(room,(newMessages)=>{
        console.log("mensajes",newMessages)
        setMessages((prev)=>prev.concat(newMessages))
    })
    setSocket(socket)
    setTimeout(()=>{
        socket.emit("sendMessage",{username:"Andres",message:"Hola hola",room})
    },2000)
  })
  onCleanup(()=>{
    socket()?.off()
  })
  return <div></div>;
};

export default Messages