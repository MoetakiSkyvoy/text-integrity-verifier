/**
 * script.js
 * Handles SHA-256 generation and verification for the text integrity tool.
 * Includes logic for default inputs and a copy button for the generated result.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Get DOM Elements ---
    const inputText = document.getElementById('inputText');
    const generateButton = document.getElementById('generateButton');
    const generatedOutput = document.getElementById('generatedOutput');
    const copyButton = document.getElementById('copyButton'); // Get the new copy button element

    const verifyInput = document.getElementById('verifyInput');
    const verifyButton = document.getElementById('verifyButton');
    const verificationResult = document.getElementById('verificationResult');

    // --- Constants ---
    const SEPARATOR = '; SHA-256: ';
    const DEFAULT_INPUT_TEXT = "© Moetaki. All rights reserved. Verify: [] Contact: moeterminator@proton.me";
    const ENCODING = 'utf-8';

    // --- SHA-256 Hashing Function (using Web Crypto API) ---
    async function calculateSHA256(text) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error("SHA-256 Hashing Error:", error);
            throw new Error("无法计算哈希值。请检查浏览器是否支持 Web Crypto API 或查看控制台错误。(Could not calculate hash. Check browser support for Web Crypto API or see console errors.)");
        }
    }

    // --- Event Listener for Generate Button ---
    generateButton.addEventListener('click', async () => {
        let textToHash = inputText.value.trim();
        if (!textToHash) {
            console.log("Generator input was empty. Using default text.");
            textToHash = DEFAULT_INPUT_TEXT;
            inputText.value = textToHash;
        } else {
             inputText.value = textToHash;
        }

        generatedOutput.value = "正在计算...";
        copyButton.disabled = true; // Disable copy button during calculation/error
        try {
            const hash = await calculateSHA256(textToHash);
            const finalString = `${textToHash}${SEPARATOR}${hash}`;
            generatedOutput.value = finalString;
            copyButton.disabled = false; // Enable copy button ONLY on successful generation
        } catch (error) {
            generatedOutput.value = `生成错误 (Generation error): ${error.message}`;
            // Keep copy button disabled if there was an error
        }
    });

    // --- Event Listener for Verify Button ---
    // (Verification logic remains unchanged from the previous version)
    verifyButton.addEventListener('click', async () => {
        let fullString = verifyInput.value.trim();
        verificationResult.textContent = '正在验证...';
        verificationResult.className = 'info';

        if (!fullString) {
            console.log("Verifier input was empty. Generating and using default verification string.");
            try {
                const defaultHash = await calculateSHA256(DEFAULT_INPUT_TEXT);
                fullString = `${DEFAULT_INPUT_TEXT}${SEPARATOR}${defaultHash}`;
                verifyInput.value = fullString;
                console.log("Using default verification string:", fullString);
            } catch (error) {
                verificationResult.textContent = `设置默认验证字符串时出错 (Error setting default verification string): ${error.message}`;
                verificationResult.className = 'error';
                return;
            }
        } else {
             verifyInput.value = fullString;
        }

        const separatorIndex = fullString.lastIndexOf(SEPARATOR);

        if (separatorIndex === -1) {
            verificationResult.textContent = `验证失败：未找到分隔符 "${SEPARATOR}"。请检查格式。(Verification Failed: Separator "${SEPARATOR}" not found. Check format.)`;
            verificationResult.className = 'error';
            return;
        }

        const extractedText = fullString.substring(0, separatorIndex);
        const storedHash = fullString.substring(separatorIndex + SEPARATOR.length);

        if (storedHash.length !== 64) {
             verificationResult.textContent = `验证警告：提取的哈希长度 (${storedHash.length}) 不是预期的 64 位，但仍将尝试验证。(Warning: Extracted hash length (${storedHash.length}) is not the expected 64. Verification will proceed.)`;
             verificationResult.className = 'info';
        }

        try {
            const recalculatedHash = await calculateSHA256(extractedText);

            if (recalculatedHash.toLowerCase() === storedHash.toLowerCase()) {
                verificationResult.textContent = '✅ 验证成功：文本内容完整，未被修改。(Verification Successful: Text is intact.)';
                verificationResult.className = 'success';
            } else {
                verificationResult.textContent = '❌ 验证失败：文本内容已被修改或哈希值不匹配。(Verification Failed: Text has been modified or hash mismatch.)';
                verificationResult.className = 'error';
                console.warn("Verification failure details:", {
                    "Extracted Text": extractedText,
                    "Stored Hash": storedHash,
                    "Recalculated Hash": recalculatedHash
                });
            }
        } catch (error) {
            verificationResult.textContent = `验证错误 (Verification error during recalculation): ${error.message}`;
            verificationResult.className = 'error';
        }
    });


    // --- Event Listener for Copy Button ---
    copyButton.addEventListener('click', () => {
        const textToCopy = generatedOutput.value;

        // Check if there's text to copy and if clipboard API is available
        if (!textToCopy || !navigator.clipboard) {
            console.warn("Nothing to copy or Clipboard API not supported.");
            alert("没有可复制的内容或浏览器不支持剪贴板 API。(Nothing to copy or Clipboard API not supported.)");
            return;
        }

        // Use the Clipboard API to write text
        navigator.clipboard.writeText(textToCopy).then(() => {
            // --- Success feedback ---
            const originalText = copyButton.textContent; // Store original button text
            copyButton.textContent = '已复制!'; // Change text to "Copied!"
            copyButton.disabled = true; // Temporarily disable button

            // Set a timeout to revert the button state after 2 seconds
            setTimeout(() => {
                copyButton.textContent = originalText; // Revert to original text (e.g., "复制")
                copyButton.disabled = false; // Re-enable the button
            }, 2000); // 2000 milliseconds = 2 seconds

        }).catch(err => {
            // --- Error handling ---
            console.error('无法复制文本 (Could not copy text): ', err);
            alert('无法自动复制文本。请手动选择并复制。(Could not copy text automatically. Please select and copy manually.)'); // Inform user
        });
    });

}); // End of DOMContentLoaded event listener