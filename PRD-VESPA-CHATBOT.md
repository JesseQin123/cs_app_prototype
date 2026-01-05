# PRD: Vespa AI Chatbot 集成

## 1. 产品概述

### 1.1 背景
CrownSync 是一个连接奢侈品牌与零售商的营销资产管理平台。为了提升用户体验和数据可发现性，我们计划集成基于 Vespa 的 AI 搜索助手，让品牌管理员能够通过自然语言查询业务数据、搜索知识库内容，以及进行图像相似性搜索。

### 1.2 目标用户
- **主要用户**: 品牌管理员 (Brand Admin)
- **使用场景**: 在品牌应用中快速查找 campaigns、retailers、products 等业务数据

### 1.3 核心价值
- 快速定位业务数据，减少手动浏览时间
- 支持语义搜索，提升搜索准确性
- 支持图像搜索，通过描述找到相似产品图片

---

## 2. 功能需求

### 2.1 搜索功能

#### 2.1.1 文本搜索 (Text Search)
- **技术**: BM25 关键词匹配
- **搜索字段**: 标题、描述、分类
- **用例**: "Verragio campaigns"、"platinum retailers"

#### 2.1.2 图像搜索 (Image Search)
- **技术**: CLIP 512 维向量嵌入 + HNSW 近似最近邻
- **搜索方式**: 用文字描述搜索视觉相似的图片
- **用例**: "gold engagement ring with halo"、"blue dial diving watch"

#### 2.1.3 混合搜索 (Hybrid Search) - 默认模式
- **技术**: 文本 + 图像搜索加权组合
- **权重配置**: 文本 50% + 图像 50% (可调整)
- **优势**: 最全面的搜索结果

### 2.2 可搜索数据类型

| 数据类型 | 来源 | 搜索内容 |
|---------|------|---------|
| Campaigns | campaignStore | 标题、描述、品牌、状态 |
| Brands | brandStore | 品牌名称、描述 |
| Retailers | retailerStore | 零售商名称、区域、层级 |
| Products | 新生成 | 产品名称、描述、系列、价格区间 |
| Resources | resourceStore | 资源标题、描述、文件类型 |
| FAQs | 新生成 | 问题、答案 |
| Images | public/mock/ | 封面图、产品图（CLIP 向量） |

### 2.3 用户界面

#### 2.3.1 入口
- 品牌应用侧边栏新增 "AI Assistant" 菜单项
- 图标: MessageCircle (lucide-react)
- 位置: 主菜单区域

#### 2.3.2 页面布局
```
┌─────────────────────────────────────────┐
│  AI Assistant                           │
├─────────────────────────────────────────┤
│  [搜索选项: 文本 | 图像 | 混合(默认)]    │
├─────────────────────────────────────────┤
│                                         │
│  搜索结果区域                            │
│  ┌─────────────────────────────────┐   │
│  │ Campaign: Holiday Gift Guide    │   │
│  │ Brand: Verragio | 采纳率: 78%   │   │
│  │ 节日送礼指南，精选订婚戒指...    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Product: Couture-0424R          │   │
│  │ [产品图片]                       │   │
│  │ 经典光环订婚戒指，18K白金...     │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ 输入问题或搜索关键词...           [发送] │
└─────────────────────────────────────────┘
```

#### 2.3.3 搜索结果卡片
- 显示内容类型图标 (Campaign/Product/Retailer 等)
- 标题 + 来源/品牌
- 摘要描述 (最多 2 行)
- 相关性分数 (可选显示)
- 图片预览 (如有)

#### 2.3.4 状态处理
- **加载中**: 骨架屏动画
- **无结果**: 空状态提示 + 搜索建议
- **服务离线**: 友好提示 "搜索服务暂时不可用，请确保 Vespa 服务已启动"
- **错误状态**: 重试按钮

---

## 3. 数据需求

### 3.1 数据来源
- **现有数据**: `src/data/mockStore/` 下的 20 个 mock 文件
- **图片资源**: `public/mock/verragio/brand/campaigns/` 下的 49 张图片

### 3.2 数据扩充目标
从当前 ~156 条扩充到 **300-500 条**

| 数据类型 | 当前 | 目标 | 扩充方式 |
|---------|------|------|---------|
| Campaigns | 17 | 60 | 为每个品牌生成更多活动变体 |
| Brands | 12 | 25 | 添加更多奢侈品牌 |
| Retailers | 38 | 80 | 添加更多珠宝/手表零售商 |
| Products | 0 | 100 | 新增产品数据 |
| Resources | 40 | 80 | 生成更多营销资源 |
| FAQs | 0 | 30 | 添加帮助文档 |

### 3.3 Vespa Schema 设计

```
multimodal document:
├── id (string)           - 唯一标识 "campaign_001"
├── content_type (string) - "campaign" | "brand" | "retailer" | "product" | "resource" | "document"
├── title (string, BM25)  - 标题/名称
├── body (string, BM25)   - 描述/内容
├── category (string)     - 分类标签
├── metadata (string)     - JSON 格式额外数据
├── image_file_name (string) - 图片文件名
├── image_embedding (tensor<float>(x[512])) - CLIP 向量
├── created_at (long)     - 创建时间戳
```

