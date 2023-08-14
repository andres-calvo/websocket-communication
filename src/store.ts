import { createSignal } from 'solid-js';
interface Message{
    id:string
    username:string
    message:string
    room:string
}
export const usernameSignal = createSignal("")
export const messagesSignal = createSignal<Array<Message>>([])
