import { useEffect } from 'react';
import getPostSignalRConnection from '../services/signalR/postSignalR';

const usePostSignalR = (onReactionUpdate, onNewPost, onPostDeleted, onPostUpdated) => {
    useEffect(() => {
        const connection = getPostSignalRConnection();

        console.log("Setting up SignalR connection. onNewPost defined:", typeof onNewPost === "function");

        // Set up listeners for different events
        if (onReactionUpdate) {
            connection.on("ReceiveReactionUpdate", onReactionUpdate);
        }

        if (onNewPost) {
            connection.on("ReceiveNewPost", onNewPost);
        }

        if (onPostDeleted) {
            console.log('some post deleted');
            connection.on("ReceivePostDeleted", onPostDeleted);
        }

        if (onPostUpdated) {
            connection.on("ReceivePostUpdated", onPostUpdated); // Listen for updated posts
        }

        // Clean up listeners on component unmount
        return () => {
            connection.off("ReceiveReactionUpdate", onReactionUpdate);
            connection.off("ReceiveNewPost", onNewPost);
            connection.off("ReceivePostDeleted", onPostDeleted);
            connection.off("ReceivePostUpdated", onPostUpdated);
        };
    }, [onReactionUpdate, onNewPost, onPostDeleted, onPostUpdated]);  // Ensure all handlers are included in dependency array
};

export default usePostSignalR;
