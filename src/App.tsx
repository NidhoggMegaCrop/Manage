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
  Coins
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
  ]
};

// --- 子组件: 状态标签 ---
const StatusBadge = ({ status }) => {
  const styles = {
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
const Drawer = ({ isOpen, onClose, title, children, onConfirm }) => {
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
  const userMenuRef = useRef(null);

  // 表单状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('');
  const [activeTenant, setActiveTenant] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
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