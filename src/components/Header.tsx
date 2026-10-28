import React from 'react';
import { ShieldCheck, PlusCircle, UserCheck } from 'lucide-react';
import { UserRole } from '../types/tpu';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNewTicketClick: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onNewTicketClick,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            TPU
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            PolymerGuard 智慧客訴與物性管理平台
          </span>
        </div>

        {/* Zone 2: Concise Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            客訴總覽看板
          </button>
          <button
            onClick={() => onTabChange('process')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left cursor-pointer ${
              activeTab === 'process'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            標準工藝核對
          </button>
          <button
            onClick={() => onTabChange('traceability')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left cursor-pointer ${
              activeTab === 'traceability'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            COA數據溯源
          </button>
          <button
            onClick={() => onTabChange('ai-prediction')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left cursor-pointer ${
              activeTab === 'ai-prediction'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            AI成因與出廠預警
          </button>
          <button
            onClick={() => onTabChange('sign-off')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left cursor-pointer ${
              activeTab === 'sign-off'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            責任歸屬簽核
          </button>
        </nav>

        {/* Zone 3: Primary Action + Role Selection */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Functional Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => onRoleChange('CLIENT')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'CLIENT'
                  ? 'bg-white font-semibold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              客戶端
            </button>
            <button
              onClick={() => onRoleChange('SALES')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'SALES'
                  ? 'bg-white font-semibold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              業務窗口
            </button>
            <button
              onClick={() => onRoleChange('QC_RD')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                currentRole === 'QC_RD'
                  ? 'bg-white font-semibold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              品管與研發 (QC/R&D)
            </button>
          </div>

          <button
            onClick={onNewTicketClick}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>發起新客訴單</span>
          </button>
        </div>

      </div>

      {/* Role Context Notification Bar */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>
            當前視角身分：
            <strong className="text-slate-800 font-semibold ml-1">
              {currentRole === 'CLIENT' && '客戶端（採購 / 產線品檢）- 支援上傳拉力報告與工藝條件'}
              {currentRole === 'SALES' && '業務窗口（Account Manager）- 追蹤 48h SLA、同步進度與客戶協調'}
              {currentRole === 'QC_RD' && '內部品管與研發（QC & Polymer R&D）- 數據溯源、留樣複驗、AI機理分析與責任判定'}
            </strong>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-500">
          <span>SLA 目標：48 小時結案</span>
          <span aria-hidden="true">·</span>
          <span>測試標準：ASTM D412 / ISO 37</span>
        </div>
      </div>
    </header>
  );
};
