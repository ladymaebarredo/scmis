import { useEffect, useState } from "react";
import { getAllDiagnostics } from "../utils/diagnostic";
import { getAppointment } from "../utils/appointment";
import { getAllRequests } from "../utils/request";
import { PDFViewer } from "@react-pdf/renderer";
import { InventoryReport } from "./InventoryReport";
import { getItems } from "../utils/inventory";
import RemainingItemsReport from "./RemainingItemsReport";

export default function InventoryReportSection() {
  const [loading, setLoading] = useState(true);

  // State for items data
  const [allItems, setAllItems] = useState([]);
  const [itemsGiven, setItemsGiven] = useState([]);
  const [filteredItemsGiven, setFilteredItemsGiven] = useState([]);

  // Filter states
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeCollege, setEmployeeCollege] = useState(""); // New state for college filter

  const types = ["Diagnostics", "Medkit Request"];
  const colleges = ["CCS", "COC", "CAS", "CED"]; // Add your available college options here

  const fetchDiagnostics = async () => {
    try {
      const diagnostics = await getAllDiagnostics();

      const medicinesData = await Promise.all(
        diagnostics
          .filter((diagnostic) => diagnostic.medicines.length > 0)
          .map(async (diagnostic) => {
            const appointment = await getAppointment(diagnostic.appointmentId);
            return {
              type: "Diagnostics",
              givenTo: appointment?.appointee || "Unknown",
              college: appointment.appointeeCollege,
              dateGiven: new Date(
                diagnostic.createdAt.seconds * 1000
              ).toLocaleString(),
              items: diagnostic.medicines.map((medicine) => ({
                itemName: medicine.itemName,
                quantity: medicine.quantity,
              })),
            };
          })
      );

      setItemsGiven((prevItemsGiven) => [...prevItemsGiven, ...medicinesData]);
    } catch (error) {
      console.error("Error fetching diagnostics or appointments:", error);
    }
  };

  const fetchMedkitRequests = async () => {
    try {
      const requests = await getAllRequests();

      const medkitData = requests
        .filter(
          (request) => request.medkitItems && request.medkitItems.length > 0
        )
        .map((request) => ({
          type: "Medkit Request",
          givenTo: request.employeeName || "Unknown",
          dateGiven: new Date(
            request.updatedAt.seconds * 1000
          ).toLocaleString(),
          items: request.medkitItems.map((item) => ({
            itemName: item.name,
            quantity: item.quantity,
          })),
          college: request.employeeCollege, // Include employee college
        }));

      setItemsGiven((prevItemsGiven) => [...prevItemsGiven, ...medkitData]);
    } catch (error) {
      console.error("Error fetching medkit requests:", error);
    }
  };

  const fetchAllItems = async () => {
    try {
      const items = await getItems();
      setAllItems(items);
    } catch (error) {
      console.error("Error fetching all items:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchDiagnostics(),
        fetchMedkitRequests(),
        fetchAllItems(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filtering logic
  const handleFilter = () => {
    let filtered = [...itemsGiven];

    if (type) {
      filtered = filtered.filter((item) => item.type === type);
    }

    // Filter by college (substring match)
    if (employeeCollege) {
      filtered = filtered.filter((item) =>
        item.college.includes(employeeCollege)
      );
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dateGiven);
        return itemDate >= from && itemDate <= to;
      });
    }

    setFilteredItemsGiven(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [type, employeeCollege, fromDate, toDate, itemsGiven]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Inventory Report</h2>
      {/* Filter Section */}
      <div className="mb-4 grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">College</label>
          <select
            value={employeeCollege}
            onChange={(e) => setEmployeeCollege(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Colleges</option>
            {colleges.map((collegeOption) => (
              <option key={collegeOption} value={collegeOption}>
                {collegeOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Report Section */}
      {filteredItemsGiven.length === 0 ? (
        <section className="p-10">No Data Found</section>
      ) : (
        <PDFViewer className="w-full h-screen">
          <InventoryReport
            data={filteredItemsGiven}
            type={type}
            from={fromDate}
            to={toDate}
            college={employeeCollege}
          />
        </PDFViewer>
      )}

      <PDFViewer className="w-full h-screen">
        <RemainingItemsReport items={allItems} />
      </PDFViewer>
    </div>
  );
}
