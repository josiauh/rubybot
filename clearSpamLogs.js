const fs = require('node:fs');
const path = require('node:path');

const logFilePath = path.join(__dirname, 'spam.log');
const dbFilePath = path.join(__dirname, 'database.json');

let logLines;
let acceptedExceptions;

try {
  const logData = fs.readFileSync(logFilePath, 'utf-8');
  logLines = logData.split(/\r?\n/);

  const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

  if (!Array.isArray(dbData.acceptedExceptions)) {
    throw new Error('`acceptedExceptions` key must be an array.');
  }

  acceptedExceptions = dbData.acceptedExceptions;
} catch (err) {
  console.error('Error reading files:', err.message);
  process.exit(1);
}

const filteredLines = logLines.filter(line =>
  !acceptedExceptions.some(exception => line.includes(exception))
);

fs.writeFileSync(logFilePath, filteredLines.join('\n'), 'utf-8');
console.log('Filtered spam.log written successfully.');
