# 隐私说明 / Privacy Policy

适用产品：AP Classroom 深色模式。生效日期：2026-11-17。本文说明版本 0.3.2 的行为。

## 外观设置

扩展使用 `chrome.storage.local` 在设备本地保存外观模式：深色、浅色或跟随系统。不使用 `chrome.storage.sync`，不向开发者提供该设置。

## 网页内容的本地处理

扩展只在清单中限定的 AP Students、AP Classroom、My AP 入口及 College Board 身份验证域运行。为找到需要调整的颜色，它会在本地检查 DOM 结构、部分网页文字和计算样式。例如，识别 Results 列中的数字分数，以及检查页中的中性浅色容器。

这些网页内容只用于当前页面的配色处理，不持久保存、上传、出售或分享给开发者或第三方。扩展的本地存储中只保存外观模式。

## 登录信息

登录页面上的代码只负责颜色和模式同步。不读取账号或密码输入框的值，不读取认证 Cookie，不填写或提交登录表单。扩展没有独立账号系统。

## 网络和第三方

扩展会通过 `chrome.runtime.getURL` 读取安装包内的 `shadow.css`，用于开放 Shadow DOM 组件的配色。这是本地扩展资源，不是远程代码或对外传输。

扩展不运行分析、广告、遥测或远程脚本，不主动向外部服务器发送请求。用户访问的网站本身、Chrome 和 GitHub 等分发平台的行为受各自的隐私政策约束，不属于扩展的本地处理。

## 保留和删除

外观设置保留在当前浏览器的扩展本地存储中。卸载扩展可删除扩展保存的设置；刷新网站后，其颜色覆盖也会消失。开发者没有服务器端的用户数据副本。

## 联系与更新

有关本说明的问题，请通过 [GitHub Issues](https://github.com/hxd3c0504/ap-classroom-dark-mode/issues) 联系维护者。不要在公开 Issue 中提交个人信息、密码或验证码。若未来的数据处理方式发生变化，将同步更新本文和版本说明。

## English summary

This extension stores only your appearance preference in Chrome's local extension storage. It examines page structure, some page text and computed styles on its listed College Board domains solely to adjust colors on your device. Page content is not persistently stored or transmitted to the developer or third parties.

It does not read username or password input values, authentication cookies, or submit forms. It contains no analytics, advertising or remotely hosted code. Its component stylesheet is read from the installed extension package. Uninstalling removes the extension's stored setting. Contact the maintainer through the repository's Issues page without sharing private information.
