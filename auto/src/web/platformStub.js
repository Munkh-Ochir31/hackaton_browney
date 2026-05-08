const Platform = {
  OS: 'web',
  select(options) {
    return options.web ?? options.default;
  },
  get isTesting() {
    return process.env.NODE_ENV === 'test';
  },
};

module.exports = Platform;
module.exports.default = Platform;
