import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ComplaintTicket, ProcessCondition } from '../types/tpu';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: ComplaintTicket) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [lotNo, setLotNo] = useState('LOT-20261015-85A');
  const [productGrade, setProductGrade] = useState('TPU-85A-EST (聚酯型)');
  const [purchaseDate, setPurchaseDate] = useState('2026-10-20');
  const [incidentDate, setIncidentDate] = useState('2026-10-26');
  const [defectDescription, setDefectDescription] = useState('');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  
  // Test Data
  const [tensileStrength, setTensileStrength] = useState<number>(29.2);
  const [elongationAtBreak, setElongationAtBreak] = useState<number>(370);
  const [hardness, setHardness] = useState('85A');
  const [moisturePpm, setMoisturePpm] = useState<number>(450);

  // Process Conditions
  const [dryingTemp, setDryingTemp] = useState<number>(85);
  const [dryingHours, setDryingHours] = useState<number>(2.0);
  const [dewPoint, setDewPoint] = useState<number>(-15);
  const [meteringTemp, setMeteringTemp] = useState<number>(195);
  const [moldTemp, setMoldTemp] = useState<number>(25);
  const [testSpeed, setTestSpeed] = useState<number>(500);

  if (!isOpen) return null;

  const handleApplyPreset = (type: 'hydrolysis' | 'shear' | 'defect') => {
    if (type === 'hydrolysis') {
      setCustomerName('欣興運動護具股份有限公司 (Apex Sports)');
      setContactPerson('陳宏毅 品保組長');
      setContactEmail('hy.chen@apex-sports.example.com');
      setLotNo('LOT-20261015-85A');
      setProductGrade('TPU-85A-EST (聚酯型)');
      setPurchaseDate('2026-10-18');
      setIncidentDate('2026-10-26');
      setDefectDescription('產線拉伸測試於標線內提早脆斷，實測斷裂伸長率僅 350%（要求 ≥550%），拉伸強度 27.5 MPa，斷面粗糙有氣孔跡象。');
      setSeverity('CRITICAL');
      setTensileStrength(27.5);
      setElongationAtBreak(350);
      setHardness('84A');
      setMoisturePpm(490);
      setDryingTemp(80);
      setDryingHours(2);
      setDewPoint(-10);
      setMeteringTemp(195);
      setMoldTemp(25);
      setTestSpeed(500);
    } else if (type === 'shear') {
      setCustomerName('立訊光通訊線纜廠 (Luxnet Cable)');
      setContactPerson('黃淑真 研發工程師');
      setContactEmail('sc.huang@luxnet.example.com');
      setLotNo('LOT-20260928-95A');
      setProductGrade('TPU-95A-ETH (聚醚型)');
      setPurchaseDate('2026-10-12');
      setIncidentDate('2026-10-26');
      setDefectDescription('高速押出護套表面輕微泛黃，抗張拉伸破壞強度 43.8 MPa 雖及格，但斷裂伸長率 395% 未達 480% 標準，疑為剪切過熱降解。');
      setSeverity('HIGH');
      setTensileStrength(43.8);
      setElongationAtBreak(395);
      setHardness('95A');
      setMoisturePpm(130);
      setDryingTemp(105);
      setDryingHours(4.0);
      setDewPoint(-35);
      setMeteringTemp(225); // 剪切過熱
      setMoldTemp(35);
      setTestSpeed(200);
    } else {
      setCustomerName('台精工業機械齒輪廠 (TS Precision)');
      setContactPerson('吳志遠 廠長');
      setContactEmail('cw.wu@t-precision.example.com');
      setLotNo('LOT-20261002-64D');
      setProductGrade('TPU-64D-ENG (工程級高硬度)');
      setPurchaseDate('2026-10-10');
      setIncidentDate('2026-10-26');
      setDefectDescription('齒輪齒部受力拉伸脆斷，實測強度 35.8 MPa 遠低於 52 MPa 規格，客戶端標準烘料 110°C 4.5h 且經退火，懷疑為原料出廠品質異常。');
      setSeverity('CRITICAL');
      setTensileStrength(35.8);
      setElongationAtBreak(260);
      setHardness('63D');
      setMoisturePpm(150);
      setDryingTemp(110);
      setDryingHours(4.5);
      setDewPoint(-40);
      setMeteringTemp(210);
      setMoldTemp(45);
      setTestSpeed(200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !defectDescription.trim()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `TPU-2026-${randomNum}`;
    const now = new Date().toISOString();
    const deadline = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

    const newTicket: ComplaintTicket = {
      id: newId,
      customerName,
      contactPerson: contactPerson || '採購/品管課',
      contactEmail: contactEmail || 'qa@customer.example.com',
      productGrade,
      lotNo,
      purchaseDate,
      incidentDate,
      defectCategory: 'TENSILE_BREAK',
      defectDescription,
      severity,
      status: 'RECEIVED',
      createdAt: now,
      updatedAt: now,
      slaDeadline: deadline,
      attachments: [
        { name: `${customerName.substring(0, 4)}_拉伸測試報告_ASTM.pdf`, type: 'PDF', size: '1.9 MB' },
        { name: '不良品斷裂巨觀相片.jpg', type: 'IMAGE', size: '2.5 MB' },
      ],
      clientTestingData: {
        tensileStrength,
        elongationAtBreak,
        hardness,
        moistureMeasuredPpm: moisturePpm,
        testStandard: 'ASTM D412 Die C (500 mm/min)',
      },
      clientProcessConditions: {
        dryingTemp,
        dryingHours,
        dewPoint,
        feedZoneTemp: 175,
        compressionTemp: 185,
        meteringTemp,
        nozzleTemp: meteringTemp + 2,
        moldTemp,
        injectionSpeed: 45,
        testSpeed,
        specimenConditioning: '客戶端常溫放置 2 小時後測試',
        isDryerDehumidified: dewPoint <= -25,
      },
      signOff: {
        qcDirectorApproved: false,
        rdLeadApproved: false,
        salesRepApproved: false,
      },
    };

    onSubmit(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">數位化客訴登錄 (New Complaint Ticket)</h2>
            <p className="text-xs text-slate-500 mt-0.5">系統將自動生成專屬工單單號並派發業務窗口與QC實驗室</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Filler */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            快速帶入模擬案例：
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('hydrolysis')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
            >
              烘料不足水解案例
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('shear')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
            >
              剪切過熱降解案例
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('defect')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
            >
              原料聚合疑似異常案例
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                客戶公司名稱 *
              </label>
              <input
                type="text"
                required
                placeholder="例如：宏達精密鞋業射出廠"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                產品批號 (Lot No.) *
              </label>
              <select
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white font-mono"
              >
                <option value="LOT-20261015-85A">LOT-20261015-85A (TPU-85A-EST 聚酯型)</option>
                <option value="LOT-20260928-95A">LOT-20260928-95A (TPU-95A-ETH 聚醚型)</option>
                <option value="LOT-20261002-64D">LOT-20261002-64D (TPU-64D-ENG 工程級)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                聯絡人姓名 / 課別
              </label>
              <input
                type="text"
                placeholder="例如：林建宏 經理 (品保課)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                購料日期
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white font-mono"
              />
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              不良現象與客訴描述 *
            </label>
            <textarea
              required
              rows={3}
              placeholder="請詳細描述拉伸不足、斷裂伸長率不達標、表面泛白或產線斷料情境..."
              value={defectDescription}
              onChange={(e) => setDefectDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Section: Client Test Data (ASTM D412) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">客戶端實測物性數據 (ASTM D412)</span>
              <span className="text-[11px] text-slate-500 font-mono">拉伸速度 500 mm/min</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">實測拉伸強度 (MPa)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tensileStrength}
                  onChange={(e) => setTensileStrength(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">斷裂伸長率 (%)</label>
                <input
                  type="number"
                  value={elongationAtBreak}
                  onChange={(e) => setElongationAtBreak(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono font-bold text-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">實測硬度 (Shore)</label>
                <input
                  type="text"
                  value={hardness}
                  onChange={(e) => setHardness(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">實測水分含量 (ppm)</label>
                <input
                  type="number"
                  value={moisturePpm}
                  onChange={(e) => setMoisturePpm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section: Client Processing Conditions */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">客戶端加工與烘乾條件</span>
              <span className="text-[11px] text-slate-500">標準建議：≥100°C / ≥4h / 露點≤-30°C</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">烘料溫度 (°C)</label>
                <input
                  type="number"
                  value={dryingTemp}
                  onChange={(e) => setDryingTemp(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">烘乾時間 (小時)</label>
                <input
                  type="number"
                  step="0.5"
                  value={dryingHours}
                  onChange={(e) => setDryingHours(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">除濕露點 Dew Point (°C)</label>
                <input
                  type="number"
                  value={dewPoint}
                  onChange={(e) => setDewPoint(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">射出熔膠溫度 (°C)</label>
                <input
                  type="number"
                  value={meteringTemp}
                  onChange={(e) => setMeteringTemp(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Attachments Upload Mock */}
          <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
            <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <div className="text-xs text-slate-700 font-medium">
              拖曳或點選上傳拉力測試報告 (PDF/Excel) 與斷裂樣品照片
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              已自動掛載預設測試曲線報告與電子顯微鏡斷面照
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              確認登錄並啟動 48h SLA 追蹤
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
