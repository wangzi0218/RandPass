/**
 * RandPass 内容脚本
 * 用于在网页上检测密码输入框并添加生成按钮
 */

// 创建SVG图标
const keyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="randpass-icon"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`;
const checkIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="randpass-notification-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

// 监听DOM变化，检测新添加的密码输入框
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // 元素节点
          checkForPasswordFields(node);
        }
      });
    }
  });
});

// 检查节点中的密码输入框
function checkForPasswordFields(rootNode) {
  if (!rootNode.querySelectorAll) return;
  
  const passwordFields = rootNode.querySelectorAll('input[type="password"]');
  passwordFields.forEach(addGenerateButton);
}

// 添加生成按钮到密码输入框
function addGenerateButton(passwordField) {
  // 避免重复添加
  if (passwordField.dataset.randpassButton) return;
  passwordField.dataset.randpassButton = 'true';
  
  // 获取输入框的位置和尺寸
  const fieldRect = passwordField.getBoundingClientRect();
  const fieldStyle = window.getComputedStyle(passwordField);
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'randpass-button-container';
  
  // 包装密码输入框
  const parent = passwordField.parentNode;
  parent.insertBefore(buttonContainer, passwordField);
  buttonContainer.appendChild(passwordField);
  
  // 创建生成按钮
  const generateButton = document.createElement('button');
  generateButton.className = 'randpass-generate-button';
  generateButton.innerHTML = `${keyIconSvg} RandPass`;
  generateButton.style.display = 'none';
  
  buttonContainer.appendChild(generateButton);
  
  // 显示/隐藏按钮
  passwordField.addEventListener('focus', function() {
    generateButton.style.display = 'flex';
  });
  
  passwordField.addEventListener('blur', function() {
    // 使用延时，以便用户可以点击按钮
    setTimeout(() => {
      if (document.activeElement !== generateButton) {
        generateButton.style.display = 'none';
      }
    }, 200);
  });
  
  // 生成密码并填充
  generateButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    generatePasswordForSite(passwordField);
  });
}

// 分析网站密码规则并生成密码
function generatePasswordForSite(passwordField) {
  // 分析网站规则
  const siteRules = analyzeSitePasswordRules(passwordField);
  const hostname = window.location.hostname;
  
  // 发送消息给扩展后台，请求生成密码
  chrome.runtime.sendMessage({
    action: 'generatePassword',
    rules: siteRules,
    site: hostname
  }, function(response) {
    if (response && response.password) {
      // 填充密码
      passwordField.value = response.password;
      
      // 触发input事件，以便网站的JavaScript可以检测到值的变化
      const inputEvent = new Event('input', { bubbles: true });
      passwordField.dispatchEvent(inputEvent);
      
      // 触发change事件
      const changeEvent = new Event('change', { bubbles: true });
      passwordField.dispatchEvent(changeEvent);
      
      // 显示提示消息
      showNotification(chrome.i18n.getMessage('passwordGenerated'));
    }
  });
}

// 分析网站密码规则
function analyzeSitePasswordRules(passwordField) {
  // 基本规则
  let rules = {
    minLength: 12,
    maxLength: 32,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true
  };
  
  // 尝试从DOM中提取规则
  const form = findParentForm(passwordField);
  if (form) {
    const formText = form.innerText.toLowerCase();
    
    // 检查长度要求
    const lengthMatch = formText.match(/(\d+)(?:\\s*-\\s*(\d+))?\\s*characters/);
    if (lengthMatch) {
      rules.minLength = parseInt(lengthMatch[1]);
      if (lengthMatch[2]) {
        rules.maxLength = parseInt(lengthMatch[2]);
      }
    }
    
    // 检查其他要求
    rules.requireUppercase = /uppercase|capital/i.test(formText);
    rules.requireNumbers = /number|digit/i.test(formText);
    rules.requireSymbols = /symbol|special/i.test(formText);
  }
  
  // 检查输入框的maxlength属性
  if (passwordField.hasAttribute('maxlength')) {
    const maxLength = parseInt(passwordField.getAttribute('maxlength'));
    if (maxLength > 0 && maxLength < rules.maxLength) {
      rules.maxLength = maxLength;
    }
  }
  
  return rules;
}

// 查找父表单元素
function findParentForm(element) {
  let current = element;
  while (current && current.tagName !== 'FORM') {
    current = current.parentElement;
    if (!current) break;
  }
  return current;
}

// 显示通知
function showNotification(message) {
  // 移除现有通知
  const existingNotification = document.querySelector('.randpass-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'randpass-notification';
  notification.innerHTML = `${checkIconSvg} ${message}`;
  
  document.body.appendChild(notification);
  
  // 显示通知
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // 自动关闭通知
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// 页面加载时检查已有的密码输入框
document.addEventListener('DOMContentLoaded', function() {
  checkForPasswordFields(document);
  
  // 开始观察DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// 立即检查当前页面上的密码输入框
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  checkForPasswordFields(document);
  
  // 开始观察DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
