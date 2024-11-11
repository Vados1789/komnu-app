// src/services/signalR.js
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const SIGNALR_URL = "http://10.71.106.237:5202/postHub";

const createSignalRConnection = () => {
    const connection = new HubConnectionBuilder()
        .withUrl(SIGNALR_URL)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

    connection.onreconnecting((error) => {
        console.log("SignalR reconnecting...", error);
    });

    connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected. Connection ID:", connectionId);
    });

    connection.onclose((error) => {
        if (error) {
            console.error("SignalR connection closed with error:", error);
        } else {
            console.log("SignalR connection closed.");
        }
    });

    return connection;
};

export default createSignalRConnection;
