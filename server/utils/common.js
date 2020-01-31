
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

module.exports = {
  extractFields,
};
