import { createSignal, onCleanup, onMount, For } from "solid-js";
import { io, Socket } from "socket.io-client";
import { messagesSignal, usernameSignal } from "../store";

let listMessagesRef: HTMLDivElement;
let inputRef: HTMLInputElement;
const Messages = ({ room }: { room: string }) => {
  const [messages, setMessages] = messagesSignal;
  const [userName,setUserName] = usernameSignal
  const [socket, setSocket] = createSignal<Socket>();

  const sendMessage = (value: string) => {
    socket()?.emit("sendMessage", {
      username: userName(),
      message: value,
      room,
    });
  };
  onMount(() => {
    const auth = sessionStorage.getItem("auth")
    if(!auth){
      document.location.href="/"
      return
    }
    const authParsed= JSON.parse(auth)
    const socket = io("ws://localhost:4000");
    socket.emit("joinRoom", room);
    socket.on(room, (newMessages) => {
      setMessages((prev) => prev.concat(newMessages).slice(-100));
      listMessagesRef.scrollTo({
        top: listMessagesRef.scrollHeight,
        behavior: "instant",
      });
    });
    setSocket(socket);
    setUserName(authParsed.username)
  });
  onCleanup(() => {
    socket()?.off();
  });
  return (
    <>
      <div ref={listMessagesRef} class="overflow-y-auto ">
        <For each={messages()} >
          {(msg) => (
            <div class="flex flex-col gap-1 text-white">
              <h2 class="text-lg font-bold leading-tight">{msg.username}</h2>
              <p>{msg.message}</p>
            </div>
          )}
        </For>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(inputRef.value);
          sendMessage(inputRef.value);
          inputRef.value = "";
        }}
        class="w-full "
      >
        <input
          type="text"
          placeholder="Write a message...  (Max 150 Char)"
          class="bg-[#282b30] px-4 py-3 rounded-xl mt-auto text-white w-full "
          ref={inputRef}
        ></input>
      </form>
    </>
  );
};

export default Messages;
