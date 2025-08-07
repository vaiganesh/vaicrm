import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BMailTab() {
  const [scId, setScId] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/provisioning/send-bmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scId, message }),
      });
      toast({ title: "B-Mail Sent", description: "B-Mail command sent successfully." });
      setScId(""); setMessage("");
    } catch {
      toast({ title: "Error", description: "Failed to send B-Mail.", variant: "destructive" });
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
        <label className="block text-sm font-medium mb-1">Message</label>
        <Input value={message} onChange={e => setMessage(e.target.value)} required className="w-full" />
      </div>
      <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "Sending..." : "Send B-Mail"}
      </Button>
    </form>
  );
}