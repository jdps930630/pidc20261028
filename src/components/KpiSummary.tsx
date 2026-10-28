import React from 'react';
import { Clock, CheckCircle2, Star, AlertTriangle, TrendingUp } from 'lucide-react';
import { ComplaintTicket } from '../types/tpu';

interface KpiSummaryProps {
  tickets: ComplaintTicket[];
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({ tickets }) => {
  const activeCount = tickets.filter(t => t.status !== 'RESOLVED').length;
  const criticalCount = tickets.filter(t => t.severity === 'CRITICAL' && t.status !== 'RESOLVED').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Cycle Time */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>平均客訴處理週期 (MTTR)</span>
            <span className="font-medium text-slate-700">目標 ≤ 48h</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              31.5
            </span>
            <span className="text-sm font-medium text-slate-500">小時</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>自傳統 3~5 天 (84h) 縮減 62.5%</span>
          </div>
        </div>

        {/* KPI 2: Diagnostic Accuracy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>成因判定準確率</span>
            <span className="font-medium text-slate-700">雙盲留樣驗證</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              94.2
            </span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>較導入前判定準確率提升 +42.8%</span>
          </div>
        </div>

        {/* KPI 3: Customer Satisfaction */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>客戶處理滿意度 (CSAT)</span>
            <span className="font-medium text-slate-700">規格目標 ≥ 4.5</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              4.82
            </span>
            <span className="text-sm font-medium text-slate-500">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600">
            <Star className="w-3.5 h-3.5 shrink-0 fill-amber-500 text-amber-500" />
            <span>近 30 天 18 件客訴評價無爭議</span>
          </div>
        </div>

        {/* KPI 4: Active Complaint Tickets */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>進行中案件 / SLA 監控</span>
            <span className="font-medium text-slate-700">{resolvedCount} 件已結案</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {activeCount}
            </span>
            <span className="text-sm font-medium text-slate-500">件在案</span>
            {criticalCount > 0 && (
              <span className="ml-auto text-xs text-rose-600 font-medium">
                {criticalCount} 件重度緊急
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>目前所有案件均在 48h SLA 效期內</span>
          </div>
        </div>

      </div>
    </section>
  );
};
