import React, { useState } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  HelpCircle, 
  Save, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Droplets,
  Gauge
} from 'lucide-react';
import { ComplaintTicket, ProcessCondition } from '../types/tpu';
import { TPU_PROCESS_CHECK_RULES } from '../data/mockTpuData';

interface ProcessVerificationWizardProps {
  ticket: ComplaintTicket;
  onUpdateProcess: (updatedConditions: ProcessCondition) => void;
  onProceedToAi: () => void;
}

export const ProcessVerificationWizard: React.FC<ProcessVerificationWizardProps> = ({
  ticket,
  onUpdateProcess,
  onProceedToAi,
}) => {
  const [conditions, setConditions] = useState<ProcessCondition>({
    ...ticket.clientProcessConditions,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Evaluate compliance score
  const evalDryingTemp = conditions.dryingTemp >= 100 && conditions.dryingTemp <= 110;
  const evalDryingHours = conditions.dryingHours >= 3.5;
  const evalDewPoint = conditions.dewPoint <= -30;
  const evalMoldTemp = conditions.moldTemp >= 20 && conditions.moldTemp <= 45;
  const evalMeltTemp = conditions.meteringTemp <= 210;
  const evalTestSpeed = conditions.testSpeed === 500 || conditions.testSpeed === 200;

  const passedChecksCount = [
    evalDryingTemp,
    evalDryingHours,
    evalDewPoint,
    evalMoldTemp,
    evalMeltTemp,
    evalTestSpeed,
    conditions.isDryerDehumidified,
  ].filter(Boolean).length;

  const complianceScore = Math.round((passedChecksCount / 7) * 100);

  const handleSave = () => {
    onUpdateProcess(conditions);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>模組二</span>
              <span aria-hidden="true">·</span>
              <span>TPU 特性吸濕烘乾與加工參數核對 (Process Verification Wizard)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              TPU 標準化工藝核對與符合性評估
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              客訴單：<strong className="font-mono text-slate-800">{ticket.id}</strong> | 客戶：{ticket.customerName} | 規格：{ticket.productGrade}
            </p>
          </div>

          {/* Compliance Meter */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:px-5 flex items-center gap-4">
            <div>
              <span className="text-xs text-slate-500 block">工藝符合性綜合指數</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-2xl font-bold font-mono tabular-nums ${
                  complianceScore >= 80 ? 'text-emerald-600' : complianceScore >= 50 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {complianceScore}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {complianceScore >= 80 ? '符合規範' : complianceScore >= 50 ? '存在偏差' : '重大偏差風險'}
                </span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? '已儲存對焦' : '儲存核對紀錄'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameter Checkers and Instant Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Parameter Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              1. 烘乾與吸濕排查（TPU 水解致命關鍵）
            </h3>
            <span className="text-xs text-slate-400">標準要求：含水量 &lt; 200 ppm</span>
          </div>

          {/* Drying Controls */}
          <div className="space-y-4">
            
            {/* Drying Temp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">烘料溫度 (Drying Temp)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">標準建議：100 ~ 110 °C</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {conditions.dryingTemp} °C
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="60"
                max="130"
                step="5"
                value={conditions.dryingTemp}
                onChange={(e) => setConditions({ ...conditions, dryingTemp: Number(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>60°C (低溫未乾)</span>
                <span className="text-emerald-600 font-semibold">100-110°C (最佳區間)</span>
                <span>130°C (過熱黏結)</span>
              </div>
              {conditions.dryingTemp < 100 && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  警告：烘烤低於 100°C 無法破壞 TPU 表面水分子附著層，熔膠水解率急遽增加！
                </p>
              )}
            </div>

            {/* Drying Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">烘乾時間 (Drying Duration)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">標準建議：≥ 4 小時</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {conditions.dryingHours} 小時
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={conditions.dryingHours}
                onChange={(e) => setConditions({ ...conditions, dryingHours: Number(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />
              {conditions.dryingHours < 3.5 && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  時間不足 3.5 小時，原料核心顆粒結晶水未釋出，極易導致注塑件內部微氣孔。
                </p>
              )}
            </div>

            {/* Dew Point */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">乾燥風露點 (Dew Point)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">標準建議：≤ -30 °C</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {conditions.dewPoint} °C
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="-50"
                max="0"
                step="5"
                value={conditions.dewPoint}
                onChange={(e) => setConditions({ ...conditions, dewPoint: Number(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conditions.isDryerDehumidified}
                    onChange={(e) => setConditions({ ...conditions, isDryerDehumidified: e.target.checked })}
                    className="rounded accent-slate-900"
                  />
                  <span>配備蜂巢轉輪除濕乾燥機 (Dehumidifying Dryer)</span>
                </label>
              </div>
            </div>

          </div>

          {/* Section 2: Barrel & Injection Temperatures */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                2. 射出/押出機筒各區溫度設定
              </h3>
              <span className="text-xs text-slate-400">TPU 85A 熔融加工區：185 ~ 205 °C</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">進料段 (Feed)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={conditions.feedZoneTemp}
                    onChange={(e) => setConditions({ ...conditions, feedZoneTemp: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-slate-400">°C</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">標稱: 175-185</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">壓縮段 (Compress)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={conditions.compressionTemp}
                    onChange={(e) => setConditions({ ...conditions, compressionTemp: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-slate-400">°C</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">標稱: 185-195</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">計量/熔膠段</label>
                <div className="relative">
                  <input
                    type="number"
                    value={conditions.meteringTemp}
                    onChange={(e) => setConditions({ ...conditions, meteringTemp: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-slate-400">°C</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">標稱: 190-205</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">模具溫度 (Mold)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={conditions.moldTemp}
                    onChange={(e) => setConditions({ ...conditions, moldTemp: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-slate-400">°C</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">標稱: 20-40</span>
              </div>
            </div>
          </div>

          {/* Section 3: Specimen Conditioning & Test Setup */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-600" />
                3. 試片裁切與拉伸試驗機速度 (ASTM D412 / ISO 37)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  試驗機拉伸速度 (Testing Speed)
                </label>
                <select
                  value={conditions.testSpeed}
                  onChange={(e) => setConditions({ ...conditions, testSpeed: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                >
                  <option value={500}>500 mm/min (ASTM D412 標準規範)</option>
                  <option value={200}>200 mm/min (ISO 37 / DIN 53504 規範)</option>
                  <option value={100}>100 mm/min (低速測試)</option>
                  <option value={50}>50 mm/min (非標準)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  高分子彈性體具有應變率依賴性；速度不同會直接造成 10~15% 的數據落差。
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  試片退火與環境調濕條件
                </label>
                <input
                  type="text"
                  value={conditions.specimenConditioning}
                  onChange={(e) => setConditions({ ...conditions, specimenConditioning: e.target.value })}
                  placeholder="例如：成型後置於 23°C 50%RH 調濕 24hr / 退火 20hr"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  未退火注塑件常因殘留冷卻應力而在標距線內部過早撕裂。
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Output: Real-time Compliance Assessment Report (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              加工條件符合性評估報告
            </h3>
            <span className="text-xs text-slate-500 font-mono">Process Audit Report</span>
          </div>

          {/* Quick Comparison Checklist */}
          <div className="space-y-3">
            {[
              {
                title: '原料烘乾溫度',
                clientVal: `${conditions.dryingTemp} °C`,
                standardVal: '100 ~ 110 °C',
                status: evalDryingTemp ? 'pass' : 'fail',
                note: evalDryingTemp ? '溫度達標' : '偏低，具水解高風險',
              },
              {
                title: '除濕乾燥時間',
                clientVal: `${conditions.dryingHours} 小時`,
                standardVal: '≥ 4.0 小時',
                status: evalDryingHours ? 'pass' : 'fail',
                note: evalDryingHours ? '時間充足' : '烘烤時間不足',
              },
              {
                title: '乾燥空氣露點',
                clientVal: `${conditions.dewPoint} °C`,
                standardVal: '≤ -30 °C',
                status: evalDewPoint ? 'pass' : 'fail',
                note: evalDewPoint ? '超低水氣環境' : '水氣脫附能力不足',
              },
              {
                title: '蜂巢除濕乾燥設備',
                clientVal: conditions.isDryerDehumidified ? '有配備' : '一般熱風箱',
                standardVal: '強制建議',
                status: conditions.isDryerDehumidified ? 'pass' : 'fail',
                note: conditions.isDryerDehumidified ? '符合' : '熱風箱無除濕效果',
              },
              {
                title: '熔膠計量溫度',
                clientVal: `${conditions.meteringTemp} °C`,
                standardVal: '190 ~ 205 °C',
                status: evalMeltTemp ? 'pass' : 'fail',
                note: evalMeltTemp ? '無過熱剪切' : '過熱熱氧裂解風險',
              },
              {
                title: '拉伸測試速度',
                clientVal: `${conditions.testSpeed} mm/min`,
                standardVal: '500 mm/min (ASTM)',
                status: evalTestSpeed ? 'pass' : 'warning',
                note: conditions.testSpeed === 500 ? '標準一致' : '測試應變率存在差異',
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">{row.title}</div>
                  <div className="text-[11px] text-slate-500">
                    現行：<span className="font-mono font-medium text-slate-900">{row.clientVal}</span>
                    {' / '}
                    建議：<span className="font-mono text-slate-600">{row.standardVal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {row.status === 'pass' && (
                    <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      符合
                    </span>
                  )}
                  {row.status === 'fail' && (
                    <span className="text-rose-700 font-medium text-xs flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      不符
                    </span>
                  )}
                  {row.status === 'warning' && (
                    <span className="text-amber-700 font-medium text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      注意
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Synthesis Conclusion */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-1.5">
            <span className="text-xs font-bold text-slate-900">工程初判結論</span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {complianceScore < 70 ? (
                <>
                  客戶端加工條件有 <strong className="text-rose-600">{7 - passedChecksCount} 項顯著偏差</strong>。
                  尤其在 TPU 最關鍵的烘乾溫度與露點控制上嚴重不足，极易在高溫熔融時引發主鏈水解裂解，導致拉伸與延伸率巨幅跌落。建議業務窗口立即向客戶品保對焦此符合性報告。
                </>
              ) : (
                <>
                  客戶端加工工藝大致合規（符合度 {complianceScore}%）。若拉伸強度仍有明顯差距，需優先往「出廠原料聚合分子量離散」或「試片裁切微裂痕應力集中」方向比對驗證。
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={onProceedToAi}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>帶入此工藝條件至 AI 智慧成因推薦</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
