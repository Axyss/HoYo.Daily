// Type definitions
export enum MessageType {
  CLAIM,
  UPDATE
}

interface Message {
  type: MessageType;
  target?: any;
  content?: any;
}

// Messaging wrappers
export async function sendMessage(message: Message): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
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
