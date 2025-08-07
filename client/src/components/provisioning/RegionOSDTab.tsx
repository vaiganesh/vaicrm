import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RegionOSDTab() {
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/provisioning/send-region-osd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, message, duration }),
      });
      toast({ title: "Region OSD Sent", description: "Region OSD message sent successfully." });
      setRegion(""); setMessage(""); setDuration("");
    } catch {
      toast({ title: "Error", description: "Failed to send Region OSD.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="max-w-lg w-full mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Region Code</label>
        <Input value={region} onChange={e => setRegion(e.target.value)} required className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <Input value={message} onChange={e => setMessage(e.target.value)} required className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration (seconds, optional)</label>
        <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full" />
      </div>
      <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "Sending..." : "Send Region OSD"}
      </Button>
    </form>
  );
}