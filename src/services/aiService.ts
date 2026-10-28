import { AiRootCauseResult, ComplaintTicket, CoaBatchRecord } from '../types/tpu';

export interface BatchRiskPrediction {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: string[];
  recommendedAction: string;
  predictedTensileMPa: string;
  predictedElongationPercent: number;
  evaluatedAt: string;
}

export async function analyzeRootCause(ticket: ComplaintTicket, coa?: CoaBatchRecord): Promise<AiRootCauseResult> {
  const payload = {
    lotNo: ticket.lotNo,
    grade: ticket.productGrade,
    clientTensile: ticket.clientTestingData.tensileStrength,
    coaTensile: coa?.coaProperties.tensileStrength,
    clientElongation: ticket.clientTestingData.elongationAtBreak,
    coaElongation: coa?.coaProperties.elongationAtBreak,
    dryingTemp: ticket.clientProcessConditions.dryingTemp,
    dryingHours: ticket.clientProcessConditions.dryingHours,
    dewPoint: ticket.clientProcessConditions.dewPoint,
    meltTemp: ticket.clientProcessConditions.meteringTemp,
    moisturePpm: ticket.clientTestingData.moistureMeasuredPpm || 400,
    defectDesc: ticket.defectDescription,
    processType: '射出成型 / ASTM D412 拉伸測試',
  };

  try {
    const res = await fetch('/api/ai/root-cause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        return {
          ...data.data,
          source: data.source,
          analyzedAt: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('API call failed, fallback to local polymer rule engine:', err);
  }

  // Client-side Polymer Science Engine Fallback
  const { dryingTemp, dryingHours, dewPoint } = ticket.clientProcessConditions;
  const isDryingInsufficient = dryingTemp < 100 || dryingHours < 3.5 || dewPoint > -25;
  const tensileGap = coa ? coa.coaProperties.tensileStrength - ticket.clientTestingData.tensileStrength : 12;

  let primaryCause = '客戶端原料烘乾不完全導致氨基甲酸酯基團 (Urethane Bond) 高溫水解';
  let confidence = 88;
  let attribution = '客戶端加工條件不當';
  let mechanism = `TPU 聚酯基團易吸濕。客戶端設定烘烤條件為 ${dryingTemp}°C / ${dryingHours} 小時（露點 ${dewPoint}°C），未達建議之 100~110°C / 4 小時 / 露點 ≤-30°C。殘留水分高於 200 ppm 在射出成型時催化水解反應，導致分子量下降、斷裂伸長率驟降。`;

  if (!isDryingInsufficient && tensileGap > 10) {
    primaryCause = '原料聚合階段異氰酸酯計量比微幅偏移或分子量分佈 (PDI) 異常';
    confidence = 76;
    attribution = '原料批次瑕疵 (建議實驗室複驗留樣)';
    mechanism = '客戶端加工條件符合標準規範，但實測拉伸強度出現明顯系統性偏低。可能成因為反應釜聚合階段異氰酸酯/多元醇比例控制偏差，致使硬段結晶域形成不良。';
  }

  return {
    primaryCause,
    confidenceScore: confidence,
    attribution,
    mechanismAnalysis: mechanism,
    rootCauseRankings: [
      {
        rank: 1,
        cause: primaryCause,
        probability: confidence,
        description: mechanism,
      },
      {
        rank: 2,
        cause: '啞鈴狀試片沖切邊緣存在微裂紋 (ASTM D412 試驗機治具應力集中)',
        probability: 54,
        description: '試片沖切刀具鈍化產生微觀鋸齒痕，在高速拉伸 (500mm/min) 時提早擴展斷裂。',
      },
      {
        rank: 3,
        cause: '未經退火處理，成型殘留熱應力引發脆裂',
        probability: 42,
        description: 'TPU 注塑後結晶結構需經 20 小時以上退火或常溫調濕，方能達到最佳物性。',
      },
    ],
    recommendedActions: [
      {
        phase: '現場即時改善',
        action: '改採蜂巢除濕乾燥機於 105°C 烘烤 4 小時以上（露點 ≤ -30°C），並在射出機進料斗加裝保溫除濕罩。',
      },
      {
        phase: '實驗室標準複驗',
        action: '將原廠留樣粒料送交品管實驗室，依 ASTM D412 標準裁切並於 23°C/50%RH 調濕 24 小時後對比複拉。',
      },
      {
        phase: '三方責任簽核',
        action: '召集品管、研發與業務窗口召開對焦會議，依據數據報告進行責任判定與後續派駐處置。',
      },
    ],
    source: 'expert-polymer-engine',
    analyzedAt: new Date().toISOString(),
  };
}

export async function predictBatchRisk(params: {
  reactorTempVariance: number;
  vacuumDehydrationRate: number;
  viscosityDeviation: number;
  moisturePpm: number;
  batchVolumeKg?: number;
}): Promise<BatchRiskPrediction> {
  try {
    const res = await fetch('/api/ai/predict-batch-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Risk prediction API failed, using client model:', err);
  }

  // Client formula
  let riskScore = 15;
  const factors: string[] = [];

  if (params.reactorTempVariance > 3.0) {
    riskScore += 30;
    factors.push(`反應釜聚合溫度波動達 ±${params.reactorTempVariance}°C`);
  }
  if (params.vacuumDehydrationRate < 95) {
    riskScore += 32;
    factors.push(`真空脫水率僅 ${params.vacuumDehydrationRate}%（未達 98%）`);
  }
  if (Math.abs(params.viscosityDeviation) > 10) {
    riskScore += 22;
    factors.push(`熔融黏度偏差 ${params.viscosityDeviation}%`);
  }
  if (params.moisturePpm > 200) {
    riskScore += 18;
    factors.push(`出料水分含量 ${params.moisturePpm} ppm 偏高`);
  }

  riskScore = Math.min(99, Math.max(5, riskScore));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let recommendedAction = '批次聚合與物性參數優良，准予常規包裝發貨。';
  if (riskScore >= 65) {
    riskLevel = 'HIGH';
    recommendedAction = '【出廠前預警攔截】預測拉伸不合格風險高，強制留置檢驗！';
  } else if (riskScore >= 35) {
    riskLevel = 'MEDIUM';
    recommendedAction = '【警示監控】參數微幅飄移，出廠前加抽樣品複驗水分與拉伸。';
  }

  return {
    riskScore,
    riskLevel,
    factors,
    recommendedAction,
    predictedTensileMPa: (43.0 - riskScore * 0.17).toFixed(1),
    predictedElongationPercent: Math.round(570 - riskScore * 2.4),
    evaluatedAt: new Date().toISOString(),
  };
}
