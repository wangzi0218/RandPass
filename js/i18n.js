/**
 * 国际化处理模块
 * 使用Chrome扩展的i18n API进行国际化，不再使用自定义的i18n对象
 */

// 获取当前浏览器语言
function getBrowserLanguage() {
  if (chrome && chrome.i18n) {
    const lang = chrome.i18n.getUILanguage().toLowerCase();
    return lang.startsWith('zh') ? 'zh_CN' : 'en';
  } else {
    // 回退到navigator.language（仅用于非扩展环境的测试）
    const language = navigator.language || navigator.userLanguage;
    return language.startsWith('zh') ? 'zh_CN' : 'en';
  }
}

// 当前语言
let currentLanguage = getBrowserLanguage();

// 获取翻译文本
function t(key) {
  // 使用Chrome扩展的i18n API
  if (chrome && chrome.i18n) {
    const message = chrome.i18n.getMessage(key);
    if (message) {
      return message;
    }
  }
  // 如果没有找到翻译，返回键名作为回退
  return key;
}

// 更新页面所有文本
function updatePageLanguage() {
  // 设置HTML的lang属性
  document.documentElement.setAttribute('lang', currentLanguage);
  
  // 更新所有带有 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });
  
  // 更新所有带有 data-i18n-placeholder 属性的元素
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key);
    }
  });
  
  // 更新标题
  document.title = t('appName');
  
  // 触发自定义事件，通知其他脚本语言已更改
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}

// 初始化语言
document.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();
});

// 导出函数供其他脚本使用
window.i18n = {
  t,
  getCurrentLanguage: () => currentLanguage
};
