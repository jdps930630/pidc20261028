import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  ArrowRightLeft, 
  FileCheck, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  Cpu, 
  Sparkles,
  BarChart3
} from 'lucide-react';
import { CoaBatchRecord, ComplaintTicket } from '../types/tpu';
import { INITIAL_COA_BATCHES } from '../data/mockTpuData';

interface CoaMatchingModuleProps {
  ticket: ComplaintTicket;
  onSelectBatchForTicket?: (lotNo: string) => void;
  onProceedToAi: () => void;
}

export const CoaMatchingModule: React.FC<CoaMatchingModuleProps> = ({
  ticket,
  onProceedToAi,
}) => {
  const [queryLot, setQueryLot] = useState(ticket.lotNo);
  const [selectedBatch, setSelectedBatch] = useState<CoaBatchRecord | undefined>(
    INITIAL_COA_BATCHES.find((b) => b.lotNo === ticket.lotNo) || INITIAL_COA_BATCHES[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_COA_BATCHES.find(
      (b) => b.lotNo.toLowerCase() === queryLot.trim().toLowerCase()
    );
    if (found) {
      setSelectedBatch(found);
    }
  };

  // 3-Way Metrics Calculation
  const coa = selectedBatch?.coaProperties;
  const retest = selectedBatch?.retestProperties;
  const client = ticket.clientTestingData;

  const tensileGapCoaClient = coa ? (client.tensileStrength - coa.tensileStrength).toFixed(1) : '0';
  const tensileGapPercent = coa ? Math.round(((client.tensileStrength - coa.tensileStrength) / coa.tensileStrength) * 100) : 0;

  const elongationGap = coa ? client.elongationAtBreak - coa.elongationAtBreak : 0;
  const elongationGapPercent = coa ? Math.round((elongationGap / coa.elongationAtBreak) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>模組三</span>
              <span aria-hidden="true">·</span>
              <span>實驗室與 ERP 製程數據溯源比對 (Data Traceability & COA Matching)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              ERP/LIMS 原料批次物性溯源與三方留樣對比
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              調閱同批原料出廠 COA、原廠留樣庫複測數據，與客戶端不良測試進行三方客觀對焦
            </p>
          </div>

          {/* Quick Lot Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryLot}
                onChange={(e) => setQueryLot(e.target.value)}
                placeholder="輸入原料批號 (Lot No.)..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer whitespace-nowrap"
            >
              溯源調閱
            </button>
          </form>
        </div>
      </div>

      {selectedBatch ? (
        <div className="space-y-6">
          
          {/* Section 1: Reactor History & Polymerization Parameters */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  原廠 ERP 聚合反應釜歷史生產監控參數
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>反應釜：{selectedBatch.reactorId}</span>
                <span aria-hidden="true">·</span>
                <span>生產日期：{selectedBatch.productionDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] text-slate-500 block">聚合反應均溫</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-bold font-mono text-slate-900">
                    {selectedBatch.reactorTemp} °C
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono">±{selectedBatch.reactorTempVariance}°C</span>
                </div>
                <span className={`text-[10px] mt-1 block font-medium ${
                  selectedBatch.reactorTempVariance <= 2.0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {selectedBatch.reactorTempVariance <= 2.0 ? '反應溫度平穩正常' : '聚合溫差過大 (警報)'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] text-slate-500 block">反應釜真空脫水率</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-bold font-mono text-slate-900">
                    {selectedBatch.vacuumDehydrationRate} %
                  </strong>
                </div>
                <span className={`text-[10px] mt-1 block font-medium ${
                  selectedBatch.vacuumDehydrationRate >= 97 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {selectedBatch.vacuumDehydrationRate >= 97 ? '脫水充份 (標準≥97%)' : '脫水偏低，殘存微水'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] text-slate-500 block">聚合熔融黏度偏差</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-bold font-mono text-slate-900">
                    {selectedBatch.viscosityDeviation}%
                  </strong>
                </div>
                <span className={`text-[10px] mt-1 block font-medium ${
                  Math.abs(selectedBatch.viscosityDeviation) <= 8 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {Math.abs(selectedBatch.viscosityDeviation) <= 8 ? '分子量分佈常態' : '黏度離散過大'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] text-slate-500 block">包裝封裝前水分含量</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-bold font-mono text-slate-900">
                    {selectedBatch.productionMoisturePpm} ppm
                  </strong>
                </div>
                <span className={`text-[10px] mt-1 block font-medium ${
                  selectedBatch.productionMoisturePpm <= 150 ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {selectedBatch.productionMoisturePpm <= 150 ? '出廠含水量極優' : '出廠含水略高'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: 3-Way Comparative Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  三方數據比對矩陣 (COA 出廠 vs 原廠留樣複測 vs 客戶實測)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  測試方法標準：ASTM D412 Die C 啞鈴狀試片 / ISO 37
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">當前對焦批號:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedBatch.lotNo}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">檢測物性項目</th>
                    <th className="py-2.5 px-3 font-semibold">原廠出廠檢驗 (COA)</th>
                    <th className="py-2.5 px-3 font-semibold">實驗室留樣複測 (Retest)</th>
                    <th className="py-2.5 px-3 font-semibold text-rose-600">客戶端現場實測 (Client)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">差值 (Delta %)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">判定分析</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  
                  {/* Tensile Strength */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      拉伸強度 (Tensile Strength, MPa)
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-bold">
                      {coa?.tensileStrength} MPa
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      {retest?.tensileStrength} MPa
                    </td>
                    <td className="py-3 px-3 text-rose-600 font-bold bg-rose-50/40">
                      {client.tensileStrength} MPa
                    </td>
                    <td className="py-3 px-3 text-right text-rose-600 font-bold">
                      {tensileGapPercent > 0 ? `+${tensileGapPercent}%` : `${tensileGapPercent}%`}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      {retest && Math.abs(retest.tensileStrength - (coa?.tensileStrength || 0)) <= 1.5 ? (
                        <span className="text-emerald-700 font-medium text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          留樣物性一致 (原料無變質)
                        </span>
                      ) : (
                        <span className="text-rose-600 font-medium text-[11px] flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          留樣亦有衰退
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Elongation at Break */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      斷裂伸長率 (Elongation at Break, %)
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-bold">
                      {coa?.elongationAtBreak} %
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      {retest?.elongationAtBreak} %
                    </td>
                    <td className="py-3 px-3 text-rose-600 font-bold bg-rose-50/40">
                      {client.elongationAtBreak} %
                    </td>
                    <td className="py-3 px-3 text-right text-rose-600 font-bold">
                      {elongationGapPercent > 0 ? `+${elongationGapPercent}%` : `${elongationGapPercent}%`}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <span className="text-rose-600 font-medium text-[11px]">
                        客戶端延伸率嚴重失真 (降解)
                      </span>
                    </td>
                  </tr>

                  {/* Hardness */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      硬度 (Hardness, Shore)
                    </td>
                    <td className="py-3 px-3 text-slate-700">{coa?.hardness}</td>
                    <td className="py-3 px-3 text-slate-700">{retest?.hardness}</td>
                    <td className="py-3 px-3 text-slate-700">{client.hardness}</td>
                    <td className="py-3 px-3 text-right text-slate-500">±0</td>
                    <td className="py-3 px-3 text-center font-sans text-slate-600 text-[11px]">
                      硬度符合規格容許差
                    </td>
                  </tr>

                  {/* 100% Modulus */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      100% 定伸應力 (M100, MPa)
                    </td>
                    <td className="py-3 px-3 text-slate-700">{coa?.tensileStress100} MPa</td>
                    <td className="py-3 px-3 text-slate-700">{retest?.tensileStress100} MPa</td>
                    <td className="py-3 px-3 text-slate-400">未測 / 脆斷</td>
                    <td className="py-3 px-3 text-right text-slate-400">-</td>
                    <td className="py-3 px-3 text-center font-sans text-slate-500 text-[11px]">
                      客戶於初期伸長階段即脆裂
                    </td>
                  </tr>

                  {/* Moisture */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      水分殘留 (Moisture Content, ppm)
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">{coa?.moisturePpm} ppm</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">{retest?.moisturePpm} ppm</td>
                    <td className="py-3 px-3 text-rose-600 font-bold bg-rose-50/40">
                      {ticket.clientTestingData.moistureMeasuredPpm || 480} ppm
                    </td>
                    <td className="py-3 px-3 text-right text-rose-600 font-bold">
                      +300%
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <span className="text-rose-700 font-bold text-[11px]">
                        ★ 客戶端嚴重受潮超標
                      </span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Scientific Explanation of the Gap */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                三方溯源對比結論：
              </div>
              <p className="text-slate-700 leading-relaxed">
                原廠實驗室同批次留樣粒料複測結果：拉伸強度為 <strong className="font-mono text-emerald-700">{retest?.tensileStrength} MPa</strong>，
                斷裂伸長率為 <strong className="font-mono text-emerald-700">{retest?.elongationAtBreak}%</strong>，
                與出廠 COA 數據（42.5 MPa / 580%）高度相符，無老化衰退跡象。
                然而客戶端實測僅 <strong className="font-mono text-rose-600">{client.tensileStrength} MPa</strong> 與 <strong className="font-mono text-rose-600">{client.elongationAtBreak}%</strong>，
                兩者差距達 <strong className="font-mono text-rose-600">{tensileGapPercent}%</strong>。結合客戶端實測含水量高達 <strong className="font-mono text-rose-600">{ticket.clientTestingData.moistureMeasuredPpm || 480} ppm</strong>，
                明確指示物性衰退源於加工前烘料未透導致的高溫水解。
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onProceedToAi}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>送入 AI 進行成因權重機理計算</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
          請輸入有效批號以調閱出廠檢驗資料庫
        </div>
      )}

    </div>
  );
};
