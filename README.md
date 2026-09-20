# 硅之路

一款从 1960 年经营到科技寒冬的 Build 驱动文字决策游戏。

目标模式为 12 回合、约 15 分钟的“飞轮危机局”：玩家组装公司能力，让收益形成指数增长，再用 Build 应对三阶段终局危机。完整规则见 [玩法规范](docs/15-minute-build-slice.md)。

当前 Web 版本是 6 个经营回合加 1 个最终危机的可玩灰盒。每回合直接出现一张左右二选一卡牌，可拖动卡牌或点击两侧选项；完整 12 回合版本将在灰盒通过测试后扩展。

早期剧情、系统和界面方案保存在 [旧设计文档归档](docs/outdated-doc/README.md)，仅供追溯与参考。

## 在线游玩

启用 GitHub Pages 后，在以下地址游玩：

[https://jiashuzhang.github.io/silicon-road/](https://jiashuzhang.github.io/silicon-road/)

## 本地运行

直接用浏览器打开 `index.html`。

游戏进度保存在浏览器的 `localStorage` 中，不会跨设备同步。

## 项目结构

- `index.html`：页面结构
- `styles.css`：界面样式
- `cards.config.js`：灰盒能力、机会和市场事件配置
- `app.js`：7 回合状态机与三套 Build 结算逻辑
- `outdated-code/legacy-build-slice/`：改版前的完整可运行原型
