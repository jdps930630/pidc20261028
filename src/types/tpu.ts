/**
 * TPU 塑膠原料拉伸不足客訴改善與智慧化管理平台 - 核心資料型別定義
 */

export type UserRole = 'CLIENT' | 'SALES' | 'QC_RD';

export type TicketStatus = 
  | 'RECEIVED'        // 已收件
  | 'TESTING'         // 檢驗中
  | 'PARAM_ALIGNING'  // 參數對焦
  | 'SIGN_OFF'        // 審批簽核中
  | 'RESOLVED';       // 已結案

export type AttributionType = 
  | 'CUSTOMER_PROCESS'     // 客戶端操作不當 (烘料/溫度)
  | 'MATERIAL_DEFECT'      // 原料批次瑕疵 (分子量/副反應)
  | 'TESTING_DISCREPANCY'  // 測試條件/試片裁切偏差
  | 'COMBINED_FACTORS';    // 共同複合因素

export type ResolutionAction = 
  | 'REPLACE_BATCH'        // 補換貨重出
  | 'COMMERCIAL_REBATE'    // 商業折讓補償
  | 'ONSITE_FAE_DISPATCH'  // 現場技術支援派駐
  | 'PROCESS_COACHING';    // 加工工藝參數輔導

export interface ProcessCondition {
  dryingTemp: number;       // 烘乾溫度 (°C), 標準: 100-110°C
  dryingHours: number;      // 烘乾時間 (hrs), 標準: 3-4h
  dewPoint: number;         // 除濕機露點 (°C), 標準: <= -30°C
  feedZoneTemp: number;     // 進料段溫度 (°C)
  compressionTemp: number;  // 壓縮段溫度 (°C)
  meteringTemp: number;     // 計量段溫度 (°C)
  nozzleTemp: number;       // 噴嘴溫度 (°C)
  moldTemp: number;         // 模具溫度 (°C), 標準: 20-40°C
  injectionSpeed: number;   // 射出速度 (mm/s)
  testSpeed: number;        // ASTM D412 拉伸試驗機速度 (mm/min), 標準: 500
  specimenConditioning: string; // 試片退火與調濕狀態
  isDryerDehumidified: boolean; // 是否採用蜂巢式除濕乾燥機
}

export interface PhysicalProperties {
  hardness: string;         // 硬度 (Shore A / Shore D)
  tensileStrength: number;  // 拉伸強度 (MPa)
  elongationAtBreak: number;// 斷裂伸長率 (%)
  tensileStress100: number; // 100% 定伸應力 (MPa)
  tensileStress300: number; // 300% 定伸應力 (MPa)
  tearStrength: number;     // 撕裂強度 (kN/m)
  meltFlowRate: number;     // MVR / MFI (cm³/10min 或 g/10min)
  moisturePpm: number;      // 水分含量 (ppm, 標準 < 200ppm)
}

export interface CoaBatchRecord {
  lotNo: string;
  grade: string;
  basePolymer: 'Polyester' | 'Polyether' | 'Polycaprolactone';
  productionDate: string;
  reactorId: string;
  reactorTemp: number;      // 聚合反應溫度 (°C)
  reactorTempVariance: number; // 聚合反應溫度波動 (±°C)
  vacuumDehydrationRate: number; // 真空脫水率 (%)
  viscosityDeviation: number; // 熔融黏度偏差 (%)
  productionMoisturePpm: number;
  coaProperties: PhysicalProperties;
  retestProperties?: PhysicalProperties; // 實驗室留樣複測數據
}

export interface SignOffRecord {
  qcDirectorApproved: boolean;
  qcDirectorName?: string;
  qcDirectorDate?: string;
  qcDirectorNotes?: string;

  rdLeadApproved: boolean;
  rdLeadName?: string;
  rdLeadDate?: string;
  rdLeadNotes?: string;

  salesRepApproved: boolean;
  salesRepName?: string;
  salesRepDate?: string;
  salesRepNotes?: string;

  finalAttribution?: AttributionType;
  finalAction?: ResolutionAction;
  decisionTimestamp?: string;
}

export interface AiRootCauseResult {
  primaryCause: string;
  confidenceScore: number;
  attribution: string;
  mechanismAnalysis: string;
  rootCauseRankings: {
    rank: number;
    cause: string;
    probability: number;
    description: string;
  }[];
  recommendedActions: {
    phase: string;
    action: string;
  }[];
  source?: 'gemini-3.8-flash' | 'expert-polymer-engine';
  analyzedAt: string;
}

export interface ComplaintTicket {
  id: string; // e.g. TPU-2026-1042
  customerName: string;
  contactPerson: string;
  contactEmail: string;
  productGrade: string;
  lotNo: string;
  purchaseDate: string;
  incidentDate: string;
  defectCategory: 'TENSILE_BREAK' | 'ELONGATION_FAIL' | 'SURFACE_BRITTLE' | 'BUBBLE_SPLAY';
  defectDescription: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string; // 48小時目標
  attachments: {
    name: string;
    type: 'PDF' | 'EXCEL' | 'IMAGE';
    size: string;
  }[];
  clientTestingData: {
    tensileStrength: number;
    elongationAtBreak: number;
    hardness: string;
    moistureMeasuredPpm?: number;
    testStandard: string; // ASTM D412 / ISO 37
  };
  clientProcessConditions: ProcessCondition;
  aiAnalysis?: AiRootCauseResult;
  signOff: SignOffRecord;
}

export interface ProcessCheckRule {
  key: keyof ProcessCondition;
  label: string;
  unit: string;
  recommended: string;
  evaluator: (val: any) => { pass: boolean; severity: 'ok' | 'warning' | 'danger'; message: string };
}
