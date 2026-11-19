'use client';

import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Layers,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  weight: number;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'objective',
    category: 'Business Strategy',
    title: 'Single Measurable Problem & Baseline KPI Defined',
    description: 'A specific baseline metric (e.g. handling time, error rate) and concrete success criteria are documented.',
    weight: 15,
  },
  {
    id: 'data',
    category: 'Data Architecture',
    title: 'Live Source-of-Truth Data Audited & Synced',
    description: 'System connects to verified live data (ERP/CRM/vector DB) with freshness guarantees, not static CSVs.',
    weight: 20,
  },
  {
    id: 'integration',
    category: 'System Integration',
    title: 'End-to-End Workflow Integrated via APIs',
    description: 'System completes full business actions (updates CRM, triggers orders) rather than isolated text generation.',
    weight: 20,
  },
  {
    id: 'testing',
    category: 'Testing & Stress-Cases',
    title: 'Realistic Edge Cases & Prompt Injections Tested',
    description: 'System evaluated against missing inputs, conflicting data, out-of-scope queries, and malicious injections.',
    weight: 15,
  },
  {
    id: 'governance',
    category: 'Security & Oversight',
    title: 'Least-Privilege RBAC & Human Escalation Built In',
    description: 'Sensitive/financial operations require human sign-off; audit logging and session isolation enforced.',
    weight: 15,
  },
  {
    id: 'ownership',
    category: 'Operations & TCO',
    title: 'Operational Owner Assigned & Telemetry Configured',
    description: 'Designated business & tech owners monitor accuracy drift, API cost per task, and system latency.',
    weight: 15,
  },
];

