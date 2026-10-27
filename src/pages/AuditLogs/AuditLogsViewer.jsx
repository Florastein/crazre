import React, { useState } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { Database, Search, Download, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AuditLogsViewer() {
  const { auditLogs } = useAppState();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(al => {
    const matchesSearch = al.user.toLowerCase().includes(search.toLowerCase()) || 
                          al.details.toLowerCase().includes(search.toLowerCase()) ||
                          al.ip.includes(search);
    const matchesAction = actionFilter === 'all' || al.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-fade-in text-text-primary text-xs font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary-900">
            Immutable Audit logs
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Historical administrative actions verified by security protocols.
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting complete administrative audit logs as spreadsheet CSV format...')}
          className="h-10 px-4 bg-primary-900 hover:bg-primary-800 text-white rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm ml-auto text-xs font-sans"
        >
          <Download className="w-4 h-4" />
          <span>Export logs CSV</span>
        </button>
      </div>

      {/* 2. FILTER CONTROLS */}
      <div className="flex bg-surface p-4 rounded-xl border border-border flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] text-text-muted uppercase font-bold text-primary-615">Action Filter:</span>
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-surface border border-border text-xs rounded-md h-8 px-2 outline-none font-semibold cursor-pointer"
          >
            <option value="all">Display All Operations</option>
            <option value="AUTH_LOGIN">User Authentications</option>
            <option value="DOC_UPLOAD">Document File Uploads</option>
            <option value="DOC_REVIEW">Supervisor Evaluations</option>
            <option value="GROUP_CREATE">Group Assemblies</option>
            <option value="USER_CREATE">User Account Registers</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input 
            type="text" 
            placeholder="Search logs by IP, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface-alt font-sans text-xs outline-none"
          />
        </div>
      </div>

      {/* 3. VERIFIED BANNER */}
      <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 flex items-center space-x-2.5 font-sans">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p className="leading-snug">
          <strong>Cryptographic Consensus Engaged</strong> — Meeting registries, supervisor evaluations, and audit histories are signed and locked. Modifications are prohibited under supervisory regulations.
        </p>
      </div>

      {/* 4. TABLE */}
      <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="min-w-full text-left font-sans">
            <thead>
              <tr className="border-b border-border bg-surface-alt p-3 text-text-muted font-mono text-[10px] uppercase">
                <th className="p-3">Timestamp Audit</th>
                <th className="p-3">Account operator</th>
                <th className="p-3">Operation action</th>
                <th className="p-3">Registry Details</th>
                <th className="p-3">Vetted IP Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-secondary">
              {filteredLogs.map(lg => (
                <tr key={lg.id} className="hover:bg-primary-50/10 transition">
                  <td className="p-3 font-mono text-[11px]">
                    {new Date(lg.timestamp).toLocaleDateString()} {new Date(lg.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3 font-semibold text-text-primary">
                    {lg.user}
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[9px] bg-primary-100 text-primary-900 px-2 py-0.5 rounded font-bold uppercase">
                      {lg.action}
                    </span>
                  </td>
                  <td className="p-3 font-sans truncate max-w-[240px]" title={lg.details}>
                    {lg.details}
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    {lg.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
