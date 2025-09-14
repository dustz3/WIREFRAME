# TailorMed - Professional Cold Chain Logistics Wireframe

一個專業的冷鏈物流公司首頁線框圖，採用 Biocair 風格的清潔臨床設計。

## 專案概述

TailorMed 是一個為生物技術、臨床試驗和製藥行業提供溫度敏感物流服務的專業公司。此線框圖展示了現代化的首頁設計，強調可靠性、合規性和專業性。

## 設計特色

- **清潔臨床風格**：採用 Biocair 風格的簡潔設計
- **專業色彩方案**：藍灰色調搭配大量留白
- **響應式設計**：支援各種設備尺寸
- **無襯線字體**：使用 Inter 字體確保可讀性
- **信任感設計**：強調合規性和專業性

## 技術架構

- **模板引擎**：Pug
- **樣式預處理器**：Stylus
- **字體**：Inter (Google Fonts)
- **圖標**：SVG 內嵌圖標
- **響應式**：CSS Grid 和 Flexbox

## 專案結構

```
Website_Wireframe/
├── src/
│   ├── templates/
│   │   └── index.pug          # 首頁模板
│   └── styles/
│       └── main.styl          # 主要樣式文件
├── dist/
│   ├── index.html             # 編譯後的 HTML
│   └── css/
│       └── main.css           # 編譯後的 CSS
├── package.json               # 專案配置
└── README.md                  # 專案說明
```

## 頁面結構

### 1. Header
- Logo（左對齊）
- 導航選單：Home, Solutions, Expertise, Compliance, About, Contact
- CTA 按鈕：Request a Quote

### 2. Hero Section
- 大型視覺元素（科學/運輸主題）
- 主標題：「Your Trusted Partner in Precision Cold Chain Logistics」
- 副標題：描述公司服務
- CTA 按鈕：Request Consultation

### 3. Key Services Section
- 標題：「What We Deliver」
- 6 個服務卡片網格：
  - Cell & Gene Therapy
  - Bio-Sample Transport
  - Clinical Trial Logistics
  - Pharmaceutical Distribution
  - Vaccine Handling
  - Global Freight Support

### 4. Compliance & Trust Section
- 雙欄佈局
- 左側：認證列表（GDP, GxP, ISO）
- 右側：合規性說明

### 5. Process Overview Section
- 5 步驟流程：
  - Inquiry → Planning → Packaging → Delivery → Monitoring

### 6. Why Choose Us Section
- 4 個特色區塊：
  - 24/7 Global Support
  - Real-time Temperature Monitoring
  - Custom SOP & Risk Management
  - Proven Track Record

### 7. Contact & CTA Section
- 聯絡表單
- CTA：Book a Free Consultation

### 8. Footer
- 導航連結
- 認證標誌
- 聯絡資訊
- 電子報訂閱

## 開發指令

### 安裝依賴
```bash
npm install
```

### 編譯模板和樣式
```bash
npm run build
```

### 編譯 Pug 模板
```bash
npm run compile
```

### 編譯 Stylus 樣式
```bash
npm run stylus
```

### 監聽檔案變化
```bash
npm run dev
```

## 設計原則

1. **清潔性**：大量留白，簡潔的視覺層次
2. **專業性**：使用專業術語和合規性標誌
3. **信任感**：強調認證和專業經驗
4. **可讀性**：清晰的字體和對比度
5. **響應式**：適配各種設備尺寸

## 色彩方案

- **主色調**：#2563EB (藍色)
- **次要色調**：#64748B (灰色)
- **背景色**：#F8FAFC (淺灰)
- **文字色**：#1E293B (深灰)
- **邊框色**：#E2E8F0 (中灰)

## 字體

- **主要字體**：Inter (300, 400, 500, 600, 700)
- **備用字體**：-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

## 瀏覽器支援

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 授權

MIT License

## 聯絡資訊

- 公司：TailorMed
- 地址：123 Logistics Drive, Cold Chain Center, New York, NY 10001
- 電話：+1 (555) 123-4567
- 電子郵件：info@tailormed.com
