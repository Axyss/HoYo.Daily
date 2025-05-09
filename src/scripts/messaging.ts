// Type definitions
export enum MessageType {
  UI_CLAIM= "ui_claim",
  MANUAL_CLAIM = "manual_claim",
  CLAIMING = "claiming",
  CLAIM_ERROR= "claim_error",
  CLAIM_SUCCESS = "claim_success",
  UPDATE = "update",
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
        console.error(`[messaging.ts]: Error sending message: ${chrome.runtime.lastError.message}`, message);
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
