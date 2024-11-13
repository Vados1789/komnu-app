// src/hooks/useCommentSignalR.js
import { useEffect } from 'react';
import getCommentSignalRConnection from '../services/signalR/commentSignalR';

const useCommentSignalR = (onNewComment, onDeleteComment) => {
    useEffect(() => {
        const connection = getCommentSignalRConnection();

        // Remove any existing listeners to prevent duplicates
        connection.off("ReceiveNewComment");
        connection.off("DeleteComment");

        // Set up listener for new comments
        if (onNewComment) {
            connection.on("ReceiveNewComment", (newComment) => {
                console.log("Received new comment via SignalR:", newComment);
                onNewComment(newComment);
            });
        }

        // Set up listener for comment deletions
        if (onDeleteComment) {
            connection.on("DeleteComment", (deletedCommentId) => {
                console.log("Received delete comment signal via SignalR:", deletedCommentId);
                onDeleteComment(deletedCommentId);
            });
        }

        // Clean up listeners on component unmount
        return () => {
            connection.off("ReceiveNewComment", onNewComment);
            connection.off("DeleteComment", onDeleteComment);
        };
    }, [onNewComment, onDeleteComment]);
};

export default useCommentSignalR;
