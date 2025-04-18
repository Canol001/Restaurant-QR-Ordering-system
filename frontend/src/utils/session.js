// utils/session.js
export function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export function setTableId(tableId) {
  if (tableId) {
    localStorage.setItem('tableId', tableId);
  }
}

export function getTableId() {
  return localStorage.getItem('tableId');
}
