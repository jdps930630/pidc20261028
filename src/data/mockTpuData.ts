import { CoaBatchRecord, ComplaintTicket, ProcessCheckRule } from '../types/tpu';

export const INITIAL_COA_BATCHES: CoaBatchRecord[] = [
  {
    lotNo: 'LOT-20261015-85A',
    grade: 'TPU-85A-EST',
    basePolymer: 'Polyester',
    productionDate: '2026-10-15',
    reactorId: 'RX-02 (4000L 主反應釜)',
    reactorTemp: 198.5,
    reactorTempVariance: 1.2,
    vacuumDehydrationRate: 98.4,
    viscosityDeviation: 3.8,
    productionMoisturePpm: 110,
    coaProperties: {
      hardness: '85A',
      tensileStrength: 42.5,
      elongationAtBreak: 580,
      tensileStress100: 6.8,
      tensileStress300: 14.5,
      tearStrength: 115,
      meltFlowRate: 18.2,
      moisturePpm: 120,
    },
    retestProperties: {
      hardness: '85A',
      tensileStrength: 41.8,
      elongationAtBreak: 575,
      tensileStress100: 6.7,
      tensileStress300: 14.2,
      tearStrength: 112,
      meltFlowRate: 18.6,
      moisturePpm: 135,
    },
  },
  {
    lotNo: 'LOT-20260928-95A',
    grade: 'TPU-95A-ETH',
    basePolymer: 'Polyether',
    productionDate: '2026-09-28',
    reactorId: 'RX-01 (6000L 主反應釜)',
    reactorTemp: 202.1,
    reactorTempVariance: 1.5,
    vacuumDehydrationRate: 98.9,
    viscosityDeviation: 4.2,
    productionMoisturePpm: 95,
    coaProperties: {
      hardness: '95A',
      tensileStrength: 48.0,
      elongationAtBreak: 490,
      tensileStress100: 11.2,
      tensileStress300: 24.5,
      tearStrength: 138,
      meltFlowRate: 14.5,
      moisturePpm: 105,
    },
    retestProperties: {
      hardness: '95A',
      tensileStrength: 47.6,
      elongationAtBreak: 485,
      tensileStress100: 11.0,
      tensileStress300: 24.1,
      tearStrength: 135,
      meltFlowRate: 14.8,
      moisturePpm: 115,
    },
  },
  {
    lotNo: 'LOT-20261002-64D',
    grade: 'TPU-64D-ENG',
    basePolymer: 'Polyester',
    productionDate: '2026-10-02',
    reactorId: 'RX-03 (3000L 特用反應釜)',
    reactorTemp: 205.0,
    reactorTempVariance: 4.1, // 異常波動
    vacuumDehydrationRate: 93.5, // 脫水偏低
    viscosityDeviation: 13.5, // 黏度偏差
    productionMoisturePpm: 230,
    coaProperties: {
      hardness: '64D',
      tensileStrength: 52.0,
      elongationAtBreak: 420,
      tensileStress100: 18.5,
      tensileStress300: 36.0,
      tearStrength: 165,
      meltFlowRate: 22.0,
      moisturePpm: 210,
    },
    retestProperties: {
      hardness: '63D',
      tensileStrength: 38.5, // 留樣已降解
      elongationAtBreak: 280,
      tensileStress100: 15.2,
      tensileStress300: 28.0,
      tearStrength: 125,
      meltFlowRate: 31.5,
      moisturePpm: 340,
    },
  },
];

