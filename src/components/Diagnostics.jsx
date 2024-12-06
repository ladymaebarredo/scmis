import { useEffect, useState } from "react";
import { getMedicines } from "../utils/inventory";
import { assignDiagnostic, getDiagnostic } from "../utils/diagnostic";
import { useUser } from "../providers/UserProvider";

export function Diagnostics({ appointmentId, workerType }) {
  const [medicines, setMedicines] = useState([]);
  const [diagnostic, setDiagnostic] = useState({
    message: "",
    medicines: [],
    bloodPressure: "",
    temperature: "",
  });
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { user } = useUser();

  const fetchDiagnostic = async () => {
    const diagnosticData = await getDiagnostic(appointmentId);
    if (!diagnosticData) return;
    setDiagnostic(diagnosticData);
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      const fetchedMedicines = await getMedicines();
      setMedicines(fetchedMedicines);
    };
    fetchMedicines();
    fetchDiagnostic();
  }, [appointmentId]);

  const handleAddMedicine = () => {
    if (!selectedMedicine || quantity <= 0) return;

    const existingMedicine = diagnostic.medicines.find(
      (med) => med.itemName === selectedMedicine
    );

    if (existingMedicine) {
      // Update quantity if medicine already exists
      setDiagnostic((prev) => ({
        ...prev,
        medicines: prev.medicines.map((med) =>
          med.itemName === selectedMedicine
            ? { ...med, quantity: med.quantity + quantity }
            : med
        ),
      }));
    } else {
      // Add new medicine
      setDiagnostic((prev) => ({
        ...prev,
        medicines: [
          ...prev.medicines,
          { itemName: selectedMedicine, quantity },
        ],
      }));
    }

    // Reset selected medicine and quantity
    setSelectedMedicine("");
    setQuantity(1);
  };

  const handleRemoveMedicine = (itemName) => {
    setDiagnostic((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((med) => med.itemName !== itemName),
    }));
  };

  const handleSave = async () => {
    try {
      await assignDiagnostic(
        appointmentId,
        diagnostic.message,
        diagnostic.medicines,
        diagnostic.bloodPressure,
        diagnostic.temperature
      );
      alert("Saved");
    } catch (error) {}
    console.log("Saving diagnostic data:", diagnostic);
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {workerType === "Dentist" ? "Assessment" : "Diagnostic"}
      </h2>
      {user?.data?.role === "WORKER" ? (
        <>
          <textarea
            value={diagnostic.message}
            onChange={(e) =>
              setDiagnostic({ ...diagnostic, message: e.target.value })
            }
            className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter diagnostic message..."
          />
          {/* Blood Pressure and Temperature Section */}
          <section className="mb-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Vital Signs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Blood Pressure */}
              <div className="flex flex-col">
                <label
                  htmlFor="bloodPressure"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Blood Pressure
                </label>
                <input
                  type="text"
                  id="bloodPressure"
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter blood pressure"
                  value={diagnostic.bloodPressure}
                  onChange={(e) =>
                    setDiagnostic({
                      ...diagnostic,
                      bloodPressure: e.target.value,
                    })
                  }
                />
              </div>

              {/* Temperature */}
              <div className="flex flex-col">
                <label
                  htmlFor="temperature"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Temperature
                </label>
                <input
                  type="text"
                  id="temperature"
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter temperature"
                  value={diagnostic.temperature}
                  onChange={(e) =>
                    setDiagnostic({
                      ...diagnostic,
                      temperature: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>
          {/* Medicines section */}
          {workerType !== "Dentist" && (
            <>
              <div className="flex items-center mb-4">
                <select
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                  className="mr-2 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((med) => (
                    <option key={med.id} value={med.itemName}>
                      {med.itemName}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mr-2 w-16 p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleAddMedicine}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Medicine
                </button>
              </div>
              <div className="medicines-area-box mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Selected Medicines
                </h3>
                {diagnostic.medicines.map((med, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
                  >
                    <span>
                      {med.itemName} (Quantity: {med.quantity})
                    </span>
                    <button
                      onClick={() => handleRemoveMedicine(med.itemName)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">
            <strong>Message:</strong> {diagnostic.message || "N/A"}
          </p>
          {workerType !== "Dentist" && (
            <div className="medicines-area-box mb-4">
              <h3 className="text-lg font-semibold mb-2">Medicines</h3>
              {diagnostic.medicines.length > 0 ? (
                diagnostic.medicines.map((med, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
                    <span>
                      {med.itemName} (Quantity: {med.quantity})
                    </span>
                  </div>
                ))
              ) : (
                <p>No medicines assigned</p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
