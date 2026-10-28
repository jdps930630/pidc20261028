import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  FileSpreadsheet, 
  Sparkles, 
  Sliders, 
  ArrowRight,
  Upload,
  Calendar,
  Building,
  Hash,
  Download
} from 'lucide-react';
import { ComplaintTicket, TicketStatus, UserRole } from '../types/tpu';

interface ComplaintDashboardProps {
  tickets: ComplaintTicket[];
  selectedTicket: ComplaintTicket | null;
  onSelectTicket: (ticket: ComplaintTicket) => void;
  onOpenProcessWizard: (ticket: ComplaintTicket) => void;
  onOpenCoaMatching: (ticket: ComplaintTicket) => void;
  onOpenAiAnalysis: (ticket: ComplaintTicket) => void;
  onOpenSignOff: (ticket: ComplaintTicket) => void;
  onOpenReport: (ticket: ComplaintTicket) => void;
  currentRole: UserRole;
}

export const ComplaintDashboard: React.FC<ComplaintDashboardProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onOpenProcessWizard,
  onOpenCoaMatching,
  onOpenAiAnalysis,
  onOpenSignOff,
  onOpenReport,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lotNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.productGrade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'RECEIVED':
        return '已收件';
      case 'TESTING':
        return '檢驗中';
      case 'PARAM_ALIGNING':
        return '參數對焦';
      case 'SIGN_OFF':
        return '審批簽核';
      case 'RESOLVED':
        return '已結案';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'RECEIVED':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'TESTING':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'PARAM_ALIGNING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'SIGN_OFF':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'RESOLVED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  const getStageStep = (status: TicketStatus): number => {
    switch (status) {
      case 'RECEIVED': return 1;
      case 'TESTING': return 2;
      case 'PARAM_ALIGNING': return 3;
      case 'SIGN_OFF': return 4;
      case 'RESOLVED': return 5;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋客訴單號、客戶名稱、批號 (Lot No.) 或規格..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition-all"
            />
          </div>

          {/* Interactive Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: '全部案件' },
              { id: 'RECEIVED', label: '已收件' },
              { id: 'TESTING', label: '檢驗中' },
              { id: 'PARAM_ALIGNING', label: '參數對焦' },
              { id: 'SIGN_OFF', label: '審批簽核' },
              { id: 'RESOLVED', label: '已結案' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Layout: Ticket List & Active Selected Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Ticket List Table (Left 7 cols or full width) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">客訴案件列表</h2>
              <p className="text-xs text-slate-500 mt-0.5">點擊案件調閱詳細工藝核對與實驗室溯源數據</p>
            </div>
            <div className="text-xs text-slate-500">
              共 <span className="font-mono font-semibold text-slate-800">{filteredTickets.length}</span> 筆記錄
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                查無符合條件的客訴案件。
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    className={`p-4 sm:p-5 transition-colors cursor-pointer hover:bg-slate-50/80 ${
                      isSelected ? 'bg-slate-50/90 ring-1 ring-inset ring-slate-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        
                        {/* Unboxed Metadata Header (Anti-Pill Rule) */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono font-bold text-slate-900">{ticket.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{ticket.lotNo}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ticket.purchaseDate} 購料</span>
                        </div>

                        {/* Customer & Issue */}
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {ticket.customerName}
                        </h3>
                        
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {ticket.defectDescription}
                        </p>

                        {/* Tensile Comparison Snippet */}
                        <div className="flex items-center gap-4 text-xs pt-1">
                          <span className="text-slate-500">
                            實測拉伸: <strong className="font-mono text-rose-600 font-semibold">{ticket.clientTestingData.tensileStrength} MPa</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            延伸率: <strong className="font-mono text-rose-600 font-semibold">{ticket.clientTestingData.elongationAtBreak} %</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            烘料條件: <strong className="font-mono text-slate-700">{ticket.clientProcessConditions.dryingTemp}°C / {ticket.clientProcessConditions.dryingHours}h</strong>
                          </span>
                        </div>
                      </div>

                      {/* Right Status Indicator */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-md border font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                        {ticket.severity === 'CRITICAL' && (
                          <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            重大緊急
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(ticket.createdAt).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Ticket Active Detail Panel (Right 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          {selectedTicket ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-mono font-bold text-slate-900">{selectedTicket.id}</span>
                  <span className="font-mono">SLA 48h 監控中</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedTicket.customerName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>規格: {selectedTicket.productGrade}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selectedTicket.lotNo}</span>
                </div>
              </div>

              {/* Visual Lifecycle Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">處理進度看板</span>
                  <span className="text-slate-500">
                    階段 {getStageStep(selectedTicket.status)} / 5 ({getStatusLabel(selectedTicket.status)})
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[
                    { key: 'RECEIVED', label: '1.已收件' },
                    { key: 'TESTING', label: '2.檢驗中' },
                    { key: 'PARAM_ALIGNING', label: '3.參數對焦' },
                    { key: 'SIGN_OFF', label: '4.審批簽核' },
                    { key: 'RESOLVED', label: '5.已結案' },
                  ].map((st, idx) => {
                    const stepNum = idx + 1;
                    const curStep = getStageStep(selectedTicket.status);
                    const isDone = curStep >= stepNum;
                    return (
                      <div key={st.key} className="space-y-1">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            isDone ? 'bg-slate-900' : 'bg-slate-200'
                          }`}
                        />
                        <span className={`block text-[10px] text-center truncate ${isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notification Dispatch Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>系統已自動派發通知協同網絡</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  已同步通知業務窗口 (林副理)、QC品檢實驗室及研發工程組；立案起算 48 小時內需完成成因對焦。
                </p>
              </div>

              {/* Quick Spec Delta */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-800">客戶端實測異常指標</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-md">
                    <span className="text-slate-500 block">客戶拉伸強度</span>
                    <strong className="text-rose-600 text-sm font-mono font-bold">
                      {selectedTicket.clientTestingData.tensileStrength} MPa
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">標稱需 ≥40 MPa</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-md">
                    <span className="text-slate-500 block">客戶斷裂伸長率</span>
                    <strong className="text-rose-600 text-sm font-mono font-bold">
                      {selectedTicket.clientTestingData.elongationAtBreak} %
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">標稱需 ≥550 %</span>
                  </div>
                </div>
              </div>

              {/* Attachments List */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>客訴佐證附件 ({selectedTicket.attachments.length})</span>
                  <span className="text-slate-400 font-normal text-[11px]">測試報告 / 照片</span>
                </div>
                <div className="space-y-1">
                  {selectedTicket.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                        {file.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modular Action Workflow Links */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-slate-800">跨模組協同處置流程</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenProcessWizard(selectedTicket)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 text-xs text-slate-800 font-medium transition-colors bg-white hover:bg-slate-50 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-slate-600" />
                      標準工藝核對表
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onOpenCoaMatching(selectedTicket)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 text-xs text-slate-800 font-medium transition-colors bg-white hover:bg-slate-50 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                      COA留樣比對
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onOpenAiAnalysis(selectedTicket)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-xs text-indigo-950 font-medium transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI 成因推薦分析
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  </button>

                  <button
                    onClick={() => onOpenSignOff(selectedTicket)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 text-xs text-slate-800 font-medium transition-colors bg-white hover:bg-slate-50 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-600" />
                      三方責任簽核
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenReport(selectedTicket)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>預覽與匯出 8D 異常調查客訴報告</span>
                </button>
              </div>

            </>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              請從左側列表選擇一件客訴進行詳情調閱
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
