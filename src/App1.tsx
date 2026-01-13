import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutGrid,
  FileText,
  ShoppingCart,
  Building2,
  Users,
  Layers,
  Download,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  UserCircle,
  LogOut,
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Clock,
  AlertCircle,
  ChevronDown,
  BarChart3,
  FileDown,
  Settings,
  Coins,
  Sliders,
  Database,
  PieChart,
  Activity,
  Briefcase,
  Target,
  Zap,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Bot,
  Sparkles,
  MessageSquare,
  UploadCloud,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  Paperclip,
  Send,
  Edit3,
  Save,
  Code,
  FileUp,
  Cpu,
  Copy,
  Calculator,
  BookOpen,
  TrendingUp,
  Wallet,
  Banknote,
  Power,
  Play,
  AlertTriangle,
} from "lucide-react";

// ==========================================
// --- Mock Data & Interfaces ---
// ==========================================

// 1. 基础运营数据 (Legacy)
const MOCK_OLD_DATA = {
  tasks: [
    {
      id: "FLOW-241024-01",
      tenant: "阿里巴巴",
      user: "张三",
      status: "已完成",
      time: "2023-10-24 14:20",
      fileName: "智能机器人项目.pdf",
    },
    {
      id: "FLOW-241024-02",
      tenant: "腾讯",
      user: "李四",
      status: "分析中",
      time: "2023-10-24 15:10",
      fileName: "新能源车出海计划.pdf",
    },
    {
      id: "FLOW-241024-03",
      tenant: "字节跳动",
      user: "王五",
      status: "失败",
      time: "2023-10-24 16:05",
      fileName: "教育大模型方案.pdf",
    },
    {
      id: "FLOW-241025-01",
      tenant: "阿里巴巴",
      user: "赵六",
      status: "已完成",
      time: "2023-10-25 09:30",
      fileName: "跨境电商物流.pdf",
    },
  ],
  orders: [
    {
      id: "ORD-20231001",
      tenant: "阿里巴巴",
      type: "基础点数包充值",
      amount: 5000,
      status: "支付成功",
      time: "2023-10-24 10:00",
    },
    {
      id: "ORD-20231002",
      tenant: "腾讯",
      type: "专业版点数续费",
      amount: 12000,
      status: "等待付款",
      time: "2023-10-24 11:30",
    },
  ],
  tenants: [
    {
      id: "TEN-01",
      name: "阿里巴巴",
      contact: "马云",
      status: "启用",
      quotaUsed: 450,
      quotaTotal: 1000,
      userCount: 12,
    },
    {
      id: "TEN-02",
      name: "腾讯",
      contact: "马化腾",
      status: "启用",
      quotaUsed: 820,
      quotaTotal: 1500,
      userCount: 8,
    },
  ],
  users: [
    {
      id: "U-01",
      name: "张三",
      role: "租户管理员",
      tenant: "阿里巴巴",
      status: "在线",
      email: "zhang@ali.com",
    },
    {
      id: "U-02",
      name: "李四",
      role: "普通用户",
      tenant: "腾讯",
      status: "离线",
      email: "li@tencent.com",
    },
  ],
};

// 2. 核心业务数据 (Core)
interface WeightItem {
  id: "team" | "tech" | "market" | "finance";
  label: string;
  value: number;
  color: string;
  description: string;
}

interface ConfigProfile {
  id: string;
  name: string;
  description: string;
  skillId: string;
  weights: WeightItem[];
  promptTemplate: string;
  lastUpdated: string;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  track: string;
  trackLevel: string;
  scenario: string[];
  revenue: string;
  profit: string;
  funding: string;
  uploaderId: string;
  uploaderName: string;
  contact: string;
  fileName: string;
  submitTime: string;
  tenant: string;
  tags: string[];
  rawScores: {
    team: number;
    tech: number;
    market: number;
    finance: number;
  };
  details: {
    missingModules: number;
    evaluation: string;
  };
  score: number; // 占位符，实际由前端计算
}

