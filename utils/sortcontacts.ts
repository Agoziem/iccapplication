// Define interfaces for message and contact structure
interface Message {
  timestamp: string | Date;
  [key: string]: any;
}

interface Contact {
  recieved_messages: Message[];
  sent_messages: Message[];
  [key: string]: any;
}

const SortContacts = (contacts: Contact[]): Contact[] => {
    return contacts.sort((a: Contact, b: Contact): number => {
        // Get the latest message timestamp for contact 'a'
        const aLastReceivedMessage: number = a.recieved_messages.length
        ? new Date(a.recieved_messages[a.recieved_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const aLastSentMessage: number = a.sent_messages.length
        ? new Date(a.sent_messages[a.sent_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const aLastMessageTimestamp: number = aLastReceivedMessage > aLastSentMessage ? aLastReceivedMessage : aLastSentMessage;
    
        // Get the latest message timestamp for contact 'b'
        const bLastReceivedMessage: number = b.recieved_messages.length
        ? new Date(b.recieved_messages[b.recieved_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const bLastSentMessage: number = b.sent_messages.length
        ? new Date(b.sent_messages[b.sent_messages.length - 1].timestamp).getTime()
        : new Date(0).getTime();
    
        const bLastMessageTimestamp: number = bLastReceivedMessage > bLastSentMessage ? bLastReceivedMessage : bLastSentMessage;
    
        // Sort contacts by the most recent message timestamp (descending order)
        return bLastMessageTimestamp - aLastMessageTimestamp;
    });
};

export default SortContacts;