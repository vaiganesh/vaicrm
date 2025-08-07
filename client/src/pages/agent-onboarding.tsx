import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MultiStepAgentForm from "@/components/forms/multi-step-agent-form";
import PageHeader from "@/components/layout/page-header";
import AgentsDataGrid from "@/components/agents/agents-data-grid";

export default function AgentOnboarding() {
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [viewingAgent, setViewingAgent] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for URL parameters to show form directly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'new') {
      setShowForm(true);
    }
  }, []);

  const { data: agents, isLoading } = useQuery<{success: boolean; data: any[]}>({
    queryKey: ["/api/agents"],
    select: (data) => ({
      ...data,
      data: data.data?.filter((agent: any) => agent.status === 'approved') || []
    })
  });

  const createAgentMutation = useMutation({
    mutationFn: async (agentData: any) => {
      console.log("Mutation triggered with data:", agentData);
      
      if (editingAgent) {
        console.log("Updating existing agent:", editingAgent.id);
        return await apiRequest("PUT", `/api/agents/${editingAgent.id}`, agentData);
      } else {
        console.log("Creating new agent");
        return await apiRequest("POST", "/api/agents", agentData);
      }
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      
      if (!editingAgent && response?.data?.onboardingRefNo) {
        // New agent submission
        toast({
          title: "Agent Submitted for KYC Verification",
          description: `Onboarding reference: ${response.data.onboardingRefNo}. Your application has been sent for KYC verification.`,
        });
      } else {
        toast({
          title: "Success",
          description: editingAgent ? "Agent has been updated successfully" : "Agent has been onboarded successfully",
        });
      }
      setShowForm(false);
      setEditingAgent(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: editingAgent ? "Failed to update agent" : "Failed to onboard agent",
        variant: "destructive",
      });
    },
  });

  if (showForm || editingAgent) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingAgent ? `Edit Agent - ${editingAgent.firstName} ${editingAgent.lastName}` : "New Agent Registration"}
          </h2>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false);
              setEditingAgent(null);
            }}
            className="text-sm w-full sm:w-auto"
          >
            Back to List
          </Button>
        </div>

        <MultiStepAgentForm
          onSubmit={(data) => {
            console.log("onSubmit called with data:", data);
            createAgentMutation.mutate(data);
          }}
          isLoading={createAgentMutation.isPending}
          defaultValues={editingAgent || undefined}
        />
      </div>
    );
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
  };

  const handleEditAgent = (agent: any) => {
    console.log("Edit agent:", agent);
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleViewAgent = (agent: any) => {
    console.log("View agent:", agent);
    setViewingAgent(agent);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-lg font-semibold text-gray-900">Registered Agents</h2>
        <Button className="btn-primary w-full sm:w-auto" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {!agents?.data || agents.data.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No agents registered yet</p>
            <Button className="btn-primary mt-4" onClick={() => setShowForm(true)}>
              Add First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AgentsDataGrid
          agents={agents?.data || []}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onEdit={handleEditAgent}
          onView={handleViewAgent}
        />
      )}
    </div>
  );
}
