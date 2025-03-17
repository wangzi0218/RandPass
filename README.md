# RandPass - 安全密码生成器 Chrome 扩展 | Secure Password Generator Chrome Extension

[中文](#chinese) | [English](#english)

<a name="chinese"></a>
## 中文版

RandPass 是一个现代化、功能丰富的密码生成器 Chrome 扩展，提供多种类型的密码生成选项和用户友好的界面。无论是创建复杂的随机密码、易记的词组密码，还是简单的 PIN 码，RandPass 都能满足您的需求。

### ✨ 功能特点

#### 多种密码类型
- **随机密码**：生成包含字母、数字和特殊字符的强密码
- **记忆密码**：创建由单词组成的易记密码，支持单词首字母大写或全部大写
- **PIN 码**：生成纯数字 PIN 码，适用于门禁、银行卡等场景

#### 现代化界面
- 使用 Tailwind CSS 构建的美观响应式界面
- 支持中英文双语界面，可一键切换
- 密码强度实时评估与可视化显示
- 一键复制功能，方便快捷

#### 高度可定制
- **随机密码选项**：
  - 可调节密码长度（8-50 字符）
  - 可选择包含大写字母、小写字母、数字和特殊符号
  - 可排除易混淆字符（如 O 和 0、I 和 l）

- **记忆密码选项**：
  - 可调节单词数量（2-8 个单词）
  - 支持首字母大写或全部大写
  - 可替换字母为特殊符号（如 a→@, e→3）
  - 可自定义单词分隔符

- **PIN 码选项**：
  - 可调节 PIN 码长度（4-8 位）
  - 可启用数字不相邻选项，提高安全性
  - 可启用不重复字符选项，确保每个数字只出现一次

#### 安全与隐私
- **本地生成**：所有密码完全在您的设备上生成，不会通过网络传输，杜绝泄露风险
- **加密算法**：采用 Web Crypto API 生成真正随机的密码，远超普通随机函数的安全性
- **隐私保护**：不收集任何个人数据，不需要任何特殊权限，您的隐私安全始终掌握在自己手中
- **历史管理**：可选择保存最近生成的密码（最多10个），并支持单个删除不需要的记录

### 🔧 安装方法

#### 从 Chrome 网上应用店安装
1. 访问 Chrome 网上应用店中的 RandPass 页面 (即将上线)
2. 点击"添加至 Chrome"按钮

#### 开发模式安装
1. 下载或克隆此仓库到本地
2. 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
3. 开启"开发者模式"（右上角开关）
4. 点击"加载已解压的扩展程序"
5. 选择此仓库的文件夹

### 📝 使用指南

#### 基本使用
1. 点击 Chrome 工具栏中的 RandPass 图标打开扩展
2. 选择所需的密码类型（随机、记忆或 PIN）
3. 调整密码长度和其他选项
4. 点击"生成"按钮创建新密码
5. 点击复制图标将密码复制到剪贴板

#### 高级选项
点击"高级选项"展开更多设置：

- **随机密码高级选项**：
  - **排除相似字符**：避免使用容易混淆的字符
  - **不允许字符重复**：确保密码中每个字符只出现一次
  - **数字不相邻**：确保相同数字不会相邻出现

- **记忆密码高级选项**：
  - **单词首字母大写**：使每个单词的首字母大写
  - **单词全部大写**：将所有单词转为大写
  - **替换字母为符号**：用相似的符号替换某些字母
  - **单词连接符**：自定义单词之间的分隔符

#### 历史记录
- 点击"历史记录"展开最近生成的密码列表
- 通过开关控制是否保存历史记录
- 点击历史记录中的复制图标可快速复制之前生成的密码

### 🔄 Chrome 同步

启用 Chrome 同步后，您可以在所有设备上使用相同的设置和历史记录（如果选择保存）。无论是在工作电脑还是家庭设备上，都能获得一致的体验。

### 🛡️ 为什么选择 RandPass？

- **零信任设计**：我们相信最安全的数据是不离开您设备的数据，所有操作均在本地完成
- **无追踪承诺**：不收集使用数据，不分析您的密码模式，没有遥测或分析代码
- **透明开源**：完整源代码公开，您可以亲自验证我们的安全承诺
- **轻量高效**：扩展体积小，启动快，不会拖慢您的浏览器
- **持续更新**：我们定期更新以确保安全性和兼容性，用心维护每一个细节

### 🔨 技术栈

- **前端框架**：原生 JavaScript
- **样式**：Tailwind CSS
- **图标**：Lucide 图标库
- **随机数生成**：Web Crypto API

### 📜 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

### 🤝 贡献

欢迎提交 Pull Request 或创建 Issue 来帮助改进这个项目！

### 🔗 项目链接

- GitHub 仓库：[https://github.com/wangzi0218/RandPass](https://github.com/wangzi0218/RandPass)

---

<a name="english"></a>
## English Version

RandPass is a modern, feature-rich password generator Chrome extension that offers various types of password generation options and a user-friendly interface. Whether you need to create complex random passwords, memorable passphrases, or simple PIN codes, RandPass has you covered.

### ✨ Features

#### Multiple Password Types
- **Random Passwords**: Generate strong passwords with letters, numbers, and special characters
- **Memorable Passwords**: Create easy-to-remember passwords composed of words, with options for capitalization
- **PIN Codes**: Generate numeric PIN codes suitable for door locks, bank cards, etc.

#### Modern Interface
- Beautiful responsive interface built with Tailwind CSS
- Bilingual support (English and Chinese) with one-click language switching
- Real-time password strength assessment and visualization
- One-click copy functionality for convenience

#### Highly Customizable
- **Random Password Options**:
  - Adjustable password length (8-50 characters)
  - Optional inclusion of uppercase letters, lowercase letters, numbers, and special symbols
  - Option to exclude similar characters (like O and 0, I and l)

- **Memorable Password Options**:
  - Adjustable word count (2-8 words)
  - Support for capitalizing first letters or all uppercase
  - Option to substitute letters with special symbols (e.g., a→@, e→3)
  - Customizable word separators

- **PIN Code Options**:
  - Adjustable PIN length (4-8 digits)
  - Option to prevent adjacent identical digits for enhanced security
  - Option to prevent digit repetition, ensuring each digit appears only once

#### Security and Privacy
- **Local Generation**: All passwords are created entirely on your device, never transmitted over the network, eliminating leak risks
- **Cryptographic Strength**: Uses Web Crypto API to generate truly random passwords, far superior to ordinary random functions
- **Privacy Protection**: Collects no personal data and requires no special permissions, keeping your privacy firmly in your control
- **History Management**: Optionally save recently generated passwords (up to 10) with the ability to delete individual entries as needed

### 🔧 Installation

#### From Chrome Web Store
1. Visit the RandPass page in the Chrome Web Store (coming soon)
2. Click the "Add to Chrome" button

#### Developer Mode Installation
1. Download or clone this repository to your local machine
2. Open Chrome browser and navigate to the extensions management page (chrome://extensions/)
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked extension"
5. Select the folder of this repository

### 📝 Usage Guide

#### Basic Usage
1. Click the RandPass icon in the Chrome toolbar to open the extension
2. Select the desired password type (Random, Memorable, or PIN)
3. Adjust the password length and other options
4. Click the "Generate" button to create a new password
5. Click the copy icon to copy the password to your clipboard

#### Advanced Options
Click "Advanced Options" to expand more settings:

- **Random Password Advanced Options**:
  - **Exclude Similar Characters**: Avoid using easily confused characters
  - **No Character Repetition**: Ensure each character appears only once in the password
  - **No Adjacent Digits**: Ensure the same digit doesn't appear adjacently

- **Memorable Password Advanced Options**:
  - **Capitalize First Letter**: Make the first letter of each word uppercase
  - **All Uppercase**: Convert all words to uppercase
  - **Substitute Letters with Symbols**: Replace certain letters with similar symbols
  - **Word Separator**: Customize the separator between words

#### History
- Click "History" to expand the list of recently generated passwords
- Control whether to save history with the toggle switch
- Click the copy icon in the history to quickly copy previously generated passwords

### 🔄 Chrome Sync

With Chrome sync enabled, you can use the same settings and history (if saved) across all your devices. Whether on your work computer or home device, you'll enjoy a consistent experience.

### 🛡️ Why Choose RandPass?

- **Zero-Trust Design**: We believe the most secure data is data that never leaves your device, so everything happens locally
- **No Tracking Promise**: No usage data collection, no analysis of your password patterns, no telemetry or analytics code
- **Transparent & Open Source**: Full source code available for review, so you can verify our security claims yourself
- **Lightweight & Efficient**: Small extension size, quick startup, won't slow down your browser
- **Regularly Updated**: We update regularly to ensure security and compatibility, caring for every detail

### 🔨 Technology Stack

- **Frontend Framework**: Native JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icon Library
- **Random Number Generation**: Web Crypto API

### 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### 🤝 Contribution

Pull requests and issue reports are welcome to help improve this project!

### 🔗 Project Links

- GitHub Repository: [https://github.com/wangzi0218/RandPass](https://github.com/wangzi0218/RandPass)
