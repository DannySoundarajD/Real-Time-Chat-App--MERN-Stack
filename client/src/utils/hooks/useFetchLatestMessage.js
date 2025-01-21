import { useContext, useState, useEffect } from "react"
import { ChatContext } from "../../context/ChatContext"
import { baseUrl, getRequest } from "../services";


export const useFetchLatestMessage = (chat) => {
    const {newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setlatestMessage] = useState(null);

    useEffect (() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messageges/${chat?._id}}`);

            if(response.error) {
                return console.log("Error getting messagess...", error);
            }

            const lastMessage = response[response?.length -1];


            setlatestMessage(lastMessage);

        };
        getMessages();
    }, [newMessage, notifications])
}


export default useFetchLatestMessage;