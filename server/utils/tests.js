
const matchers = {
  toBeArrayOfObjects: (received, props) => {
    const pass = received.every((item) => {
      return props.every((key) => {
        return Object.prototype.hasOwnProperty.call(item, key);
      });
    });

    if (pass) {
      return {
        message: () => `expected ${received} not to be array of objects with following props: ${props.join(', ')}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be array of objects with following props: ${props.join(', ')}`,
        pass: false,
      };
    }
  },
};

module.exports = {
  matchers,
};
