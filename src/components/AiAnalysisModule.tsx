import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Cpu, 
  RefreshCw, 
  Sliders, 
  HelpCircle,
  FileText,
  Activity
} from 'lucide-react';
import { ComplaintTicket, CoaBatchRecord, AiRootCauseResult } from '../types/tpu';
import { analyzeRootCause, predictBatchRisk, BatchRiskPrediction } from '../services/aiService';

interface AiAnalysisModuleProps {
  ticket: ComplaintTicket;
  coaBatch?: CoaBatchRecord;
  onUpdateAiResult: (result: AiRootCauseResult) => void;
  onProceedToSignOff: () => void;
}

export const AiAnalysisModule: React.FC<AiAnalysisModuleProps> = ({
  ticket,
  coaBatch,
  onUpdateAiResult,
  onProceedToSignOff,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAiResult, setCurrentAiResult] = useState<AiRootCauseResult | undefined>(
    ticket.aiAnalysis
  );

  // Pre-shipment batch risk predictor state
  const [reactorTempVar, setReactorTempVar] = useState<number>(coaBatch?.reactorTempVariance || 1.2);
  const [vacuumRate, setVacuumRate] = useState<number>(coaBatch?.vacuumDehydrationRate || 98.4);
  const [viscosityDev, setViscosityDev] = useState<number>(coaBatch?.viscosityDeviation || 3.8);
  const [moisturePpm, setMoisturePpm] = useState<number>(coaBatch?.productionMoisturePpm || 110);
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<BatchRiskPrediction | null>(null);

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeRootCause(ticket, coaBatch);
      setCurrentAiResult(result);
      onUpdateAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunPreShipmentPrediction = async () => {
    setIsPredicting(true);
    try {
      const pred = await predictBatchRisk({
        reactorTempVariance: reactorTempVar,
        vacuumDehydrationRate: vacuumRate,
        viscosityDeviation: viscosityDev,
        moisturePpm: moisturePpm,
      });
      setPrediction(pred);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>模組四</span>
              <span aria-hidden="true">·</span>
              <span>AI 智慧輔助分析與出廠前風險預警 (AI-Powered Root Cause & Prediction)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              TPU 拉伸異常成因推薦引擎與出廠品質預警
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              整合高分子材料水解動力學、聚合製程離散特徵與歷史客訴資料庫，進行跨維度成因初判
            </p>
          </div>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? '模型深度推理中...' : '重新執行 AI 成因推薦'}</span>
          </button>
        </div>
      </div>

      {/* Human In the Loop Strict Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold block text-amber-950">
            規格規範：AI 輔助邊界與人工確認原則 (Human-in-the-Loop)
          </strong>
          <p className="text-amber-800 leading-relaxed">
            系統與 AI 模型僅提供數據關聯比對、成因機理推薦與出廠前風險預估。
            最終的<strong>「責任歸屬判定」</strong>（原料瑕疵 vs. 客戶端操作不當）、<strong>「補換貨折讓決策」</strong>以及<strong>「現場技術支援派駐」</strong>，
            必須由品管主管、研發與業務窗口於後續「責任簽核模組」共同手動簽核，方具執行效力。
          </p>
        </div>
      </div>

      {/* Part 1: Root Cause Recommendation Engine Result */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              1. 客訴成因推薦引擎輸出 (Root Cause Engine)
            </h3>
          </div>
          {currentAiResult?.source && (
            <span className="text-[11px] text-slate-500 font-mono">
              推理模型：{currentAiResult.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Polymer Science Expert Engine'}
            </span>
          )}
        </div>

        {currentAiResult ? (
          <div className="space-y-5">
            
            {/* Primary Recommendation Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium">首選判定成因</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    初步責任傾向：<strong className="text-slate-900">{currentAiResult.attribution}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    信心指數：<strong className="text-indigo-600 font-mono font-bold">{currentAiResult.confidenceScore}%</strong>
                  </span>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {currentAiResult.primaryCause}
              </h4>

              {/* Chemical Mechanism Prose */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed space-y-1.5">
                <span className="font-semibold text-slate-900 block">高分子化學機理解析：</span>
                <p>{currentAiResult.mechanismAnalysis}</p>
              </div>
            </div>

            {/* Root Cause Rankings */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                成因機率排行榜 (Root Cause Rankings)
              </span>

              <div className="space-y-2">
                {currentAiResult.rootCauseRankings.map((item) => (
                  <div
                    key={item.rank}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {item.rank}
                        </span>
                        <strong className="text-slate-900">{item.cause}</strong>
                      </div>
                      <p className="text-slate-600 text-[11px] pl-7 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-slate-400 text-[11px] block">匹配概率</span>
                      <strong className="font-mono font-bold text-indigo-700 text-sm">
                        {item.probability}%
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Countermeasures */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                建議處置對策 (Engineering Action Plan)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentAiResult.recommendedActions.map((act, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-800 block">
                      {act.phase}
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {act.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Transfer to Sign-off */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onProceedToSignOff}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                <span>將成因分析呈報「責任歸屬簽核會議」</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs space-y-3">
            <p>點擊上方「重新執行 AI 成因推薦」按鈕，立即計算客訴根因機率</p>
            <button
              onClick={handleRunAiAnalysis}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              啟動初次分析
            </button>
          </div>
        )}
      </div>

      {/* Part 2: Pre-shipment Batch Risk Predictor */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              2. 出廠前物性預警模型 (Pre-Shipment Risk Predictor)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            基於聚合反應釜在線傳感器數據預防客訴
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          在產品裝袋出廠前，透過聚合反應釜溫度震盪 (±°C)、真空脫水率 (%)、熔融黏度偏差 (%) 與含水量預測該批次之拉伸強度與延伸率表現，於發貨前主動攔截潛在異常批次。
        </p>

        {/* Interactive Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">反應釜溫差波動</span>
              <strong className="font-mono text-slate-900">±{reactorTempVar} °C</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={reactorTempVar}
              onChange={(e) => setReactorTempVar(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">標準: ≤ 1.5°C</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">真空脫水效率</span>
              <strong className="font-mono text-slate-900">{vacuumRate} %</strong>
            </div>
            <input
              type="range"
              min="90"
              max="100"
              step="0.5"
              value={vacuumRate}
              onChange={(e) => setVacuumRate(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">標準: ≥ 98%</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">熔融黏度偏差</span>
              <strong className="font-mono text-slate-900">{viscosityDev} %</strong>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={viscosityDev}
              onChange={(e) => setViscosityDev(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">標準: ±5% 內</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">包裝水分含量</span>
              <strong className="font-mono text-slate-900">{moisturePpm} ppm</strong>
            </div>
            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={moisturePpm}
              onChange={(e) => setMoisturePpm(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">標準: &lt; 150 ppm</span>
          </div>

        </div>

        {/* Prediction Trigger & Output Display */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={handleRunPreShipmentPrediction}
            disabled={isPredicting}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            {isPredicting ? '計算出廠風險指標中...' : '評估本批次出廠風險評分'}
          </button>

          {prediction && (
            <span className="text-xs text-slate-500">
              評估時間: {new Date(prediction.evaluatedAt).toLocaleTimeString('zh-TW')}
            </span>
          )}
        </div>

        {prediction && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">出廠前品質風險評分：</span>
                <span className={`text-lg font-bold font-mono ${
                  prediction.riskLevel === 'LOW' ? 'text-emerald-700' : prediction.riskLevel === 'MEDIUM' ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {prediction.riskScore} / 100 ({prediction.riskLevel})
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span>預估拉伸強度: <strong className="text-slate-900">{prediction.predictedTensileMPa} MPa</strong></span>
                <span>預估伸長率: <strong className="text-slate-900">{prediction.predictedElongationPercent} %</strong></span>
              </div>
            </div>

            {/* Factors */}
            {prediction.factors.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-700 block">偏離警示因子：</span>
                <ul className="text-xs text-rose-700 space-y-0.5 list-disc pl-4">
                  {prediction.factors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action */}
            <div className="text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-md">
              <strong className="text-slate-900">QC 品檢派工處置：</strong> {prediction.recommendedAction}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
