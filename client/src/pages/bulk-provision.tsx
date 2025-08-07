import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkUploadTab from "@/components/bulk-provision/BulkUploadTab";
import BulkUploadTable from "@/components/bulk-provision/BulkUploadTable";

export default function BulkProvision() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] py-8 px-2 md:px-0">
      <Card className="w-full max-w-5xl shadow-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200 px-4 md:px-8 pt-2 bg-white">
            <TabsList className="flex gap-8 h-auto p-0 bg-transparent">
              <TabsTrigger value="new" className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-4 px-4 text-base font-medium transition-all">
                New Upload
              </TabsTrigger>
              <TabsTrigger value="view" className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-4 px-4 text-base font-medium transition-all">
                View Uploads
              </TabsTrigger>
            </TabsList>
          </div>
          <CardContent className="p-6 md:p-8 bg-gray-50">
            <TabsContent value="new" className="mt-0">
              <BulkUploadTab />
            </TabsContent>
            <TabsContent value="view" className="mt-0">
              <BulkUploadTable />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}