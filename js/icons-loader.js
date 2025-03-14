// 初始化 Lucide 图标
document.addEventListener('DOMContentLoaded', function() {
  // 确保 lucide 对象存在
  if (typeof lucide !== 'undefined') {
    // 尝试不同的方式调用 createIcons 方法
    if (typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    } else if (typeof lucide.default !== 'undefined' && typeof lucide.default.createIcons === 'function') {
      lucide.default.createIcons();
    }
  }
});
