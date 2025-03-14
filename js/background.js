/**
 * RandPass 后台脚本
 * 处理内容脚本发送的消息并生成密码
 */

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'generatePassword') {
    // 生成密码
    const password = generatePasswordWithRules(request.rules, request.site);
    
    // 复制密码到剪贴板
    copyToClipboard(password);
    
    // 响应内容脚本
    sendResponse({ password: password });
  }
  return true; // 保持消息通道开放，以便异步响应
});

// 根据规则生成密码
function generatePasswordWithRules(rules, site) {
  // 获取存储的设置
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false
    }, function(items) {
      // 合并网站规则和用户设置
      const finalRules = {
        length: Math.min(Math.max(rules.minLength, items.length), rules.maxLength),
        uppercase: rules.requireUppercase && items.uppercase,
        lowercase: rules.requireLowercase && items.lowercase,
        numbers: rules.requireNumbers && items.numbers,
        symbols: rules.requireSymbols && items.symbols,
        excludeSimilar: items.excludeSimilar,
        excludeAmbiguous: items.excludeAmbiguous
      };
      
      const password = generatePassword(finalRules);
      resolve(password);
    });
  });
}

// 生成密码的核心函数
function generatePassword(options) {
  // 字符集
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // 排除相似字符
  const similarChars = 'il1Lo0O';
  // 排除歧义字符
  const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
  
  // 构建字符集
  let charset = '';
  if (options.uppercase) charset += uppercaseChars;
  if (options.lowercase) charset += lowercaseChars;
  if (options.numbers) charset += numberChars;
  if (options.symbols) charset += symbolChars;
  
  // 应用排除规则
  if (options.excludeSimilar) {
    for (let i = 0; i < similarChars.length; i++) {
      charset = charset.replace(new RegExp(similarChars[i], 'g'), '');
    }
  }
  
  if (options.excludeAmbiguous) {
    for (let i = 0; i < ambiguousChars.length; i++) {
      charset = charset.replace(new RegExp('\\' + ambiguousChars[i], 'g'), '');
    }
  }
  
  // 确保字符集不为空
  if (charset.length === 0) {
    charset = lowercaseChars + numberChars;
  }
  
  // 生成密码
  let password = '';
  let hasUppercase = !options.uppercase;
  let hasLowercase = !options.lowercase;
  let hasNumber = !options.numbers;
  let hasSymbol = !options.symbols;
  
  // 确保至少包含一个每种所需字符
  while (password.length < options.length || 
         (!hasUppercase && options.uppercase) || 
         (!hasLowercase && options.lowercase) || 
         (!hasNumber && options.numbers) || 
         (!hasSymbol && options.symbols)) {
    
    const randomIndex = Math.floor(Math.random() * charset.length);
    const char = charset[randomIndex];
    
    password += char;
    
    // 检查字符类型
    if (uppercaseChars.includes(char)) hasUppercase = true;
    if (lowercaseChars.includes(char)) hasLowercase = true;
    if (numberChars.includes(char)) hasNumber = true;
    if (symbolChars.includes(char)) hasSymbol = true;
    
    // 如果密码超过了要求的长度，但仍然缺少某些类型的字符，则替换一些字符
    if (password.length > options.length) {
      if (!hasUppercase && options.uppercase) {
        const replaceIndex = Math.floor(Math.random() * password.length);
        const randomUppercase = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        password = password.substring(0, replaceIndex) + randomUppercase + password.substring(replaceIndex + 1);
        hasUppercase = true;
      } else if (!hasLowercase && options.lowercase) {
        const replaceIndex = Math.floor(Math.random() * password.length);
        const randomLowercase = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        password = password.substring(0, replaceIndex) + randomLowercase + password.substring(replaceIndex + 1);
        hasLowercase = true;
      } else if (!hasNumber && options.numbers) {
        const replaceIndex = Math.floor(Math.random() * password.length);
        const randomNumber = numberChars[Math.floor(Math.random() * numberChars.length)];
        password = password.substring(0, replaceIndex) + randomNumber + password.substring(replaceIndex + 1);
        hasNumber = true;
      } else if (!hasSymbol && options.symbols) {
        const replaceIndex = Math.floor(Math.random() * password.length);
        const randomSymbol = symbolChars[Math.floor(Math.random() * symbolChars.length)];
        password = password.substring(0, replaceIndex) + randomSymbol + password.substring(replaceIndex + 1);
        hasSymbol = true;
      }
    }
  }
  
  // 截取到指定长度
  return password.substring(0, options.length);
}

// 复制文本到剪贴板
function copyToClipboard(text) {
  // 使用Clipboard API
  navigator.clipboard.writeText(text).catch(err => {
    console.error('无法复制到剪贴板:', err);
  });
}
