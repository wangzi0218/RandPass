document.addEventListener('DOMContentLoaded', function() {
  // DOM 元素
  const generatedPasswordEl = document.getElementById('generated-password');
  const copyBtn = document.getElementById('copy-btn');
  const generateBtn = document.getElementById('generate-btn');
  const turboGenerateBtn = document.getElementById('turbo-generate-btn');
  const passwordLengthEl = document.getElementById('password-length');
  const lengthValueEl = document.getElementById('length-value');
  const wordCountEl = document.getElementById('word-count');
  const wordCountValueEl = document.getElementById('word-count-value');
  const pinLengthEl = document.getElementById('pin-length');
  const pinLengthValueEl = document.getElementById('pin-length-value');
  const uppercaseEl = document.getElementById('uppercase');
  const lowercaseEl = document.getElementById('lowercase');
  const numbersEl = document.getElementById('numbers');
  const symbolsEl = document.getElementById('symbols');
  const excludeSimilarEl = document.getElementById('exclude-similar');
  const darkModeToggleEl = document.getElementById('dark-mode-toggle');
  const turboModeToggleEl = document.getElementById('turbo-mode-toggle');
  const notificationEl = document.getElementById('notification');
  // 这些元素在HTML中不存在，创建空对象避免错误
  const noRepeatEl = { checked: false };
  const noAdjacentNumbersEl = { checked: false };
  const saveHistoryEl = document.getElementById('save-history');
  const syncHistoryEl = document.getElementById('sync-history');
  const syncHistoryOptionEl = document.getElementById('sync-history-option');
  const strengthIndicatorEl = document.getElementById('strength-indicator');
  const strengthTextEl = document.getElementById('strength-text');
  const advancedToggleEl = document.getElementById('advanced-toggle');
  const advancedOptionsEl = document.getElementById('advanced-options');
  const advancedIconEl = document.getElementById('advanced-icon');
  const historyToggleEl = document.getElementById('history-toggle');
  const historyIconEl = document.getElementById('history-icon');
  const historySectionEl = document.getElementById('history-section');
  const historyListEl = document.getElementById('history-list');
  const randomTabEl = document.getElementById('random-tab');
  const memorableTabEl = document.getElementById('memorable-tab');
  const pinTabEl = document.getElementById('pin-tab');
  const passwordResultEl = document.getElementById('password-result');

  // 常量
  const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBER_CHARS = '0123456789';
  const SYMBOL_CHARS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const SIMILAR_CHARS = 'iIlL1oO0';
  const MAX_HISTORY = 10;
  const DEFAULT_MULTIPLE_COUNT = 5;
  
  // 状态
  let currentMode = 'random'; // 'random', 'memorable' 或 'pin'
  let passwordHistory = [];
  let isGeneratingMultiple = false;
  let isTurboMode = false; // 极速模式状态
  
  // 随机数生成器状态
  let cryptoRandomState = null;
  let cryptoRandomIndex = 0;
  const CRYPTO_BUFFER_SIZE = 1024; // 缓冲区大小

  // 初始化
  init();

  // 初始化函数
  function init() {
    // 从存储中加载设置
    loadSettings();
    
    // 设置初始模式
    currentMode = 'random';
    
    // 确保历史记录默认不保存
    if (saveHistoryEl) {
      saveHistoryEl.checked = false;
    }
    
    // 初始化高级选项的事件监听器
    const noRepeatEl = document.getElementById('no-repeat');
    const noAdjacentNumbersEl = document.getElementById('no-adjacent-numbers');
    
    if (noRepeatEl) {
      noRepeatEl.addEventListener('change', function() {
        debouncedSaveSettings();
        generatePassword();
      });
    }
    
    if (noAdjacentNumbersEl) {
      noAdjacentNumbersEl.addEventListener('change', function() {
        debouncedSaveSettings();
        generatePassword();
      });
    }
    
    // 添加语言变更事件监听器
    document.addEventListener('languageChanged', function() {
      // 重新生成密码以更新错误消息的语言
      generatePassword();
      // 更新密码强度显示
      updatePasswordStrength(generatedPasswordEl.textContent);
    });
    
    // 生成初始密码
    generatePassword();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化所有滑块的进度样式
    if (passwordLengthEl) updateRangeProgress(passwordLengthEl);
    if (wordCountEl) updateRangeProgress(wordCountEl);
    if (pinLengthEl) updateRangeProgress(pinLengthEl);
  }

  // 设置事件监听器
  function setupEventListeners() {
    // 基本功能
    generateBtn.addEventListener('click', handleGenerateClick);
    copyBtn.addEventListener('click', copyToClipboard);
    // 极速模式生成并复制按钮
    turboGenerateBtn.addEventListener('click', autoGenerateAndCopyPassword);
    passwordLengthEl.addEventListener('input', updateLengthValue);
    
    // 极速模式切换
    turboModeToggleEl.addEventListener('click', function() {
      isTurboMode = !isTurboMode;
      
      if (isTurboMode) {
        // 激活极速模式
        document.querySelector('.turbo-inactive').classList.add('hidden');
        document.querySelector('.turbo-active').classList.remove('hidden');
        document.body.classList.add('turbo-mode');
        // 自动生成并复制高强度密码
        autoGenerateAndCopyPassword();
      } else {
        // 关闭极速模式
        document.querySelector('.turbo-inactive').classList.remove('hidden');
        document.querySelector('.turbo-active').classList.add('hidden');
        document.body.classList.remove('turbo-mode');
      }
      
      // 保存设置
      saveSettingsDirectly();
    });
    
    // 助记密码单词数量滑块
    if (wordCountEl) {
      wordCountEl.addEventListener('input', function() {
        if (wordCountValueEl) {
          wordCountValueEl.textContent = this.value;
        }
        generatePassword();
      });
    }
    
    // PIN码长度滑块
    if (pinLengthEl) {
      pinLengthEl.addEventListener('input', function() {
        if (pinLengthValueEl) {
          pinLengthValueEl.textContent = this.value;
        }
        generatePassword();
      });
    }
    
    // 助记密码选项
    const capitalizeWordsEl = document.getElementById('capitalize-words');
    const allUppercaseEl = document.getElementById('all-uppercase');
    const substituteCharsEl = document.getElementById('substitute-chars');
    
    if (capitalizeWordsEl) {
      capitalizeWordsEl.addEventListener('change', function() {
        if (this.checked) {
          // 如果选中了单词首字母大写，则自动取消选中单词全部大写
          if (allUppercaseEl) {
            allUppercaseEl.checked = false;
          }
        }
        generatePassword();
      });
    }
    
    if (allUppercaseEl) {
      allUppercaseEl.addEventListener('change', function() {
        if (this.checked) {
          // 如果选中了单词全部大写，则自动取消选中单词首字母大写
          if (capitalizeWordsEl) {
            capitalizeWordsEl.checked = false;
          }
        }
        generatePassword();
      });
    }
    
    if (substituteCharsEl) {
      substituteCharsEl.addEventListener('change', function() {
        generatePassword();
      });
    }
    
    // 单词分隔符选项
    const separatorEl = document.getElementById('separator');
    if (separatorEl) {
      separatorEl.addEventListener('input', function() {
        generatePassword();
      });
    }
    
    // 标签页切换
    randomTabEl.addEventListener('click', () => switchTab('random'));
    if (memorableTabEl) memorableTabEl.addEventListener('click', () => switchTab('memorable'));
    pinTabEl.addEventListener('click', () => switchTab('pin'));
    
    // 高级选项和历史记录切换
    if (advancedToggleEl) {
      advancedToggleEl.addEventListener('click', toggleAdvancedOptions);
    }
    
    if (historyToggleEl) {
      historyToggleEl.addEventListener('click', toggleHistory);
    }
    
    // 保存历史记录设置变更
    if (saveHistoryEl) {
      saveHistoryEl.addEventListener('change', function() {
        // 显示或隐藏同步选项
        if (this.checked) {
          syncHistoryOptionEl.classList.remove('hidden');
        } else {
          syncHistoryOptionEl.classList.add('hidden');
          // 如果取消保存历史记录，同时取消同步选项
          if (syncHistoryEl) {
            syncHistoryEl.checked = false;
          }
          clearHistory();
        }
        debouncedSaveSettings();
      });
    }
    
    // 同步历史记录设置变更
    if (syncHistoryEl) {
      syncHistoryEl.addEventListener('change', function() {
        // 如果开启同步，需要将当前历史记录从local迁移到sync，或从sync迁移到local
        migrateHistoryStorage(this.checked);
        debouncedSaveSettings();
      });
    }
    
    // 复选框事件监听
    if (numbersEl) numbersEl.addEventListener('change', handleOptionChange);
    if (symbolsEl) symbolsEl.addEventListener('change', handleOptionChange);
    if (uppercaseEl && typeof uppercaseEl !== 'object') uppercaseEl.addEventListener('change', debouncedSaveSettings);
    if (lowercaseEl && typeof lowercaseEl !== 'object') lowercaseEl.addEventListener('change', debouncedSaveSettings);
    if (excludeSimilarEl) excludeSimilarEl.addEventListener('change', debouncedSaveSettings);
    
    // 黑暗模式切换
    if (darkModeToggleEl) {
      darkModeToggleEl.addEventListener('click', function() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        // 使用 data 属性存储状态而不是 checked 属性
        this.dataset.darkMode = isDarkMode;
        
        // 切换图标显示
        const lightModeIcon = this.querySelector('.light-mode-icon');
        const darkModeIcon = this.querySelector('.dark-mode-icon');
        
        if (isDarkMode) {
          lightModeIcon.classList.add('hidden');
          darkModeIcon.classList.remove('hidden');
        } else {
          lightModeIcon.classList.remove('hidden');
          darkModeIcon.classList.add('hidden');
        }
        
        debouncedSaveSettings();
      });
    }
  }
  
  // 处理选项变更
  function handleOptionChange() {
    debouncedSaveSettings();
    generatePassword();
  }

  // 从存储中加载设置
  function loadSettings() {
    chrome.storage.sync.get({
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
      noRepeat: false,
      noAdjacentNumbers: false,
      saveHistory: false,
      passwordHistory: [],
      darkMode: false,
      turboMode: false
    }, function(items) {
      passwordLengthEl.value = items.length;
      lengthValueEl.textContent = items.length;
      uppercaseEl.checked = items.uppercase;
      lowercaseEl.checked = items.lowercase;
      numbersEl.checked = items.numbers;
      symbolsEl.checked = items.symbols;
      excludeSimilarEl.checked = items.excludeSimilar;
      noRepeatEl.checked = items.noRepeat;
      noAdjacentNumbersEl.checked = items.noAdjacentNumbers;
      saveHistoryEl.checked = items.saveHistory || false;
      
      // 设置同步选项状态
      if (syncHistoryEl) {
        syncHistoryEl.checked = items.syncHistory || false;
        // 根据保存历史记录选项显示或隐藏同步选项
        if (saveHistoryEl.checked) {
          syncHistoryOptionEl.classList.remove('hidden');
        } else {
          syncHistoryOptionEl.classList.add('hidden');
        }
      }
      
      // 加载历史记录，优先从选择的存储位置加载
      loadPasswordHistory();
      
      // 应用黑暗模式设置
      if (items.darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggleEl.dataset.darkMode = 'true';
        
        // 显示正确的图标
        const lightModeIcon = darkModeToggleEl.querySelector('.light-mode-icon');
        const darkModeIcon = darkModeToggleEl.querySelector('.dark-mode-icon');
        lightModeIcon.classList.add('hidden');
        darkModeIcon.classList.remove('hidden');
      } else {
        document.body.classList.remove('dark-mode');
        darkModeToggleEl.dataset.darkMode = 'false';
        
        // 显示正确的图标
        const lightModeIcon = darkModeToggleEl.querySelector('.light-mode-icon');
        const darkModeIcon = darkModeToggleEl.querySelector('.dark-mode-icon');
        lightModeIcon.classList.remove('hidden');
        darkModeIcon.classList.add('hidden');
      }
      
      // 应用极速模式设置
      isTurboMode = items.turboMode || false;
      if (isTurboMode) {
        document.querySelector('.turbo-inactive').classList.add('hidden');
        document.querySelector('.turbo-active').classList.remove('hidden');
        document.body.classList.add('turbo-mode');
        // 如果是极速模式，自动生成并复制高强度密码
        autoGenerateAndCopyPassword();
      } else {
        document.querySelector('.turbo-inactive').classList.remove('hidden');
        document.querySelector('.turbo-active').classList.add('hidden');
      }
      
      updateHistoryList();
    });
  }

  // 保存设置到存储 - 防抖版本
  function saveSettings() {
    debouncedSaveSettings();
  }
  
  // 直接保存设置到存储 - 不防抖
  function saveSettingsDirectly() {
    // 基本设置始终保存到 sync 存储中
    const settings = {
      length: parseInt(passwordLengthEl.value),
      uppercase: uppercaseEl.checked,
      lowercase: lowercaseEl.checked,
      numbers: numbersEl.checked,
      symbols: symbolsEl.checked,
      excludeSimilar: excludeSimilarEl.checked,
      noRepeat: noRepeatEl.checked,
      noAdjacentNumbers: noAdjacentNumbersEl.checked,
      saveHistory: saveHistoryEl.checked,
      syncHistory: syncHistoryEl ? syncHistoryEl.checked : false,
      darkMode: darkModeToggleEl.dataset.darkMode === 'true',
      turboMode: isTurboMode
    };
    
    // 将基本设置保存到sync存储
    chrome.storage.sync.set(settings);
    
    // 根据用户选择决定密码历史记录保存到哪里
    if (saveHistoryEl && saveHistoryEl.checked) {
      if (syncHistoryEl && syncHistoryEl.checked) {
        // 如果选择同步，将密码历史记录保存到sync存储
        chrome.storage.sync.set({ passwordHistory: passwordHistory });
        // 同时清除local存储中的密码历史记录
        chrome.storage.local.remove('passwordHistory');
      } else {
        // 如果不选择同步，将密码历史记录保存到local存储
        chrome.storage.local.set({ passwordHistory: passwordHistory });
        // 同时清除sync存储中的密码历史记录
        chrome.storage.sync.remove('passwordHistory');
      }
    } else {
      // 如果不保存历史记录，清除两种存储中的密码历史记录
      chrome.storage.sync.remove('passwordHistory');
      chrome.storage.local.remove('passwordHistory');
    }
  }

  // 防抖计时器
  let saveSettingsTimer = null;
  
  // 显示通知
  function showNotification() {
    // 添加显示类
    notificationEl.classList.add('notification-show');
    
    // 3秒后移除类
    setTimeout(() => {
      notificationEl.classList.remove('notification-show');
    }, 3000);
  }
  
  // 显示按钮成功状态
  function showButtonSuccess() {
    const button = document.getElementById('turbo-generate-btn');
    const defaultIcon = button.querySelector('.btn-icon-default');
    const successIcon = button.querySelector('.btn-icon-success');
    const defaultText = button.querySelector('.btn-text-default');
    const successText = button.querySelector('.btn-text-success');
    
    // 显示成功状态
    button.classList.add('success');
    defaultIcon.classList.add('hidden');
    successIcon.classList.remove('hidden');
    defaultText.classList.add('hidden');
    successText.classList.remove('hidden');
    
    // 2秒后恢复原状态
    setTimeout(() => {
      button.classList.remove('success');
      defaultIcon.classList.remove('hidden');
      successIcon.classList.add('hidden');
      defaultText.classList.remove('hidden');
      successText.classList.add('hidden');
    }, 2000);
  }
  
  // 自动生成并复制高强度密码
  function autoGenerateAndCopyPassword() {
    // 在极速模式下，生成高强度密码
    // 设置为18位长度
    passwordLengthEl.value = 18;
    lengthValueEl.textContent = 18;
    
    // 启用所有字符类型
    uppercaseEl.checked = true;
    lowercaseEl.checked = true;
    numbersEl.checked = true;
    symbolsEl.checked = true;
    
    // 生成密码
    generatePassword();
    
    // 复制密码到剪切板
    copyToClipboard();
    
    // 如果在极速模式下，显示按钮成功状态
    if (isTurboMode) {
      showButtonSuccess();
    } else {
      // 在普通模式下使用原来的通知
      showNotification();
    }
  }
  
  // 防抖包装函数 - 用于所有存储操作
  function debouncedSaveSettings() {
    clearTimeout(saveSettingsTimer);
    saveSettingsTimer = setTimeout(() => {
      saveSettingsDirectly();
    }, 500); // 500毫秒后才保存设置
  }
  
  // 更新长度值显示
  function updateLengthValue() {
    // 根据当前模式更新不同的滑块值
    if (currentMode === 'random' && lengthValueEl) {
      lengthValueEl.textContent = passwordLengthEl.value;
      updateRangeProgress(passwordLengthEl);
    } else if (currentMode === 'memorable' && wordCountValueEl) {
      wordCountValueEl.textContent = wordCountEl.value;
      updateRangeProgress(wordCountEl);
    } else if (currentMode === 'pin' && pinLengthValueEl) {
      pinLengthValueEl.textContent = pinLengthEl.value;
      updateRangeProgress(pinLengthEl);
    }
    
    // 在密码长度改变时同时刷新密码
    generatePassword();
    
    // 使用防抖函数减少存储操作频率
    debouncedSaveSettings();
  }
  
  // 更新滑块进度样式
  function updateRangeProgress(rangeEl) {
    if (!rangeEl) return;
    const min = parseInt(rangeEl.min) || 0;
    const max = parseInt(rangeEl.max) || 100;
    const value = parseInt(rangeEl.value) || 0;
    const progress = ((value - min) / (max - min)) * 100;
    rangeEl.style.setProperty('--range-progress', `${progress}%`);
  }

  // 切换标签页
  function switchTab(mode) {
    currentMode = mode;
    
    // 获取各种选项容器
    const randomOptionsEl = document.getElementById('random-options');
    const memorableOptionsMainEl = document.getElementById('memorable-options-main');
    const memorableOptionsAdvancedEl = document.getElementById('memorable-options');
    const pinOptionsEl = document.getElementById('pin-options');
    const randomCharsOptionsEl = document.getElementById('random-chars-options');
    const adjacentNumbersOptionsEl = document.getElementById('adjacent-numbers-options');
    
    // 获取高级选项和历史记录容器
    const advancedOptionsEl = document.getElementById('advanced-options');
    const historyEl = document.getElementById('history-section');
    
    // 获取密码长度滑块和显示值
    const passwordLengthEl = document.getElementById('password-length');
    const wordCountEl = document.getElementById('word-count');
    const pinLengthEl = document.getElementById('pin-length');
    const lengthValueEl = document.getElementById('length-value');
    const wordCountValueEl = document.getElementById('word-count-value');
    const pinLengthValueEl = document.getElementById('pin-length-value');
    
    // 重置密码长度为默认值
    if (passwordLengthEl) {
      passwordLengthEl.value = 12; // 随机密码默认长度为12
      if (lengthValueEl) lengthValueEl.textContent = '12';
    }
    if (wordCountEl) {
      wordCountEl.value = 4; // 助记密码默认单词数为4
      if (wordCountValueEl) wordCountValueEl.textContent = '4';
    }
    if (pinLengthEl) {
      pinLengthEl.value = 6; // PIN码默认长度为6
      if (pinLengthValueEl) pinLengthValueEl.textContent = '6';
    }
    
    // 隐藏高级选项和历史记录
    if (advancedOptionsEl) advancedOptionsEl.classList.add('hidden');
    if (historyEl) historyEl.classList.add('hidden');
    
    // 重置高级选项和历史记录按钮的图标
    const advancedIconEl = document.getElementById('advanced-icon');
    const historyIconEl = document.getElementById('history-icon');
    if (advancedIconEl) advancedIconEl.classList.remove('rotate-180');
    if (historyIconEl) historyIconEl.classList.remove('rotate-180');
    
    // 隐藏所有选项容器
    if (randomOptionsEl) randomOptionsEl.classList.add('hidden');
    if (memorableOptionsMainEl) memorableOptionsMainEl.classList.add('hidden');
    if (memorableOptionsAdvancedEl) memorableOptionsAdvancedEl.classList.add('hidden');
    if (pinOptionsEl) pinOptionsEl.classList.add('hidden');
    if (randomCharsOptionsEl) randomCharsOptionsEl.classList.add('hidden');
    if (adjacentNumbersOptionsEl) adjacentNumbersOptionsEl.classList.add('hidden');
    
    // 隐藏随机密码模式特有的选项
    document.querySelectorAll('.random-mode-only').forEach(el => {
      el.classList.add('hidden');
    });
    
    // 重置所有标签页样式
    randomTabEl.classList.remove('active', 'bg-indigo-50', 'text-indigo-600', 'border-indigo-600');
    if (memorableTabEl) {
      memorableTabEl.classList.remove('active', 'bg-indigo-50', 'text-indigo-600', 'border-indigo-600');
    }
    pinTabEl.classList.remove('active', 'bg-indigo-50', 'text-indigo-600', 'border-indigo-600');
    
    if (mode === 'random') {
      // 设置标签页样式
      randomTabEl.classList.add('active', 'bg-indigo-50', 'text-indigo-600', 'border-indigo-600');
      
      // 显示随机密码相关选项
      if (randomOptionsEl) randomOptionsEl.classList.remove('hidden');
      if (randomCharsOptionsEl) randomCharsOptionsEl.classList.remove('hidden');
      if (adjacentNumbersOptionsEl) adjacentNumbersOptionsEl.classList.remove('hidden');
      
      // 显示随机密码模式特有的选项
      document.querySelectorAll('.random-mode-only').forEach(el => {
        el.classList.remove('hidden');
      });
      
      // 启用所有选项
      if (uppercaseEl && uppercaseEl.type !== 'hidden') uppercaseEl.disabled = false;
      if (lowercaseEl && lowercaseEl.type !== 'hidden') lowercaseEl.disabled = false;
      if (symbolsEl) symbolsEl.disabled = false;
      if (numbersEl) numbersEl.disabled = false;
    } 
    else if (mode === 'memorable' && memorableTabEl) {
      // 设置标签页样式
      memorableTabEl.classList.add('active', 'bg-indigo-50', 'text-indigo-600', 'border-indigo-600');
      
      // 显示助记密码相关选项
      if (memorableOptionsMainEl) memorableOptionsMainEl.classList.remove('hidden');
      if (memorableOptionsAdvancedEl) memorableOptionsAdvancedEl.classList.remove('hidden');
    } 
    else if (mode === 'pin') {
      // 设置标签页样式
      pinTabEl.classList.add('active', 'bg-indigo-50', 'text-indigo-600', 'border-indigo-600');
      
      // 显示PIN码相关选项
      if (pinOptionsEl) pinOptionsEl.classList.remove('hidden');
      if (adjacentNumbersOptionsEl) adjacentNumbersOptionsEl.classList.remove('hidden');
      
      // 禁用不适用于 PIN 的选项
      if (uppercaseEl && uppercaseEl.type !== 'hidden') {
        uppercaseEl.checked = false;
        uppercaseEl.disabled = true;
      }
      if (lowercaseEl && lowercaseEl.type !== 'hidden') {
        lowercaseEl.checked = false;
        lowercaseEl.disabled = true;
      }
      if (symbolsEl) {
        symbolsEl.checked = false;
        symbolsEl.disabled = true;
      }
      if (numbersEl) {
        numbersEl.checked = true;
      }
    }
    
    generatePassword();
  }

  // 处理生成按钮点击
  function handleGenerateClick() {
    generatePassword();
    
    // 如果在极速模式下，自动复制密码并显示通知
    if (isTurboMode) {
      copyToClipboard();
      showNotification();
    }
  }

  // 初始化随机数生成器
  
  // 使用Web Crypto API获取真随机数作为种子
  async function initCryptoRandom() {
    try {
      // 创建一个新的随机数缓冲区
      const buffer = new Uint32Array(CRYPTO_BUFFER_SIZE);
      // 使用Web Crypto API填充真随机数
      window.crypto.getRandomValues(buffer);
      cryptoRandomState = buffer;
      cryptoRandomIndex = 0;
      console.log('已初始化高熵随机数生成器');
    } catch (error) {
      console.error('初始化高熵随机数生成器失败:', error);
      cryptoRandomState = null;
    }
  }
  
  // 从缓冲区获取随机数，如果缓冲区用尽则重新填充
  function getCryptoRandom() {
    // 如果没有初始化或者缓冲区已用尽，重新填充
    if (!cryptoRandomState || cryptoRandomIndex >= CRYPTO_BUFFER_SIZE) {
      // 异步初始化，但当前返回使用Math.random()
      initCryptoRandom();
      return Math.random();
    }
    
    // 从缓冲区中获取一个随机数并标准化为0-1之间
    const randomValue = cryptoRandomState[cryptoRandomIndex] / 4294967295; // 2^32 - 1
    cryptoRandomIndex++;
    return randomValue;
  }
  
  // 生成指定范围内的随机整数
  function getRandomInt(min, max) {
    return Math.floor(getCryptoRandom() * (max - min + 1)) + min;
  }
  
  // 生成密码
  function generatePassword() {
    // 确保随机数生成器已初始化
    if (!cryptoRandomState) {
      initCryptoRandom();
    }
    
    const options = getPasswordOptions();
    let password;
    
    if (currentMode === 'pin') {
      password = generatePin(options);
    } else if (currentMode === 'memorable') {
      password = generateMemorablePassword(options);
    } else {
      password = generateRandomPassword(options);
    }
    
    // 显示密码并高亮特殊字符
    displayPasswordWithHighlight(password);
    updatePasswordStrength(password);
    
    // 添加到历史记录
    if (saveHistoryEl.checked && password) {
      addToHistory(password);
    }
  }

  // 生成多个密码
  function generateMultiplePasswords() {
    const options = getPasswordOptions();
    const passwords = [];
    
    for (let i = 0; i < DEFAULT_MULTIPLE_COUNT; i++) {
      let password;
      if (currentMode === 'pin') {
        password = generatePin(options);
      } else if (currentMode === 'memorable') {
        password = generateMemorablePassword(options);
      } else {
        password = generateRandomPassword(options);
      }
      passwords.push(password);
      
      // 添加到历史记录
      if (saveHistoryEl.checked && password) {
        addToHistory(password);
      }
    }
    
    // 显示第一个密码在主输入框
    if (passwords.length > 0) {
      displayPasswordWithHighlight(passwords[0]);
      updatePasswordStrength(passwords[0]);
    }
    
    // 更新密码列表
    updatePasswordList(passwords);
  }

  // 生成随机密码
  function generateRandomPassword(options) {
    let chars = '';
    
    if (options.uppercase) chars += UPPERCASE_CHARS;
    if (options.lowercase) chars += LOWERCASE_CHARS;
    if (options.numbers) chars += NUMBER_CHARS;
    if (options.symbols) chars += SYMBOL_CHARS;
    
    // 排除相似字符
    if (options.excludeSimilar) {
      for (let i = 0; i < SIMILAR_CHARS.length; i++) {
        chars = chars.replace(SIMILAR_CHARS[i], '');
      }
    }
    
    if (chars.length === 0) {
      return t('selectAtLeastOne');
    }
    
    // 不允许字符重复
    if (options.noRepeat && options.length > chars.length) {
      return `${t('lengthExceedsAvailable')} (${chars.length})`;
    }
    
    let password = '';
    let lastChar = '';
    
    for (let i = 0; i < options.length; i++) {
      let nextChar;
      let isValid = false;
      
      while (!isValid) {
        const randomIndex = getRandomInt(0, chars.length - 1);
        nextChar = chars[randomIndex];
        
        // 检查字符重复
        if (options.noRepeat && password.includes(nextChar)) {
          continue;
        }
        
        // 检查相邻数字
        if (options.noAdjacentNumbers && NUMBER_CHARS.includes(nextChar) && NUMBER_CHARS.includes(lastChar)) {
          continue;
        }
        
        isValid = true;
      }
      
      password += nextChar;
      lastChar = nextChar;
    }
    
    // 确保密码包含所有必要的字符类型
    if (options.uppercase && !containsUppercase(password)) {
      return generateRandomPassword(options);
    }
    if (options.lowercase && !containsLowercase(password)) {
      return generateRandomPassword(options);
    }
    if (options.numbers && !containsNumbers(password)) {
      return generateRandomPassword(options);
    }
    if (options.symbols && !containsSymbols(password)) {
      return generateRandomPassword(options);
    }
    
    return password;
  }

  // 生成 PIN 码
  function generatePin(options) {
    // PIN码只包含数字，不包含符号
    let pin = '';
    let lastDigit = '';
    let attempts = 0;
    const maxAttempts = 1000; // 防止无限循环
    
    // 如果排除相似字符，则创建一个新的数字字符集
    let chars = NUMBER_CHARS;
    if (options.excludeSimilar) {
      chars = NUMBER_CHARS;
      for (let i = 0; i < SIMILAR_CHARS.length; i++) {
        if ('0123456789'.includes(SIMILAR_CHARS[i])) {
          chars = chars.replace(SIMILAR_CHARS[i], '');
        }
      }
    }
    
    // 不允许字符重复
    if (options.noRepeat && options.length > chars.length) {
      return `长度不能超过可用数字数 (${chars.length})`;
    }
    
    for (let i = 0; i < options.length; i++) {
      let nextDigit;
      let isValid = false;
      attempts = 0;
      
      while (!isValid && attempts < maxAttempts) {
        attempts++;
        nextDigit = chars.charAt(getRandomInt(0, chars.length - 1));
        
        // 检查数字重复
        if (options.noRepeat && pin.includes(nextDigit)) {
          continue;
        }
        
        // 检查相邻数字
        if (options.noAdjacentNumbers && lastDigit !== '' && Math.abs(parseInt(nextDigit) - parseInt(lastDigit)) === 1) {
          continue;
        }
        
        isValid = true;
      }
      
      // 如果无法生成有效字符，则使用随机字符
      if (!isValid) {
        const randomIndex = getRandomInt(0, chars.length - 1);
        nextDigit = chars[randomIndex];
      }
      
      pin += nextDigit;
      lastDigit = nextDigit;
    }
    
    return pin;
  }
  
  // 生成助记密码
  function generateMemorablePassword(options) {
    // 获取单词数量
    const wordCount = options.length;
    
    // 使用从选项中获取的助记密码设置
    const capitalizeWords = options.capitalizeWords;
    const allUppercase = options.allUppercase;
    const substituteChars = options.substituteChars;
    
    // 直接从 DOM 中获取分隔符值，确保始终使用最新的值
    const separatorEl = document.getElementById('separator');
    const separator = separatorEl ? separatorEl.value : (options.wordSeparator || '-');
    
    // 随机选择单词
    let selectedWords = [];
    let retryCount = 0;
    const maxRetries = 100;
    
    while (selectedWords.length < wordCount && retryCount < maxRetries) {
      const randomIndex = getRandomInt(0, WORD_LIST.length - 1);
      const word = WORD_LIST[randomIndex];
      
      // 如果启用了不重复选项，检查单词是否已被选择
      if (options.noRepeat && selectedWords.includes(word)) {
        retryCount++;
        continue;
      }
      
      selectedWords.push(word);
    }
    
    if (selectedWords.length < wordCount) {
      return t('selectAtLeastOne');
    }
    
    // 格式化单词
    selectedWords = selectedWords.map(word => formatWord(word, capitalizeWords, allUppercase));
    
    // 如果启用了字符替换，替换字母为特殊符号
    if (substituteChars) {
      selectedWords = selectedWords.map(word => substituteCharacters(word));
    }
    
    // 使用连接符连接单词
    return selectedWords.join(separator);
  }
  
  // 格式化单词（首字母大写或全部大写）
  function formatWord(word, capitalize, uppercase) {
    if (uppercase) {
      return word.toUpperCase();
    } else if (capitalize) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }
  
  // 替换字母为特殊符号
  function substituteCharacters(word) {
    let result = '';
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (CHAR_SUBSTITUTIONS[char.toLowerCase()]) {
        result += CHAR_SUBSTITUTIONS[char.toLowerCase()];
      } else {
        result += char;
      }
    }
    return result;
  }

  // 获取密码选项
  function getPasswordOptions() {
    // 检查是否为隐藏输入字段
    let useUppercase = true;
    let useLowercase = true;
    
    if (uppercaseEl) {
      if (uppercaseEl.type === 'hidden') {
        useUppercase = true; // 默认启用大写字母
      } else {
        useUppercase = uppercaseEl.checked;
      }
    }
    
    if (lowercaseEl) {
      if (lowercaseEl.type === 'hidden') {
        useLowercase = true; // 默认启用小写字母
      } else {
        useLowercase = lowercaseEl.checked;
      }
    }
    
    // 获取高级选项的值
    const excludeSimilar = excludeSimilarEl ? excludeSimilarEl.checked : false;
    const noRepeat = document.getElementById('no-repeat') ? document.getElementById('no-repeat').checked : false;
    const noAdjacentNumbers = document.getElementById('no-adjacent-numbers') ? document.getElementById('no-adjacent-numbers').checked : false;
    
    // 获取助记密码特殊选项
    const capitalizeWords = document.getElementById('capitalize-words') ? document.getElementById('capitalize-words').checked : false;
    const allUppercase = document.getElementById('all-uppercase') ? document.getElementById('all-uppercase').checked : false;
    const substituteChars = document.getElementById('substitute-chars') ? document.getElementById('substitute-chars').checked : false;
    const wordSeparator = document.getElementById('separator') ? document.getElementById('separator').value : '-';
    
    // 如果用户只选择了数字或符号，我们仍然需要包含字母
    const onlyNumbersOrSymbols = (numbersEl && numbersEl.checked) || (symbolsEl && symbolsEl.checked);
    const noLetters = !useUppercase && !useLowercase;
    
    if (onlyNumbersOrSymbols && noLetters && currentMode === 'random') {
      useUppercase = true;
      useLowercase = true;
    }
    
    // 根据当前模式返回不同的选项
    if (currentMode === 'memorable') {
      // 助记密码模式使用单词数量滑块
      return {
        length: wordCountEl ? parseInt(wordCountEl.value) : 4,
        uppercase: useUppercase,
        lowercase: useLowercase,
        numbers: numbersEl ? numbersEl.checked : true,
        symbols: symbolsEl ? symbolsEl.checked : true,
        excludeSimilar: excludeSimilarEl ? excludeSimilarEl.checked : false,
        noRepeat: noRepeat,
        capitalizeWords: capitalizeWords,
        allUppercase: allUppercase,
        substituteChars: substituteChars,
        wordSeparator: wordSeparator
      };
    } else if (currentMode === 'pin') {
      // PIN码模式使用PIN码长度滑块
      return {
        length: pinLengthEl ? parseInt(pinLengthEl.value) : 6,
        uppercase: false,
        lowercase: false,
        numbers: true,
        symbols: false,
        excludeSimilar: excludeSimilarEl ? excludeSimilarEl.checked : false,
        noRepeat: noRepeat,
        noAdjacentNumbers: noAdjacentNumbers
      };
    } else {
      // 随机密码模式使用密码长度滑块
      return {
        length: parseInt(passwordLengthEl.value),
        uppercase: useUppercase,
        lowercase: useLowercase,
        numbers: numbersEl ? numbersEl.checked : true,
        symbols: symbolsEl ? symbolsEl.checked : true,
        excludeSimilar: excludeSimilarEl ? excludeSimilarEl.checked : false,
        noRepeat: noRepeat,
        noAdjacentNumbers: noAdjacentNumbers
      };
    }
  }

  // 复制到剪贴板
  function copyToClipboard() {
    const password = generatedPasswordEl.textContent;
    navigator.clipboard.writeText(password).then(() => {
      // 显示复制按钮的成功状态
      showCopyButtonSuccess();
    });
  }
  
  // 显示复制按钮成功状态
  function showCopyButtonSuccess() {
    const button = document.getElementById('copy-btn');
    const defaultIcon = button.querySelector('.copy-icon-default');
    const successIcon = button.querySelector('.copy-icon-success');
    const defaultText = button.querySelector('.copy-text-default');
    const successText = button.querySelector('.copy-text-success');
    
    // 显示成功状态
    button.classList.add('success');
    defaultIcon.classList.add('hidden');
    successIcon.classList.remove('hidden');
    defaultText.classList.add('hidden');
    successText.classList.remove('hidden');
    
    // 2秒后恢复原状态
    setTimeout(() => {
      button.classList.remove('success');
      defaultIcon.classList.remove('hidden');
      successIcon.classList.add('hidden');
      defaultText.classList.remove('hidden');
      successText.classList.add('hidden');
    }, 2000);
  }

  // 切换高级选项
  function toggleAdvancedOptions() {
    if (advancedOptionsEl && advancedIconEl) {
      advancedOptionsEl.classList.toggle('hidden');
      advancedIconEl.classList.toggle('rotate-180');
    }
  }

  // 切换历史记录
  function toggleHistory() {
    if (historySectionEl && historyIconEl) {
      historySectionEl.classList.toggle('hidden');
      historyIconEl.classList.toggle('rotate-180');
    }
  }

  // 移除多个密码生成功能

  // 添加到历史记录
  function addToHistory(password) {
    // 避免重复
    if (passwordHistory.includes(password)) {
      return;
    }
    
    passwordHistory.unshift(password);
    
    // 限制历史记录数量
    if (passwordHistory.length > MAX_HISTORY) {
      passwordHistory = passwordHistory.slice(0, MAX_HISTORY);
    }
    
    debouncedSaveSettings();
    updateHistoryList();
  }

  // 清除历史记录
  function clearHistory() {
    passwordHistory = [];
    debouncedSaveSettings();
    updateHistoryList();
  }
  
  // 从存储中加载密码历史记录
  function loadPasswordHistory() {
    // 根据同步选项决定从哪里加载历史记录
    const storageType = (syncHistoryEl && syncHistoryEl.checked) ? chrome.storage.sync : chrome.storage.local;
    
    storageType.get('passwordHistory', function(items) {
      // 如果在选择的存储中找不到历史记录，尝试从另一个存储加载
      if (!items.passwordHistory || items.passwordHistory.length === 0) {
        const alternativeStorage = (storageType === chrome.storage.sync) ? chrome.storage.local : chrome.storage.sync;
        
        alternativeStorage.get('passwordHistory', function(altItems) {
          if (altItems.passwordHistory && altItems.passwordHistory.length > 0) {
            passwordHistory = altItems.passwordHistory;
            // 如果在另一个存储中找到了历史记录，迁移到当前选择的存储
            migrateHistoryStorage(syncHistoryEl && syncHistoryEl.checked);
          } else {
            passwordHistory = [];
          }
          updateHistoryList();
        });
      } else {
        passwordHistory = items.passwordHistory;
        updateHistoryList();
      }
    });
  }
  
  // 迁移历史记录存储位置
  function migrateHistoryStorage(syncEnabled) {
    if (!passwordHistory || passwordHistory.length === 0) return;
    
    if (syncEnabled) {
      // 迁移到sync存储
      chrome.storage.sync.set({ passwordHistory: passwordHistory });
      chrome.storage.local.remove('passwordHistory');
    } else {
      // 迁移到local存储
      chrome.storage.local.set({ passwordHistory: passwordHistory });
      chrome.storage.sync.remove('passwordHistory');
    }
  }
  
  // 从历史记录中删除特定密码
  function removePasswordFromHistory(index) {
    if (index >= 0 && index < passwordHistory.length) {
      // 从数组中移除指定索引的密码
      passwordHistory.splice(index, 1);
      // 保存更新后的设置
      debouncedSaveSettings();
      // 更新历史记录列表显示
      updateHistoryList();
    }
  }

  // 更新历史记录列表
  function updateHistoryList() {
    historyListEl.innerHTML = '';
    
    if (passwordHistory.length === 0) {
      // 使用固定的文本元素，并使用data-i18n属性来支持国际化
      // 使用i18n API获取本地化的“无历史记录”文本
      const noHistoryText = chrome.i18n && chrome.i18n.getMessage ? chrome.i18n.getMessage('noHistory') : window.i18n.t('noHistory');
      historyListEl.innerHTML = `<div class="text-gray-500 text-center py-1" data-i18n="noHistory">${noHistoryText}</div>`;
      return;
    }
    
    passwordHistory.forEach((password, index) => {
      const item = document.createElement('div');
      item.className = 'password-item text-xs';
      
      const passwordText = document.createElement('div');
      passwordText.className = 'password-text text-xs';
      passwordText.textContent = password;
      
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'actions-container flex';
      
      const copyIcon = document.createElement('div');
      copyIcon.className = 'copy-icon mr-2';
      copyIcon.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>';
      
      copyIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(password).then(() => {
          copyIcon.classList.add('copy-success');
          setTimeout(() => {
            copyIcon.classList.remove('copy-success');
          }, 500);
        });
      });
      
      const deleteIcon = document.createElement('div');
      deleteIcon.className = 'delete-icon';
      deleteIcon.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
      
      deleteIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        removePasswordFromHistory(index);
      });
      
      actionsContainer.appendChild(copyIcon);
      actionsContainer.appendChild(deleteIcon);
      
      item.appendChild(passwordText);
      item.appendChild(actionsContainer);
      historyListEl.appendChild(item);
    });
  }

  // 移除密码列表更新功能

  // 显示密码并高亮特殊字符
  function displayPasswordWithHighlight(password) {
    if (!generatedPasswordEl || !password) return;
    
    // 清空密码元素
    generatedPasswordEl.innerHTML = '';
    
    // 获取当前选项
    const useNumbers = numbersEl ? numbersEl.checked : true;
    const useSymbols = symbolsEl ? symbolsEl.checked : false;
    
    // 定义数字和符号的正则表达式
    const numberRegex = /[0-9]/;
    const symbolRegex = /[^a-zA-Z0-9]/;
    
    // 逐字符处理密码，根据类型高亮显示
    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      const span = document.createElement('span');
      span.textContent = char;
      
      if (useNumbers && numberRegex.test(char)) {
        span.classList.add('highlight-number');
      } else if (useSymbols && symbolRegex.test(char)) {
        span.classList.add('highlight-symbol');
      }
      
      generatedPasswordEl.appendChild(span);
    }
  }

  // 更新密码强度
  function updatePasswordStrength(password) {
    if (!strengthTextEl) return;
    
    if (!password || typeof password !== 'string' || password.includes(t('selectAtLeastOne'))) {
      strengthTextEl.textContent = t('none');
      strengthTextEl.className = 'font-medium px-2 py-0.5 rounded-sm bg-gray-100 text-gray-800';
      return;
    }
    
    const score = calculatePasswordStrength(password);
    let strengthKey, bgColorClass, textColorClass;
    
    if (score < 20) {
      strengthKey = 'veryWeak';
      bgColorClass = 'bg-red-200';
      textColorClass = 'text-red-800';
    } else if (score < 40) {
      strengthKey = 'weak';
      bgColorClass = 'bg-red-100';
      textColorClass = 'text-red-800';
    } else if (score < 60) {
      strengthKey = 'good';
      bgColorClass = 'bg-yellow-100';
      textColorClass = 'text-yellow-800';
    } else if (score < 80) {
      strengthKey = 'excellent';
      bgColorClass = 'bg-blue-100';
      textColorClass = 'text-blue-800';
    } else {
      strengthKey = 'veryStrong';
      bgColorClass = 'bg-green-100';
      textColorClass = 'text-green-800';
    }
    
    strengthTextEl.textContent = t(strengthKey);
    strengthTextEl.className = `ml-2 font-medium text-xs px-2 py-0.5 rounded-sm ${bgColorClass} ${textColorClass} whitespace-nowrap`;
  }

  // 计算密码强度
  function calculatePasswordStrength(password) {
    if (currentMode === 'pin') {
      // PIN 码强度计算
      return Math.min(20 + password.length * 5, 60);
    }
    
    let score = 0;
    
    // 长度得分 (最多 30 分)
    score += Math.min(30, password.length * 2);
    
    // 字符类型得分 (最多 40 分)
    if (containsLowercase(password)) score += 10;
    if (containsUppercase(password)) score += 10;
    if (containsNumbers(password)) score += 10;
    if (containsSymbols(password)) score += 10;
    
    // 复杂性得分 (最多 30 分)
    const uniqueChars = new Set(password.split('')).size;
    score += Math.min(15, uniqueChars * 0.5);
    
    // 连续字符减分
    score -= countSequentialChars(password) * 2;
    
    // 重复字符减分
    score -= countRepeatedChars(password) * 2;
    
    return Math.max(0, Math.min(100, score));
  }

  // 辅助函数
  function containsLowercase(str) {
    return /[a-z]/.test(str);
  }
  
  function containsUppercase(str) {
    return /[A-Z]/.test(str);
  }
  
  function containsNumbers(str) {
    return /\d/.test(str);
  }
  
  function containsSymbols(str) {
    return /[^A-Za-z0-9]/.test(str);
  }
  
  function countSequentialChars(str) {
    let count = 0;
    for (let i = 0; i < str.length - 2; i++) {
      const c1 = str.charCodeAt(i);
      const c2 = str.charCodeAt(i + 1);
      const c3 = str.charCodeAt(i + 2);
      if ((c1 + 1 === c2 && c2 + 1 === c3) || (c1 - 1 === c2 && c2 - 1 === c3)) {
        count++;
      }
    }
    return count;
  }
  
  function countRepeatedChars(str) {
    let count = 0;
    for (let i = 0; i < str.length - 1; i++) {
      if (str[i] === str[i + 1]) {
        count++;
      }
    }
    return count;
  }
});
