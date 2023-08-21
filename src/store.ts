import { createSignal } from 'solid-js';
export interface MessageType{
    id:string
    username:string
    message:string
    room:string
}
export const usernameSignal = createSignal("")
export const messagesSignal = createSignal<Array<MessageType>>([])