// 扩充至 18 个项目
const MOCK_EXTENDED_PROJECTS: Project[] = [
  {
    id: "BP-2401",
    name: "智航低空物流网络",
    track: "低空经济",
    trackLevel: "L3",
    scenario: ["智慧物流", "应急救援"],
    revenue: "5000万",
    profit: "-800万",
    funding: "A轮 3000万",
    uploaderId: "U-8821",
    uploaderName: "王经理",
    contact: "138****1234",
    fileName: "智航BP_v2.pdf",
    submitTime: "2024-01-15 10:30",
    tenant: "国信中数",
    tags: ["连续创业", "高新企业", "海外团队"],
    rawScores: { team: 92, tech: 85, market: 95, finance: 70 },
    details: {
      missingModules: 2,
      evaluation: "团队背景扎实，技术壁垒较高，但财务模型尚需优化。",
    },
    score: 0,
  },
  {
    id: "BP-2402",
    name: "DeepSeeker 医疗影像大模型",
    track: "人工智能",
    trackLevel: "L2",
    scenario: ["医疗健康", "辅助诊断"],
    revenue: "200万",
    profit: "-500万",
    funding: "天使轮 1000万",
    uploaderId: "U-9932",
    uploaderName: "李博士",
    contact: "139****5678",
    fileName: "DeepSeeker_Medical.pdf",
    submitTime: "2024-01-16 14:20",
    tenant: "华为云创新中心",
    tags: ["清北团队", "C9高校", "核心专利"],
    rawScores: { team: 98, tech: 96, market: 85, finance: 60 },
    details: {
      missingModules: 0,
      evaluation: "技术极具创新性，学术背景深厚，处于早期研发阶段。",
    },
    score: 0,
  },
  {
    id: "BP-2403",
    name: "绿能储能聚合平台",
    track: "新能源",
    trackLevel: "L3",
    scenario: ["能源电力", "工业园区"],
    revenue: "1.2亿",
    profit: "2000万",
    funding: "B轮 1亿",
    uploaderId: "U-7711",
    uploaderName: "张总",
    contact: "186****9988",
    fileName: "绿能聚合.pdf",
    submitTime: "2024-01-16 09:15",
    tenant: "腾讯众创空间",
    tags: ["营收过亿", "盈亏平衡", "产业龙头背景"],
    rawScores: { team: 80, tech: 78, market: 85, finance: 95 },
    details: {
      missingModules: 3,
      evaluation: "财务表现优异，现金流健康，适合稳健型投资。",
    },
    score: 0,
  },
  {
    id: "BP-2404",
    name: "跨境电商SaaS ERP",
    track: "企业服务",
    trackLevel: "L3",
    scenario: ["电子商务"],
    revenue: "3000万",
    profit: "500万",
    funding: "Pre-A 1500万",
    uploaderId: "U-6655",
    uploaderName: "赵总监",
    contact: "135****2233",
    fileName: "跨境ERP.pdf",
    submitTime: "2024-01-17 11:00",
    tenant: "阿里巴巴",
    tags: ["首次创业", "数据合规", "盈亏平衡"],
    rawScores: { team: 75, tech: 70, market: 88, finance: 85 },
    details: {
      missingModules: 1,
      evaluation: "市场切入点精准，数据合规性好，增长稳健。",
    },
    score: 0,
  },
  {
    id: "BP-2405",
    name: "eVTOL 动力电池包",
    track: "低空经济",
    trackLevel: "L2",
    scenario: ["城市交通"],
    revenue: "8000万",
    profit: "1200万",
    funding: "B轮 1.5亿",
    uploaderId: "U-3321",
    uploaderName: "孙工",
    contact: "159****8888",
    fileName: "eVTOL_Battery.pdf",
    submitTime: "2024-01-18 16:45",
    tenant: "国信中数",
    tags: ["宁德时代背景", "核心专利", "专精特新"],
    rawScores: { team: 85, tech: 90, market: 92, finance: 88 },
    details: {
      missingModules: 0,
      evaluation: "硬科技属性强，供应链资源丰富。",
    },
    score: 0,
  },
  {
    id: "BP-2406",
    name: "城市空中交通管制系统",
    track: "低空经济",
    trackLevel: "L3",
    scenario: ["政府监管", "空域管理"],
    revenue: "1500万",
    profit: "200万",
    funding: "A轮 5000万",
    uploaderId: "U-4411",
    uploaderName: "周经理",
    contact: "136****7777",
    fileName: "UAM_Control.pdf",
    submitTime: "2024-01-19",
    tenant: "华为云创新中心",
    tags: ["ToG业务", "军工背景"],
    rawScores: { team: 88, tech: 85, market: 95, finance: 75 },
    details: {
      missingModules: 1,
      evaluation: "ToG业务，回款周期较长，但壁垒极高。",
    },
    score: 0,
  },
  {
    id: "BP-2407",
    name: "AI 法律顾问 Agent",
    track: "人工智能",
    trackLevel: "L3",
    scenario: ["法律服务"],
    revenue: "50万",
    profit: "-200万",
    funding: "种子轮 300万",
    uploaderId: "U-5522",
    uploaderName: "赵律师",
    contact: "133****9999",
    fileName: "LegalAI.pdf",
    submitTime: "2024-01-20",
    tenant: "腾讯众创空间",
    tags: ["大模型微调", "早期项目", "法律科技"],
    rawScores: { team: 90, tech: 80, market: 70, finance: 50 },
    details: {
      missingModules: 4,
      evaluation: "早期项目，模型微调能力不错，但商业模式待验证。",
    },
    score: 0,
  },
  {
    id: "BP-2408",
    name: "量子计算芯片设计",
    track: "半导体",
    trackLevel: "L2",
    scenario: ["科研计算"],
    revenue: "0",
    profit: "-3000万",
    funding: "天使轮 5000万",
    uploaderId: "U-1234",
    uploaderName: "钱教授",
    contact: "130****0000",
    fileName: "QuantumChip.pdf",
    submitTime: "2024-01-21",
    tenant: "国信中数",
    tags: ["科学家创业", "颠覆性技术", "长期研发"],
    rawScores: { team: 98, tech: 99, market: 60, finance: 20 },
    details: {
      missingModules: 0,
      evaluation: "极具前瞻性的硬科技项目，团队为国际顶尖水平。",
    },
    score: 0,
  },
  {
    id: "BP-2409",
    name: "合成生物护肤原料",
    track: "生物医药",
    trackLevel: "L2",
    scenario: ["消费医疗", "美妆"],
    revenue: "4000万",
    profit: "800万",
    funding: "A轮 6000万",
    uploaderId: "U-5678",
    uploaderName: "吴总",
    contact: "131****1111",
    fileName: "SynBioSkin.pdf",
    submitTime: "2024-01-22",
    tenant: "杭州湾加速器",
    tags: ["消费升级", "高毛利", "自有工厂"],
    rawScores: { team: 85, tech: 90, market: 92, finance: 88 },
    details: {
      missingModules: 1,
      evaluation: "产品已验证，市场渠道成熟，现金流良好。",
    },
    score: 0,
  },
  {
    id: "BP-2410",
    name: "无人矿山运输解决方案",
    track: "自动驾驶",
    trackLevel: "L3",
    scenario: ["智慧矿山"],
    revenue: "6000万",
    profit: "500万",
    funding: "B轮 1.2亿",
    uploaderId: "U-9012",
    uploaderName: "郑工",
    contact: "132****2222",
    fileName: "AutoMine.pdf",
    submitTime: "2024-01-23",
    tenant: "华为云创新中心",
    tags: ["封闭场景", "刚需高频", "已签大单"],
    rawScores: { team: 88, tech: 85, market: 80, finance: 75 },
    details: {
      missingModules: 2,
      evaluation: "特定场景自动驾驶落地典范，商业闭环已跑通。",
    },
    score: 0,
  },
  {
    id: "BP-2411",
    name: "VR 职业技能培训平台",
    track: "元宇宙",
    trackLevel: "L3",
    scenario: ["职业教育"],
    revenue: "1500万",
    profit: "-200万",
    funding: "Pre-A 2000万",
    uploaderId: "U-3456",
    uploaderName: "周老师",
    contact: "133****3333",
    fileName: "VREdu.pdf",
    submitTime: "2024-01-24",
    tenant: "腾讯众创空间",
    tags: ["职教改革", "内容生态", "人社合作"],
    rawScores: { team: 75, tech: 80, market: 85, finance: 60 },
    details: {
      missingModules: 0,
      evaluation: "政策利好赛道，内容生产成本较高，需关注复购率。",
    },
    score: 0,
  },
  {
    id: "BP-2412",
    name: "固态电池电解质研发",
    track: "新能源",
    trackLevel: "L2",
    scenario: ["新能源汽车"],
    revenue: "500万",
    profit: "-1000万",
    funding: "A轮 8000万",
    uploaderId: "U-7890",
    uploaderName: "冯博士",
    contact: "134****4444",
    fileName: "SolidState.pdf",
    submitTime: "2024-01-25",
    tenant: "国信中数",
    tags: ["下一代电池", "技术壁垒", "车企定点"],
    rawScores: { team: 92, tech: 95, market: 90, finance: 50 },
    details: {
      missingModules: 1,
      evaluation: "关键材料突破，已获头部车企测试认证。",
    },
    score: 0,
  },
  {
    id: "BP-2413",
    name: "智能康复外骨骼机器人",
    track: "医疗器械",
    trackLevel: "L3",
    scenario: ["康复医疗", "养老"],
    revenue: "800万",
    profit: "-300万",
    funding: "天使轮 1500万",
    uploaderId: "U-2345",
    uploaderName: "陈总",
    contact: "135****5555",
    fileName: "ExoSkeleton.pdf",
    submitTime: "2024-01-26",
    tenant: "苏州工业园",
    tags: ["老龄化趋势", "二类器械", "产学研"],
    rawScores: { team: 85, tech: 88, market: 95, finance: 55 },
    details: {
      missingModules: 3,
      evaluation: "市场需求巨大，产品体验需进一步打磨。",
    },
    score: 0,
  },
  {
    id: "BP-2414",
    name: "碳捕集与利用(CCUS)设备",
    track: "双碳科技",
    trackLevel: "L2",
    scenario: ["高耗能工厂"],
    revenue: "2000万",
    profit: "200万",
    funding: "A轮 4000万",
    uploaderId: "U-6789",
    uploaderName: "褚工",
    contact: "136****6666",
    fileName: "CCUS_Tech.pdf",
    submitTime: "2024-01-27",
    tenant: "国信中数",
    tags: ["碳中和", "设备制造", "政策补贴"],
    rawScores: { team: 80, tech: 85, market: 80, finance: 70 },
    details: {
      missingModules: 0,
      evaluation: "符合国家双碳战略，设备成本控制是关键。",
    },
    score: 0,
  },
  {
    id: "BP-2415",
    name: "企业级低代码开发平台",
    track: "企业服务",
    trackLevel: "L3",
    scenario: ["数字化转型"],
    revenue: "8000万",
    profit: "1500万",
    funding: "B+轮 2亿",
    uploaderId: "U-0123",
    uploaderName: "卫总",
    contact: "137****7777",
    fileName: "LowCodePaaS.pdf",
    submitTime: "2024-01-28",
    tenant: "阿里巴巴",
    tags: ["SaaS", "高复购", "国产替代"],
    rawScores: { team: 85, tech: 80, market: 90, finance: 90 },
    details: {
      missingModules: 0,
      evaluation: "业务成熟，客户粘性高，具备上市潜力。",
    },
    score: 0,
  },
  {
    id: "BP-2416",
    name: "脑机接口康复系统",
    track: "脑科学",
    trackLevel: "L2",
    scenario: ["神经康复"],
    revenue: "0",
    profit: "-500万",
    funding: "种子轮 1000万",
    uploaderId: "U-4567",
    uploaderName: "蒋博士",
    contact: "138****8888",
    fileName: "BCI_Rehab.pdf",
    submitTime: "2024-01-29",
    tenant: "华为云创新中心",
    tags: ["前沿科技", "临床试验", "高风险高回报"],
    rawScores: { team: 95, tech: 90, market: 70, finance: 30 },
    details: {
      missingModules: 2,
      evaluation: "处于技术验证阶段，需长期资本支持。",
    },
    score: 0,
  },
  {
    id: "BP-2417",
    name: "柔性电子皮肤传感器",
    track: "新材料",
    trackLevel: "L2",
    scenario: ["智能穿戴"],
    revenue: "500万",
    profit: "-100万",
    funding: "天使轮 1200万",
    uploaderId: "U-8901",
    uploaderName: "沈总",
    contact: "139****9999",
    fileName: "FlexSensor.pdf",
    submitTime: "2024-01-30",
    tenant: "腾讯众创空间",
    tags: ["可穿戴", "进口替代", "高精度"],
    rawScores: { team: 88, tech: 92, market: 85, finance: 65 },
    details: {
      missingModules: 1,
      evaluation: "技术指标领先，正处于产能爬坡期。",
    },
    score: 0,
  },
  {
    id: "BP-2418",
    name: "生成式AI游戏美术工具",
    track: "AIGC",
    trackLevel: "L3",
    scenario: ["游戏开发"],
    revenue: "1000万",
    profit: "300万",
    funding: "A轮 3000万",
    uploaderId: "U-2346",
    uploaderName: "韩总",
    contact: "150****0000",
    fileName: "GenAI_Art.pdf",
    submitTime: "2024-01-31",
    tenant: "杭州湾加速器",
    tags: ["AIGC", "降本增效", "爆发式增长"],
    rawScores: { team: 90, tech: 88, market: 95, finance: 80 },
    details: {
      missingModules: 0,
      evaluation: "抓住了AIGC风口，用户增长迅速，商业变现能力强。",
    },
    score: 0,
  },
];

