const SortContacts = (contacts) => {
    return contacts.sort((a, b) => {
        // Get the latest message timestamp for contact 'a'
        const aLastReceivedMessage = a.recieved_messages.length
        ? new Date(a.recieved_messages[a.recieved_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const aLastSentMessage = a.sent_messages.length
        ? new Date(a.sent_messages[a.sent_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const aLastMessageTimestamp = aLastReceivedMessage > aLastSentMessage ? aLastReceivedMessage : aLastSentMessage;
    
        // Get the latest message timestamp for contact 'b'
        const bLastReceivedMessage = b.recieved_messages.length
        ? new Date(b.recieved_messages[b.recieved_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const bLastSentMessage = b.sent_messages.length
        ? new Date(b.sent_messages[b.sent_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const bLastMessageTimestamp = bLastReceivedMessage > bLastSentMessage ? bLastReceivedMessage : bLastSentMessage;
    
        // Sort contacts by the most recent message timestamp
        return bLastMessageTimestamp - aLastMessageTimestamp;
    });
};

export default SortContacts;