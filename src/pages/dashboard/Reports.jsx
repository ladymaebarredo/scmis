import AppointmentReportSection from "../../components/AppointmentReportSection";
import InventoryReportSection from "../../components/InventoryReportSection";

export default function ReportsPage() {
  return (
    <main className="p-10 space-y-20">
      <InventoryReportSection />
      <AppointmentReportSection />
    </main>
  );
}
