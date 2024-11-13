// src/services/signalR/commentSignalR.js
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import API_BASE_URL from '../../config/apiConfig';

const SIGNALR_URL = `${API_BASE_URL.replace('/api/', '')}/commentHub`;
let connection = null;

const getCommentSignalRConnection = () => {
    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl(SIGNALR_URL)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        connection.onreconnecting((error) => {
            console.log("Reconnecting to CommentHub...", error);
        });

        connection.onreconnected((connectionId) => {
            console.log("Reconnected to CommentHub. Connection ID:", connectionId);
        });

        connection.onclose((error) => {
            console.error("CommentHub connection closed:", error);
        });

        connection.start()
            .then(() => console.log("CommentHub connected successfully"))
            .catch((err) => console.error("SignalR Connection Error: ", err));
    }
    return connection;
};

export default getCommentSignalRConnection;