---

## 4. 技术架构

### 4.1 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                    CrownSync Brand App                  │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│  │ BrandSidebar │ → │ ChatbotPage │ → │ useVespaSearch │
│  └─────────────┘    └─────────────┘    └────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP (via Vite proxy)
                             ↓
┌─────────────────────────────────────────────────────────┐
│                   vespa-search Services                  │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│  │ Node.js API │ ↔ │ CLIP Service │ ↔ │   Vespa    │  │
│  │  :3001      │    │   :5000      │    │   :8080    │  │
│  └─────────────┘    └─────────────┘    └────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 4.2 API 端点

| 端点 | 方法 | 用途 |
|------|------|------|
| `/api/search` | POST | 执行搜索查询 |
| `/api/health` | GET | 检查服务状态 |
| `/api/stats` | GET | 获取索引统计 |

### 4.3 前端组件结构

```
src/brand/features/chatbot/
├── ChatbotPage.jsx          # 主页面容器
├── components/
│   ├── ChatInput.jsx        # 搜索输入框
│   ├── SearchResults.jsx    # 结果列表容器
│   ├── ResultCard.jsx       # 单个结果卡片
│   ├── SearchOptions.jsx    # 搜索模式选择
│   └── ServiceStatus.jsx    # 服务状态提示
└── hooks/
    └── useVespaSearch.js    # 搜索逻辑 Hook
```

---

## 5. 依赖关系

### 5.1 服务依赖
- **Vespa Docker** (port 8080) - 搜索引擎
- **CLIP Service** (port 5000) - 图像/文本嵌入
- **Node.js API** (port 3001) - API 网关

### 5.2 启动顺序
1. 启动 vespa-search 服务: `cd vespa-search && ./scripts/start.sh`
2. 启动 CrownSync 开发服务器: `npm run dev`

### 5.3 配置要求
`vite.config.js` 需添加 API 代理:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

---

## 6. 成功指标

### 6.1 功能完成标准
- [ ] 侧边栏显示 AI Assistant 入口
- [ ] 可执行文本搜索并显示结果
- [ ] 可执行图像搜索并显示结果
- [ ] 混合搜索模式正常工作
- [ ] 服务离线时显示友好提示
- [ ] 搜索结果可点击查看详情（可选）

### 6.2 数据完成标准
- [ ] 数据总量达到 300+ 条
- [ ] 图片索引完成（49 张）
- [ ] 所有数据类型都可被搜索到

---

## 7. 实施计划

### Phase 1: 数据准备
1. 创建数据导出脚本 (`scripts/export-to-vespa.js`)
2. 创建数据扩充脚本 (`scripts/generate-extended-data.js`)
3. 生成扩充数据并验证格式

### Phase 2: 数据导入
1. 启动 vespa-search 服务
2. 运行数据导入
3. 验证搜索功能正常

### Phase 3: UI 开发
1. 创建 Chatbot 页面和组件
2. 实现 useVespaSearch Hook
3. 集成到侧边栏

### Phase 4: 测试优化
1. 端到端测试
2. UI 样式调整
3. 错误处理优化

---

## 8. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Vespa 服务不可用 | 搜索功能无法使用 | 实现友好的离线提示和服务状态检测 |
| 图片嵌入生成慢 | 数据导入时间长 | 使用批量嵌入 API，添加进度显示 |
| 搜索结果相关性低 | 用户体验差 | 调整 BM25 权重和混合搜索比例 |

---

## 9. 快速启动指南

### 9.1 数据准备

```bash
# 1. 导出基础 mock 数据
npm run vespa:export

# 2. 生成扩充数据 (300-500 条)
npm run vespa:generate
```

### 9.2 启动 Vespa 服务

```bash
# 在 vespa-search 项目目录
cd ../vespa-search
./scripts/start.sh

# 等待 30-60 秒让服务完全启动
# 可以通过以下命令检查服务状态:
curl http://localhost:8080/state/v1/health
curl http://localhost:5000/health
```

### 9.3 导入数据到 Vespa

```bash
# 返回 CrownSync 项目目录
cd ../cs_app_prototype

# 导入所有数据 (文本 + 图片)
npm run vespa:import

# 或者只导入文本数据 (更快)
npm run vespa:import:text

# 或者只导入图片 (需要 CLIP 服务)
npm run vespa:import:images
```

### 9.4 启动开发服务器

```bash
npm run dev
```

### 9.5 使用 AI Assistant

1. 在浏览器打开 http://localhost:5173
2. 在左侧边栏点击 "AI Assistant"
3. 输入搜索关键词，如 "Verragio diamond ring"
4. 选择搜索模式: Text / Image / Hybrid

### 9.6 可用的 NPM 脚本

| 脚本 | 说明 |
|------|------|
| `npm run vespa:export` | 导出 mock 数据到 Vespa 格式 |
| `npm run vespa:generate` | 生成扩充数据 |
| `npm run vespa:import` | 导入所有数据到 Vespa |
| `npm run vespa:import:text` | 只导入文本数据 |
| `npm run vespa:import:images` | 只导入图片数据 |
