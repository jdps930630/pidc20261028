import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiSummary } from './components/KpiSummary';
import { ComplaintDashboard } from './components/ComplaintDashboard';
import { ProcessVerificationWizard } from './components/ProcessVerificationWizard';
import { CoaMatchingModule } from './components/CoaMatchingModule';
import { AiAnalysisModule } from './components/AiAnalysisModule';
import { HumanInTheLoopSignOff } from './components/HumanInTheLoopSignOff';
import { NewTicketModal } from './components/NewTicketModal';
import { ReportExportModal } from './components/ReportExportModal';
import { ComplaintTicket, UserRole, ProcessCondition, AiRootCauseResult, SignOffRecord } from './types/tpu';
import { INITIAL_COMPLAINT_TICKETS, INITIAL_COA_BATCHES } from './data/mockTpuData';

export default function App() {
  const [tickets, setTickets] = useState<ComplaintTicket[]>(() => {
    const saved = localStorage.getItem('tpu_complaint_tickets_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached tickets:', e);
      }
    }
    return INITIAL_COMPLAINT_TICKETS;
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    INITIAL_COMPLAINT_TICKETS[0].id
  );

  const [currentRole, setCurrentRole] = useState<UserRole>('QC_RD');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('tpu_complaint_tickets_v1', JSON.stringify(tickets));
  }, [tickets]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;
  const currentCoaBatch = selectedTicket
    ? INITIAL_COA_BATCHES.find((b) => b.lotNo === selectedTicket.lotNo) || INITIAL_COA_BATCHES[0]
    : INITIAL_COA_BATCHES[0];

  const handleSelectTicket = (ticket: ComplaintTicket) => {
    setSelectedTicketId(ticket.id);
  };

  const handleCreateTicket = (newTicket: ComplaintTicket) => {
    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketOpen(false);
    setActiveTab('dashboard');
  };

  const handleUpdateProcessConditions = (updatedConditions: ProcessCondition) => {
    if (!selectedTicket) return;
    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          clientProcessConditions: updatedConditions,
          status: t.status === 'RECEIVED' ? ('PARAM_ALIGNING' as const) : t.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    setTickets(updated);
  };

  const handleUpdateAiResult = (result: AiRootCauseResult) => {
    if (!selectedTicket) return;
    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          aiAnalysis: result,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    setTickets(updated);
  };

  const handleUpdateSignOff = (signOff: SignOffRecord, newStatus: ComplaintTicket['status']) => {
    if (!selectedTicket) return;
    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          signOff,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    setTickets(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* 3-Zone Top Navigation Bar & Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onNewTicketClick={() => setIsNewTicketOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Executive ROI & KPI Strip */}
        <KpiSummary tickets={tickets} />

        {/* Tab Content Routing */}
        {activeTab === 'dashboard' && (
          <ComplaintDashboard
            tickets={tickets}
            selectedTicket={selectedTicket}
            onSelectTicket={handleSelectTicket}
            onOpenProcessWizard={(t) => {
              setSelectedTicketId(t.id);
              setActiveTab('process');
            }}
            onOpenCoaMatching={(t) => {
              setSelectedTicketId(t.id);
              setActiveTab('traceability');
            }}
            onOpenAiAnalysis={(t) => {
              setSelectedTicketId(t.id);
              setActiveTab('ai-prediction');
            }}
            onOpenSignOff={(t) => {
              setSelectedTicketId(t.id);
              setActiveTab('sign-off');
            }}
            onOpenReport={(t) => {
              setSelectedTicketId(t.id);
              setIsReportOpen(true);
            }}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'process' && selectedTicket && (
          <ProcessVerificationWizard
            ticket={selectedTicket}
            onUpdateProcess={handleUpdateProcessConditions}
            onProceedToAi={() => setActiveTab('ai-prediction')}
          />
        )}

        {activeTab === 'traceability' && selectedTicket && (
          <CoaMatchingModule
            ticket={selectedTicket}
            onProceedToAi={() => setActiveTab('ai-prediction')}
          />
        )}

        {activeTab === 'ai-prediction' && selectedTicket && (
          <AiAnalysisModule
            ticket={selectedTicket}
            coaBatch={currentCoaBatch}
            onUpdateAiResult={handleUpdateAiResult}
            onProceedToSignOff={() => setActiveTab('sign-off')}
          />
        )}

        {activeTab === 'sign-off' && selectedTicket && (
          <HumanInTheLoopSignOff
            ticket={selectedTicket}
            onUpdateSignOff={handleUpdateSignOff}
            currentRole={currentRole}
            onExportReport={() => setIsReportOpen(true)}
          />
        )}

      </main>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* 8D Report Export Modal */}
      {selectedTicket && (
        <ReportExportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          ticket={selectedTicket}
          coaBatch={currentCoaBatch}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">TPU PolymerGuard</span>
            <span>·</span>
            <span>熱塑性聚胺酯材料拉伸不足客訴智慧化管理平台</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>ASTM D412 / ISO 37 規範對標</span>
            <span>·</span>
            <span>IATF 16949 / ISO 9001 8D 體系</span>
            <span>·</span>
            <span>SLA 48h 閉環控制</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
