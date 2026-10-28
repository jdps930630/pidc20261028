import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required headers
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini client initialization failed, falling back to rule engine:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Root Cause Recommendation Engine (Module 4)
app.post('/api/ai/root-cause', async (req: Request, res: Response) => {
  try {
    const {
      lotNo,
      grade,
      clientTensile,
      coaTensile,
      clientElongation,
      coaElongation,
      dryingTemp,
      dryingHours,
      dewPoint,
      meltTemp,
      moisturePpm,
      defectDesc,
      processType,
    } = req.body;

    const tensileDiff = coaTensile && clientTensile ? Number(coaTensile) - Number(clientTensile) : null;
    const elongationDiff = coaElongation && clientElongation ? Number(coaElongation) - Number(clientElongation) : null;

    // If Gemini API is available, generate expert polymer analysis
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
你是一位專精於熱塑性聚胺酯（TPU）高分子材料加工與品管的資深材料研發專家 (Polymer R&D Specialist)。
請針對客戶反映的「TPU塑膠原料拉伸不足/斷裂」客訴事件進行深度機理分析與根本原因推薦。

客訴與數據輸入：
- 批號 (Lot No.): ${lotNo || '未提供'}
- TPU 規格/硬度: ${grade || 'TPU 85A'}
- 加工方式: ${processType || '射出成型 Injection Molding'}
- 不良現象描述: ${defectDesc || '拉伸強度未達標，延伸率不足斷裂'}
- 出廠 COA 拉伸強度: ${coaTensile || 42} MPa, 客戶實測: ${clientTensile || 28} MPa (差距: ${tensileDiff || 14} MPa)
- 出廠 COA 斷裂伸長率: ${coaElongation || 550} %, 客戶實測: ${clientElongation || 360} % (差距: ${elongationDiff || 190} %)
- 客戶烘料條件: ${dryingTemp || 80}°C, 烘乾時間: ${dryingHours || 2} 小時, 露點 (Dew Point): ${dewPoint || -10}°C
- 加工熔膠溫度: ${meltTemp || 195}°C
- 殘留水分 (Moisture Content): ${moisturePpm || 450} ppm (標準要求通常 < 200 ppm)

標準 TPU 物理化學機理考量：
1. TPU 氨基甲酸酯基團 (-NH-COO-) 在高溫受潮時極易水解，導致主鏈斷裂、分子量 (Mw) 急劇下降，造成脆化與拉伸延伸率雪崩。
2. 烘乾標準應為 100~110°C / 3~4 小時，除濕露點建議低於 -30°C。
3. 剪切過熱或熔融溫度過高會導致分子鏈熱降解與黃化。
4. 原料出廠端若異氰酸酯 (MDI) 與多元醇 (Polyol) 計量偏離或 PDI 過廣，亦可能造成本體拉伸強度不足。

請以繁體中文輸出結構化 JSON，遵循以下格式（切勿包含任何 markdown 代碼框以外的雜質）：
{
  "primaryCause": "主要成因名稱（如：吸濕水解導致高分子鏈降解斷裂、低溫烘烤水分殘留、螺桿剪切過熱熱分解、出廠分子量偏低原料批次瑕疵 等）",
  "confidenceScore": 88,
  "attribution": "客戶端加工條件不當 / 原料瑕疵 / 共同複合因素 / 檢測條件偏差",
  "mechanismAnalysis": "深入化學與分子量機理解釋，說明為何拉伸與伸長率衰退",
  "rootCauseRankings": [
    {
      "rank": 1,
      "cause": "原因標題",
      "probability": 85,
      "description": "成因依據與機理解析"
    },
    {
      "rank": 2,
      "cause": "原因標題",
      "probability": 45,
      "description": "次要可能因素"
    }
  ],
  "recommendedActions": [
    {
      "phase": "短期處置 / 現場對策",
      "action": "具體操作指引（如立即停線、以除濕乾燥機105°C除濕4小時，露點確保<-30°C）"
    },
    {
      "phase": "中期實驗室驗證",
      "action": "留樣送 GPC 測定分子量重均分子量 Mw 與分子量分佈 PDI，進行卡爾費休水分測定"
    },
    {
      "phase": "長期預防對策",
      "action": "客戶端進料驗收增加水分儀快檢，原料出廠強化真空除水包裝鋁箔袋密封監控"
    }
  ],
  "disclaimer": "本分析為 AI 智慧輔助初判，依據系統規範，最終責任歸屬與補換貨決策必須經由品管主管、研發與業務人工簽核生效。"
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, source: 'gemini-3.8-flash', data: parsed });
        }
      } catch (geminiError) {
        console.warn('Gemini generateContent encountered error, using rule-based fallback:', geminiError);
      }
    }

    // Rule-based Polymer Science Fallback Algorithm
    const isUnderDried = (Number(dryingTemp) < 100 || Number(dryingHours) < 3.5 || Number(dewPoint) > -25);
    const hasHighMoisture = Number(moisturePpm) > 250;
    const isMeltOverheated = Number(meltTemp) > 215;
    const isSevereTensileDrop = tensileDiff !== null && tensileDiff > 10;

    let primaryCause = '客戶烘料不足導致 TPU 氨基甲酸酯鍵水解降解 (Hydrolytic Degradation)';
    let confidenceScore = 85;
    let attribution = '客戶端加工條件不當';
    let mechanismAnalysis = `TPU 具備高吸濕性特性，檢視目前客戶端烘乾溫度僅 ${dryingTemp || 80}°C（建議值 ≥100°C），乾燥時間 ${dryingHours || 2} 小時（建議 ≥4 小時），殘留水氣在加工機筒高溫下引發水解反應，破壞高分子胺基甲酸酯基團，重均分子量 Mw 顯著下降，直接反映在斷裂伸長率下降與拉伸強度驟降。`;

    if (!isUnderDried && !hasHighMoisture && isSevereTensileDrop) {
      primaryCause = '原料合成反應計量偏離或多元醇分子量分佈 (PDI) 異常';
      confidenceScore = 78;
      attribution = '原料瑕疵 (需留樣複驗審批)';
      mechanismAnalysis = '客戶端加工與烘乾條件均符合 TPU 標準規範（除濕烘料 ≥100°C 達 4 小時以上），但實測強度明顯低於出廠 COA。可能成因為反應釜聚合階段異氰酸酯指數 (NCO/OH Ratio) 波動或催化劑局部失活，導致軟硬段微相分離不完全。';
    } else if (isMeltOverheated) {
      primaryCause = '螺桿剪切過度與熔膠溫度過高造成熱氧降解';
      confidenceScore = 82;
      attribution = '客戶端加工條件不當';
      mechanismAnalysis = `加工溫度達到 ${meltTemp}°C，超過該硬度規格之熱穩定上限（205°C），在熔融段產生熱剪切裂解，導致黃化指數上升與分子鏈斷裂，韌性與抗拉伸能力喪失。`;
    }

    return res.json({
      success: true,
      source: 'expert-polymer-engine',
      data: {
        primaryCause,
        confidenceScore,
        attribution,
        mechanismAnalysis,
        rootCauseRankings: [
          {
            rank: 1,
            cause: primaryCause,
            probability: confidenceScore,
            description: mechanismAnalysis,
          },
          {
            rank: 2,
            cause: '試片注塑退火不全或裁切毛邊應力集中 (ASTM D412 測試誤差)',
            probability: 52,
            description: '啞鈴狀試片沖切時刀模鈍化產生微裂紋，拉伸測試時由微裂紋快速延伸導致假性拉伸不足。',
          },
          {
            rank: 3,
            cause: '再生回收料摻混比例偏高或二次降解',
            probability: 38,
            description: '混入水口回料造成熱歷史累積，影響分子鏈結晶度。',
          },
        ],
        recommendedActions: [
          {
            phase: '緊急現場對策',
            action: '立即改用蜂巢式除濕乾燥機，設定溫度 100~105°C 烘料至少 4 小時，確保露點 ≤ -30°C，料斗殘留水分控制在 0.02% (200 ppm) 以下。',
          },
          {
            phase: '實驗室比對驗證',
            action: '調取原廠同批次留樣進行 GPC 分子量分佈比對，並以原廠標準模具注塑退火試片進行 ASTM D412 拉伸對比複驗。',
          },
          {
            phase: '跨部門協調與責任簽核',
            action: '提供標準化 TPU 工藝核對表交由業務窗口向客戶技術對焦，並召開品管、研發主管審批會議手動確認補換貨或技術派駐。',
          },
        ],
        disclaimer: '本分析為 AI 智慧輔助初判，依據系統規範，最終責任歸屬與補換貨決策必須經由品管主管、研發與業務人工簽核生效。',
      },
    });
  } catch (error: any) {
    console.error('Error in root-cause API:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Pre-shipment batch risk prediction (Module 4)
app.post('/api/ai/predict-batch-risk', (req: Request, res: Response) => {
  const {
    reactorTempVariance,
    vacuumDehydrationRate,
    viscosityDeviation,
    moisturePpm,
    batchVolumeKg,
  } = req.body;

  // Scientific calculation of risk score (0 - 100)
  let riskScore = 12; // baseline nominal
  const factors: string[] = [];

  const tempVar = Number(reactorTempVariance) || 0;
  if (tempVar > 3.5) {
    riskScore += 28;
    factors.push(`聚合釜溫度波動達 ±${tempVar}°C (警戒值 > 3°C)，恐造成低分子量寡聚物生成`);
  } else if (tempVar > 2.0) {
    riskScore += 12;
    factors.push(`聚合釜溫度微幅波動 (±${tempVar}°C)`);
  }

  const vacRate = Number(vacuumDehydrationRate) || 98;
  if (vacRate < 94) {
    riskScore += 35;
    factors.push(`真空脫水率僅 ${vacRate}% (標準 ≥98%)，殘留水分恐使異氰酸酯副反應增高`);
  } else if (vacRate < 97) {
    riskScore += 15;
    factors.push(`真空脫水率微幅偏低 (${vacRate}%)`);
  }

  const viscDev = Math.abs(Number(viscosityDeviation) || 0);
  if (viscDev > 12) {
    riskScore += 25;
    factors.push(`聚合熔融黏度偏差達 ${viscDev}% (標準 ≤8%)，分子量分佈發散`);
  }

  const moisture = Number(moisturePpm) || 120;
  if (moisture > 200) {
    riskScore += 20;
    factors.push(`封裝前水分含量 ${moisture} ppm 超標 (標準 ≤150 ppm)`);
  }

  riskScore = Math.min(99, Math.max(5, riskScore));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let recommendedAction = '批次物性正常，符合出廠標準，准予常規包裝發貨。';

  if (riskScore >= 65) {
    riskLevel = 'HIGH';
    recommendedAction = '【攔截警報】預測拉伸斷裂強度存在高度不合格風險！建議暫停自動出貨，強制抽檢 5 組留樣進行 ASTM D412 拉力拉伸與 GPC 檢測。';
  } else if (riskScore >= 35) {
    riskLevel = 'MEDIUM';
    recommendedAction = '【預警提示】部分反應參數出現輕微離散，建議增加包裝前二次水分快檢，並在出廠檢驗報告 (COA) 標註建議烘乾標準。';
  }

  return res.json({
    success: true,
    riskScore,
    riskLevel,
    factors,
    recommendedAction,
    predictedTensileMPa: (43.5 - (riskScore * 0.18)).toFixed(1),
    predictedElongationPercent: Math.round(580 - (riskScore * 2.5)),
    evaluatedAt: new Date().toISOString(),
  });
});

async function startServer() {
  // In dev mode, mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TPU Platform] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
