
export interface LogEntry {
  timestamp: string;
  operation: string;
  userIdentifier: string;
  result: string;
}

export const logOperation = (
  operation: string,
  userIdentifier: string,
  result: string
): void => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    operation,
    userIdentifier,
    result
  };

  // Store in localStorage for simple logging
  const logs = JSON.parse(localStorage.getItem('quiz-logs') || '[]');
  logs.push(entry);
  localStorage.setItem('quiz-logs', JSON.stringify(logs));

  // Also log to console for debugging
  console.log(`[${entry.timestamp}] ${operation} - ${userIdentifier}: ${result}`);
};

export const exportLogs = (): string => {
  const logs = JSON.parse(localStorage.getItem('quiz-logs') || '[]');
  const csvHeader = 'Timestamp,Operation,User,Result\n';
  const csvRows = logs.map((log: LogEntry) => 
    `${log.timestamp},${log.operation},${log.userIdentifier},"${log.result}"`
  ).join('\n');
  
  return csvHeader + csvRows;
};
