# 数感乐园 (Math Fun Land)

专为3-6岁儿童设计的数学启蒙游戏，通过有趣的图案和互动培养孩子的数感能力。

## 🎮 游戏特点

### 核心玩法
1. **数字识别**：显示随机数字（5-20）
2. **图案对应**：生成对应数量的可爱图案（冰淇淋、饼干、星星等）
3. **选择挑战**：显示3个连续数字选项，其中一个是正确答案
4. **即时反馈**：选择后立即获得视觉和声音反馈
5. **智能进阶**：根据表现自动调整难度

### 儿童友好设计
- 🎨 **明亮色彩**：使用儿童喜爱的鲜艳颜色
- 🎵 **友好音效**：温和的提示音和庆祝音效
- ✨ **生动动画**：流畅的动画效果吸引注意力
- 👆 **触摸友好**：所有交互元素满足最小44×44像素标准
- 💡 **错误提示**：错误时提供友好的学习提示，无惩罚性反馈

### 智能难度系统
- **自适应调整**：连续正确时提高难度，错误时降低难度
- **渐进学习**：从简单数字（5-10）逐步扩展到复杂数字（5-20）
- **图案复杂度**：随难度增加图案变得更多样和复杂

### 多语言支持
- 🇨🇳 中文（简体）
- 🇺🇸 英文

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 8+

### 安装和运行

```bash
# 克隆项目
git clone <repository-url>
cd math-game

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test
```

### 访问应用
开发服务器启动后，在浏览器中打开：
- http://localhost:5173

## 📁 项目结构

```
math-game/
├── public/                 # 静态资源
│   ├── images/            # 图案图片资源
│   ├── sounds/            # 音效文件
│   └── locales/           # 国际化语言文件
├── src/
│   ├── components/        # 可复用组件
│   │   ├── GameBoard/     # 游戏主面板组件
│   │   ├── UI/           # 通用UI组件
│   │   └── Layout/       # 布局组件
│   ├── screens/          # 页面组件
│   │   ├── HomePage.tsx  # 首页
│   │   ├── GamePage.tsx  # 游戏主页面
│   │   └── SettingsPage.tsx # 设置页面
│   ├── game/            # 游戏核心逻辑
│   │   ├── engine.ts    # 游戏引擎和状态管理
│   │   ├── generator.ts # 数字和图案生成
│   │   ├── validator.ts # 答案验证
│   │   └── types.ts     # 类型定义
│   ├── styles/          # 样式文件
│   │   ├── global.css   # 全局样式
│   │   ├── variables.css # CSS变量定义
│   │   ├── animations.css # 关键帧动画
│   │   └── responsive.css # 响应式样式
│   ├── i18n/           # 国际化
│   │   ├── index.ts
│   │   ├── zh-CN.json  # 中文翻译
│   │   └── en-US.json  # 英文翻译
│   ├── hooks/          # 自定义Hooks
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 应用根组件
│   └── main.tsx        # 应用入口
└── 配置文件
    ├── vite.config.ts  # 构建配置
    ├── tsconfig.json   # TypeScript配置
    └── package.json    # 项目依赖
```

## 🧩 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **状态管理**：React Context + useReducer
- **动画库**：Framer Motion
- **国际化**：react-i18next
- **样式方案**：CSS Modules + CSS Variables
- **测试框架**：Vitest + React Testing Library
- **代码质量**：ESLint + Prettier

## 🎯 学习目标

### 认知发展
- 数字识别（5-20）
- 数量对应关系建立
- 观察力和注意力培养
- 错误中学习的能力

### 情感发展
- 成功体验建立自信心
- 温和的错误提示减少挫败感
- 渐进挑战保持学习兴趣
- 可视化进度激励持续参与

## 🛠️ 开发计划

### 已完成功能
- [x] 项目基础架构搭建
- [x] 核心游戏逻辑实现
- [x] 智能难度调整系统
- [x] 友好的错误提示系统
- [x] 响应式UI设计
- [x] 中英文双语支持
- [x] 动画和交互效果
- [x] 游戏设置页面

### 计划功能
- [ ] 音效系统集成
- [ ] 用户进度保存
- [ ] 成就系统
- [ ] 家长监控面板
- [ ] 更多图案主题
- [ ] 离线支持

## 📱 设备支持

- **桌面电脑**：Chrome、Firefox、Safari、Edge最新版本
- **平板电脑**：iPad、Android平板（横屏/竖屏优化）
- **手机**：iPhone、Android手机（触摸优化）

## 🧪 测试

```bash
# 运行单元测试
npm run test

# 运行测试覆盖率
npm run test:coverage

# 启动测试UI
npm run test:ui
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍👩‍👧‍👦 致谢

感谢所有为儿童教育付出努力的教育工作者和开发者！
特别感谢测试游戏的孩子们和家长们提供的宝贵反馈。

---

**让每个孩子都能在游戏中快乐学习数学！** 🧮✨
