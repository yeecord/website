# 協作指南大全

## 文檔等基本需求

請參照 [中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines) 中的中英文空格需求，[為什麼你們就是不能加個空格呢？](https://github.com/vinta/pangu.js)

## 專案結構

```yaml
- README.md: Readme
- CONTRIBUTING.md: 協作指南大全
- LICENSE.md: 授權文件
- babel.config.js: Babel 配置檔
- blog: 部落格文章
- docs: 文檔
- docusaurus.config.js: docusaurus 設定檔案
- node_modules: NodeJS 的無底洞
- package-lock.json: npm 的設定檔
- package.json: npm 的設定檔
- sidebars.js: docs 的側邊欄
- src: 專案主要程式
- static: 靜態圖片等檔案
```

## 你需要先準備好

- [markdown 基本知識](https://www.casper.tw/development/2019/11/23/ten-mins-learn-markdown/)
- [NodeJS 16](https://nodejs.org/download) 或以上版本
- 一個可以使用的 markdown 編輯器 (VSCode)

1. 使用 `git` 將專案下載下來

    ```shell
    git clone https://github.com/yeecord/docs
    ```

2. 安裝好專案需要的依賴

    ```shell
    npm i
    ```

3. 然後你可以開始改了

更多詳情可以參照 [docusaurus](https://docusaurus.io/) 的教學，有支援需求可以聯絡 `凱恩Kane#5384` 或是 [kane@yeecord.com](mailto:kane@yeecord.com) 或是我們的支援群組 https://discord.gg/yeecord