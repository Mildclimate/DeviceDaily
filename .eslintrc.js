module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // 动画 transform / 进度百分比等运行时值只能内联，规则误报较多
    'react-native/no-inline-styles': 'off',
  },
};
