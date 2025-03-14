/**
 * 助记密码生成器使用的常用英文单词列表
 * 这些单词简短且容易记忆
 */
const WORD_LIST = [
  // 动物
  'dog', 'cat', 'bird', 'fish', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer',
  'duck', 'goat', 'frog', 'seal', 'swan', 'hawk', 'eagle', 'owl', 'snake', 'horse',
  
  // 颜色
  'red', 'blue', 'green', 'gold', 'pink', 'black', 'white', 'gray', 'brown', 'teal',
  
  // 自然
  'sun', 'moon', 'star', 'sky', 'rain', 'snow', 'wind', 'tree', 'lake', 'hill',
  'rock', 'sand', 'leaf', 'seed', 'wood', 'fire', 'ice', 'sea', 'wave', 'cloud',
  
  // 食物
  'cake', 'rice', 'meat', 'fish', 'milk', 'egg', 'soup', 'bread', 'salt', 'fruit',
  'apple', 'pear', 'grape', 'plum', 'peach', 'lemon', 'corn', 'bean', 'nut', 'pie',
  
  // 物品
  'book', 'door', 'key', 'pen', 'desk', 'chair', 'bed', 'lamp', 'clock', 'phone',
  'cup', 'bowl', 'fork', 'knife', 'plate', 'bag', 'box', 'ring', 'coin', 'card',
  
  // 动作
  'run', 'walk', 'jump', 'swim', 'fly', 'sing', 'dance', 'read', 'write', 'talk',
  'eat', 'drink', 'sleep', 'wake', 'laugh', 'smile', 'cry', 'think', 'work', 'play',
  
  // 形容词
  'big', 'small', 'tall', 'short', 'fast', 'slow', 'hot', 'cold', 'new', 'old',
  'good', 'bad', 'hard', 'soft', 'dark', 'light', 'rich', 'poor', 'weak', 'strong',
  
  // 数字相关
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'first', 'last', 'half', 'double', 'triple', 'zero', 'many', 'few', 'all', 'none',
  
  // 时间相关
  'day', 'week', 'month', 'year', 'hour', 'time', 'now', 'then', 'soon', 'late',
  'dawn', 'dusk', 'noon', 'night', 'today', 'spring', 'summer', 'fall', 'winter', 'age',
  
  // 方位
  'up', 'down', 'left', 'right', 'top', 'base', 'side', 'front', 'back', 'in',
  'out', 'near', 'far', 'high', 'low', 'east', 'west', 'north', 'south', 'center'
];

// 字母替换映射表
const CHAR_SUBSTITUTIONS = {
  'a': '@',
  'e': '3',
  'i': '!',
  'o': '0',
  's': '$',
  't': '+',
  'l': '1',
  'b': '8'
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WORD_LIST, CHAR_SUBSTITUTIONS };
}
