import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  FolderOpen,
  Tag,
  Filter
} from 'lucide-react';

// --- 模拟数据 ---
const MOCK_DATA = {
  tasks: [
    { id: 'T-1001', tenant: '阿里巴巴', user: '张三', status: '已完成', time: '2023-10-24 14:20', fileName: '智能机器人项目.pdf' },
    { id: 'T-1002', tenant: '腾讯', user: '李四', status: '分析中', time: '2023-10-24 15:10', fileName: '新能源车出海计划.pdf' },
    { id: 'T-1003', tenant: '字节跳动', user: '王五', status: '失败', time: '2023-10-24 16:05', fileName: '教育大模型方案.pdf' },
    { id: 'T-1004', tenant: '阿里巴巴', user: '赵六', status: '已完成', time: '2023-10-25 09:30', fileName: '跨境电商物流.pdf' },
  ],
  orders: [
    { id: 'ORD-20231001', tenant: '阿里巴巴', type: '基础点数包充值', amount: 5000, status: '支付成功', time: '2023-10-24 10:00' },
    { id: 'ORD-20231002', tenant: '腾讯', type: '专业版点数续费', amount: 12000, status: '等待付款', time: '2023-10-24 11:30' },
    { id: 'ORD-20231003', tenant: '字节跳动', type: '加购额外点数', amount: 2000, status: '支付成功', time: '2023-10-24 14:45' },
    { id: 'ORD-20231004', tenant: '百度', type: '基础点数包充值', amount: 5000, status: '已关闭', time: '2023-10-24 16:20' },
  ],
  tenants: [
    { id: 'TEN-01', name: '阿里巴巴', contact: '马云', status: '启用', quotaUsed: 450, quotaTotal: 1000, userCount: 12 },
    { id: 'TEN-02', name: '腾讯', contact: '马化腾', status: '启用', quotaUsed: 820, quotaTotal: 1500, userCount: 8 },
    { id: 'TEN-03', name: '字节跳动', contact: '张一鸣', status: '禁用', quotaUsed: 120, quotaTotal: 500, userCount: 5 },
  ],
  users: [
    { id: 'U-01', name: '张三', role: '租户管理员', tenant: '阿里巴巴', status: '在线', email: 'zhang@ali.com' },
    { id: 'U-02', name: '李四', role: '普通用户', tenant: '腾讯', status: '离线', email: 'li@tencent.com' },
    { id: 'U-03', name: '王五', role: '普通用户', tenant: '字节跳动', status: '离线', email: 'wang@bytedance.com' },
  ],
  bpProjects: [
    {
      id: 'BP-001',
      name: '智能机器人项目',
      fundingStage: 'A轮',
      contact: '张三',
      uploadTime: '2023-10-24 14:20',
      missingCount: 2,
      track: '人工智能',
      scenarios: ['工业自动化', '物流配送', '服务机器人'],
      tags: ['海外名校', '连续创业', '已有营收'],
      revenue: '500-1000万',
      profit: '未盈利',
      teamBackground: '海外名校'
    },
    {
      id: 'BP-002',
      name: '新能源车出海计划',
      fundingStage: 'B轮',
      contact: '李四',
      uploadTime: '2023-10-24 15:10',
      missingCount: 0,
      track: '新能源',
      scenarios: ['新能源汽车', '海外市场', '供应链'],
      tags: ['国内C9 985团队', '职业履历', '已盈利'],
      revenue: '1亿+',
      profit: '1000万+',
      teamBackground: '国内C9 985'
    },
    {
      id: 'BP-003',
      name: '教育大模型方案',
      fundingStage: '天使轮',
      contact: '王五',
      uploadTime: '2023-10-24 16:05',
      missingCount: 5,
      track: '人工智能',
      scenarios: ['在线教育', 'AI教学', 'K12教育'],
      tags: ['首次创业', '海外名校'],
      revenue: '100万以下',
      profit: '未盈利',
      teamBackground: '海外名校'
    },
    {
      id: 'BP-004',
      name: '半导体芯片设计',
      fundingStage: 'Pre-A',
      contact: '赵六',
      uploadTime: '2023-10-25 09:30',
      missingCount: 1,
      track: '半导体',
      scenarios: ['芯片设计', 'AI芯片', '物联网'],
      tags: ['职业履历', '连续创业', '国内C9 985团队'],
      revenue: '1000-5000万',
      profit: '未盈利',
      teamBackground: '国内C9 985'
    },
    {
      id: 'BP-005',
      name: '智能医疗诊断系统',
      fundingStage: 'A轮',
      contact: '孙七',
      uploadTime: '2023-10-25 10:15',
      missingCount: 0,
      track: '医疗科技',
      scenarios: ['医疗影像', 'AI诊断', '远程医疗'],
      tags: ['海外名校', '职业履历', '已有营收'],
      revenue: '500-1000万',
      profit: '100-500万',
      teamBackground: '海外名校'
    },
    {
      id: 'BP-006',
      name: '元宇宙社交平台',
      fundingStage: '种子轮',
      contact: '周八',
      uploadTime: '2023-10-25 11:00',
      missingCount: 3,
      track: '元宇宙',
      scenarios: ['虚拟社交', '数字资产', '游戏娱乐'],
      tags: ['首次创业', '国内C9 985团队'],
      revenue: '100万以下',
      profit: '未盈利',
      teamBackground: '国内C9 985'
    },
    {
      id: 'BP-007',
      name: '5G智能通信基站',
      fundingStage: 'C轮',
      contact: '吴九',
      uploadTime: '2023-10-25 13:20',
      missingCount: 0,
      track: '智能通信',
      scenarios: ['5G网络', '基站设备', '物联网通信'],
      tags: ['连续创业', '职业履历', '已盈利'],
      revenue: '1亿+',
      profit: '5000万+',
      teamBackground: '职业履历'
    },
    {
      id: 'BP-008',
      name: '量子计算云平台',
      fundingStage: 'Pre-A',
      contact: '郑十',
      uploadTime: '2023-10-25 14:45',
      missingCount: 4,
      track: '前沿科技',
      scenarios: ['量子计算', '云计算', '科研服务'],
      tags: ['海外名校', '首次创业'],
      revenue: '100-500万',
      profit: '未盈利',
      teamBackground: '海外名校'
    },
    {
      id: 'BP-009',
      name: '企业级AI软件平台',
      fundingStage: 'B轮',
      contact: '钱十一',
      uploadTime: '2023-10-26 09:00',
      missingCount: 1,
      track: '软件',
      scenarios: ['企业服务', 'AI应用', 'SaaS平台'],
      tags: ['连续创业', '职业履历', '已有营收'],
      revenue: '5000万-1亿',
      profit: '500-1000万',
      teamBackground: '职业履历'
    },
    {
      id: 'BP-010',
      name: '具身智能家居系统',
      fundingStage: 'A轮',
      contact: '陈十二',
      uploadTime: '2023-10-26 10:30',
      missingCount: 2,
      track: '具身智能',
      scenarios: ['智能家居', '人机交互', '物联网'],
      tags: ['国内C9 985团队', '首次创业', '已有营收'],
      revenue: '1000-5000万',
      profit: '未盈利',
      teamBackground: '国内C9 985'
    }
  ]
};

