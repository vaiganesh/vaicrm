import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BlacklistTab() {
  const [scId, setScId] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/provisioning/blacklist-stb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scId, reason }),
      });
      toast({ title: "STB Blacklisted", description: "STB/Smart Card blacklisted successfully." });
      setScId(""); setReason("");
    } catch {
      toast({ title: "Error", description: "Failed to blacklist STB.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="max-w-lg w-full mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">SC/STB ID</label>
        <Input value={scId} onChange={e => setScId(e.target.value)} required className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <Input value={reason} onChange={e => setReason(e.target.value)} required className="w-full" />
      </div>
      <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "Processing..." : "Blacklist / Kill STB"}
      </Button>
    </form>
  );
}