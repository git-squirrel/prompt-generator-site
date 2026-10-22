# Prompt Generator · 项目介绍页

为开源项目 [git-squirrel/prompt-generator](https://github.com/git-squirrel/prompt-generator) 制作的功能介绍 / 交互演示单页。纯 HTML + CSS + JavaScript，无构建步骤、无外部字体、无第三方依赖，可直接托管到 GitHub Pages。

![页面预览](assets/preview.png)

## 页面包含什么

- **首屏介绍**：项目定位、版本、技术要点与 GitHub 入口
- **完整工作流**：随机组合 → 模板 / AI 润色 → ComfyUI 生图
- **可交互演示**：随机组合、词条锁定、身份开关、模板优化、AI 润色（模拟）、批量生图进度、瀑布流画廊、图片查看器
- **真实功能拆解**：词库管理、身份总开关、润色模板组、五家 AI 服务商、ComfyUI 节点识别、生图画廊；「词条管理」「润色模板组」卡片可直接点击跳到演示区
- **异步流水线对比**：串行 138s vs 流水线 98s 的甘特图演示
- **本地优先与快速开始**：数据目录说明、克隆启动命令、ComfyUI API 格式提示
- **响应式与主题**：桌面 / 平板 / 手机布局，亮色 / 暗色主题

> 页面内的「生图」和「AI 润色」都是前端模拟，不会请求真实的 ComfyUI 或 AI 接口，也不会消耗 API 额度。画廊中的图片是程序生成的抽象 SVG 演示图，不代表真实模型输出。

## 本地预览

直接双击 `index.html` 即可。或者起一个本地静态服务：

```bash
cd prompt-generator-showcase
python -m http.server 8080
```

然后打开 <http://localhost:8080>。

页面没有构建步骤；修改 `assets/style.css` 或 `assets/app.js` 后刷新即可。

## 上传到 GitHub Pages

### 方式 A：放进现有项目仓库（推荐）

适合把介绍页作为 `prompt-generator` 项目的官网，同时不影响仓库根目录的运行代码。

1. 在 `prompt-generator` 仓库里新建 `docs/` 目录。
2. 把本目录下的 `index.html`、`assets/`、`.nojekyll` 复制到 `docs/`。
3. 提交并推送到 `main`。
4. 打开仓库 **Settings → Pages**。
5. **Build and deployment → Source** 选择 **Deploy from a branch**。
6. **Branch** 选择 `main`，目录选择 **`/docs`**，点击 **Save**。
7. 等待几十秒，访问：

   ```text
   https://<你的用户名>.github.io/prompt-generator/
   ```

   如果仓库名不是 `prompt-generator`，把路径最后一段换成实际仓库名。

### 方式 B：独立仓库

1. 新建一个仓库（例如 `prompt-generator-site`）。
2. 把 `index.html`、`assets/`、`.nojekyll` 放到仓库根目录。
3. **Settings → Pages → Deploy from a branch → `main` / `(root)`**。
4. 访问 `https://<你的用户名>.github.io/prompt-generator-site/`。

> 这个地址是 GitHub Pages 根据「用户名 + 仓库名」自动生成的，**不要**把它填进 Custom domain。Custom domain 只用于你自己的独立域名（如 `prompt.example.com`）。

### 自定义域名

Custom domain 输入框只接受**域名本身**，不能带 `https://`、路径或末尾斜杠。

| 想使用的地址 | Custom domain 应填 |
| --- | --- |
| `https://git-squirrel.github.io/prompt-generator-site/` | **留空**（这是默认 Pages 地址） |
| `https://prompt.example.com/` | `prompt.example.com` |
| `https://example.com/` | `example.com` |

如果出现 “自定义域名的格式不正确 / not properly formatted”，通常是因为把完整 URL、仓库路径或末尾 `/` 填了进去。清空 Custom domain 并保存即可恢复默认的 `*.github.io` 地址。

使用自己的域名时，还需要在 DNS 服务商处配置记录：

- 子域名（`prompt.example.com`）：添加 `CNAME` 指向 `<你的用户名>.github.io`
- 根域名（`example.com`）：配置 GitHub Pages 提供的 `A` 记录（或使用 `ALIAS`/`ANAME`）

保存后等待 DNS 检查通过，再在 Pages 设置中勾选 **Enforce HTTPS**。最后把 `index.html` 里 `og:image` 改成完整的绝对地址，社交平台才能正确抓取预览图。

## 仓库信息建议

GitHub 仓库详情里的 **主题（Topics）是搜索标签，不是页面主题或配色**，填英文小写关键词即可，用连字符连接，不要空格。

| 字段 | 建议内容 |
| --- | --- |
| Description | `AI 提示词管理与生图一体化工具，支持随机组合、AI 润色、ComfyUI 生图` |
| Website | `https://<你的用户名>.github.io/<仓库名>/`（Pages 部署成功后填写） |
| Topics | `prompt-generator` `prompt-engineering` `ai-art` `comfyui` `stable-diffusion` `text-to-image` `image-generation` `deepseek` `ollama` `local-first` `self-hosted` |

Topics 可以逐个输入后按回车添加，GitHub 最多允许 20 个；选 8–12 个与项目真正相关的即可，不要堆砌无关标签。

## 需要修改的地方

| 内容 | 位置 |
| --- | --- |
| GitHub 仓库地址 | `index.html` 中所有 `https://github.com/git-squirrel/prompt-generator` |
| 主题色 / 字体 / 圆角 | `assets/style.css` 顶部的 `:root` 变量 |
| 演示词库与身份选项 | `assets/app.js` 顶部的 `CATEGORIES`、`REGIONS`、`GENDERS` |
| 演示提示词与种子 | `assets/app.js` 顶部的 `SAMPLE_PROMPTS` |
| 社交预览图 | `assets/preview.png`，并更新 `og:image` |
| 页面标题 / 描述 | `index.html` 的 `<title>` 与 `meta` |

### 换配色

`assets/style.css` 的 `:root` 里集中定义了颜色；暗色主题在 `html[data-theme="dark"]` 中覆盖。演示面板（深色工作台）还有一组独立的 `--d-*` 变量，位于 `.demo-shell` 规则内。

## 文件结构

```text
prompt-generator-showcase/
├─ index.html              # 页面结构、文案、内联 SVG 图标
├─ assets/
│  ├─ style.css            # 全部样式（亮 / 暗主题、响应式）
│  ├─ app.js               # 演示交互、SVG 生成、甘特图
│  ├─ favicon.svg          # 站点图标
│  └─ preview.png          # README / OG 预览图
├─ .nojekyll               # 跳过 GitHub Pages 的 Jekyll 处理
└─ README.md
```

## 兼容性

- 现代 Chrome / Edge / Firefox / Safari。
- 使用了 `color-mix()`、`backdrop-filter`、`<dialog>`、`aspect-ratio` 等现代特性；旧版浏览器会降级显示，但交互演示建议使用最近两年的浏览器。
- 已适配 `prefers-reduced-motion`，并保留键盘焦点样式。

## 说明

- 本项目介绍页不是 Prompt Generator 的运行程序；真实功能需要克隆原仓库并在本地启动 `start_server.py`。
- 原项目采用 MIT License。本介绍页可随原项目一起以 MIT 协议发布。
- 页面内所有演示图都由 `assets/app.js` 在浏览器里实时生成，不包含任何远程图片请求。
