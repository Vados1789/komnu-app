// src/services/signalR/postSignalR.js
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import API_BASE_URL from '../../config/apiConfig';

const SIGNALR_URL = `${API_BASE_URL.replace('/api/', '')}/postHub`; // Base URL without `/api` path
let connection = null;

const getPostSignalRConnection = () => {
    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl(SIGNALR_URL)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        connection.onreconnecting((error) => {
            console.log("Reconnecting to PostHub...", error);
        });

        connection.onreconnected((connectionId) => {
            console.log("Reconnected to PostHub. Connection ID:", connectionId);
        });

        connection.onclose((error) => {
            console.error("PostHub connection closed:", error);
        });

        // Start the connection
        connection.start()
            .then(() => console.log("PostHub connected successfully"))
            .catch((err) => console.error("SignalR Connection Error: ", err));
    }
    return connection;
};

export default getPostSignalRConnection;
