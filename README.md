<p align="center"><img src="ap-dark-mode/icons/icon-128.png" width="88" alt="月牙与书页图标"></p>

# AP Classroom 深色模式

为 AP Classroom、AP Students 和相关登录入口提供深色配色的 Chrome 扩展。

支持 **深色 / 浅色 / 跟随系统**，默认跟随浏览器报告的系统外观。保留原站布局、字号和题目图片，保留课程卡片的学科主题色。当前版本：**0.3.4**。

这是独立开发的非官方扩展，与 College Board 无隶属或背书关系。

## 安装

在 [Chrome 应用商店](https://chromewebstore.google.com/detail/hoipdonfpmmjhechpgjfeaohllcnpgkn) 点击「添加至 Chrome」。商店安装版会自动接收审核通过的更新。

要手动安装 GitHub 版：

1. [下载安装包](https://github.com/hxd3c0504/ap-classroom-dark-mode/raw/refs/heads/main/dist/ap-classroom-dark-mode-0.3.4.zip) 并解压到一个固定文件夹。
2. 在 Chrome 地址栏打开 `chrome://extensions`，开启右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择解压后包含 `manifest.json` 的文件夹。
4. 刷新 AP 网站。点击浏览器工具栏上的月牙书页图标，即可切换三个模式。

也可以使用仓库的 **Code → Download ZIP**，解压后加载其中的 `ap-dark-mode` 文件夹。

## 支持范围

| 页面 | 匹配范围 |
| --- | --- |
| AP Students | `https://apstudents.collegeboard.org/*` |
| AP Classroom | `https://apclassroom.collegeboard.org/*` |
| My AP 账号类型入口 | `https://myap.collegeboard.org/login*` |
| College Board 身份验证页 | `https://prod.idp.collegeboard.org/*` |

包含常见导航、课程信息区、作业列表、题目工具、Java 参考表、部分检查页及成绩概览统计表、图例和总用时栏的颜色适配。成绩条中的数字分数使用黑色，保留原来的黄绿底色。

网站更新和未覆盖的题型、弹窗可能仍需调整。不适用于 Bluebook 独立应用、浏览器 PDF 查看器或其他未列出的域名。图片内部的白色不会统一反相。

## 模式与更新

- **深色**：启用扩展配色。
- **浅色**：恢复网站原始配色。
- **跟随系统**：使用浏览器 `prefers-color-scheme` 报告的外观偏好。

设置保存在当前 Chrome 的扩展本地存储中，已打开的匹配页面会同步切换。GitHub 安装版需要手动更新：用新版文件替换原文件，前往扩展页点击重新加载，再刷新网站。

## 隐私

仅申请 `storage` API 权限，并在表中列出的页面运行。保存的设置只有外观模式。

为修复颜色，会在设备本地检查网页结构、部分文字及计算样式；不保存网页内容，不向开发者或第三方传输这些内容。不会读取输入框中的账号、密码，也不会填写或提交表单。扩展没有广告、遥测或远程代码。

完整说明见 [PRIVACY.md](PRIVACY.md)。

## 开发与检查

扩展采用 Manifest V3，运行文件均位于 `ap-dark-mode/`，无需构建或第三方运行库。

```sh
node tools/verify.mjs
python3 tools/package.py
```

第一个命令检查站点范围、文件引用、颜色属性限制和模式同步逻辑；第二个命令按文件清单生成 `dist/` 下的安装包及 SHA-256 校验文件。

图标的 SVG 源文件位于 `ap-dark-mode/icons/icon.svg`。仓库不包含个人账户截图或作业页面快照。

## 反馈

请在 [Issues](https://github.com/hxd3c0504/ap-classroom-dark-mode/issues) 中反馈页面路径、所选模式和问题。提交截图前，请遮住姓名、邮箱、学校和个人成绩；不要提交密码或验证码。

Unofficial dark mode extension for AP Classroom and AP Students. Three appearance modes, local settings, and no telemetry.
