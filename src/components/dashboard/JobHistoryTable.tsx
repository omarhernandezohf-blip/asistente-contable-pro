'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Download, Clock, CheckCircle2, FileSpreadsheet, FileCode, MoreVertical, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

// Mock Data Type
interface Job {
    id: string;
    name: string;
    type: 'excel' | 'pdf' | 'xml' | 'json';
    date: string; // ISO String
    size: string;
    status: 'completed' | 'expired';
}

// Mock Data Generator
const mockJobs: Job[] = [
    { id: '1', name: 'Reporte_Auditoria_DIAN_2025.xlsx', type: 'excel', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), size: '2.4 MB', status: 'completed' },
    { id: '2', name: 'Nomina_Diciembre_Analisis.pdf', type: 'pdf', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), size: '1.2 MB', status: 'completed' },
    { id: '3', name: 'Facturacion_Electronica_Lote_1.xml', type: 'xml', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), size: '4.8 MB', status: 'completed' },
    { id: '4', name: 'Conciliacion_Bancaria_Nov.xlsx', type: 'excel', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), size: '3.1 MB', status: 'completed' },
    { id: '5', name: 'Reporte_Antiguo_Vencido.json', type: 'json', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), size: '0.5 MB', status: 'expired' },
];

export function JobHistoryTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState<Job[]>(mockJobs);

    const filteredJobs = jobs.filter(job =>
        job.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch (type) {
            case 'excel': return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
            case 'pdf': return <FileText className="w-5 h-5 text-rose-400" />;
            case 'xml': return <FileCode className="w-5 h-5 text-amber-400" />;
            default: return <FileText className="w-5 h-5 text-slate-400" />;
        }
    };

    const handleDelete = (id: string) => {
        setJobs(jobs.filter(j => j.id !== id));
    };

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar archivo..."
                        className="pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                <div className="col-span-5">Nombre del Archivo</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-2">Tamaño</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-1 text-right">Acciones</div>
            </div>

            {/* List */}
            <div className="space-y-2 mt-2">
                <AnimatePresence>
                    {filteredJobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group relative grid grid-cols-12 gap-4 px-6 py-4 items-center bg-slate-800/20 hover:bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all duration-300"
                        >
                            {/* File Name & Icon */}
                            <div className="col-span-5 flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 shadow-sm group-hover:scale-110 transition-transform">
                                    {getIcon(job.type)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate pr-4">
                                        {job.name}
                                    </h4>
                                    <span className="text-xs text-slate-500 uppercase">{job.type}</span>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="col-span-2 flex items-center gap-2 text-sm text-slate-400">
                                <Clock className="w-3.5 h-3.5 opacity-50" />
                                <span>{new Date(job.date).toLocaleDateString()}</span>
                            </div>

                            {/* Size */}
                            <div className="col-span-2 text-sm text-slate-400 font-mono">
                                {job.size}
                            </div>

                            {/* Status */}
                            <div className="col-span-2">
                                {job.status === 'completed' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Disponible
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
                                        <Clock className="w-3 h-3" />
                                        Expirado
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    className="p-2 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors"
                                    title="Descargar"
                                    disabled={job.status === 'expired'}
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    onClick={() => handleDelete(job.id)}
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>No se encontraron archivos en tu historial reciente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
