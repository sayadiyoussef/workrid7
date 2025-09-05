import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Droplets, TestTube, Leaf, Flame, Minus, TrendingUp, TrendingDown } from "lucide-react";
import type { Forward } from "@/data/forward-prices";
import { forwardPrices } from "@/data/forward-prices";

const gradeIcons = {
  "RBD Palm Oil": Zap,
  "RBD Palm Stearin": Droplets,
  "RBD Palm Olein IV56": TestTube,
  "Olein IV64": Leaf,
  "RBD PKO": Flame,
  "RBD CNO": Zap,
  "CDSBO": Droplets,
} as const;

function ChangeBadge({ value }:{ value:number }) {
  if (value > 0) {
    return <span className="flex items-center text-trading-green font-medium" data-testid="change-up">
      <TrendingUp className="w-3 h-3 mr-1" /> {value.toFixed(1)}%
    </span>;
  } else if (value < 0) {
    return <span className="flex items-center text-trading-red font-medium" data-testid="change-down">
      <TrendingDown className="w-3 h-3 mr-1" /> {value.toFixed(1)}%
    </span>;
  }
  return <span className="flex items-center text-gray-400 font-medium" data-testid="change-neutral">
    <Minus className="w-3 h-3 mr-1" /> 0.0%
  </span>;
}

function StatusBadge({ status }:{ status:string }){
  switch (status) {
    case "active":
      return <Badge className="bg-trading-green/20 text-trading-green border-trading-green/20">Active</Badge>;
    case "limited":
      return <Badge className="bg-trading-amber/20 text-trading-amber border-trading-amber/20">Limited</Badge>;
    default:
      return <Badge variant="secondary">Inactive</Badge>;
  }
}

export default function MarketTableWithForwards(){
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [, setLocation] = useLocation();
  const { data, isLoading } = useQuery({ queryKey: ["/api/market/latest"] });
  const latestData = (data as any)?.data || [];

  return (
    <Card className="bg-trading-slate border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Live Market Data</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Price (USD)</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Price (TND)</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Change 24h</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-trading-slate">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-gray-700" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-gray-700" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-gray-700" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-gray-700" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-gray-700" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-gray-700" /></td>
                  </tr>
                ))
              ) : latestData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No market data available</td>
                </tr>
              ) : (
                latestData.map((item:any) => {
                  const IconComponent = (gradeIcons as any)[item.gradeName] || Zap;
                  const isOpen = !!expanded[item.gradeId];
                  const fw: Forward[] = (forwardPrices as any)[item.gradeName] || [];
                  return (
                    <>
                      <tr
                        key={item.id}
                        className="border-b border-gray-700 hover:bg-gray-800/40 cursor-pointer"
                        onClick={()=> setExpanded((e)=>({ ...e, [item.gradeId]: !e[item.gradeId] }))}
                      >
                        <td className="px-6 py-4 flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-trading-blue" />
                          <span className="text-white font-medium">{item.gradeName}</span>
                        </td>
                        <td className="px-6 py-4 text-white">${item.priceUsd?.toFixed?.(2) ?? item.priceUsd}</td>
                        <td className="px-6 py-4 text-white">{(item.priceUsd * (item.usdTnd||3.43)).toLocaleString("fr-FR")} TND</td>
                        <td className="px-6 py-4"><ChangeBadge value={Number(item.change24h||0)} /></td>
                        <td className="px-6 py-4">{item.volume} MT</td>
                        <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td className="px-6 py-3 bg-gray-900/60" colSpan={6}>
                            {fw.length === 0 ? (
                              <div className="text-gray-400 text-sm">Aucun prix à terme pour ce grade (à compléter).</div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                                {fw.map((p, idx) => (
                                  <div
                                    key={idx}
                                    className="border border-gray-700 rounded-lg p-3 bg-gray-800/60 hover:bg-gray-800 cursor-pointer"
                                    onClick={()=> setLocation(`/fixings?price=${p.price}&grade=${encodeURIComponent(item.gradeName)}&period=${encodeURIComponent(p.label)}`)}
                                  >
                                    <div className="text-xs text-gray-400">{p.code || ""}</div>
                                    <div className="text-sm text-gray-300">{p.label}</div>
                                    <div className="text-lg font-semibold text-white">${p.price.toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
