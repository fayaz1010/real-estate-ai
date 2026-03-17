import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationRead,
  setActiveConversation,
  clearError,
} from "../store/communicationSlice";

export const useCommunication = () => {
  const dispatch = useDispatch<AppDispatch>();
  const communication = useSelector((state: RootState) => state.communication);

  const loadConversations = useCallback(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const loadMessages = useCallback(
    (conversationId: string, page?: number) => {
      dispatch(fetchMessages({ conversationId, page }));
    },
    [dispatch],
  );

  const send = useCallback(
    (conversationId: string, content: string) => {
      return dispatch(sendMessage({ conversationId, content })).unwrap();
    },
    [dispatch],
  );

  const selectConversation = useCallback(
    (conversationId: string | null) => {
      dispatch(setActiveConversation(conversationId));
      if (conversationId) {
        dispatch(fetchMessages({ conversationId }));
        dispatch(markConversationRead(conversationId));
      }
    },
    [dispatch],
  );

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const activeConversation = communication.conversations.find(
    (c) => c.id === communication.activeConversationId,
  ) || null;

  return {
    conversations: communication.conversations,
    activeConversationId: communication.activeConversationId,
    activeConversation,
    messages: communication.messages,
    isLoadingConversations: communication.isLoadingConversations,
    isLoadingMessages: communication.isLoadingMessages,
    isSending: communication.isSending,
    error: communication.error,
    loadConversations,
    loadMessages,
    send,
    selectConversation,
    resetError,
  };
};
