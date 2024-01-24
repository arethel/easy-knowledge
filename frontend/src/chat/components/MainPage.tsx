import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {ChatService} from "../service/ChatService";
import Chat from "./Chat";
import {ChatCompletion, ChatMessage, MessageType, Role} from "../models/ChatCompletion";
import {ScrollToBottomButton} from "./ScrollToBottomButton";
import {OPENAI_DEFAULT_SYSTEM_PROMPT} from "../../config";
import {toast, ToastContainer} from "react-toastify";
import {CustomError} from "../service/CustomError";
import db, {getConversationById} from "../service/ConversationDB";
import Tooltip from "./Tooltip";
import {useTranslation} from 'react-i18next';
import MessageBox, {MessageBoxHandles} from "./MessageBox";

const MainPage = (client: any) => {
    const { t } = useTranslation();
    const [isNewConversation, setIsNewConversation] = useState<boolean>(false);
    const [conversationId, setConversationId] = useState(0);
    const [systemPrompt, setSystemPrompt] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [allowAutoScroll, setAllowAutoScroll] = useState(true);
    const messageBoxRef = useRef<MessageBoxHandles>(null);

    const updateConversationMessages = async (id: number, updatedMessages: any[]) => {
        try {
            await client.patch(`/api/conversation/${id}/`, { messages: updatedMessages });
        } catch (error) {
            console.error("Error updating conversation:", error);
        }
    }

    useEffect(() => {
        const fetchConversation = async (id: string) => {
            try {
                const response = await client.get(`/api/conversation/${id}/`);
                const conversation = response.data;
                setSystemPrompt(conversation.system_prompt);
                setMessages(conversation.messages);
            } catch (error) {
                console.error("Error fetching conversation:", error);
            }
        };

        const storedConversationId = localStorage.getItem("lastConversationId");
        if (storedConversationId) {
            fetchConversation(storedConversationId);
            setConversationId(parseInt(storedConversationId));
        } else {
            setIsNewConversation(true);
        }
    }, []);

    useEffect(() => {
        const handleSelectedConversation = (id: string | null) => {
            if (id && id.length > 0) {
                let n = Number(id);
                getConversationById(n).then(conversation => {
                    if (conversation) {
                        setConversationId(conversation.id)
                        setSystemPrompt(conversation.systemPrompt);
                        ChatService.setSelectedModelId(conversation.model);
                        const messages: ChatMessage[] = JSON.parse(conversation.messages);
                        if (messages.length == 0) {
                            // Race condition: the navigate to /c/id and the updating of the messages state
                            // are happening at the same time.
                            console.warn('possible state problem');
                        } else {
                            setMessages(messages);
                        }
                        clearTextArea();
                    } else {
                        console.error("Conversation not found.");
                    }
                });
            } else {
                setIsNewConversation(true);
                setConversationId(0);
                setSystemPrompt('');
                clearTextArea();
                // ChatService.setSelectedModelId('');
                setMessages([]);
            }
            setAllowAutoScroll(true);
            setShowScrollButton(false)
        }
        scrollToBottom();
        handleSelectedConversation(localStorage.getItem("lastConversationId"))
    }, []);

    useEffect(() => {
        setIsNewConversation(messages.length === 0);
        if (conversationId) {
            // Only update if there are messages
            if (messages.length > 0) {
                updateConversationMessages(conversationId, messages);
            }
        }
    }, [messages]);

    const startConversation = async (message: string) => {
        const timestamp = new Date().toISOString();
        const shortenedText = message.substring(0, 25);
        console.log({
            title: shortenedText,
            model: ChatService.getSelectedModelId(),
            system_prompt: systemPrompt,
            messages: [],
            timestamp: timestamp,
        })
        try {
            const response = await client.post('/api/conversation/', {
                title: shortenedText,
                model: ChatService.getSelectedModelId(),
                system_prompt: systemPrompt,
                messages: [],
                timestamp: timestamp,
            });
            setConversationId(response.data.id);
            localStorage.setItem('lastConversationId', response.data.id.toString());
        } catch (error) {
            console.error("Error starting a new conversation:", error);
        }
    }

    const callApp = (message: string) => {
        if (isNewConversation) {
            startConversation(message);
        }
        setAllowAutoScroll(true);
        addMessage(Role.User, MessageType.Normal, message, sendMessage);
    }

    const addMessage = (role: Role, messageType: MessageType, content: string, callback?: (callback: ChatMessage[]) => void) => {

        setMessages((prevMessages: ChatMessage[]) => {
            const message: ChatMessage = {
                id: prevMessages.length + 1,
                role: role,
                messageType: messageType,
                content: content
            };
            const updatedMessages = [...prevMessages, message];
            return updatedMessages;
        });

        const newMessage: ChatMessage = {
            id: messages.length + 1,
            role: role,
            messageType: messageType,
            content: content
        };
        const updatedMessages = [...messages, newMessage];
        if (callback) {
            callback(updatedMessages);
        }
    };

    function sendMessage(updatedMessages: ChatMessage[]) {
        setLoading(true);
        clearTextArea();
        let systemPromptFinal = systemPrompt;
        if (!systemPromptFinal || systemPromptFinal === '') {
            systemPromptFinal = OPENAI_DEFAULT_SYSTEM_PROMPT;
        }
        let messages: ChatMessage[] = [{
            role: Role.System,
            content: systemPromptFinal
        } as ChatMessage, ...updatedMessages];
        const message: string = "Some placeholder text to answer user";
        setLoading(false);
        addMessage(Role.Assistant, MessageType.Normal, message);
        // ChatService.sendMessageStreamed(messages, ChatService.getSelectedModelId(), handleStreamedResponse)
        //     .then((response: ChatCompletion) => {
        //         // nop
        //     })
        //     .catch(err => {
        //             if (err instanceof CustomError) {
        //                 const message: string = err.message;
        //                 setLoading(false);
        //                 addMessage(Role.Assistant, MessageType.Error, message);
        //             } else {
        //                 toast.error(err.message, {
        //                     position: "top-center",
        //                     autoClose: 5000,
        //                     hideProgressBar: false,
        //                     closeOnClick: true,
        //                     pauseOnHover: true,
        //                     draggable: true,
        //                     progress: undefined,
        //                     theme: "light",
        //                 });
        //             }
        //         }
        //     ).finally(() => {
        //     setLoading(false); // Stop loading here, whether successful or not
        // });
    }

    function handleStreamedResponse(content: string) {
        setMessages(prevMessages => {
            let isNew: boolean = false;
            try {
                // todo: this shouldn't be necessary
                if (prevMessages.length == 0) {
                    console.error('prevMessages should not be empty in handleStreamedResponse.');
                    return [];
                }
                if ((prevMessages[prevMessages.length - 1].role == Role.User)) {
                    isNew = true;
                }
            } catch (e) {
                console.error('Error getting the role')
                console.error('prevMessages = '+JSON.stringify(prevMessages));
                console.error(e);
            }

            if (isNew) {
                const message: ChatMessage = {
                    id: prevMessages.length + 1,
                    role: Role.Assistant,
                    messageType: MessageType.Normal,
                    content: content
                };
                return [...prevMessages, message];
            } else {
                // Clone the last message and update its content
                const updatedMessage = {
                    ...prevMessages[prevMessages.length - 1],
                    content: prevMessages[prevMessages.length - 1].content + content
                };

                // Replace the old last message with the updated one
                return [...prevMessages.slice(0, -1), updatedMessage];
            }
        });
    }

    const scrollToBottom = () => {
        const chatContainer = document.getElementById('chat-container'); // Replace with your chat container's actual ID
        if (chatContainer) {
            chatContainer.scroll({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const clearTextArea = () => {
        messageBoxRef.current?.clearTextValue();
    };

    const getTextAreaValue = () => {
        const value = messageBoxRef.current?.getTextValue();
    };

    const handleUserScroll = (isAtBottom: boolean) => {
        setAllowAutoScroll(isAtBottom);
        setShowScrollButton(!isAtBottom);
    };

    return (
        <div className="overflow-hidden w-full h-full relative flex z-0">
            <div className="flex flex-col items-stretch w-full h-full">
                <ToastContainer/>
                <main
                    className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                    {/*<div className="flex-grow">*/}
                    <Chat chatBlocks={messages} onChatScroll={handleUserScroll} allowAutoScroll={allowAutoScroll}/>
                    {/*</div>*/}
                    {/* Absolute container for the ScrollToBottomButton */}
                    {showScrollButton && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-10 z-10">
                            <ScrollToBottomButton onClick={scrollToBottom}/>
                        </div>
                    )}

                    {/* MessageBox remains at the bottom */}
                    <MessageBox ref={messageBoxRef} callApp={callApp} loading={loading} setLoading={setLoading}/>
                </main>
            </div>
        </div>
    );
}

export default MainPage;
