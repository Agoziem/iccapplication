"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import axios from "axios";

interface ChatRoom {
  id: number;
  group_name?: string;
  [key: string]: any;
}

interface ChatroomContextValue {
  organizationID: string | undefined;
  groupChats: ChatRoom[];
  selectedChat: ChatRoom | null;
  setSelectedChat: (chat: ChatRoom | null) => void;
  fetchGroupChats: (user_id?: number) => Promise<void>;
  createGroupChat: (user_id: number, data: any) => Promise<void>;
  editChatRoom: (chatroomId: number, user_id: number, data: any) => Promise<void>;
  deleteChatRoom: (chatroomId: number, user_id: number) => Promise<void>;
  addUsersToChatRoom: (chatroomId: number, admin_id: number, users: number[]) => Promise<void>;
  addUserToChatRoom: (chatroomId: number, admin_id: number, user_id: number) => Promise<void>;
  removeMembersFromChatRoom: (chatroomId: number, admin_id: number, users: number[]) => Promise<void>;
  removeMemberFromChatRoom: (chatroomId: number, admin_id: number, user_id: number) => Promise<void>;
  addAdminsToChatRoom: (chatroomId: number, owner_id: number, users: number[]) => Promise<void>;
  addAdminToChatRoom: (chatroomId: number, owner_id: number, user_id: number) => Promise<void>;
  removeAdminsFromChatRoom: (chatroomId: number, owner_id: number, users: number[]) => Promise<void>;
  removeAdminFromChatRoom: (chatroomId: number, owner_id: number, user_id: number) => Promise<void>;
  viewChatRoom: (chatroomId: number, user_id: number) => Promise<void>;
}

interface ChatroomContextProviderProps {
  children: ReactNode;
}

// Create the context
const ChatroomContext = createContext<ChatroomContextValue | null>(null);

const ChatroomContextProvider: React.FC<ChatroomContextProviderProps> = ({ children }) => {
  const [organizationID, setOrganizationID] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_ORGANIZATION_ID
  );
  const [groupChats, setGroupChats] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);


  // ------------------------------------------------------
  // Fetch group chats from the API
  // ------------------------------------------------------
  const fetchGroupChats = async (user_id: number | null = null): Promise<void> => {
    try {
      const url = user_id
        ? `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${organizationID}/${user_id}/list/`
        : `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${organizationID}/list/`;
      const response = await axios.get(url);
      setGroupChats(response.data);
    } catch (error: any) {
      console.error("Failed to fetch group chats", error);
    }
  };

  //------------------------------------------------------
  // Create a group chat (only the admin can create)
  //------------------------------------------------------ 
  const createGroupChat = async (user_id: number, data: any): Promise<void> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${user_id}/create/`, data);
      setGroupChats([...groupChats, response.data]);
    } catch (error: any) {
      console.error("Failed to create group chat", error);
    }
  };

  //------------------------------------------------------
  // Edit a group chat (only the admin can edit)
  //------------------------------------------------------
  const editChatRoom = async (chatroomId: number, user_id: number, data: any): Promise<void> => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${user_id}/edit/`,
        data
      );
      setGroupChats(
        groupChats.map((chat) =>
          chat.id === chatroomId ? response.data : chat
        )
      );
    } catch (error: any) {
      console.error("Failed to edit chat room", error);
    }
  };

  // ------------------------------------------------------
  // Delete a group chat (only the admin can delete)
  // ------------------------------------------------------
  const deleteChatRoom = async (chatroomId: number, user_id: number): Promise<void> => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${user_id}/delete/`);
      setGroupChats(groupChats.filter((chat) => chat.id !== chatroomId));
    } catch (error: any) {
      console.error("Failed to delete chat room", error);
    }
  };


  // ------------------------------------------------------
  // Add users to a chat room (only the admin can add)
  // ------------------------------------------------------
  const addUsersToChatRoom = async (chatroomId: number, admin_id: number, users: number[]): Promise<void> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/add-users/`,
        { users }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to add users to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Add a user to a chat room (only the admin can add)
  // ------------------------------------------------------
  const addUserToChatRoom = async (chatroomId: number, admin_id: number, user_id: number): Promise<void> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/add-user/`,
        { user_id }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to add user to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove members from a chat room (only the admin can remove)
  // ------------------------------------------------------
  const removeMembersFromChatRoom = async (chatroomId: number, admin_id: number, users: number[]): Promise<void> => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/remove-members/`,
        { data: { users } }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to remove members from chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove a member from a chat room (only the admin can remove)
  // ------------------------------------------------------
  const removeMemberFromChatRoom = async (chatroomId: number, admin_id: number, user_id: number): Promise<void> => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/remove-member/`,
        { data: { user_id } }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to remove member from chat room", error);
    }
  };

  // ------------------------------------------------------
  // Add admins to a chat room (only the owner can add)
  // ------------------------------------------------------
  const addAdminsToChatRoom = async (chatroomId: number, owner_id: number, users: number[]): Promise<void> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/add-admins/`,
        { users }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to add admins to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Add an admin to a chat room (only the owner can add)
  // ------------------------------------------------------
  const addAdminToChatRoom = async (chatroomId: number, owner_id: number, user_id: number): Promise<void> => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/add-admin/`,
        { user_id }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to add admin to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove admins from a chat room (only the owner can remove)
  // ------------------------------------------------------
  const removeAdminsFromChatRoom = async (chatroomId: number, owner_id: number, users: number[]): Promise<void> => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/remove-admins/`,
        { data: { users } }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to remove admins from chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove an admin from a chat room (only the owner can remove)
  // ------------------------------------------------------
  const removeAdminFromChatRoom = async (chatroomId: number, owner_id: number, user_id: number): Promise<void> => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/remove-admin/`,
        { data: { user_id } }
      );
      fetchGroupChats();
    } catch (error: any) {
      console.error("Failed to remove admin from chat room", error);
    }
  };

  // ------------------------------------------------------
  // View a chat room
  // ------------------------------------------------------
  const viewChatRoom = async (chatroomId: number, user_id: number): Promise<void> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${user_id}/view/`
      );
      setSelectedChat(response.data);
    } catch (error: any) {
      console.error("Failed to view chat room", error);
    }
  };



  return (
    <ChatroomContext.Provider
      value={{
        organizationID,
        groupChats,
        selectedChat,
        setSelectedChat,
        fetchGroupChats,
        createGroupChat,
        editChatRoom,
        deleteChatRoom,
        addUsersToChatRoom,
        addUserToChatRoom,
        removeMembersFromChatRoom,
        removeMemberFromChatRoom,
        addAdminsToChatRoom,
        addAdminToChatRoom,
        removeAdminsFromChatRoom,
        removeAdminFromChatRoom,
        viewChatRoom,
      }}
    >
      {children}
    </ChatroomContext.Provider>
  );
};

const useChatroomContext = (): ChatroomContextValue => {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error('useChatroomContext must be used within a ChatroomContextProvider');
  }
  return context;
};

export { ChatroomContextProvider, useChatroomContext };
