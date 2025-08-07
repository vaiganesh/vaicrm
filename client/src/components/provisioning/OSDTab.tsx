import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function OSDTab() {
  const [scId, setScId] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/provisioning/send-osd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scId, message, duration }),
      });
      toast({ title: "OSD Sent", description: "OSD message sent successfully." });
      setScId(""); setMessage(""); setDuration("");
    } catch {
      toast({ title: "Error", description: "Failed to send OSD.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium mb-2">SC/STB ID</label>
          <Input value={scId} onChange={e => setScId(e.target.value)} required className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <Input value={message} onChange={e => setMessage(e.target.value)} required className="w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2">Duration (seconds, optional)</label>
          <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full" />
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button type="submit" className="btn-primary px-8" disabled={loading}>
          {loading ? "Sending..." : "Send OSD"}
        </Button>
      </div>
    </form>
  );
}