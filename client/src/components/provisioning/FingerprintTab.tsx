import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function FingerprintTab() {
  const [target, setTarget] = useState(""); // SC/STB ID or Region
  const [channelList, setChannelList] = useState("");
  const [xPos, setXPos] = useState("");
  const [yPos, setYPos] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/provisioning/send-fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, channelList, xPos, yPos, duration }),
      });
      toast({ title: "Fingerprint Sent", description: "Fingerprint command sent successfully." });
      setTarget(""); setChannelList(""); setXPos(""); setYPos(""); setDuration("");
    } catch {
      toast({ title: "Error", description: "Failed to send fingerprint.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSend} className="max-w-lg w-full mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">SC/STB ID or Region</label>
        <Input value={target} onChange={e => setTarget(e.target.value)} required className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Channel List (comma separated)</label>
        <Input value={channelList} onChange={e => setChannelList(e.target.value)} required className="w-full" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">X Position</label>
          <Input value={xPos} onChange={e => setXPos(e.target.value)} required className="w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Y Position</label>
          <Input value={yPos} onChange={e => setYPos(e.target.value)} required className="w-full" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
        <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} required className="w-full" />
      </div>
      <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "Sending..." : "Send Fingerprint"}
      </Button>
    </form>
  );
}