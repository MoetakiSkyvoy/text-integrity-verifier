# Text Integrity Verification Tool (SHA-256)

A simple web-based tool to generate and verify text strings with embedded SHA-256 hashes for integrity checking. Useful for ensuring that snippets of text (like copyright notices, contact information, or configuration data) have not been accidentally modified.

## [Live Demo](https://moetakiskyvoy.github.io/text-integrity-verifier/)

## Purpose

This tool helps you create a self-verifying string. It takes your original text, calculates its SHA-256 hash (using UTF-8 encoding), and appends the hash to the original text using a specific format. Anyone can then use the tool (or perform the steps manually) to verify if the original text part has been tampered with.

## Format Used

The tool uses the following format: `[Original Text Content]; SHA-256: [64-character lowercase hexadecimal SHA-256 hash]`.


* **Separator:** `; SHA-256: ` (注意：冒号后面有一个空格)
* **Hash:** 一个 64 位的小写十六进制字符串，根据 `[Original Text Content]` 的 UTF-8 字节计算得出。

## Features

* **Generator:** 输入文本以生成包含 SHA-256 哈希的完整验证字符串。
* **Verifier:** 粘贴完整的验证字符串以检查文本部分是否与嵌入的哈希匹配。
* **Default Input:** 如果您将输入字段留空，该工具会使用默认示例文本 (`© Moetaki. All rights reserved. Contact: moeterminator@proton.me`) 进行演示。
* **Copy Button:** 轻松将生成的结果复制到剪贴板。
* **Clear Instructions:** 页面本身解释了该系统的工作原理以及如何手动验证。

## How to Use (On the Webpage)

1.  **Generate:**
    * 转到 "生成验证字符串" 部分。
    * 在第一个文本区域中输入您要保护的文本。
    * 点击 "生成带哈希的字符串" 按钮。
    * 完整的字符串（文本 + 分隔符 + 哈希）将出现在 "生成结果" 框中。
    * 使用 "复制" 按钮复制结果。
2.  **Verify:**
    * 转到 "验证字符串完整性" 部分。
    * 将*整个*字符串（包括 `; SHA-256: ` 部分和哈希）粘贴到文本区域中。
    * 点击 "验证完整性" 按钮。
    * 结果（成功或失败）将显示在按钮下方。

## Manual Verification

您可以手动验证完整性：
1.  复制分隔符 `; SHA-256: ` *之前*的所有文本。
2.  使用外部 SHA-256 工具（确保它使用 UTF-8 输入）计算此文本的哈希值。
3.  将计算出的小写十六进制哈希值与原始字符串中分隔符*之后*的 64 位哈希值进行比较。它们必须完全匹配。

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Web Crypto API (`crypto.subtle`) 用于 SHA-256 哈希计算（需要安全上下文 - HTTPS 或 localhost）。
