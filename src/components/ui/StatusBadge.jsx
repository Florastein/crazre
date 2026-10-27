import React from 'react';

export const statusConfig = {
  pending:   { bg: 'bg-amber-50/50',   text: 'text-amber-700 border border-amber-500/20',   label: 'PENDING'      },
  submitted: { bg: 'bg-blue-50/50',    text: 'text-blue-700 border border-blue-500/20',    label: 'SUBMITTED'    },
  review:    { bg: 'bg-purple-50/50',  text: 'text-purple-700 border border-purple-500/20',  label: 'UNDER REVIEW' },
  approved:  { bg: 'bg-emerald-50/50', text: 'text-accent border border-accent/20',         label: 'APPROVED'     },
  rejected:  { bg: 'bg-red-50/50',     text: 'text-red-700 border border-red-500/20',       label: 'REJECTED'     },
  draft:     { bg: 'bg-slate-50',      text: 'text-slate-600 border border-slate-500/20',    label: 'DRAFT'        },
  risk:      { bg: 'bg-orange-50/50',  text: 'text-orange-700 border border-orange-500/30',  label: 'AT RISK'      },
  active:    { bg: 'bg-emerald-50/50', text: 'text-accent border border-accent/20',         label: 'ACTIVE'       },
  archived:  { bg: 'bg-gray-50',       text: 'text-gray-500 border border-gray-500/20',      label: 'ARCHIVED'     },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] ?? statusConfig.draft;
  return (
    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-none text-[10px] font-mono tracking-wider font-bold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
export default StatusBadge;
