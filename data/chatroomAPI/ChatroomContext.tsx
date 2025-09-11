"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the context
const ChatroomContext = createContext(null);

const ChatroomContextProvider = ({ children }) => {
  const [organizationID, setOrganizationID] = useState(
    process.env.NEXT_PUBLIC_ORGANIZATION_ID
  );
  const [groupChats, setGroupChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);


  // ------------------------------------------------------
  // Fetch group chats from the API
  // ------------------------------------------------------
  const fetchGroupChats = async (user_id = null) => {
    try {
      const url = user_id
        ? `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${organizationID}/${user_id}/list/`
        : `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${organizationID}/list/`;
      const response = await axios.get(url);
      setGroupChats(response.data);
    } catch (error) {
      console.error("Failed to fetch group chats", error);
    }
  };

  //------------------------------------------------------
  // Create a group chat (only the admin can create)
  //------------------------------------------------------ 
  const createGroupChat = async (user_id, data) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${user_id}/create/`, data);
      setGroupChats([...groupChats, response.data]);
    } catch (error) {
      console.error("Failed to create group chat", error);
    }
  };

  //------------------------------------------------------
  // Edit a group chat (only the admin can edit)
  //------------------------------------------------------
  const editChatRoom = async (chatroomId, user_id, data) => {
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
    } catch (error) {
      console.error("Failed to edit chat room", error);
    }
  };

  // ------------------------------------------------------
  // Delete a group chat (only the admin can delete)
  // ------------------------------------------------------
  const deleteChatRoom = async (chatroomId, user_id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${user_id}/delete/`);
      setGroupChats(groupChats.filter((chat) => chat.id !== chatroomId));
    } catch (error) {
      console.error("Failed to delete chat room", error);
    }
  };


  // ------------------------------------------------------
  // Add users to a chat room (only the admin can add)
  // ------------------------------------------------------
  const addUsersToChatRoom = async (chatroomId, admin_id, users) => {
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
  const addUserToChatRoom = async (chatroomId, admin_id, user_id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/add-user/`,
        { user_id }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to add user to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove members from a chat room (only the admin can remove)
  // ------------------------------------------------------
  const removeMembersFromChatRoom = async (chatroomId, admin_id, users) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/remove-members/`,
        { data: { users } }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to remove members from chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove a member from a chat room (only the admin can remove)
  // ------------------------------------------------------
  const removeMemberFromChatRoom = async (chatroomId, admin_id, user_id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${admin_id}/remove-member/`,
        { data: { user_id } }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to remove member from chat room", error);
    }
  };

  // ------------------------------------------------------
  // Add admins to a chat room (only the owner can add)
  // ------------------------------------------------------
  const addAdminsToChatRoom = async (chatroomId, owner_id, users) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/add-admins/`,
        { users }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to add admins to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Add an admin to a chat room (only the owner can add)
  // ------------------------------------------------------
  const addAdminToChatRoom = async (chatroomId, owner_id, user_id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/add-admin/`,
        { user_id }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to add admin to chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove admins from a chat room (only the owner can remove)
  // ------------------------------------------------------
  const removeAdminsFromChatRoom = async (chatroomId, owner_id, users) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/remove-admins/`,
        { data: { users } }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to remove admins from chat room", error);
    }
  };

  // ------------------------------------------------------
  // Remove an admin from a chat room (only the owner can remove)
  // ------------------------------------------------------
  const removeAdminFromChatRoom = async (chatroomId, owner_id, user_id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${owner_id}/remove-admin/`,
        { data: { user_id } }
      );
      fetchGroupChats();
    } catch (error) {
      console.error("Failed to remove admin from chat room", error);
    }
  };

  // ------------------------------------------------------
  // View a chat room
  // ------------------------------------------------------
  const viewChatRoom = async (chatroomId, user_id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/chatroomapi/chatrooms/${chatroomId}/${user_id}/view/`
      );
      setSelectedChat(response.data);
    } catch (error) {
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

const useChatroomContext = () => {
  return useContext(ChatroomContext);
};

export { ChatroomContextProvider, useChatroomContext };