// 扩充至 5 个配置
const MOCK_CONFIGS: ConfigProfile[] = [
  {
    id: "CONF-001",
    name: "低空经济专项基金遴选",
    description: "侧重于市场潜力和技术壁垒，适用于低空经济产业园入驻筛选。",
    skillId: "SKILL-LOW-ALTITUDE-2024-V1",
    promptTemplate:
      '{"role": "Investment Analyst", "focus": ["UAM", "Drone Logistics"], "constraints": "High technical barrier required"}',
    weights: [
      {
        id: "team",
        label: "团队背景",
        value: 20,
        color: "bg-blue-500",
        description: "核心成员学历、连续创业经验、行业背景",
      },
      {
        id: "tech",
        label: "技术壁垒",
        value: 30,
        color: "bg-purple-500",
        description: "专利数量、研发投入占比、技术独特性",
      },
      {
        id: "market",
        label: "市场前景",
        value: 40,
        color: "bg-amber-500",
        description: "市场规模(TAM)、增长率(CAGR)、竞争格局",
      },
      {
        id: "finance",
        label: "财务表现",
        value: 10,
        color: "bg-emerald-500",
        description: "营收增速、毛利率、现金流健康度",
      },
    ],
    lastUpdated: "2024-01-26",
    tags: ["专项债", "产业园"],
  },
  {
    id: "CONF-002",
    name: "人工智能种子期海选",
    description: "极度看重团队背景（科学家）和技术创新，忽略早期财务表现。",
    skillId: "SKILL-AI-SEED-2024-V2",
    promptTemplate:
      "Focus on the founding team's academic background and the core algorithm innovation. Ignore short-term revenue.",
    weights: [
      {
        id: "team",
        label: "团队背景",
        value: 45,
        color: "bg-blue-500",
        description: "科学家背景、顶会论文、名校校友",
      },
      {
        id: "tech",
        label: "技术壁垒",
        value: 45,
        color: "bg-purple-500",
        description: "算法领先性、算力资源、数据壁垒",
      },
      {
        id: "market",
        label: "市场前景",
        value: 10,
        color: "bg-amber-500",
        description: "应用场景落地潜力",
      },
      {
        id: "finance",
        label: "财务表现",
        value: 0,
        color: "bg-emerald-500",
        description: "早期项目不做强制要求",
      },
    ],
    lastUpdated: "2024-01-15",
    tags: ["硬科技", "投早投小"],
  },
  {
    id: "CONF-003",
    name: "上市公司并购标的筛选",
    description:
      "寻找营收规模可观，利润为正，且所在赛道具有整合价值的成熟期项目。",
    skillId: "SKILL-MA-MERGER-V1",
    promptTemplate:
      "Identify targets with stable cash flow and strategic value for M&A...",
    weights: [
      {
        id: "team",
        label: "团队背景",
        value: 10,
        color: "bg-blue-500",
        description: "团队稳定性、合规性",
      },
      {
        id: "tech",
        label: "技术壁垒",
        value: 20,
        color: "bg-purple-500",
        description: "技术成熟度、专利布局",
      },
      {
        id: "market",
        label: "市场前景",
        value: 20,
        color: "bg-amber-500",
        description: "市场份额、协同效应",
      },
      {
        id: "finance",
        label: "财务表现",
        value: 50,
        color: "bg-emerald-500",
        description: "净利润、现金流、负债率",
      },
    ],
    lastUpdated: "2024-01-20",
    tags: ["并购", "稳健型"],
  },
  {
    id: "CONF-004",
    name: "Pre-IPO 财务合规筛选",
    description: "针对拟上市企业，重点审查财务合规性、营收规模及利润指标。",
    skillId: "SKILL-PRE-IPO-V3",
    promptTemplate:
      "Strictly check financial compliance and revenue scale for Pre-IPO standards.",
    weights: [
      {
        id: "team",
        label: "团队背景",
        value: 10,
        color: "bg-blue-500",
        description: "管理层稳定性",
      },
      {
        id: "tech",
        label: "技术壁垒",
        value: 10,
        color: "bg-purple-500",
        description: "科创属性",
      },
      {
        id: "market",
        label: "市场前景",
        value: 10,
        color: "bg-amber-500",
        description: "行业地位",
      },
      {
        id: "finance",
        label: "财务表现",
        value: 70,
        color: "bg-emerald-500",
        description: "营收、利润、合规性",
      },
    ],
    lastUpdated: "2024-01-28",
    tags: ["Pre-IPO", "财务审计"],
  },
  {
    id: "CONF-005",
    name: "出海项目专项扶持",
    description: "筛选具备海外市场拓展能力、产品国际化潜力的项目。",
    skillId: "SKILL-GLOBAL-EXPANSION-V1",
    promptTemplate:
      "Evaluate global market potential and team international experience.",
    weights: [
      {
        id: "team",
        label: "团队背景",
        value: 30,
        color: "bg-blue-500",
        description: "海外留学/工作背景",
      },
      {
        id: "tech",
        label: "技术壁垒",
        value: 20,
        color: "bg-purple-500",
        description: "国际专利",
      },
      {
        id: "market",
        label: "市场前景",
        value: 40,
        color: "bg-amber-500",
        description: "海外市场需求、渠道能力",
      },
      {
        id: "finance",
        label: "财务表现",
        value: 10,
        color: "bg-emerald-500",
        description: "海外营收占比",
      },
    ],
    lastUpdated: "2024-01-29",
    tags: ["跨境出海", "国际化"],
  },
];

