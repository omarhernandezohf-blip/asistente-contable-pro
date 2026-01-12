'use client';

import { useState, useEffect } from 'react';
import { Banknote, Upload, ArrowLeftRight, CheckCircle, AlertCircle, FileSpreadsheet, Download, Search, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';

// Types for reconciliation items
interface ReconciliationItem {
    id: string;
    date: string;
    description: string;
    amount: number;
    source: 'BANK' | 'BOOK';
    status: 'MATCHED' | 'PENDING_BANK' | 'PENDING_BOOK';
    matchConfidence?: number;
}

export default function BankReconcilePage() {
    const [bankFile, setBankFile] = useState<File | null>(null);
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [viewMode, setViewMode] = useState<'upload' | 'results'>('upload');
    const [results, setResults] = useState<ReconciliationItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => setIsClient(true), []);

    const formatCurrency = (val: number) => {
        if (!isClient) return val.toString();
        return val.toLocaleString('es-CO', { maximumFractionDigits: 0 });
    };

    const handleConciliate = () => {
        if (!bankFile || !bookFile) return;
        setIsProcessing(true);

        // Simulate complex matching algorithm
        setTimeout(() => {
            const mockItems: ReconciliationItem[] = [
                { id: '1', date: '2026-01-05', description: 'TRANSFERENCIA BANCOLOMBIA', amount: -5000000, source: 'BANK', status: 'MATCHED', matchConfidence: 100 },
                { id: '2', date: '2026-01-08', description: 'PAGO NOMINA QUINCENA 1', amount: -12500000, source: 'BANK', status: 'MATCHED', matchConfidence: 98 },
                { id: '3', date: '2026-01-12', description: 'CHEQUE 4501 NO COBRADO', amount: -2300000, source: 'BOOK', status: 'PENDING_BANK' },
                { id: '4', date: '2026-01-15', description: 'COBRO INTERESES TARJETA', amount: -125000, source: 'BANK', status: 'PENDING_BOOK' },
                { id: '5', date: '2026-01-20', description: 'PAGO CLIENTE FACT 998', amount: 4500000, source: 'BANK', status: 'MATCHED', matchConfidence: 100 },
                { id: '6', date: '2026-01-22', description: 'GMF 4X1000', amount: -45000, source: 'BANK', status: 'PENDING_BOOK' },
            ];
            setResults(mockItems);
            setIsProcessing(false);
            setViewMode('results');
        }, 3000);
    };

    // Calculate Summary KPIs
    const totalBank = results.filter(r => r.source === 'BANK' || r.status === 'MATCHED').reduce((acc, curr) => acc + curr.amount, 150000000); // Initial balance simulation
    const totalBook = 148500000; // Simulated book balance
    const difference = totalBank - totalBook;
    const matchCount = results.filter(r => r.status === 'MATCHED').length;
    const pendingBank = results.filter(r => r.status === 'PENDING_BANK').length;
    const pendingBook = results.filter(r => r.status === 'PENDING_BOOK').length;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
                    <Banknote className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-space text-white">Conciliación Bancaria IA</h1>
                    <p className="text-slate-400">Motor de emparejamiento inteligente (Fuzzy Matching) para tus extractos.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'upload' ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
                    >
                        {/* Bank Side */}
                        <GlassCard className="h-full flex flex-col border-emerald-500/30">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">A</span>
                                Extracto Bancario
                            </h3>
                            <div className="flex-1">
                                <FileUpload
                                    accept=".xlsx,.csv,.pdf"
                                    label="Subir Extracto"
                                    onFilesSelected={(f) => setBankFile(f[0])}
                                />
                                {bankFile && <p className="mt-2 text-emerald-400 text-sm flex items-center gap-1 font-medium bg-emerald-500/10 p-2 rounded">✅ Cargado: {bankFile.name}</p>}
                            </div>
                        </GlassCard>

                        {/* Center Action */}
                        <div className="text-center space-y-4">
                            <div className="w-24 h-24 mx-auto rounded-full bg-slate-900 border border-white/10 flex items-center justify-center relative group">
                                <ArrowLeftRight className={`w-12 h-12 text-indigo-400 ${isProcessing ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                            </div>
                            <button
                                onClick={handleConciliate}
                                disabled={!bankFile || !bookFile || isProcessing}
                                className="btn-primary w-full py-4 text-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Cruzando Datos...' : 'Iniciar Conciliación'}
                            </button>
                            <p className="text-xs text-slate-500">Versión de Motor: v2.1.0-beta</p>
                        </div>

                        {/* Book Side */}
                        <GlassCard className="h-full flex flex-col border-indigo-500/30">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">B</span>
                                Libro Auxiliar
                            </h3>
                            <div className="flex-1">
                                <FileUpload
                                    accept=".xlsx,.csv"
                                    label="Subir Libro Mayor"
                                    onFilesSelected={(f) => setBookFile(f[0])}
                                />
                                {bookFile && <p className="mt-2 text-emerald-400 text-sm flex items-center gap-1 font-medium bg-emerald-500/10 p-2 rounded">✅ Cargado: {bookFile.name}</p>}
                            </div>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* KPI Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <GlassCard className="bg-emerald-900/10 border-emerald-500/30">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Saldo Extracto</p>
                                <h2 className="text-2xl font-bold text-white mt-1">${formatCurrency(totalBank)}</h2>
                                <p className="text-xs text-slate-500 mt-2">Al corte del periodo</p>
                            </GlassCard>
                            <GlassCard className="bg-indigo-900/10 border-indigo-500/30">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Saldo en Libros</p>
                                <h2 className="text-2xl font-bold text-white mt-1">${formatCurrency(totalBook)}</h2>
                                <p className="text-xs text-slate-500 mt-2">Saldo ajustado preliminar</p>
                            </GlassCard>
                            <GlassCard className={`${difference !== 0 ? 'bg-rose-900/10 border-rose-500/30' : 'bg-emerald-900/10 border-emerald-500/30'}`}>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Diferencia</p>
                                <h2 className={`text-2xl font-bold mt-1 ${difference !== 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    ${formatCurrency(difference)}
                                </h2>
                                <p className="text-xs text-slate-500 mt-2">{difference !== 0 ? 'Requiere Ajustes' : 'Conciliación Perfecta'}</p>
                            </GlassCard>
                            <GlassCard className="cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setViewMode('upload')}>
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 hover:text-white">
                                    <RefreshCw className="w-6 h-6" />
                                    <span className="text-sm font-bold">Nueva Conciliación</span>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Results Table */}
                        <GlassCard className="overflow-hidden p-0">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-indigo-400" />
                                    Detalle de Partidas
                                </h3>
                                <div className="flex gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        {matchCount} Conciliados
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                        {pendingBook} Pend. Libros
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                        {pendingBank} Pend. Banco
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-white/5">
                                        <tr>
                                            <th className="px-6 py-3">Fecha</th>
                                            <th className="px-6 py-3">Descripción</th>
                                            <th className="px-6 py-3 text-right">Monto</th>
                                            <th className="px-6 py-3 text-center">Fuente</th>
                                            <th className="px-6 py-3 text-center">Estado</th>
                                            <th className="px-6 py-3 text-right">Confianza IA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {results.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-300">{item.date}</td>
                                                <td className="px-6 py-4 font-medium text-white">{item.description}</td>
                                                <td className={`px-6 py-4 text-right font-bold ${item.amount < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                                                    ${formatCurrency(item.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.source === 'BANK' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                        {item.source === 'BANK' ? 'BANCO' : 'LIBRO'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 ${item.status === 'MATCHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                            item.status === 'PENDING_BOOK' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        }`}>
                                                        {item.status === 'MATCHED' && <CheckCircle className="w-3 h-3" />}
                                                        {item.status === 'PENDING_BOOK' && <AlertCircle className="w-3 h-3" />}
                                                        {item.status === 'PENDING_BANK' && <AlertCircle className="w-3 h-3" />}
                                                        {item.status === 'MATCHED' ? 'Conciliado' : item.status === 'PENDING_BOOK' ? 'Falta en LIbro' : 'No Cobrado'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {item.matchConfidence ? (
                                                        <span className="text-emerald-400">{item.matchConfidence}%</span>
                                                    ) : (
                                                        <span className="text-slate-600">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
