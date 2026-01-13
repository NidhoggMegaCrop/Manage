# Agent 系统管理平台 Demo

这是一个基于 React + TypeScript + Tailwind CSS 的企业级管理系统界面演示项目。

## 功能特性

- 📊 **BP分析管理** - 查看和管理业务计划分析任务
- 💰 **点数订单** - 查看点数充值和消费流水
- 🏢 **租户管理** - 管理多租户组织信息
- 👥 **用户管理** - 管理系统用户和权限
- 📈 **配额管理** - 管理和分配点数配额

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Scripts

## 快速开始

### 在本地运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 在 CodeSandbox 中运行

1. 访问 [CodeSandbox](https://codesandbox.io/)
2. 点击 "Create Sandbox"
3. 选择 "Import from GitHub"
4. 粘贴本仓库的 URL
5. 等待项目自动构建和运行

或者直接上传整个项目文件夹到 CodeSandbox。

## 项目结构

```
Manage/
├── public/
│   └── index.html          # HTML 入口文件
├── src/
│   ├── App.tsx             # 主应用组件
│   ├── index.tsx           # React 入口文件
│   └── index.css           # 全局样式和 Tailwind CSS
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # Tailwind CSS 配置
└── postcss.config.js       # PostCSS 配置
```

## 功能说明

### 角色切换
- 系统支持"系统管理员"和"租户管理员"两种角色切换
- 不同角色看到的功能和数据有所不同

### 模拟数据
- 项目使用模拟数据进行演示
- 可在 `src/App.tsx` 的 `MOCK_DATA` 中修改模拟数据

## 构建生产版本

```bash
npm run build
```

构建产物将输出到 `build/` 目录。

## License

MIT
