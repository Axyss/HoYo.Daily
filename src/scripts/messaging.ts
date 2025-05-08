// Type definitions
export enum MessageType {
  UI_CLAIM,
  MANUAL_CLAIM,
  CLAIMING,
  CLAIM_ERROR,
  CLAIM_SUCCESS,
  UPDATE,
}

interface Message {
  type: MessageType;
  target?: string | "all";
  content?: any;
}

// Messaging wrappers
export async function sendMessage(message: Message): Promise<void> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("sendMessage error:", chrome.runtime.lastError.message, "Message:", message);
      }
      resolve(response);
    });
  });
}

export function listenMessage(message: MessageType, callback: (response: any) => Promise<any>) {
  chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
    if (response.type === message) {
      callback(response).then(() => sendResponse(sender));
    }
    return true;
  });
}
