
// i18next initialization
i18next.init({
    lng: navigator.language.startsWith('ja') ? 'ja' : 'en',
    fallbackLng: 'en',
    resources: {
        ja: {
            translation: {
                pageTitle: 'Mapbox Classic スタイル生成',
                mainTitle: 'Mapbox Classic スタイル生成',
                mainDesc: 'トークンを入力し、スタイルを選んでください。Mapbox Classic スタイル用の「JSONファイル取得のためのURL」を生成します。',
                tokenLabel: 'トークン（TOKEN）',
                styleLabel: '地図タイル（クラシック・スタイル）',
                styleSelect: 'スタイルを選択してください',
                previewLabel: 'スタイル プレビュー',
                generateBtn: 'URL を生成',
                urlLabel: '生成された URL',
                downloadBtnLabel: 'JSON をダウンロード',
                linksTitle: '関連リンク',
                linkClassicStyles: 'クラシック・スタイルの紹介',
                linkAccessTokens: 'トークンの取得ページ',
                csvLoadError: 'CSV を読み込めませんでした。',
                tokenAndStyleRequired: 'トークンとスタイルを入力してください。',
                previewLoadError: 'プレビュー画像を読み込めませんでした。',
                generateUrlFirst: '先に URL を生成してください。',
                downloading: 'ダウンロード中...',
                jsonDownloadSuccess: 'JSON をダウンロードしました。',
                jsonDownloadError: 'JSON の取得に失敗しました',
                previewAlt: 'のプレビュー'
            }
        },
        en: {
            translation: {
                pageTitle: 'Mapbox Classic Style Generator',
                mainTitle: 'Mapbox Classic Style Generator',
                mainDesc: 'Enter your token and select a style. This tool generates a URL for retrieving the JSON file for Mapbox Classic styles.',
                tokenLabel: 'Token (TOKEN)',
                styleLabel: 'Map Tile (Classic Style)',
                styleSelect: 'Select a style',
                previewLabel: 'Style Preview',
                generateBtn: 'Generate URL',
                urlLabel: 'Generated URL',
                downloadBtnLabel: 'Download JSON',
                linksTitle: 'Related Links',
                linkClassicStyles: 'Introduction to Classic Styles',
                linkAccessTokens: 'Get Access Tokens',
                csvLoadError: 'Failed to load CSV.',
                tokenAndStyleRequired: 'Please enter a token and select a style.',
                previewLoadError: 'Failed to load preview image.',
                generateUrlFirst: 'Please generate a URL first.',
                downloading: 'Downloading...',
                jsonDownloadSuccess: 'JSON downloaded successfully.',
                jsonDownloadError: 'Failed to retrieve JSON',
                previewAlt: ' preview'
            }
        }
    }
}, function() {
    initializeUI();
});

function initializeUI() {
    document.getElementById('pageTitle').textContent = i18next.t('pageTitle');
    document.getElementById('mainTitle').textContent = i18next.t('mainTitle');
    document.getElementById('mainDesc').textContent = i18next.t('mainDesc');
    document.getElementById('tokenLabel').textContent = i18next.t('tokenLabel');
    document.getElementById('styleLabel').textContent = i18next.t('styleLabel');
    document.getElementById('styleSelect').textContent = i18next.t('styleSelect');
    document.getElementById('previewLabel').textContent = i18next.t('previewLabel');
    document.getElementById('generateBtn').textContent = i18next.t('generateBtn');
    document.getElementById('urlLabel').textContent = i18next.t('urlLabel');
    document.getElementById('download-btn').textContent = i18next.t('downloadBtnLabel');
    document.getElementById('linksTitle').textContent = i18next.t('linksTitle');
    document.getElementById('linkClassicStyles').textContent = i18next.t('linkClassicStyles');
    document.getElementById('linkAccessTokens').textContent = i18next.t('linkAccessTokens');
}

const styleSelect = document.getElementById("style");
const form = document.getElementById("generator-form");
const message = document.getElementById("message");
const resultSection = document.getElementById("result-section");
const generatedUrlElem = document.getElementById("generated-url");
const downloadBtn = document.getElementById("download-btn");
const previewWrapper = document.getElementById("preview-wrapper");
const previewImg = document.getElementById("style-preview");
const previewBasePath = "style-previews";

async function loadStyles() {
    try {
        const response = await fetch("styles.csv");
        if (!response.ok) {
            throw new Error(i18next.t('csvLoadError'));
        }
        const csvText = await response.text();
        populateStyles(csvText);
    } catch (error) {
        message.textContent = error.message;
        message.style.color = "#c62828";
    }
}

function populateStyles(csvText) {
    const rows = csvText
        .trim()
        .split(/\r?\n/)
        .slice(1);

    rows.forEach((row) => {
        const [name, slug] = row.split(",");
        if (!name || !slug) {
            return;
        }
        const option = document.createElement("option");
        option.value = slug.trim();
        option.textContent = name.trim();
        styleSelect.appendChild(option);
    });
}

function updatePreview(slug) {
    if (!slug) {
        previewWrapper.hidden = true;
        previewImg.removeAttribute("src");
        previewImg.alt = "";
        return;
    }
    const selectedOption = styleSelect.options[styleSelect.selectedIndex];
    const name = selectedOption ? selectedOption.textContent.trim() : "";
    const imageSrc = `${previewBasePath}/${slug}.png`;
    previewImg.src = imageSrc;
    previewImg.alt = `${name}${i18next.t('previewAlt')}`;
    previewWrapper.hidden = false;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";
    message.style.color = "#c62828";
    downloadBtn.disabled = true;

    const token = form.token.value.trim();
    const slug = styleSelect.value.trim();
    updatePreview(slug);

    if (!token || !slug) {
        message.textContent = i18next.t('tokenAndStyleRequired');
        message.style.color = "#c62828";
        resultSection.hidden = true;
        downloadBtn.disabled = true;
        return;
    }

    const url = `https://api.mapbox.com/styles/v1/mapbox/${slug}?access_token=${encodeURIComponent(
        token
    )}`;

    generatedUrlElem.textContent = url;
    resultSection.hidden = false;
    downloadBtn.disabled = false;
});

styleSelect.addEventListener("change", (event) => {
    const slug = event.target.value.trim();
    message.textContent = "";
    message.style.color = "#c62828";
    resultSection.hidden = true;
    downloadBtn.disabled = true;
    generatedUrlElem.textContent = "";
    updatePreview(slug);
});

previewImg.addEventListener("error", () => {
    previewWrapper.hidden = true;
    message.textContent = i18next.t('previewLoadError');
    message.style.color = "#c62828";
});

downloadBtn.addEventListener("click", async () => {
    const url = generatedUrlElem.textContent.trim();
    if (!url) {
        message.textContent = i18next.t('generateUrlFirst');
        message.style.color = "#c62828";
        return;
    }

    downloadBtn.disabled = true;
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = i18next.t('downloading');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `${i18next.t('jsonDownloadError')} (HTTP ${response.status}).`
            );
        }

        const jsonData = await response.json();
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const objectUrl = URL.createObjectURL(blob);
        const filename = `${styleSelect.value || "style"}.json`;
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(objectUrl);

        message.textContent = i18next.t('jsonDownloadSuccess');
        message.style.color = "#2e7d32";
        setTimeout(() => {
            message.textContent = "";
            message.style.color = "#c62828";
        }, 2000);
    } catch (error) {
        console.error(error);
        message.textContent = error.message;
        message.style.color = "#c62828";
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalText;
    }
});

loadStyles();
