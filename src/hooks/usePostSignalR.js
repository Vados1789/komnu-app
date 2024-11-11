// src/hooks/usePostSignalR.js
import { useEffect } from 'react';
import getPostSignalRConnection from '../services/signalR/postSignalR';

const usePostSignalR = (onReactionUpdate, onNewPost) => {
    useEffect(() => {
        const connection = getPostSignalRConnection();

        // Set up listeners
        if (onReactionUpdate) {
            connection.on("ReceiveReactionUpdate", onReactionUpdate);
        }

        if (onNewPost) {
            connection.on("ReceiveNewPost", onNewPost);
        }

        // Clean up listeners on component unmount
        return () => {
            connection.off("ReceiveReactionUpdate", onReactionUpdate);
            connection.off("ReceiveNewPost", onNewPost);
        };
    }, [onReactionUpdate, onNewPost]);
};

export default usePostSignalR;