// --- 子组件: 状态标签 ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    '已完成': 'bg-emerald-100 text-emerald-700',
    '支付成功': 'bg-emerald-100 text-emerald-700',
    '启用': 'bg-emerald-100 text-emerald-700',
    '在线': 'bg-emerald-100 text-emerald-700',
    '分析中': 'bg-blue-100 text-blue-700',
    '等待付款': 'bg-amber-100 text-amber-700',
    '失败': 'bg-rose-100 text-rose-700',
    '已关闭': 'bg-slate-100 text-slate-400',
    '禁用': 'bg-slate-100 text-slate-600',
    '离线': 'bg-slate-100 text-slate-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

// --- 子组件: 抽屉式表单 ---
const Drawer = ({ isOpen, onClose, title, children, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-xl text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-auto p-8 space-y-8">
          {children}
        </div>
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">取消</button>
          <button onClick={() => { onConfirm?.(); onClose(); }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">确认保存</button>
        </div>
      </div>
    </div>
  );
};

// --- 主应用组件 ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentMenu, setCurrentMenu] = useState('tasks');
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState('全部租户');

  // 菜单状态
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 表单状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('');
  const [activeTenant, setActiveTenant] = useState<any>(null);

  // 项目库筛选状态
  const [selectedTrack, setSelectedTrack] = useState('全部赛道');
  const [selectedStage, setSelectedStage] = useState('全部阶段');
  const [selectedBackground, setSelectedBackground] = useState('全部背景');
  const [projectSearchText, setProjectSearchText] = useState('');

  // 项目库筛选逻辑
  const filteredProjects = useMemo(() => {
    return MOCK_DATA.bpProjects.filter(project => {
      const matchTrack = selectedTrack === '全部赛道' || project.track === selectedTrack;
      const matchStage = selectedStage === '全部阶段' || project.fundingStage === selectedStage;
      const matchBackground = selectedBackground === '全部背景' || project.teamBackground === selectedBackground;
      const matchSearch = projectSearchText === '' || project.name.toLowerCase().includes(projectSearchText.toLowerCase());
      return matchTrack && matchStage && matchBackground && matchSearch;
    });
  }, [selectedTrack, selectedStage, selectedBackground, projectSearchText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'tasks', label: 'BP分析', icon: FileText },
    { id: 'orders', label: '点数订单', icon: ShoppingCart },
    { id: 'tenants', label: '租户管理', icon: Building2, hidden: !isAdmin },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'quota', label: '点数/配额管理', icon: Layers },
    { id: 'projects', label: '项目库', icon: FolderOpen },
  ];

  if (!isLoggedIn) return <div className="p-10 text-center">系统已退出，请刷新页面重新登录。</div>;

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900 overflow-hidden">
      {/* 侧边导航栏 */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              <LayoutGrid size={24} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tight">Agent 系统</span>
          </div>
          <div className="mt-6 flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-indigo-400' : 'bg-emerald-400'}`}></div>
            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
              {isAdmin ? '系统管理员' : '租户管理员'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.filter(item => !item.hidden).map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentMenu(item.id)}
              className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                currentMenu === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="w-full flex items-center justify-center py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white border border-white/10 rounded-xl transition-all"
          >
            切换预览身份
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between z-10">
          <h2 className="font-black text-2xl tracking-tight text-slate-900">
            {menuItems.find(m => m.id === currentMenu)?.label}
          </h2>

          <div className="flex items-center gap-8 relative" ref={userMenuRef}>
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-slate-900">{isAdmin ? '超级管理员' : '阿里巴巴'}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">在线</span>
            </div>

            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center hover:bg-indigo-100 transition-colors"
            >
              <UserCircle className="text-indigo-600" size={24} />
            </button>

            {/* 用户菜单弹窗 */}
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-5 py-2 border-b border-slate-50 mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">管理操作</p>
                </div>
                <button className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Settings size={18} /> 修改密码
                </button>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={18} /> 退出登录
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10">
          {/* BP分析视图 */}
          {currentMenu === 'tasks' && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="搜索项目名称..." 
                      className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium w-64 outline-none" 
                    />
                  </div>
                  {isAdmin && (
                    <div className="relative">
                      <select 
                        className="appearance-none pl-6 pr-12 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none cursor-pointer"
                        onChange={(e) => setSelectedTenant(e.target.value)}
                      >
                        <option>全部租户</option>
                        {MOCK_DATA.tenants.map(t => <option key={t.id}>{t.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                      <th className="px-8 py-5">任务编号</th>
                      <th className="px-8 py-5">项目文件名</th>
                      {isAdmin && <th className="px-8 py-5">所属组织</th>}
                      <th className="px-8 py-5">操作人</th>
                      <th className="px-8 py-5">处理状态</th>
                      <th className="px-8 py-5">提交时间</th>
                      <th className="px-8 py-5 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_DATA.tasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 font-mono text-[11px] text-slate-400">{task.id}</td>
                        <td className="px-8 py-6 font-bold">{task.fileName}</td>
                        {isAdmin && <td className="px-8 py-6 text-sm text-slate-500">{task.tenant}</td>}
                        <td className="px-8 py-6 text-sm text-slate-600">{task.user}</td>
                        <td className="px-8 py-6"><StatusBadge status={task.status} /></td>
                        <td className="px-8 py-6 text-xs text-slate-400">{task.time}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button className="flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">
                              <Download size={14} /> 下载BP
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest">
                              <FileDown size={14} /> 下载报告
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 订单管理视图 - 改为点数订单 */}
          {currentMenu === 'orders' && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h4 className="font-black text-slate-900">点数流水记录</h4>
                <div className="text-xs font-bold text-slate-400">仅展示近 90 天订单</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5">流水单号</th>
                      <th className="px-8 py-5">点数类型</th>
                      <th className="px-8 py-5">点数数值</th>
                      <th className="px-8 py-5">关联租户</th>
                      <th className="px-8 py-5">状态</th>
                      <th className="px-8 py-5">发生时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_DATA.orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs">{order.id}</td>
                        <td className="px-8 py-6 font-bold">{order.type}</td>
                        <td className="px-8 py-6 font-black text-indigo-600">
                          {order.amount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">点</span>
                        </td>
                        <td className="px-8 py-6 text-slate-500">{order.tenant}</td>
                        <td className="px-8 py-6"><StatusBadge status={order.status} /></td>
                        <td className="px-8 py-6 text-slate-400 text-xs">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 租户管理视图 */}
          {currentMenu === 'tenants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
               {MOCK_DATA.tenants.map(tenant => (
                  <div key={tenant.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Building2 size={28} /></div>
                      <StatusBadge status={tenant.status} />
                    </div>
                    <h3 className="font-black text-xl mb-1">{tenant.name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{tenant.id}</p>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">联系人</span><span>{tenant.contact}</span></div>
                      <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">子账号</span><span>{tenant.userCount}</span></div>
                    </div>
                  </div>
               ))}
            </div>
          )}

          {/* 配额管理视图 */}
          {currentMenu === 'quota' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {MOCK_DATA.tenants.map(tenant => (
                   <div key={tenant.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8">
                        <Coins className="text-indigo-50" size={80} />
                      </div>
                      <div className="relative z-10">
                        <h4 className="font-black text-lg text-slate-900">{tenant.name}</h4>
                        <div className="mt-6">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">当前消耗点数</span>
                            <span className="text-2xl font-black text-indigo-600">{tenant.quotaUsed} <span className="text-xs text-slate-300">/ {tenant.quotaTotal}</span></span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(tenant.quotaUsed/tenant.quotaTotal)*100}%` }}></div>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setActiveTenant(tenant); setDrawerType('recharge'); setDrawerOpen(true); }}
                          className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> 增加点数配额
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* 用户管理视图 */}
          {currentMenu === 'users' && (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5">用户编号</th>
                      <th className="px-8 py-5">姓名</th>
                      <th className="px-8 py-5">角色</th>
                      <th className="px-8 py-5">所属租户</th>
                      <th className="px-8 py-5">邮箱</th>
                      <th className="px-8 py-5">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_DATA.users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs text-slate-400">{user.id}</td>
                        <td className="px-8 py-6 font-bold">{user.name}</td>
                        <td className="px-8 py-6 text-sm text-slate-600">{user.role}</td>
                        <td className="px-8 py-6 text-sm text-slate-500">{user.tenant}</td>
                        <td className="px-8 py-6 text-xs text-slate-400">{user.email}</td>
                        <td className="px-8 py-6"><StatusBadge status={user.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}

          {/* 项目库视图 */}
          {currentMenu === 'projects' && (
            <div className="space-y-6">
              {/* 筛选栏 */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Filter size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">筛选条件</span>
                  </div>

                  {/* 赛道筛选 */}
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none cursor-pointer"
                  >
                    <option>全部赛道</option>
                    <option>人工智能</option>
                    <option>具身智能</option>
                    <option>半导体</option>
                    <option>软件</option>
                    <option>新能源</option>
                    <option>智能通信</option>
                    <option>前沿科技</option>
                    <option>医疗科技</option>
                    <option>元宇宙</option>
                  </select>

                  {/* 融资阶段筛选 */}
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none cursor-pointer"
                  >
                    <option>全部阶段</option>
                    <option>种子轮</option>
                    <option>天使轮</option>
                    <option>Pre-A</option>
                    <option>A轮</option>
                    <option>B轮</option>
                    <option>C轮</option>
                  </select>

                  {/* 团队背景筛选 */}
                  <select
                    value={selectedBackground}
                    onChange={(e) => setSelectedBackground(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none cursor-pointer"
                  >
                    <option>全部背景</option>
                    <option>海外名校</option>
                    <option>国内C9 985</option>
                    <option>职业履历</option>
                  </select>

                  {/* 搜索框 */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      placeholder="搜索项目名称..."
                      value={projectSearchText}
                      onChange={(e) => setProjectSearchText(e.target.value)}
                      className="pl-12 pr-6 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium w-full outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 结果数量提示 */}
              {(selectedTrack !== '全部赛道' || selectedStage !== '全部阶段' || selectedBackground !== '全部背景' || projectSearchText !== '') && (
                <div className="flex items-center justify-between bg-indigo-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-indigo-600">找到 {filteredProjects.length} 个项目</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTrack('全部赛道');
                      setSelectedStage('全部阶段');
                      setSelectedBackground('全部背景');
                      setProjectSearchText('');
                    }}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                  >
                    清除筛选
                  </button>
                </div>
              )}

              {/* 项目卡片网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <div key={project.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    {/* 项目头部 */}
                    <div className="p-6 border-b border-slate-50">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                        {project.missingCount > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                            <AlertCircle size={14} className="text-amber-600" />
                            <span className="text-[10px] font-black text-amber-600">{project.missingCount}项缺失</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">{project.track}</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{project.fundingStage}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{project.id}</p>
                    </div>

                    {/* 项目信息 */}
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold">联系人</span>
                        <span className="text-slate-900 font-bold">{project.contact}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold">上传时间</span>
                        <span className="text-slate-900 font-bold">{project.uploadTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold">营收规模</span>
                        <span className="text-slate-900 font-bold">{project.revenue}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-bold">盈利情况</span>
                        <span className="text-slate-900 font-bold">{project.profit}</span>
                      </div>

                      {/* 场景标签 */}
                      <div className="pt-3 border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">应用场景</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.scenarios.map((scenario, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">
                              {scenario}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 事实标签 */}
                      <div className="pt-3 border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">事实标签</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold flex items-center gap-1">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="p-6 pt-0 flex gap-2">
                      <button className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                        查看详情
                      </button>
                      <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-600 hover:text-white transition-all">
                        下载BP
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 统计信息 */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-black text-indigo-600 mb-2">{filteredProjects.length}</div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">
                      {selectedTrack !== '全部赛道' || selectedStage !== '全部阶段' || selectedBackground !== '全部背景' || projectSearchText !== '' ? '筛选结果' : '总项目数'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-emerald-600 mb-2">
                      {filteredProjects.filter(p => p.missingCount === 0).length}
                    </div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">完整BP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-600 mb-2">
                      {new Set(filteredProjects.map(p => p.track)).size}
                    </div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">覆盖赛道</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-600 mb-2">
                      {filteredProjects.filter(p => p.profit !== '未盈利').length}
                    </div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">已盈利项目</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 抽屉表单 */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerType === 'recharge' ? '增加点数配额' : '编辑'}
        onConfirm={() => {
          console.log('保存成功');
        }}
      >
        {drawerType === 'recharge' && activeTenant && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">租户名称</label>
              <div className="text-lg font-bold text-slate-900">{activeTenant.name}</div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">充值点数</label>
              <input
                type="number"
                placeholder="请输入充值点数"
                className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-colors text-lg font-bold"
              />
            </div>
            <div className="p-6 bg-indigo-50 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-indigo-400 uppercase">当前配额</span>
                <span className="text-xl font-black text-indigo-600">{activeTenant.quotaTotal} 点</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-indigo-400 uppercase">已使用</span>
                <span className="text-xl font-black text-indigo-600">{activeTenant.quotaUsed} 点</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}