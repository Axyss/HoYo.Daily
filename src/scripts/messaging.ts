// Type definitions
export enum MessageType {
  CLAIM,
  UPDATE
}

interface Message {
  type: MessageType;
  content: any | undefined;
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

export async function listenMessage(message: MessageType, callback: () => void): Promise<void> {
  chrome.runtime.onMessage.addListener((response) => {
    if (response.type === message) {
      callback();
    }
    return true;
  });
}