export const INITIAL_COMPLAINT_TICKETS: ComplaintTicket[] = [
  {
    id: 'TPU-2026-1042',
    customerName: '宏達精密鞋業射出廠 (GrandShoe Tech)',
    contactPerson: '林建宏 經理 (品保課)',
    contactEmail: 'jh.lin@grandshoe.example.com',
    productGrade: 'TPU-85A-EST (聚酯型高彈性規格)',
    lotNo: 'LOT-20261015-85A',
    purchaseDate: '2026-10-18',
    incidentDate: '2026-10-24',
    defectCategory: 'TENSILE_BREAK',
    defectDescription: '射出鞋大底進行拉伸測試時過早脆斷，延伸率僅 360%（標準規範需 ≥550%），拉伸強度實測 28.5 MPa（COA 標稱 42.5 MPa），產線全檢不良率攀升至 18.5%。',
    severity: 'CRITICAL',
    status: 'PARAM_ALIGNING',
    createdAt: '2026-10-24T09:30:00Z',
    updatedAt: '2026-10-26T14:15:00Z',
    slaDeadline: '2026-10-26T09:30:00Z', // 48小時標竿
    attachments: [
      { name: 'GrandShoe_Tensile_Test_Report_1024.pdf', type: 'PDF', size: '2.4 MB' },
      { name: 'Brittle_Fracture_Microscope.jpg', type: 'IMAGE', size: '1.8 MB' },
      { name: 'Production_Log_Line4.xlsx', type: 'EXCEL', size: '420 KB' },
    ],
    clientTestingData: {
      tensileStrength: 28.5,
      elongationAtBreak: 360,
      hardness: '84A',
      moistureMeasuredPpm: 480, // 水分超標
      testStandard: 'ASTM D412 Die C (500 mm/min)',
    },
    clientProcessConditions: {
      dryingTemp: 80,          // 嚴重過低 (標準 100-110°C)
      dryingHours: 2.0,        // 嚴重不足 (標準 3-4h)
      dewPoint: -12,           // 露點不足 (標準 <= -30°C)
      feedZoneTemp: 175,
      compressionTemp: 185,
      meteringTemp: 195,
      nozzleTemp: 198,
      moldTemp: 25,
      injectionSpeed: 45,
      testSpeed: 500,
      specimenConditioning: '成型後常溫冷卻 2 小時立即拉伸 (未依規範退火 20h)',
      isDryerDehumidified: false, // 僅使用一般熱風烘箱
    },
    aiAnalysis: {
      primaryCause: '客戶烘料條件嚴重不足導致 TPU 氨基甲酸酯基團高溫水解 (Hydrolysis)',
      confidenceScore: 89,
      attribution: '客戶端加工條件不當',
      mechanismAnalysis: '聚酯型 TPU 具極強吸濕性。客戶端僅使用熱風烘箱於 80°C 烘烤 2 小時，殘留水分高達 480 ppm。在 195°C 熔融注射時，水分子催化水解鍵結裂解，重均分子量由 185,000 下降至 112,000，引發假性原料延伸率衰退。此外，成型後未退火即行測試，殘留內應力加速斷裂。',
      rootCauseRankings: [
        {
          rank: 1,
          cause: '原料吸濕於料筒高溫水解裂解 (Moisture Hydrolysis)',
          probability: 89,
          description: '烘料溫度未達 100°C 且無除濕露點控制，射出料筒內分子鏈水解斷裂。',
        },
        {
          rank: 2,
          cause: '試片未退火調濕即拉伸 (Testing Method Deviation)',
          probability: 58,
          description: 'ASTM D412 要求成型後於 23°C 50%RH 調濕至少 24 小時使微相結構重新排列。',
        },
        {
          rank: 3,
          cause: '原料合成聚合度批次離散 (Raw Material Variance)',
          probability: 14,
          description: '原廠出廠 COA 與留樣複測數據吻合 (42.5 vs 41.8 MPa)，原料批次體質無異常。',
        },
      ],
      recommendedActions: [
        {
          phase: '現場緊急導正',
          action: '立即停用一般熱風箱，改調用除濕乾燥機設定 105°C 烘烤 4 小時以上（露點確保 ≤ -30°C），並抽取射出前原料實測水分需 < 200 ppm。',
        },
        {
          phase: '標準試片退火複驗',
          action: '請業務協助將已烘乾原粒帶回原廠實驗室標準機台進行對比試片注塑，經 100°C 20hr 退火後複驗拉伸，預計拉伸強度可回升至 41 MPa 以上。',
        },
        {
          phase: '客戶端簽核協議',
          action: '出具加工工藝符合性對焦評估表，業務窗口與客戶品保主管對焦，排定 FAE 到廠技術輔導。',
        },
      ],
      source: 'expert-polymer-engine',
      analyzedAt: '2026-10-25T11:20:00Z',
    },
    signOff: {
      qcDirectorApproved: true,
      qcDirectorName: '張品管 主任 (QC Director)',
      qcDirectorDate: '2026-10-25 14:30',
      qcDirectorNotes: '留樣複測拉伸 41.8 MPa 符合出廠規格。客戶實測 28.5 MPa 係因烘乾不足水解所致，同意技術判定為客戶端加工參數偏差。',

      rdLeadApproved: true,
      rdLeadName: '陳研發 博士 (Polymer R&D Lead)',
      rdLeadDate: '2026-10-25 16:10',
      rdLeadNotes: '紅外光譜 (FTIR) 留樣無異常羥基副反應峰，GPC 測試留樣分子量 18.2 萬正常。建議出具除濕工藝指南並派駐 FAE 協助產線調整。',

      salesRepApproved: false,
      salesRepName: '',
      salesRepDate: '',
      salesRepNotes: '',

      finalAttribution: 'CUSTOMER_PROCESS',
      finalAction: 'ONSITE_FAE_DISPATCH',
      decisionTimestamp: '',
    },
  },
  {
    id: 'TPU-2026-1039',
    customerName: '聯創光電護套工程 (NexCable Corp)',
    contactPerson: '王冠宇 專案副理',
    contactEmail: 'ky.wang@nexcable.example.com',
    productGrade: 'TPU-95A-ETH (聚醚型高耐磨抗水解規格)',
    lotNo: 'LOT-20260928-95A',
    purchaseDate: '2026-10-05',
    incidentDate: '2026-10-21',
    defectCategory: 'ELONGATION_FAIL',
    defectDescription: '押出電纜外被護套拉伸試驗，斷裂伸長率實測 410%（要求 ≥480%），撕裂抗力偏低。',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: '2026-10-21T08:00:00Z',
    updatedAt: '2026-10-23T16:00:00Z',
    slaDeadline: '2026-10-23T08:00:00Z',
    attachments: [
      { name: 'Cable_Tensile_ASTM_D412.pdf', type: 'PDF', size: '1.2 MB' },
    ],
    clientTestingData: {
      tensileStrength: 45.2,
      elongationAtBreak: 410,
      hardness: '95A',
      moistureMeasuredPpm: 140,
      testStandard: 'ASTM D412 Die C (200 mm/min)',
    },
    clientProcessConditions: {
      dryingTemp: 105,
      dryingHours: 4.5,
      dewPoint: -35,
      feedZoneTemp: 180,
      compressionTemp: 195,
      meteringTemp: 218, // 偏高
      nozzleTemp: 220, // 偏高，螺桿剪切過熱
      moldTemp: 30,
      injectionSpeed: 30,
      testSpeed: 200, // 測試速度不同
      specimenConditioning: '常溫放置 24 小時',
      isDryerDehumidified: true,
    },
    aiAnalysis: {
      primaryCause: '押出螺桿末端剪切過熱導致熱氧分解，且拉伸測試速度偏低 (200 vs 500 mm/min)',
      confidenceScore: 82,
      attribution: '共同複合因素',
      mechanismAnalysis: '聚醚型 TPU 本身耐水解極佳，烘乾條件完全符合規範。然而押出計量段與口模溫度高達 220°C，且螺桿轉速過高造成局部剪切熱，使得部分醚鍵分子鏈發生熱降解。此外，拉伸試驗速度採用 200 mm/min，相較標稱 ASTM D412 速度 500 mm/min，高彈性聚合物之延展變形應變率會偏低。',
      rootCauseRankings: [
        {
          rank: 1,
          cause: '螺桿剪切局部過熱降解',
          probability: 82,
          description: '口模溫度設定過高，熔融指數上升。',
        },
        {
          rank: 2,
          cause: '測試速度差異造成應變率效應 (Strain Rate Effect)',
          probability: 65,
          description: '200mm/min 速度下 TPU 延伸率比 500mm/min 低約 10~15%。',
        },
      ],
      recommendedActions: [
        {
          phase: '押出工藝優化',
          action: '將押出末端溫度下調 10~15°C 至 205°C，並調降螺桿轉速以降低剪切升溫。',
        },
        {
          phase: '實驗標準校正',
          action: '拉伸測試速度統一調整為 ASTM D412 標準 500 mm/min。',
        },
      ],
      source: 'expert-polymer-engine',
      analyzedAt: '2026-10-21T14:00:00Z',
    },
    signOff: {
      qcDirectorApproved: true,
      qcDirectorName: '張品管 主任',
      qcDirectorDate: '2026-10-22 10:00',
      qcDirectorNotes: '出廠 COA 48.0 MPa 正常，客戶降溫至 205°C 後複測延伸率達 485%，確認結案。',

      rdLeadApproved: true,
      rdLeadName: '陳研發 博士',
      rdLeadDate: '2026-10-22 11:30',
      rdLeadNotes: '提供熱剪切加工窗口參數建議表，結案無異議。',

      salesRepApproved: true,
      salesRepName: '黃業務 總監',
      salesRepDate: '2026-10-22 15:45',
      salesRepNotes: '客戶對技術對策與 28 小時內結案滿意度評分給予 5 顆星。',

      finalAttribution: 'CUSTOMER_PROCESS',
      finalAction: 'PROCESS_COACHING',
      decisionTimestamp: '2026-10-22 15:45',
    },
  },
  {
    id: 'TPU-2026-1045',
    customerName: '富邦精密傳動元件 (Fortis Gear & Drive)',
    contactPerson: '周天成 廠長',
    contactEmail: 'tc.chou@fortis.example.com',
    productGrade: 'TPU-64D-ENG (高硬度工程級規格)',
    lotNo: 'LOT-20261002-64D',
    purchaseDate: '2026-10-10',
    incidentDate: '2026-10-26',
    defectCategory: 'TENSILE_BREAK',
    defectDescription: '高硬度齒輪注塑成型後做抗拉破壞試驗，拉伸強度僅 36.2 MPa（規格要求 ≥50 MPa），斷裂伸長率僅 270%（規格 ≥400%），試片斷面呈現粗糙無光澤脆裂。',
    severity: 'CRITICAL',
    status: 'RECEIVED',
    createdAt: '2026-10-26T08:15:00Z',
    updatedAt: '2026-10-26T09:00:00Z',
    slaDeadline: '2026-10-28T08:15:00Z',
    attachments: [
      { name: 'Gear_Defect_Fracture.jpg', type: 'IMAGE', size: '3.1 MB' },
      { name: 'Fortis_QA_Sheet.pdf', type: 'PDF', size: '1.5 MB' },
    ],
    clientTestingData: {
      tensileStrength: 36.2,
      elongationAtBreak: 270,
      hardness: '63D',
      moistureMeasuredPpm: 160,
      testStandard: 'ISO 37 Type 2 (200 mm/min)',
    },
    clientProcessConditions: {
      dryingTemp: 110,
      dryingHours: 5.0,
      dewPoint: -40,
      feedZoneTemp: 190,
      compressionTemp: 205,
      meteringTemp: 210,
      nozzleTemp: 212,
      moldTemp: 45,
      injectionSpeed: 50,
      testSpeed: 200,
      specimenConditioning: '經 100°C 烘烤退火 20 小時',
      isDryerDehumidified: true,
    },
    signOff: {
      qcDirectorApproved: false,
      rdLeadApproved: false,
      salesRepApproved: false,
    },
  },
];

