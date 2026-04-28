# 我的收藏夹 - 网页访问指南

## 📁 项目概述

这是一个基于HTML/CSS/JavaScript的静态网页应用，展示文学、动漫、游戏和音乐作品的收藏管理功能。

## 🌐 访问方式

### 方式一：直接双击打开（最简单）

1. 打开文件资源管理器，找到项目目录：
   ```
   e:\日常存储\信息资料备份\期末\Web前端\mix\
   ```
2. 双击 `index.html` 文件
3. 系统会自动使用默认浏览器打开网页

**优点**：无需安装任何软件，操作简单  
**缺点**：某些浏览器可能限制本地文件访问（CORS限制）

---

### 方式二：使用 Python 本地服务器（推荐）

#### Windows 命令提示符：
```cmd
cd e:\日常存储\信息资料备份\期末\Web前端\mix
python -m http.server 8000
```

#### PowerShell：
```powershell
cd "e:\日常存储\信息资料备份\期末\Web前端\mix"
python -m http.server 8000
```

然后在浏览器中访问：
```
http://localhost:8000
```

---

### 方式三：使用 Node.js 本地服务器

如果你已安装 Node.js，可以使用 `http-server`：

```cmd
# 首先安装 http-server（只需安装一次）
npm install -g http-server

# 启动服务器
cd e:\日常存储\信息资料备份\期末\Web前端\mix
http-server -p 8000
```

然后在浏览器中访问：
```
http://localhost:8000
```

---

### 方式四：使用 VS Code Live Server 扩展

1. 在 VS Code 中打开项目文件夹
2. 安装 Live Server 扩展
3. 右键点击 `index.html` 文件
4. 选择 "Open with Live Server"

---

### 方式五：部署到静态网站托管服务

#### GitHub Pages
```bash
# 在 GitHub 上创建仓库
# 将代码推送到仓库
# 在仓库设置中启用 GitHub Pages
# 选择 main 分支和 /root 目录
```

#### Netlify
1. 访问 https://www.netlify.com
2. 连接 GitHub 仓库
3. 部署命令留空（静态站点无需构建）
4. 发布目录设置为 `/`

#### Vercel
1. 访问 https://vercel.com
2. 导入项目仓库
3. 按照提示完成部署

---

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计与动画
- **JavaScript (ES6+)** - 交互功能
- **Chart.js** - 数据可视化
- **LocalStorage** - 本地数据存储

## 📱 响应式设计

项目支持以下设备尺寸：
- 桌面端：1200px+
- 平板端：768px - 1199px
- 移动端：< 768px

## 🎯 功能特性

1. **作品收藏管理** - 添加、编辑、删除收藏作品
2. **分类浏览** - 文学、动漫、游戏、音乐分类
3. **数据可视化** - 展示收藏数据统计图表
4. **详情页面** - 查看作品详情和下载资源
5. **轮播图展示** - 首页顶部轮播展示
6. **首次访问动画** - Hero全屏图片展示

## 📁 项目结构

```
mix/
├── index.html          # 首页
├── book.html           # 文学分类页
├── anime.html          # 动漫分类页
├── game.html           # 游戏分类页
├── music.html          # 音乐分类页
├── data.html           # 数据可视化页
├── detail.html         # 作品详情页
├── css/
│   └── style.css       # 全局样式
├── js/
│   └── main.js         # 核心脚本
└── img/                # 图片资源
```

## 🔧 开发调试

打开浏览器开发者工具（F12），可以查看：
- Console - 日志输出
- Network - 资源加载状态
- Application - LocalStorage 数据

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 实现基础 CRUD 功能
- 添加响应式设计

### v1.1.0
- 优化 Hero 区域动画
- 修复图片加载延迟问题
- 添加全局导航栏
- 实现数据可视化页面

---

## 📧 联系方式

如有问题或建议，请联系项目维护者。

---

*最后更新：2024年1月*
