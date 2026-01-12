'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TreasuryChart } from '@/components/modules/TreasuryChart';
import { GlassCard } from '@/components/ui/GlassCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TreasuryPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/treasury/projection`);
                if (!res.ok) throw new Error('API Error');
                const json = await res.json();
                if (json.projection) setData(json.projection);
            } catch (error) {
                console.warn("Backend no detectado, usando datos simulados.");
                // Fallback Mock Data
                const mock = Array.from({ length: 12 }, (_, i) => ({
                    mes: `Mes ${i + 1}`,
                    ingresos: 20000000 + Math.random() * 5000000,
                    egresos: 15000000 + Math.random() * 3000000
                }));
                setData(mock);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const totalIngresos = data.reduce((acc, curr) => acc + (curr.ingresos || 0), 0);
    const totalEgresos = data.reduce((acc, curr) => acc + (curr.egresos || 0), 0);
    const margen = totalIngresos > 0 ? ((1 - (totalEgresos / totalIngresos)) * 100).toFixed(1) : "0.0";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
                    <Wallet className="w-10 h-10 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-space text-white">Proyección de Tesorería</h1>
                    <p className="text-slate-400">Radar de liquidez y predicción de flujo de caja futuro.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard gradient className="border-l-4 border-emerald-500">
                    <p className="text-slate-400 text-sm">Ingresos Anuales (Proj)</p>
                    <h2 className="text-3xl font-bold text-white mt-1">${(totalIngresos / 1000000).toFixed(1)}M</h2>
                    <div className="flex items-center text-emerald-400 text-sm mt-2">
                        <ArrowUpRight className="w-4 h-4 mr-1" /> +12% vs año anterior
                    </div>
                </GlassCard>

                <GlassCard gradient className="border-l-4 border-rose-500">
                    <p className="text-slate-400 text-sm">Egresos Anuales (Proj)</p>
                    <h2 className="text-3xl font-bold text-white mt-1">${(totalEgresos / 1000000).toFixed(1)}M</h2>
                    <div className="flex items-center text-rose-400 text-sm mt-2">
                        <ArrowDownRight className="w-4 h-4 mr-1" /> -5% optimización
                    </div>
                </GlassCard>

                <GlassCard gradient className="border-l-4 border-indigo-500">
                    <p className="text-slate-400 text-sm">Margen Operativo</p>
                    <h2 className="text-3xl font-bold text-white mt-1">
                        {margen}%
                    </h2>
                    <div className="flex items-center text-indigo-400 text-sm mt-2">
                        <TrendingUp className="w-4 h-4 mr-1" /> Saludable
                    </div>
                </GlassCard>
            </div>

            {data.length > 0 ? (
                <TreasuryChart data={data} />
            ) : (
                <div className="h-[400px] flex items-center justify-center">
                    <span className="animate-pulse text-slate-500">Cargando proyección financiera...</span>
                </div>
            )}
        </div>
    );
}
