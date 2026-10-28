import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck, Calendar } from 'lucide-react';
import { ComplaintTicket, CoaBatchRecord } from '../types/tpu';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ComplaintTicket;
  coaBatch?: CoaBatchRecord;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  ticket,
  coaBatch,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:m-0 print:max-w-none">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">8D 客訴品質異常調查與改善報告 (8D Investigation Report)</span>
            <span className="text-xs text-slate-400 font-mono">[{ticket.id}]</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:border-slate-400 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>列印 / 另存 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable 8D Document Content */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 font-sans print:p-6">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                POLYMERGUARD MATERIAL QUALITY ASSURANCE REPORT
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                TPU 塑膠原料拉伸不足客訴調查 8D 結案處置報告
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-mono">
                <span>單號：{ticket.id}</span>
                <span>·</span>
                <span>批號：{ticket.lotNo}</span>
                <span>·</span>
                <span>報告日期：{new Date().toISOString().substring(0, 10)}</span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 space-y-0.5">
              <div>SLA 週期：<strong className="text-emerald-700 font-mono">31.5 小時 (合規結案)</strong></div>
              <div>品質體系：ISO 9001:2015 / IATF 16949</div>
            </div>
          </div>

          {/* D1: Team Organization */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D1. 應變處置跨職能小組 (Team Formation)
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs p-2">
              <div>品管代表：<strong>{ticket.signOff.qcDirectorName || '張品管 主任 (QC Director)'}</strong></div>
              <div>研發代表：<strong>{ticket.signOff.rdLeadName || '陳研發 博士 (Polymer R&D Lead)'}</strong></div>
              <div>業務窗口：<strong>{ticket.signOff.salesRepName || '黃業務 總監 (Sales Lead)'}</strong></div>
            </div>
          </div>

          {/* D2: Problem Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D2. 問題陳述與失效模式 (Problem Description)
            </h3>
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>客戶：{ticket.customerName}</div>
                <div>規格：{ticket.productGrade}</div>
                <div>購料日：{ticket.purchaseDate}</div>
                <div>客訴日：{ticket.incidentDate}</div>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <strong>不良現象：</strong>{ticket.defectDescription}
              </p>
            </div>
          </div>

          {/* D3: Containment Actions */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D3. 緊急圍堵對策 (Interim Containment Actions)
            </h3>
            <div className="p-3 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-700">
              <div>1. 立即清查同批次 ({ticket.lotNo}) 廠內成品庫存 12,500 kg，全數實施批次隔離封存。</div>
              <div>2. 通知客戶端產線暫停該規格混料注塑，啟動現場烘乾條件盤點。</div>
            </div>
          </div>

          {/* D4: Root Cause Verification (The Core TPU Chemistry) */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D4. 根本成因驗證與高分子機理解析 (Root Cause Analysis)
            </h3>
            <div className="p-3.5 border border-slate-200 rounded-lg text-xs space-y-3 bg-white">
              <div className="grid grid-cols-3 gap-3 font-mono bg-slate-50 p-2.5 rounded text-[11px]">
                <div>出廠 COA: <strong>{coaBatch?.coaProperties.tensileStrength || 42.5} MPa</strong></div>
                <div>原廠留樣複測: <strong className="text-emerald-700">{coaBatch?.retestProperties?.tensileStrength || 41.8} MPa</strong></div>
                <div>客戶端實測: <strong className="text-rose-600">{ticket.clientTestingData.tensileStrength} MPa</strong></div>
              </div>

              <div className="text-slate-700 leading-relaxed space-y-1">
                <strong>高分子化學分析結論：</strong>
                <p>
                  原廠留樣庫同批原料留樣複測強度達到 41.8 MPa，伸長率 575%，確認原料出廠體質合格無劣化。
                  客戶端加工現場僅使用一般熱風箱於 80°C 烘料 2 小時，實測殘留水分高達 480 ppm（標準要求 &lt;200 ppm）。
                  在熔膠料筒高溫下引發胺基甲酸酯基團水解反應 (Hydrolytic Degradation)，重均分子量顯著下降造成脆化斷裂。
                </p>
              </div>

              <div className="text-[11px] text-slate-600">
                <strong>判定歸屬：</strong>
                <span className="font-semibold text-slate-900 ml-1">
                  {ticket.signOff.finalAttribution === 'CUSTOMER_PROCESS' ? '客戶端加工操作不當 (烘料不足引發高溫水解)' : '共同複合工藝因素'}
                </span>
              </div>
            </div>
          </div>

          {/* D5 & D6: Corrective Actions & Verification */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D5 & D6. 永久矯正措施與有效性驗證 (Corrective Action & Validation)
            </h3>
            <div className="p-3 border border-slate-200 rounded-lg text-xs space-y-2 text-slate-700">
              <div>
                <strong>現場對策實施：</strong>派駐 FAE 協助客戶產線改採蜂巢式除濕乾燥機，設定溫度 105°C 烘烤 4 小時以上（露點 ≤ -35°C）。
              </div>
              <div>
                <strong>有效性複拉驗證：</strong>採用標準烘乾條件後，客戶端重新射出成型試片，依 ASTM D412 速度 500 mm/min 測試，拉伸強度回升至 <strong>41.5 MPa</strong>，斷裂伸長率達 <strong>565%</strong>，全檢不良率降至 0.2% 以下，徹底解決拉伸不足問題。
              </div>
            </div>
          </div>

          {/* D7: Preventive Actions */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D7. 預防再發防呆措施 (Preventive Actions)
            </h3>
            <div className="p-3 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-700">
              <div>1. 於出廠包裝袋增印 TPU 吸濕敏感性警語與 105°C / 4h 標準除濕烘烤 SOP 標籤。</div>
              <div>2. 於系統端啟動聚合反應釜出廠前風險預警模型，監控溫度震盪與真空脫水率。</div>
            </div>
          </div>

          {/* D8: Sign-off signatures */}
          <div className="space-y-1.5 pt-2">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase bg-slate-100 px-3 py-1 rounded">
              D8. 團隊主管審核結案簽署 (Sign-Off & Closure)
            </h3>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">QC DIRECTOR</span>
                <strong className="text-slate-900 block font-semibold">{ticket.signOff.qcDirectorName || '張品管 主任'}</strong>
                <span className="text-[10px] text-emerald-700 font-medium">已簽署核准 · {ticket.signOff.qcDirectorDate || '2026-10-25'}</span>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">POLYMER R&D LEAD</span>
                <strong className="text-slate-900 block font-semibold">{ticket.signOff.rdLeadName || '陳研發 博士'}</strong>
                <span className="text-[10px] text-emerald-700 font-medium">已簽署核准 · {ticket.signOff.rdLeadDate || '2026-10-25'}</span>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">SALES DIRECTOR</span>
                <strong className="text-slate-900 block font-semibold">{ticket.signOff.salesRepName || '黃業務 總監'}</strong>
                <span className="text-[10px] text-emerald-700 font-medium">已簽署核准 · {ticket.signOff.salesRepDate || '2026-10-25'}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>TPU POLYMERGUARD INCIDENT SYSTEM · VERIFIED REPORT</span>
            <span>48H SLA COMPLIANT CLOSURE</span>
          </div>

        </div>

      </div>
    </div>
  );
};
