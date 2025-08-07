import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OSDTab from "@/components/provisioning/OSDTab";
import RegionOSDTab from "@/components/provisioning/RegionOSDTab";
import FingerprintTab from "@/components/provisioning/FingerprintTab";
import BlacklistTab from "@/components/provisioning/BlacklistTab";
import BMailTab from "@/components/provisioning/BMailTab";
import { FaRegEnvelope, FaRegEye, FaRegListAlt, FaRegStopCircle, FaRegMap } from "react-icons/fa";

export default function Provisioning() {
  const [activeTab, setActiveTab] = useState("osd");

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#f8f9fb]">
      <div className="w-full mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b bg-white shadow-sm transition-shadow duration-200">
           <TabsList
  className="
    h-auto p-0 bg-transparent flex justify-start
    flex-nowrap overflow-x-auto whitespace-nowrap
    sm:overflow-x-visible sm:whitespace-normal sm:flex-wrap
    "
  style={{ WebkitOverflowScrolling: 'touch' }}
>
  <TabsTrigger value="osd" className="min-w-[120px] sm:min-w-0 flex items-center gap-2" aria-label="OSD">
    <FaRegEye className="text-gray-500" />
    OSD
  </TabsTrigger>
  <TabsTrigger value="region-osd" className="min-w-[140px] sm:min-w-0 flex items-center gap-2" aria-label="Region OSD">
    <FaRegMap className="text-gray-500" />
    Region OSD
  </TabsTrigger>
  <TabsTrigger value="fingerprint" className="min-w-[200px] sm:min-w-0 flex items-center gap-2" aria-label="Fingerprint">
    <FaRegListAlt className="text-gray-500" />
    Fingerprint
  </TabsTrigger>
  <TabsTrigger value="blacklist" className="min-w-[180px] sm:min-w-0 flex items-center gap-2" aria-label="Blacklist or Kill STB">
    <FaRegStopCircle className="text-gray-500" />
    Blacklist / Kill STB
  </TabsTrigger>
  <TabsTrigger value="bmail" className="min-w-[120px] sm:min-w-0 flex items-center gap-2" aria-label="Send B Mail">
    <FaRegEnvelope className="text-gray-500" />
    B Mail
  </TabsTrigger>
</TabsList>
          </div>
          <div className="bg-white py-10 px-4 sm:px-10 animate-fadein">
            <TabsContent value="osd">
              <OSDTab />
            </TabsContent>
            <TabsContent value="region-osd">
              <RegionOSDTab />
            </TabsContent>
            <TabsContent value="fingerprint">
              <FingerprintTab />
            </TabsContent>
            <TabsContent value="blacklist">
              <BlacklistTab />
            </TabsContent>
            <TabsContent value="bmail">
              <BMailTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Add fade-in animation
// In your global CSS (e.g., index.css or App.css), add:
// @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
// .animate-fadein { animation: fadein 0.5s; }