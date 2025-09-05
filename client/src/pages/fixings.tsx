import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/topbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getForwards } from "@/data/forward-prices";

export default function Fixings() {
  const exportFixing = (id:string) => {
    const url = `/api/fixings/${id}/export`;
    window.open(url, "_blank");
  };
  const qc = useQueryClient();
}
  const { data } = useQuery({ queryKey: ["/api/fixings"] });
  const { data: gradesData } = useQuery({ queryKey: ["/api/grades"] });
  const { data: vesselsData } = useQuery({ queryKey: ["/api/vessels"] });
  const rows = (data as any)?.data || []; const grades = (gradesData as any)?.data || []; const vessels = (vesselsData as any)?.data || [];

  const [open, setOpen] = useState(false);
  const [showPriceMenu, setShowPriceMenu] = useState(false);
  const [form, setForm] = useState<any>({ date: new Date().toISOString().slice(0,10), route: "", grade: "", volume: "", priceUsd: "", counterparty: "", vessel: "" });

  const prefillOnceRef = useRef(false);
  useEffect(()=>{
    if (prefillOnceRef.current) return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const price = sp.get("price"); const g = sp.get("grade"); const period = sp.get("period");
      if (price) {
        prefillOnceRef.current = true;
        setOpen(true);
        setForm((f:any)=>({ ...f, priceUsd: price, grade: g || f.grade }));
        // Optionally clear the query to avoid reopening on refresh:
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, "", url.toString());
      }
    } catch {}
  }, []);

  const mutate = useMutation({
    mutationFn: async (payload:any)=>{ const res = await fetch("/api/fixings",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }); if(!res.ok) throw new Error("Failed to save fixing"); return res.json(); },
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["/api/fixings"]}); qc.invalidateQueries({queryKey:["/api/vessels"]}); setOpen(false); }
  });


  // Close price menu on Escape
  useEffect(()=>{
    const onKey = (e: KeyboardEvent)=>{ if (e.key === "Escape") setShowPriceMenu(false); };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="flex h-screen overflow-hidden bg-trading-dark">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Fixings</h2>
              <Button onClick={()=>setOpen(true)} className="bg-trading-blue">Add Fixing</Button>
            </div>
            <Card className="bg-trading-slate border-gray-700">
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-gray-300"><tr className="text-left">
                      <th className="py-2 px-3">Export</th><th className="py-2 px-3">Date</th><th className="py-2 px-3">Route</th><th className="py-2 px-3">Grade</th>
                      <th className="py-2 px-3">Volume</th><th className="py-2 px-3">Price (USD/MT)</th><th className="py-2 px-3">Counterparty</th><th className="py-2 px-3">Vessel</th>
                    </tr></thead>
                    <tbody className="text-gray-200">
                      {rows.map((r:any)=>(
                        <tr key={r.id} className="border-t border-gray-700">
                          <td className="py-2 px-3"><button onClick={()=>exportFixing(r.id)} className="px-2 py-1 text-xs rounded border border-gray-600 hover:bg-gray-700">Export</button></td><td className="py-2 px-3">{r.date}</td><td className="py-2 px-3">{r.route}</td><td className="py-2 px-3">{r.grade}</td>
                          <td className="py-2 px-3">{r.volume}</td><td className="py-2 px-3">${r.priceUsd}</td><td className="py-2 px-3">{r.counterparty}</td><td className="py-2 px-3">{r.vessel || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-[680px]">
            <div className="text-lg font-semibold mb-3">New Fixing</div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-sm">Date</Label><Input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></div>
              <div><Label className="text-sm">Route</Label><Input value={form.route} onChange={e=>setForm({...form, route:e.target.value})} placeholder="MAL → TUN"/></div>
              <div><Label className="text-sm">Grade</Label>
                <select value={form.grade} onChange={e=>setForm({...form, grade:e.target.value})} className="bg-gray-800 border border-gray-700 rounded px-2 py-2">
                  <option value="">-- select --</option>
                  {grades.map((g:any)=>(<option key={g.id} value={g.name}>{g.name}</option>))}
                </select>
              </div>
              <div><Label className="text-sm">Volume</Label><Input value={form.volume} onChange={e=>setForm({...form, volume:e.target.value})} placeholder="5000 MT"/></div>
              <div className="relative">
  <Label className="text-sm">Price (USD/MT)</Label>
  <Input value={form.priceUsd} onChange={e=>setForm({...form, priceUsd:e.target.value})}
    onFocus={()=>setShowPriceMenu(true)} onClick={()=>setShowPriceMenu(true)}
    placeholder="Click to pick from forwards"/>
  {showPriceMenu && (
    <div className="absolute z-50 mt-1 w-72 max-h-64 overflow-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2">
      {getForwards(form.grade).length === 0 ? (
        <div className="text-sm text-gray-400 p-2">Select a grade to see forward prices.</div>
      ) : (
        getForwards(form.grade).map((p:any, idx:number)=> (
          <button key={idx} type="button"
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 flex items-center justify-between"
            onClick={()=>{ setForm({...form, priceUsd: String(p.price)}); setShowPriceMenu(false); }}>
            <span className="text-gray-300">{p.label}</span>
            <span className="text-white font-semibold">${p.price.toFixed(2)}</span>
          </button>
        ))
      )}
      <div className="pt-2 text-right">
        <button type="button" className="text-xs text-gray-400 hover:text-white" onClick={()=>setShowPriceMenu(false)}>Close</button>
      </div>
    </div>
  )}
</div>
              <div><Label className="text-sm">Counterparty</Label><Input value={form.counterparty} onChange={e=>setForm({...form, counterparty:e.target.value})}/></div>
              <div className="col-span-2"><Label className="text-sm">Vessel</Label>
                <select value={form.vessel} onChange={e=>setForm({...form, vessel:e.target.value})} className="bg-gray-800 border border-gray-700 rounded px-2 py-2 w-full">
                  <option value="">-- select --</option>
                  {vessels.map((v:any)=>(<option key={v.id} value={v.name}>{v.name}</option>))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button className="bg-trading-blue" onClick={()=>mutate.mutate(form)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