export default function AiReadinessCalculator() {
  const [activeTab, setActiveTab] = useState<'readiness' | 'roi'>('readiness');

  // Readiness State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    objective: true,
    data: false,
    integration: false,
    testing: false,
    governance: false,
    ownership: false,
  });

  // ROI / TCO State
  const [monthlyTasks, setMonthlyTasks] = useState<number>(5000);
  const [minutesPerTask, setMinutesPerTask] = useState<number>(12);
  const [hourlyWage, setHourlyWage] = useState<number>(35);
  const [automationRate, setAutomationRate] = useState<number>(65);
  const [modelTier, setModelTier] = useState<'fast' | 'balanced' | 'enterprise'>('balanced');

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetChecklist = () => {
    setCheckedItems({
      objective: true,
      data: false,
      integration: false,
      testing: false,
      governance: false,
      ownership: false,
    });
  };

  // Calculate Readiness Score
  const readinessScore = CHECKLIST_ITEMS.reduce((score, item) => {
    return score + (checkedItems[item.id] ? item.weight : 0);
  }, 0);

  const getReadinessTier = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Production Ready',
        status: 'Enterprise Grade',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        icon: ShieldCheck,
        summary: 'Your architecture has the essential data freshness, workflow integration, security boundaries, and telemetry needed to thrive in enterprise production.',
      };
    }
    if (score >= 50) {
      return {
        label: 'Pilot Ready (Controlled)',
        status: 'Hardening Required',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        icon: AlertTriangle,
        summary: 'Suitable for a supervised internal pilot with friendly users. Do NOT launch to customers until data integration, security controls, and edge-case testing are locked down.',
      };
    }
    return {
      label: 'Lab Prototype / Demo Only',
      status: 'High Failure Risk',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      icon: AlertTriangle,
      summary: 'High risk of failure. This project works in a demo environment but will likely stall upon connecting to real messy business data and customer workflows.',
    };
  };

  const tier = getReadinessTier(readinessScore);

  // ROI / TCO Calculations
  // Manual Current Cost
  const manualHoursPerMonth = (monthlyTasks * minutesPerTask) / 60;
  const currentManualCost = manualHoursPerMonth * hourlyWage;

  // AI Automated Volume
  const automatedTasks = Math.round(monthlyTasks * (automationRate / 100));
  const humanEscalatedTasks = monthlyTasks - automatedTasks;

  // AI Operational Cost Breakdown (Monthly)
  const modelCostPerTask =
    modelTier === 'fast' ? 0.008 : modelTier === 'balanced' ? 0.025 : 0.075;
  const monthlyApiCost = monthlyTasks * modelCostPerTask;
  const monthlyInfraCost = modelTier === 'fast' ? 120 : modelTier === 'balanced' ? 250 : 550;
  const monthlyMaintenanceOps = modelTier === 'fast' ? 250 : modelTier === 'balanced' ? 450 : 850;
  // Human review for remaining tasks (e.g. 15% time on escalated tasks)
  const escalatedHumanHours = (humanEscalatedTasks * (minutesPerTask * 0.8)) / 60;
  const humanReviewCost = escalatedHumanHours * hourlyWage;

  const totalAiSystemCost = monthlyApiCost + monthlyInfraCost + monthlyMaintenanceOps + humanReviewCost;
  const netMonthlyBenefit = currentManualCost - totalAiSystemCost;
  const costPerSuccessfulTask = totalAiSystemCost / Math.max(automatedTasks, 1);
  const manualCostPerTask = currentManualCost / Math.max(monthlyTasks, 1);
  const annualNetSavings = Math.max(0, netMonthlyBenefit * 12);

  return (
    <div className="w-full my-12 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden text-slate-100">
      {/* Top Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Interactive Strategic Tool
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Demo-to-Production Readiness &amp; TCO Calculator
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Evaluate whether your AI prototype is actually ready for real business operations, and simulate the true Total Cost of Ownership (TCO) vs. expected manual savings.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-700/70 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('readiness')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'readiness'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Readiness Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('roi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'roi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>TCO &amp; ROI Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: READINESS AUDIT */}
      {activeTab === 'readiness' && (
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Checklist Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Implemented Production Safeguards
                </span>
                <button
                  onClick={handleResetChecklist}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to Demo State</span>
                </button>
              </div>

              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = checkedItems[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                      isChecked
                        ? 'bg-slate-800/90 border-blue-500/60 shadow-sm'
                        : 'bg-slate-800/30 border-slate-700/60 hover:bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        isChecked
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'border-slate-500 bg-slate-900 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white leading-snug">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-slate-400 shrink-0">
                          +{item.weight}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score & Verdict Column (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Production Readiness Score
                </span>

                {/* Score Number & Gauge */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                    {readinessScore}%
                  </span>
                  <span className={`text-sm font-bold uppercase tracking-wider ${tier.color}`}>
                    {tier.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full transition-all duration-500 ${
                      readinessScore >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : readinessScore >= 50
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-600 to-orange-500'
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>

                {/* Status Box */}
                <div className={`p-4 rounded-xl border ${tier.bgColor} ${tier.borderColor} mb-6`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <tier.icon className={`w-5 h-5 ${tier.color}`} />
                    <span className={`text-sm font-bold ${tier.color}`}>
                      Assessment: {tier.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tier.summary}
                  </p>
                </div>

                {/* Key Gaps List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">
                    Critical Gaps to Resolve Prior to Scale:
                  </span>
                  {CHECKLIST_ITEMS.filter((item) => !checkedItems[item.id]).length === 0 ? (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>All production criteria validated. Proceed with monitored rollout.</span>
                    </div>
                  ) : (
                    CHECKLIST_ITEMS.filter((item) => !checkedItems[item.id]).map((item) => (
                      <div
                        key={item.id}
                        className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                      >
                        <span className="text-rose-400 font-bold">•</span>
                        <span>
                          <strong className="text-white">{item.category}:</strong> {item.title}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Callout Footer */}
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Formula based on Section 6 Checklist</span>
                <button
                  onClick={() => setActiveTab('roi')}
                  className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300"
                >
                  <span>Check TCO &amp; ROI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TCO & ROI SIMULATOR */}
      {activeTab === 'roi' && (
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Monthly Task Volume */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Monthly Work Tasks / Customer Inquiries
                  </label>
                  <span className="text-sm font-mono font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-800/50">
                    {monthlyTasks.toLocaleString()} tasks
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={monthlyTasks}
                  onChange={(e) => setMonthlyTasks(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>500 (Small team)</span>
                  <span>25,000</span>
                  <span>50,000 (Enterprise)</span>
                </div>
              </div>

              {/* Slider 2: Current Minutes Per Task */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Current Manual Handling Time per Task
                  </label>
                  <span className="text-sm font-mono font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-800/50">
                    {minutesPerTask} minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="45"
                  step="1"
                  value={minutesPerTask}
                  onChange={(e) => setMinutesPerTask(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>2 mins (Quick query)</span>
                  <span>20 mins</span>
                  <span>45 mins (Document review)</span>
                </div>
              </div>

              {/* Slider 3: Employee Hourly Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Blended Employee Hourly Cost ($/hr)
                  </label>
                  <span className="text-sm font-mono font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-800/50">
                    ${hourlyWage}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="120"
                  step="2"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$18/hr</span>
                  <span>$60/hr</span>
                  <span>$120/hr (Specialized)</span>
                </div>
              </div>

              {/* Slider 4: AI Automation / Deflection Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Expected AI Automation / Deflection Rate (%)
                  </label>
                  <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                    {automationRate}% automated
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={automationRate}
                  onChange={(e) => setAutomationRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>20% (Conservative)</span>
                  <span>65% (Recommended target)</span>
                  <span>90% (Aggressive)</span>
                </div>
              </div>

              {/* Model Tier Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Model &amp; Infrastructure Architecture Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setModelTier('fast')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modelTier === 'fast'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Light / Fast</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">~$0.008 / task</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelTier('balanced')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modelTier === 'balanced'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Balanced RAG</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">~$0.025 / task</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelTier('enterprise')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modelTier === 'enterprise'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Multi-Agent</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">~$0.075 / task</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Verdict Column (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Net Financial Impact Simulation
                </span>

                {/* Net Savings Box */}
                <div className="mb-6">
                  <div className="text-xs text-slate-400">Estimated Net Monthly Savings:</div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight mt-1">
                    ${Math.max(0, Math.round(netMonthlyBenefit)).toLocaleString()}
                    <span className="text-sm font-normal text-slate-400">/mo</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Annualized Value:{' '}
                    <strong className="text-white">${Math.round(annualNetSavings).toLocaleString()} / year</strong>
                  </div>
                </div>

                {/* Cost Comparison Breakdown */}
                <div className="space-y-3 mb-6 bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Current Manual Process Cost:</span>
                    <span className="font-mono font-bold text-white">
                      ${Math.round(currentManualCost).toLocaleString()} /mo
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Model API &amp; LLM Calls:</span>
                    <span className="font-mono text-slate-200">
                      ${Math.round(monthlyApiCost).toLocaleString()} /mo
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Cloud Infra &amp; Vector DB:</span>
                    <span className="font-mono text-slate-200">${monthlyInfraCost} /mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Ongoing Engineering &amp; Ops:</span>
                    <span className="font-mono text-slate-200">${monthlyMaintenanceOps} /mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Human Escalation Handling:</span>
                    <span className="font-mono text-slate-200">
                      ${Math.round(humanReviewCost).toLocaleString()} /mo
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold text-sm">
                    <span className="text-slate-200">Total AI System TCO:</span>
                    <span className="font-mono text-rose-400">
                      ${Math.round(totalAiSystemCost).toLocaleString()} /mo
                    </span>
                  </div>
                </div>

                {/* Efficiency Metric */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Manual Cost / Task</div>
                    <div className="text-base font-bold font-mono text-slate-200 mt-1">
                      ${manualCostPerTask.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/40">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">AI Cost / Task</div>
                    <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                      ${costPerSuccessfulTask.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula note */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-blue-400" />
                Formula reflects total production footprint: Development + Infrastructure + API Usage + Maintenance + Human Escalation (Section 2, Reason 6).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
