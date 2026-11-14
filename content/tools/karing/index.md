---
title: "Karing 使用教程"
description: "Karing客户端保姆级新手配置与订阅导入使用指南！兼容iOS、Windows、macOS、Android全平台的轻量代理工具。详细演示Clash与Sing-box订阅一键导入解析、自动测速选线、分流规则配置与开机自启防断流技巧，彻底解决连接超时与分流混乱痛点，新手小白轻松掌握多端零门槛跨区上网体验。"
layout: "simple"
showTableOfContents: true
sitemap:
  changefreq: "monthly"
  priority: 0.7
---

Karing 是基于 sing-box 的多平台图形客户端，兼容 Clash、V2Ray/V2Fly、sing-box、Shadowsocks 等常见配置与订阅格式，并提供适合新用户的简化设置。

## 官方下载

前往 [Karing 官方下载页](https://karing.app/download) 选择对应平台。iPhone、iPad 和 Apple TV 用户也可以在 App Store 搜索 Karing；Android、Windows、macOS 和 Linux 用户应优先使用官网或 `KaringX/karing` 官方 Releases。

## 添加订阅

1. 打开 Karing，进入订阅或配置管理页面。
2. 选择添加订阅，从剪贴板粘贴服务提供方给出的地址。
3. 为订阅设置名称并保存，然后执行更新。
4. 更新完成后，在节点或策略页面选择需要使用的节点。

Karing 支持多种订阅格式。若导入失败，应先确认服务提供方是否支持 Clash、V2Ray 或 sing-box 格式，并尝试复制对应格式的订阅地址。

## 启动与路由

1. 首次使用可保留默认路由规则，减少配置错误。
2. 选择节点后，点击首页连接按钮。
3. 手机端首次连接时允许创建 VPN 配置；桌面端根据系统提示授予网络权限。
4. 连接后测试网页和常用应用，根据实际情况切换节点。

## 备份与同步

官方项目支持配置导入导出、局域网同步和 WebDAV；Apple 平台还支持 iCloud 同步。启用同步前，应确认同步空间由自己控制，并妥善保护包含订阅凭据的备份文件。

## 常见问题

- 订阅无法识别：换用服务提供方提供的另一种兼容格式。
- 节点存在但无法使用：更新订阅、切换节点，并确认系统时间正确。
- 桌面端连接无效：检查系统代理或虚拟网卡权限。
- 手机后台断开：允许应用后台运行，并调整省电限制。

[← 返回工具使用](/tools/)