export const TPU_PROCESS_CHECK_RULES: ProcessCheckRule[] = [
  {
    key: 'dryingTemp',
    label: '原料烘乾溫度',
    unit: '°C',
    recommended: '100 ~ 110 °C',
    evaluator: (val: number) => {
      if (val < 90) return { pass: false, severity: 'danger', message: '溫度 < 90°C，水分無法有效脫附，極高機率引發熔融水解！' };
      if (val < 100) return { pass: false, severity: 'warning', message: '溫度 90~99°C 偏低，建議提高至 105°C。' };
      if (val > 115) return { pass: false, severity: 'warning', message: '溫度 > 115°C，可能引發顆粒表面黏結與微氧化。' };
      return { pass: true, severity: 'ok', message: '符合 TPU 原料標準烘料溫度區間。' };
    },
  },
  {
    key: 'dryingHours',
    label: '除濕乾燥時間',
    unit: '小時',
    recommended: '3.0 ~ 4.5 小時',
    evaluator: (val: number) => {
      if (val < 2.5) return { pass: false, severity: 'danger', message: '烘料時間 < 2.5 小時，內部未乾透，殘留水分偏高！' };
      if (val < 3.0) return { pass: false, severity: 'warning', message: '烘料時間略少，建議至少 3.5 小時。' };
      if (val > 8.0) return { pass: false, severity: 'warning', message: '過度烘烤 (>8h) 可能造成高分子微黃化或降解。' };
      return { pass: true, severity: 'ok', message: '乾燥時間充足。' };
    },
  },
  {
    key: 'dewPoint',
    label: '除濕機工作露點',
    unit: '°C',
    recommended: '≤ -30 °C',
    evaluator: (val: number) => {
      if (val > -20) return { pass: false, severity: 'danger', message: '露點高於 -20°C，乾燥空氣含水量過高，無法抽乾 TPU 結晶水！' };
      if (val > -30) return { pass: false, severity: 'warning', message: '露點介於 -20 ~ -30°C，建議檢查乾燥機分子篩。' };
      return { pass: true, severity: 'ok', message: '露點優異，乾燥空氣含水量極低。' };
    },
  },
  {
    key: 'moldTemp',
    label: '模具冷卻溫度',
    unit: '°C',
    recommended: '20 ~ 40 °C',
    evaluator: (val: number) => {
      if (val < 15) return { pass: false, severity: 'warning', message: '模溫過低 (<15°C)，可能產生表面流痕與凝固應力。' };
      if (val > 50) return { pass: false, severity: 'warning', message: '模溫過高 (>50°C)，脫模時間拉長且易變形。' };
      return { pass: true, severity: 'ok', message: '模溫設定合理。' };
    },
  },
  {
    key: 'testSpeed',
    label: '拉伸測試速度 (ASTM D412)',
    unit: 'mm/min',
    recommended: '500 mm/min (ASTM) 或 200 mm/min (ISO)',
    evaluator: (val: number) => {
      if (val !== 500 && val !== 200) {
        return { pass: false, severity: 'warning', message: `目前速度 ${val} mm/min 與標準 ASTM D412 (500) 或 ISO 37 (200) 不符，應變率不同會造成強度與延伸率差異。` };
      }
      return { pass: true, severity: 'ok', message: '符合國際標準測試速度規範。' };
    },
  },
];
