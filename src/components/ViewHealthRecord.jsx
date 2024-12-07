import { useState } from "react";
import { getStudentRecord } from "../utils/record";
import { CheckCircle, XCircle } from "lucide-react"; // Importing Lucide icons

export default function ViewHealthRecord({ studentId }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchRecord() {
    try {
      setLoading(true);
      const fetchedRecord = await getStudentRecord(studentId);
      setRecord(fetchedRecord);
    } catch (error) {
      console.error("Error fetching record:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch record when component mounts or studentId changes
  useState(() => {
    fetchRecord();
  }, [studentId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      {/* Button to open modal */}
      <button
        onClick={openModal}
        disabled={!record || loading} // Disable if no record or loading
        className={`px-6 py-3 text-white rounded-full transition-all duration-300 ${
          !record || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        View Medical History
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Medical History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              {/* Left Side: Personal Info */}
              <div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Father's Name:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.fatherName}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Mother's Name:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.motherName}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Spouse's Name:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.spouseName}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Height:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.height}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Weight:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.weight}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Civil Status:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.civilStatus}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">Religion:</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.religion}
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-xs text-gray-500">
                    Emergency Contact:
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {record.emergencyContact}
                  </div>
                </div>
              </div>

              {/* Right Side: Immunization and Family Medical History */}
              <div>
                <div className="mb-2">
                  <strong>Immunization Status:</strong>
                  <ul className="list-inside space-y-1">
                    {Object.entries(record.immunization).map(
                      ([vaccine, status]) => (
                        <li
                          key={vaccine}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{vaccine}</span>
                          <span
                            className={
                              status ? "text-green-500" : "text-red-500"
                            }
                          >
                            {status ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <strong>Family Medical History:</strong>
                  <ul className="list-inside space-y-1">
                    {Object.entries(record.familyMedicalHistory).map(
                      ([condition, status]) => (
                        <li
                          key={condition}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{condition}</span>
                          <span
                            className={
                              status ? "text-red-500" : "text-green-500"
                            }
                          >
                            {status ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
