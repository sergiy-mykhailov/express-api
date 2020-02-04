const { exec } = require('child_process');

const extractFields = (inputs, names) => {
  const fields = {};

  names.forEach((name) => {
    if (Object.prototype.hasOwnProperty.call(inputs, name)) {
      const value = inputs[name];
      if (value !== undefined) {
        fields[name] = value;
      }
    }
  });

  return fields;
};

const runCommand = async (command) => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { env: process.env },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
};

module.exports = {
  extractFields,
  runCommand,
};
