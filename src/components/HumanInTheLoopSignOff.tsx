import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Save, 
  FileCheck2, 
  Lock, 
  Unlock,
  Building,
  User,
  Clock
} from 'lucide-react';
import { ComplaintTicket, SignOffRecord, AttributionType, ResolutionAction, UserRole } from '../types/tpu';

interface HumanInTheLoopSignOffProps {
  ticket: ComplaintTicket;
  onUpdateSignOff: (signOff: SignOffRecord, newStatus: ComplaintTicket['status']) => void;
  currentRole: UserRole;
  onExportReport: () => void;
}

export const HumanInTheLoopSignOff: React.FC<HumanInTheLoopSignOffProps> = ({
  ticket,
  onUpdateSignOff,
  currentRole,
  onExportReport,
}) => {
  const [signOff, setSignOff] = useState<SignOffRecord>({
    ...ticket.signOff,
  });

  const [attribution, setAttribution] = useState<AttributionType>(
    ticket.signOff.finalAttribution || 'CUSTOMER_PROCESS'
  );

  const [action, setAction] = useState<ResolutionAction>(
    ticket.signOff.finalAction || 'ONSITE_FAE_DISPATCH'
  );

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Individual approver actions
  const handleApproveQC = () => {
    const updated = {
      ...signOff,
      qcDirectorApproved: true,
      qcDirectorName: signOff.qcDirectorName || '張品管 主任 (QC Director)',
      qcDirectorDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      qcDirectorNotes: signOff.qcDirectorNotes || '經比對留樣複測拉伸 41.8 MPa 符合出廠規格；客戶端烘料不足導致水解，同意技術初判。',
    };
    setSignOff(updated);
    saveChanges(updated);
  };

  const handleApproveRD = () => {
    const updated = {
      ...signOff,
      rdLeadApproved: true,
      rdLeadName: signOff.rdLeadName || '陳研發 博士 (Polymer R&D Lead)',
      rdLeadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      rdLeadNotes: signOff.rdLeadNotes || '分子量分佈與硬段微相結構分析無虞，同意依加工條件符合性報告派員技術指導。',
    };
    setSignOff(updated);
    saveChanges(updated);
  };

  const handleApproveSales = () => {
    const updated = {
      ...signOff,
      salesRepApproved: true,
      salesRepName: signOff.salesRepName || '黃業務 總監 (Sales Lead)',
      salesRepDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      salesRepNotes: signOff.salesRepNotes || '已與客戶採購與品保主管召開線上會議，客戶接受除濕乾燥參數調整建議。',
    };
    setSignOff(updated);
    saveChanges(updated);
  };

  const saveChanges = (latestSignOff: SignOffRecord) => {
    const allApproved = latestSignOff.qcDirectorApproved && latestSignOff.rdLeadApproved && latestSignOff.salesRepApproved;
    const finalRecord: SignOffRecord = {
      ...latestSignOff,
      finalAttribution: attribution,
      finalAction: action,
      decisionTimestamp: allApproved ? new Date().toISOString() : latestSignOff.decisionTimestamp,
    };

    const nextStatus = allApproved ? 'RESOLVED' : 'SIGN_OFF';
    onUpdateSignOff(finalRecord, nextStatus);
    setFeedbackMsg(allApproved ? '三方主管已全員簽署完成，本案件正式結案！' : '簽核狀態已更新');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const allApproved = signOff.qcDirectorApproved && signOff.rdLeadApproved && signOff.salesRepApproved;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>模組五 · 規格第 4 節</span>
              <span aria-hidden="true">·</span>
              <span>人工確認邊界 (Human-in-the-Loop Multi-Party Sign-Off)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              責任歸屬判定與三方聯合審批簽核
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              客訴單：<strong className="font-mono text-slate-800">{ticket.id}</strong> | 客戶：{ticket.customerName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {allApproved ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                三方簽核完成 · 已結案
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                待三方主管審核手動確認
              </span>
            )}
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Mandatory Decision Matrix Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            1. 人工手動責任歸屬判定 (Final Attribution)
          </h3>
          <span className="text-xs text-slate-400">必須經由品管、研發與業務共同審核</span>
        </div>

        {/* Attribution Radio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'CUSTOMER_PROCESS',
              label: '客戶端加工操作不當',
              desc: '烘料溫度或時間不足導致水解，或螺桿剪切過熱熱降解。',
            },
            {
              id: 'MATERIAL_DEFECT',
              label: '原料批次品質瑕疵',
              desc: '反應釜聚合分子量離散過大，出廠留樣複測亦不合格。',
            },
            {
              id: 'TESTING_DISCREPANCY',
              label: '測試條件或試片偏差',
              desc: 'ASTM D412 速度設定偏差或試片沖切邊緣微裂紋。',
            },
            {
              id: 'COMBINED_FACTORS',
              label: '共同複合因素',
              desc: '原料出廠硬段分佈微幅離散，疊加客戶端成型後未退火。',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setAttribution(item.id as AttributionType)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                attribution === item.id
                  ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{item.label}</span>
                <input
                  type="radio"
                  name="attribution"
                  checked={attribution === item.id}
                  onChange={() => setAttribution(item.id as AttributionType)}
                  className="accent-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Decision Selector */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-900">
            2. 最終商務與技術處置方案 (Resolution Action)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'ONSITE_FAE_DISPATCH',
                label: '現場 FAE 工程師派駐',
                desc: '派駐資深材料工程師到廠協助烘乾設備檢測與產線試模。',
              },
              {
                id: 'PROCESS_COACHING',
                label: '工藝參數線上技術指導',
                desc: '出具加工標準 SOP 與退火指南，追蹤客戶下一批次試跑。',
              },
              {
                id: 'REPLACE_BATCH',
                label: '瑕疵原料補換貨重出',
                desc: '由品管召回異常批次並重新排產出貨，產生內部異常改善單。',
              },
              {
                id: 'COMMERCIAL_REBATE',
                label: '商業折讓補償',
                desc: '業務端依合約協議給予適當料款折讓或延展付款條件。',
              },
            ].map((act) => (
              <div
                key={act.id}
                onClick={() => setAction(act.id as ResolutionAction)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  action === act.id
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{act.label}</span>
                  <input
                    type="radio"
                    name="action"
                    checked={action === act.id}
                    onChange={() => setAction(act.id as ResolutionAction)}
                    className="accent-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Triple Department Approval Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: QC Director */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] text-slate-500 block">內部審核部門 1</span>
              <h4 className="text-sm font-bold text-slate-900">品管主管審批 (QC Director)</h4>
            </div>
            {signOff.qcDirectorApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">品管簽核意見：</span>
              <textarea
                rows={3}
                value={signOff.qcDirectorNotes || ''}
                onChange={(e) => setSignOff({ ...signOff, qcDirectorNotes: e.target.value })}
                placeholder="輸入實驗室留樣覆核結論、卡爾費休水分測試與品管判定..."
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed"
              />
            </div>

            {signOff.qcDirectorApproved && (
              <div className="bg-emerald-50/70 p-2 rounded text-[11px] text-emerald-800 space-y-0.5">
                <div>簽署人：<strong className="font-semibold">{signOff.qcDirectorName}</strong></div>
                <div>時間：<span className="font-mono">{signOff.qcDirectorDate}</span></div>
              </div>
            )}

            <button
              onClick={handleApproveQC}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                signOff.qcDirectorApproved
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {signOff.qcDirectorApproved ? '更新品管簽核' : '點擊手動簽核 (品管確認)'}
            </button>
          </div>
        </div>

        {/* Card 2: R&D Lead */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] text-slate-500 block">內部審核部門 2</span>
              <h4 className="text-sm font-bold text-slate-900">研發主管審批 (R&D Lead)</h4>
            </div>
            {signOff.rdLeadApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">研發材料對策意見：</span>
              <textarea
                rows={3}
                value={signOff.rdLeadNotes || ''}
                onChange={(e) => setSignOff({ ...signOff, rdLeadNotes: e.target.value })}
                placeholder="輸入高分子分子量 GPC 判定、FTIR 水解紅外譜圖與工藝指導對策..."
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed"
              />
            </div>

            {signOff.rdLeadApproved && (
              <div className="bg-emerald-50/70 p-2 rounded text-[11px] text-emerald-800 space-y-0.5">
                <div>簽署人：<strong className="font-semibold">{signOff.rdLeadName}</strong></div>
                <div>時間：<span className="font-mono">{signOff.rdLeadDate}</span></div>
              </div>
            )}

            <button
              onClick={handleApproveRD}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                signOff.rdLeadApproved
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {signOff.rdLeadApproved ? '更新研發簽核' : '點擊手動簽核 (研發確認)'}
            </button>
          </div>
        </div>

        {/* Card 3: Sales Rep */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] text-slate-500 block">內部審核部門 3</span>
              <h4 className="text-sm font-bold text-slate-900">業務窗口審批 (Sales Rep)</h4>
            </div>
            {signOff.salesRepApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">客戶溝通與結案摘要：</span>
              <textarea
                rows={3}
                value={signOff.salesRepNotes || ''}
                onChange={(e) => setSignOff({ ...signOff, salesRepNotes: e.target.value })}
                placeholder="輸入客戶溝通記錄、SLA滿意度評分與派駐行程確認..."
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed"
              />
            </div>

            {signOff.salesRepApproved && (
              <div className="bg-emerald-50/70 p-2 rounded text-[11px] text-emerald-800 space-y-0.5">
                <div>簽署人：<strong className="font-semibold">{signOff.salesRepName}</strong></div>
                <div>時間：<span className="font-mono">{signOff.salesRepDate}</span></div>
              </div>
            )}

            <button
              onClick={handleApproveSales}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                signOff.salesRepApproved
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {signOff.salesRepApproved ? '更新業務簽核' : '點擊手動簽核 (業務確認)'}
            </button>
          </div>
        </div>

      </div>

      {/* Audit Trail & 8D Export */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900">
            不可竄改審批數位簽署稽核軌跡 (Audit Log)
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            符合 ISO 9001 與 IATF 16949 客訴質量異常處理合規標準
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => saveChanges(signOff)}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:border-slate-400 cursor-pointer"
          >
            儲存審批狀態
          </button>
          <button
            onClick={onExportReport}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>產出並匯出 8D 正式客訴報告</span>
          </button>
        </div>
      </div>

    </div>
  );
};