// ==========================================
// --- Components ---
// ==========================================

const SmartStatusBadge = ({
  score,
  status,
}: {
  score?: number;
  status?: string;
}) => {
  if (score !== undefined) {
    let colorClass = "bg-slate-100 text-slate-600";
    let text = "C级";
    if (score >= 90) {
      colorClass = "bg-rose-100 text-rose-700";
      text = "S级";
    } else if (score >= 80) {
      colorClass = "bg-indigo-100 text-indigo-700";
      text = "A级";
    } else if (score >= 70) {
      colorClass = "bg-emerald-100 text-emerald-700";
      text = "B级";
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}`}
      >
        {text}
      </span>
    );
  }

  const styles: Record<string, string> = {
    已完成: "bg-emerald-100 text-emerald-700",
    分析中: "bg-blue-100 text-blue-700",
    失败: "bg-rose-100 text-rose-700",
    在线: "bg-emerald-100 text-emerald-700",
    支付成功: "bg-emerald-100 text-emerald-700",
    等待付款: "bg-amber-100 text-amber-700",
    已关闭: "bg-slate-100 text-slate-400",
    启用: "bg-emerald-100 text-emerald-700",
    禁用: "bg-slate-100 text-slate-600",
    离线: "bg-slate-100 text-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        styles[status || ""] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "未知"}
    </span>
  );
};

// 配额充值抽屉
const QuotaDrawer = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-xl text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-8 space-y-8">{children}</div>
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            取消
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            确认保存
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- 组件: Prompt Optimizer (Gemini Studio Layout) ---
// ==========================================

const PromptOptimizer = ({
  onClose,
  onGenerate,
  allConfigs,
}: {
  onClose: () => void;
  onGenerate: (config: ConfigProfile) => void;
  allConfigs: ConfigProfile[];
}) => {
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; content: string }[]
  >([
    {
      role: "ai",
      content:
        "您好！我是您的 AI 配置助手。请描述您的筛选目标（例如：“筛选硬科技属性强的初创企业”）。您也可以上传评分标准文档，或引用现有配置进行修改。",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(newMsgs);
    setInput("");

    setTimeout(() => {
      if (step === 0) {
        setMessages([
          ...newMsgs,
          {
            role: "ai" as const,
            content: "已解析需求。正在结合上下文构建 Skill 配置...",
          },
        ]);
        setStep(1);
        setTimeout(() => setStep(2), 1500);
      }
    }, 800);
  };

  const handleGenerateConfirm = () => {
    const newConfig: ConfigProfile = {
      id: `CONF-NEW-${Date.now()}`,
      name: "AI 生成-定制化筛选",
      description: "由配置助手根据您的对话自动生成。",
      skillId: `SKILL-GEN-${Math.floor(Math.random() * 10000)}`,
      promptTemplate:
        '{"role": "Custom Analyst", "objective": "Identify high potential startups based on user input..."}',
      weights: [
        {
          id: "team",
          label: "团队背景",
          value: 30,
          color: "bg-blue-500",
          description: "AI生成标准",
        },
        {
          id: "tech",
          label: "技术壁垒",
          value: 50,
          color: "bg-purple-500",
          description: "AI生成标准",
        },
        {
          id: "market",
          label: "市场前景",
          value: 15,
          color: "bg-amber-500",
          description: "AI生成标准",
        },
        {
          id: "finance",
          label: "财务表现",
          value: 5,
          color: "bg-emerald-500",
          description: "AI生成标准",
        },
      ],
      lastUpdated: new Date().toLocaleDateString(),
      tags: ["AI生成"],
    };
    onGenerate(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-5xl h-[80vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500"
        >
          <X size={20} />
        </button>

        {/* 左侧：对话区 */}
        <div className="flex-1 flex flex-col border-r border-slate-100">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              配置生成助手
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              基于 Kimi Thinking 模型 · 上下文感知
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {step === 2 && (
              <div className="flex justify-start">
                <div className="bg-white border border-indigo-100 p-5 rounded-2xl rounded-bl-none shadow-md w-72">
                  <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold text-sm">
                    <CheckCircle2 size={16} /> 配置已生成
                  </div>
                  <div className="space-y-2 mb-4 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Skill ID:</span>{" "}
                      <span className="font-mono bg-slate-100 px-1 rounded">
                        GEN-X829
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>重点维度:</span> <span>技术壁垒 (50%)</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateConfirm}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700"
                  >
                    应用并重排项目库
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 底部输入区 (Gemini Style) */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-2 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
              <div className="flex items-center gap-1 pr-1">
                <button
                  className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-xl transition-colors"
                  title="上传参考文档"
                >
                  <Plus size={20} />
                </button>
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="在此输入您的筛选逻辑..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium h-12 px-4 text-slate-800 placeholder:text-slate-400"
                disabled={step === 2}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || step === 2}
                className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                  input.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-300 text-slate-100"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：上下文/文档暂存区 */}
        <div className="w-80 bg-slate-50 p-6 flex flex-col border-l border-slate-200">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            参考文档 / 上下文
          </h4>
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center gap-2 text-slate-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all">
              <UploadCloud size={24} />
              <span className="text-xs font-bold">点击上传 PDF/Word</span>
            </div>
            {/* 模拟已上传文件 */}
            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-slate-700 truncate">
                  园区准入标准_2024.pdf
                </p>
                <p className="text-[10px] text-slate-400">已解析 • 2.4MB</p>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">提示：</strong>{" "}
              右侧上传的文档将作为 AI 的知识库（RAG），辅助生成更精准的 Skill ID
              和评分权重。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- 组件: Config Detail Editor (配置微调) ---
// ==========================================

const ConfigDetailEditor = ({
  config,
  allConfigs,
  onClose,
  onUpdate,
  onApply,
}: {
  config: ConfigProfile;
  allConfigs: ConfigProfile[];
  onClose: () => void;
  onUpdate: (
    id: string,
    weights: WeightItem[],
    prompt: string,
    isNewVersion: boolean
  ) => void;
  onApply: (id: string) => void;
}) => {
  const [localWeights, setLocalWeights] = useState(config.weights);
  const [localPrompt, setLocalPrompt] = useState(config.promptTemplate);
  const [activeTab, setActiveTab] = useState<"weights" | "prompt">("weights");
  const [isOverride, setIsOverride] = useState(false);
  const [promptChatInput, setPromptChatInput] = useState("");
  const [promptChatHistory, setPromptChatHistory] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);

  // 计算总权重
  const totalWeight = useMemo(
    () => localWeights.reduce((sum, w) => sum + w.value, 0),
    [localWeights]
  );
  const isWeightValid = Math.abs(totalWeight - 100) < 0.1;

  const handleWeightChange = (id: string, newValue: number) => {
    const validValue = Math.max(0, Math.min(100, newValue));
    const newWeights = localWeights.map((w) =>
      w.id === id ? { ...w, value: validValue } : w
    );
    setLocalWeights(newWeights);
    setIsOverride(true);
  };

  const handleImportConfig = (targetConfigId: string) => {
    const target = allConfigs.find((c) => c.id === targetConfigId);
    if (target) {
      setLocalWeights(target.weights);
      setLocalPrompt(target.promptTemplate);
      setIsOverride(true);
    }
  };

  const handlePromptChatSend = () => {
    if (!promptChatInput.trim()) return;
    const newHistory = [
      ...promptChatHistory,
      { role: "user" as const, content: promptChatInput },
    ];
    setPromptChatHistory(newHistory);
    setPromptChatInput("");

    // 模拟 AI 修改 Prompt
    setTimeout(() => {
      setPromptChatHistory([
        ...newHistory,
        { role: "ai" as const, content: "已根据您的要求优化了 Prompt 标准。" },
      ]);
      setLocalPrompt(
        (prev) =>
          prev + `\n// Note: Adjusted based on feedback: ${promptChatInput}`
      );
      setIsOverride(true);
    }, 800);
  };

  const handleSave = (isNew: boolean) => {
    // 门控机制：如果总和不为100，禁止保存
    if (!isWeightValid) {
      return;
    }
    onUpdate(config.id, localWeights, localPrompt, isNew);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              {config.name}
              {isOverride && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-bold">
                  已修改
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">配置ID: {config.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 shadow-sm transition-all ${
              !isWeightValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isWeightValid}
          >
            <Copy size={16} /> 另存为新策略(覆盖)
          </button>
          <button
            onClick={() => handleSave(false)}
            className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all ${
              !isWeightValid ? "opacity-50 cursor-not-allowed grayscale" : ""
            }`}
            disabled={!isWeightValid}
          >
            <Save size={16} /> 保存当前配置
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* 中间：Prompt 编辑与调优 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 上半部分：源码编辑 */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />{" "}
                评分与分类标准 (Prompt/JSON)
              </h3>
              <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded">
                JSON Mode
              </span>
            </div>
            <textarea
              className="flex-1 p-6 font-mono text-sm text-slate-700 outline-none resize-none leading-relaxed"
              value={localPrompt}
              onChange={(e) => {
                setLocalPrompt(e.target.value);
                setIsOverride(true);
              }}
              spellCheck={false}
            />
          </div>

          {/* 下半部分：Prompt 调优 Chatbot */}
          <div className="h-64 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">
                Prompt 调优助手
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
              {promptChatHistory.length === 0 && (
                <p className="text-xs text-slate-400 text-center mt-4">
                  输入指令（如“提高对技术专利的重视程度”），AI 将自动调整上方
                  Prompt。
                </p>
              )}
              {promptChatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] px-3 py-2 rounded-xl text-xs ${
                      msg.role === "user"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 flex gap-2">
              <input
                className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="输入优化指令..."
                value={promptChatInput}
                onChange={(e) => setPromptChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePromptChatSend()}
              />
              <button
                onClick={handlePromptChatSend}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧边栏：引用器 & 调整器 */}
        <div className="w-96 flex flex-col gap-6">
          {/* 右上：配置引用器 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-fit">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm">
              <Copy size={16} className="text-indigo-500" /> 引用其他配置
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-2">
                快速应用其他配置的权重与标准作为基准：
              </p>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none text-slate-700"
                onChange={(e) => handleImportConfig(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  选择配置模板...
                </option>
                {allConfigs
                  .filter((c) => c.id !== config.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* 右下：评分配置标准调整器 (Weights) */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm">
              <Sliders size={16} className="text-indigo-500" /> 评分权重配置
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {localWeights.map((w) => (
                <div key={w.id} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${w.color}`}
                      ></span>{" "}
                      {w.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={w.value}
                        onChange={(e) =>
                          handleWeightChange(w.id, parseFloat(e.target.value))
                        }
                        className="w-12 text-right bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-xs font-mono font-bold text-indigo-600 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={w.value}
                    onChange={(e) =>
                      handleWeightChange(w.id, parseFloat(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}
            </div>

            {/* 底部：门控校验 */}
            <div
              className={`mt-4 pt-4 border-t ${
                isWeightValid ? "border-slate-100" : "border-rose-100"
              } text-center transition-colors`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500">当前总权重:</span>
                <span
                  className={`text-sm font-black font-mono ${
                    isWeightValid ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {totalWeight}%
                </span>
              </div>
              {!isWeightValid && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-rose-500 font-bold bg-rose-50 py-1.5 rounded-lg">
                  <AlertTriangle size={12} />
                  总和必须等于 100% 才能保存
                </div>
              )}
              {isWeightValid && (
                <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 py-1.5 rounded-lg flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} /> 配置校验通过
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- 组件: 项目详情透视 (Drill-down with Scoring Logic) ---
// ==========================================

const ProjectDetailModal = ({
  project,
  config,
  onClose,
}: {
  project: Project;
  config: ConfigProfile;
  onClose: () => void;
}) => {
  const breakdown = config.weights.map((w) => {
    // @ts-ignore
    const raw = project.rawScores[w.id] || 0;
    const contribution = (raw * w.value) / 100;
    return { ...w, raw, contribution };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {project.name}
            </h2>
            <div className="flex gap-4 text-xs text-slate-500">
              <span className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-600">
                {project.id}
              </span>
              <span>
                {project.track} / {project.trackLevel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-indigo-600" /> 评分逻辑明细
              (Score Breakdown)
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">评分维度</th>
                    <th className="px-6 py-3">评分基准 / 标准</th>
                    <th className="px-6 py-3 text-center">原始得分 (0-100)</th>
                    <th className="px-6 py-3 text-center">标准权重</th>
                    <th className="px-6 py-3 text-right">最终贡献分</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {breakdown.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${item.color}`}
                        ></span>
                        {item.label}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-600">
                        {item.raw}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                          {item.value}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-indigo-600 text-base">
                        {item.contribution.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50/30">
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-right font-bold text-slate-500 text-xs uppercase tracking-widest"
                    >
                      综合得分 (Comprehensive Score)
                    </td>
                    <td className="px-6 py-4 text-right text-2xl font-black text-indigo-600">
                      {project.score}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bot size={18} className="text-emerald-500" /> AI 综合评价
              </h3>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                {project.details.evaluation}
                <div className="mt-4 flex gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" /> 风险与缺失
              </h3>
              {project.details.missingModules > 0 ? (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                    <AlertCircle size={16} /> 发现{" "}
                    {project.details.missingModules} 个关键模块缺失
                  </div>
                  <p className="text-xs text-amber-700">
                    建议补充：风险控制措施、详细财务预测表...
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /> BP 结构完整，无明显缺失
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- 主应用组件 ---
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeConfigId, setActiveConfigId] = useState("CONF-001");
  const [configs, setConfigs] = useState<ConfigProfile[]>(MOCK_CONFIGS);

  // 状态管理
  const [showPromptOptimizer, setShowPromptOptimizer] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfigProfile | null>(
    null
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTenant, setActiveTenant] = useState<any>(null);

  const currentConfig = useMemo(
    () => configs.find((c) => c.id === activeConfigId) || configs[0],
    [configs, activeConfigId]
  );

  // 动态排序与算分逻辑
  const sortedProjects = useMemo(() => {
    return [...MOCK_EXTENDED_PROJECTS]
      .map((project) => {
        let totalScore = 0;
        currentConfig.weights.forEach((w) => {
          // @ts-ignore
          totalScore += (project.rawScores[w.id] || 0) * (w.value / 100);
        });
        return { ...project, score: parseFloat(totalScore.toFixed(1)) };
      })
      .sort((a, b) => b.score - a.score);
  }, [currentConfig]);

  const updateConfig = (
    id: string,
    newWeights: WeightItem[],
    newPrompt: string,
    isNewVersion: boolean
  ) => {
    if (isNewVersion) {
      const original = configs.find((c) => c.id === id)!;
      const newConfig = {
        ...original,
        id: `CONF-OVERRIDE-${Date.now()}`,
        name: `${original.name} (副本)`,
        weights: newWeights,
        promptTemplate: newPrompt,
        lastUpdated: "刚刚",
      };
      setConfigs([...configs, newConfig]);
      setActiveConfigId(newConfig.id);
    } else {
      setConfigs(
        configs.map((c) =>
          c.id === id
            ? { ...c, weights: newWeights, promptTemplate: newPrompt }
            : c
        )
      );
    }
  };

  const handleConfigGenerated = (newConfig: ConfigProfile) => {
    setConfigs([...configs, newConfig]);
    setActiveConfigId(newConfig.id);
    setActiveTab("project_library");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Modals & Drawers */}
      {showPromptOptimizer && (
        <PromptOptimizer
          onClose={() => setShowPromptOptimizer(false)}
          onGenerate={handleConfigGenerated}
          allConfigs={configs}
        />
      )}
      {editingConfig && (
        <ConfigDetailEditor
          config={editingConfig}
          allConfigs={configs}
          onClose={() => setEditingConfig(null)}
          onUpdate={updateConfig}
          onApply={(id) => setActiveConfigId(id)}
        />
      )}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          config={currentConfig}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* 配额充值抽屉 */}
      <QuotaDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`点数调整: ${activeTenant?.name || ""}`}
      >
        <div className="space-y-8">
          <div className="p-6 bg-indigo-50 rounded-3xl">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
              当前剩余点数
            </p>
            <h5 className="text-3xl font-black text-indigo-900">
              {(
                (activeTenant?.quotaTotal || 0) - (activeTenant?.quotaUsed || 0)
              ).toLocaleString()}{" "}
              <span className="text-sm font-bold opacity-60 ml-1">点</span>
            </h5>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              增加点数额度
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[100, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  className="py-4 border border-slate-100 rounded-2xl text-sm font-black hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  +{val} 点
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              手动输入点数
            </label>
            <input
              type="number"
              placeholder="请输入数值"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
            />
          </div>
          <div className="p-6 bg-amber-50 rounded-3xl flex gap-4 border border-amber-100">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-xs font-bold text-amber-800 leading-relaxed">
              点数增加将立即反映在租户账户。该操作作为“管理员手动充值点数”记录在流水中。
            </p>
          </div>
        </div>
      </QuotaDrawer>

      {/* 侧边导航栏 */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutGrid size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              BP 智能中台
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-8 pb-8 custom-scrollbar">
          {/* 1. 基础运营 (Top) */}
          <div>
            <div className="px-2 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              基础运营
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "tasks"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FileText size={18} />
                <span className="text-sm font-bold">业务流水</span>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "orders"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <ShoppingCart size={18} />
                <span className="text-sm font-bold">点数订单</span>
              </button>
              <button
                onClick={() => setActiveTab("tenants")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "tenants"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Building2 size={18} />
                <span className="text-sm font-bold">租户管理</span>
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "users"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Users size={18} />
                <span className="text-sm font-bold">用户管理</span>
              </button>
              <button
                onClick={() => setActiveTab("quota")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "quota"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Layers size={18} />
                <span className="text-sm font-bold">配额管理</span>
              </button>
            </div>
          </div>

          {/* 2. 核心业务 (Bottom) */}
          <div>
            <div className="px-2 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              核心业务
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("project_library")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === "project_library"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database size={18} />
                  <span className="text-sm font-bold">项目库</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("configs")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === "configs"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sliders size={18} />
                  <span className="text-sm font-bold">配置管理器</span>
                </div>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-xl text-slate-800">
              {activeTab === "tasks"
                ? "业务流水"
                : activeTab === "project_library"
                ? "项目库"
                : activeTab === "configs"
                ? "配置管理器"
                : "运营中心"}
            </h2>
          </div>

          {/* 项目库专属 Header 信息 */}
          {activeTab === "project_library" ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  当前操作员
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Admin_01
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  当前生效配置
                </span>
                <div className="flex items-center gap-1.5 text-indigo-600">
                  <Zap size={12} fill="currentColor" />
                  <span className="text-sm font-black">
                    {currentConfig.name}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <UserCircle size={20} />
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-auto p-8">
          {/* --- 1. 项目库 (核心业务) --- */}
          {activeTab === "project_library" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full whitespace-nowrap text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4 text-center w-16">排名</th>
                      <th className="px-6 py-4">项目基础信息</th>
                      <th className="px-6 py-4">上传信息</th>
                      <th className="px-6 py-4">赛道</th>
                      <th className="px-6 py-4">场景</th>
                      <th className="px-6 py-4">财务与融资</th>
                      <th className="px-6 py-4">标签库</th>
                      <th className="px-6 py-4">综合得分</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedProjects.map((project, index) => (
                      <tr
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 text-center">
                          <div
                            className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-sm font-black ${
                              index === 0
                                ? "bg-amber-100 text-amber-600"
                                : index === 1
                                ? "bg-slate-100 text-slate-600"
                                : index === 2
                                ? "bg-orange-50 text-orange-600"
                                : "text-slate-400"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm mb-1">
                            {project.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {project.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-slate-600">
                            <span className="font-bold">
                              {project.uploaderName}
                            </span>
                            <span className="text-slate-400 scale-90 origin-left">
                              {project.submitTime}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">
                            {project.track}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap max-w-[150px]">
                            {project.scenario.map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium border border-blue-100"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 w-6">营收</span>{" "}
                              <span className="font-medium text-slate-700">
                                {project.revenue}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 w-6">利润</span>{" "}
                              <span
                                className={`font-medium ${
                                  project.profit.includes("-")
                                    ? "text-rose-500"
                                    : "text-emerald-600"
                                }`}
                              >
                                {project.profit}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 w-6">融资</span>{" "}
                              <span className="font-bold text-indigo-600">
                                {project.funding}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {project.tags.map((t) => (
                              <span
                                key={t}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                  t.includes("清北") || t.includes("海外")
                                    ? "bg-purple-50 text-purple-700 border-purple-100"
                                    : t.includes("营收")
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-slate-900 tracking-tight">
                              {project.score}
                            </span>
                            <SmartStatusBadge score={project.score} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- 2. 配置管理器 (核心业务) --- */}
          {activeTab === "configs" && (
            <div className="space-y-6 relative h-full">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    配置策略库
                  </h3>
                  <p className="text-slate-500 mt-2">
                    点击配置卡片进入详情页，可进行 Prompt 编排与权重微调。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    onClick={() => setEditingConfig(config)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:border-indigo-300 hover:shadow-xl bg-white border-slate-200 relative overflow-hidden flex flex-col`}
                  >
                    {activeConfigId === config.id && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                        当前激活
                      </div>
                    )}

                    <div className="mb-4">
                      <h4
                        className="font-bold text-lg mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1"
                        title={config.name}
                      >
                        {config.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {config.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-500 border border-slate-200 truncate max-w-[120px]">
                        {config.skillId}
                      </div>
                      {config.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50 mt-auto">
                      {config.weights.map((w) => (
                        <div
                          key={w.id}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${w.color}`}
                          ></span>
                          <span className="text-slate-500 w-16 truncate">
                            {w.label}
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${w.color}`}
                              style={{ width: `${w.value}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-700 font-bold w-8 text-right">
                            {w.value}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 卡片底部的应用按钮区 */}
                    <div
                      className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] text-slate-400">
                        最后更新: {config.lastUpdated}
                      </span>
                      {activeConfigId === config.id ? (
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold cursor-default flex items-center gap-1">
                          <CheckCircle2 size={14} /> 已应用
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveConfigId(config.id);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5"
                        >
                          <Power size={14} /> 应用配置
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAB: 新建配置 */}
              <button
                onClick={() => setShowPromptOptimizer(true)}
                className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-30 group"
              >
                <Plus
                  size={32}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>
          )}

          {/* --- 3. 基础运营模块 (业务流水) --- */}
          {activeTab === "tasks" && (
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">业务处理流水</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">任务编号</th>
                    <th className="px-8 py-4">项目文件</th>
                    <th className="px-8 py-4">所属租户</th>
                    <th className="px-8 py-4">状态</th>
                    <th className="px-8 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_OLD_DATA.tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-5 font-mono text-slate-400 text-xs">
                        {task.id}
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-700">
                        {task.fileName}
                      </td>
                      <td className="px-8 py-5 text-slate-500">
                        {task.tenant}
                      </td>
                      <td className="px-8 py-5">
                        <SmartStatusBadge status={task.status} />
                      </td>
                      <td className="px-8 py-5 text-right text-indigo-600 font-bold text-xs cursor-pointer hover:underline">
                        详情
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 其他基础运营页面 (订单、租户等) */}
          {["orders", "tenants", "users", "quota"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Briefcase size={64} className="mb-4 text-slate-200" />
              <p className="text-lg font-bold">该运营模块逻辑已保留 (Mock)</p>
              <p className="text-sm">
                功能与原版一致，此处省略具体渲染以聚焦核心业务。
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
