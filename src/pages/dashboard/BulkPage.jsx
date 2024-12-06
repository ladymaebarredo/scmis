import { useParams } from "react-router-dom";
import { useUser } from "../../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { PDFViewer } from "@react-pdf/renderer";
import BulkMedicalCertificate from "../../components/BulkMedicalCertificate";
import RequestorsTable from "../../components/RequestorsTable";
import { createNotification } from "../../utils/notifications";

export default function BulkPage() {
  const { id } = useParams(); // Get the bulk ID from the route
  const { user, userData } = useUser(); // Access user data
  const [bulk, setBulk] = useState(null); // State for bulk details
  const [loading, setLoading] = useState(true); // Loading state
  const [status, setStatus] = useState(""); // Status state
  const navigate = useNavigate(); // Navigation for redirecting

  // Fetch the bulk details
  useEffect(() => {
    const fetchBulk = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "bulkCertificate", id); // Get the document reference
        const docSnap = await getDoc(docRef); // Fetch document data

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBulk(data);
          setStatus(data.status); // Set the initial status
        } else {
          console.error("Bulk document not found");
          navigate("/404"); // Redirect if not found
        }
      } catch (error) {
        console.error("Error fetching bulk document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBulk();
  }, [id, navigate]);

  // Update status for a specific requestor
  const updateRequestorStatus = async (requestorId, newStatus) => {
    try {
      const updatedRequestors = bulk.requestors.map((requestor) =>
        requestor.id === requestorId
          ? { ...requestor, status: newStatus }
          : requestor
      );

      const docRef = doc(db, "bulkCertificate", id);
      await updateDoc(docRef, { requestors: updatedRequestors }); // Update requestors in Firestore
      setBulk({ ...bulk, requestors: updatedRequestors }); // Update local state
    } catch (error) {
      console.error("Error updating requestor status:", error);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      const docRef = doc(db, "bulkCertificate", id);
      await updateDoc(docRef, { status: newStatus }); // Update status in Firestore
      setStatus(newStatus); // Update local state
      // Create notification
      await createNotification(
        userData.id,
        bulk.deanId,
        `Nurse ${newStatus} your bulk certificate request.`,
        `/dashboard/certificate/bulk/${id}` // Use the bulkId in the notification link
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filtering approved requestors
  const approvedRequestors = bulk?.requestors.filter(
    (requestor) => requestor.status === "Approved"
  );

  if (loading) return <div>Loading...</div>;

  return (
    <main className="p-4">
      {bulk && (
        <div className="max-w-lg mx-auto p-4 border rounded shadow space-y-2">
          <h1 className="text-2xl font-bold mb-4">Bulk Details</h1>
          <p>
            <strong>Reason:</strong> {bulk.reason}
          </p>
          <p>
            <strong>Department:</strong> {bulk.department}
          </p>
          {user.data?.role === "WORKER" ? (
            <div className="my-4">
              <label htmlFor="status" className="block font-medium">
                Status:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          ) : (
            <div className="mt-4">
              <strong>Current Status:</strong> {status}
            </div>
          )}
          <p>
            <strong>Total Certificates:</strong> {bulk.requestors.length}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(bulk.dateCreated?.seconds * 1000).toLocaleString()}
          </p>
          {status == "Approved" && (
            <p>
              <strong>To Be Claimed:</strong>
              {" Week Days (8 AM to 5PM)"}
            </p>
          )}
        </div>
      )}

      {/* Requestors Table */}
      <RequestorsTable
        requestors={bulk.requestors}
        userRole={user.data.role}
        onUpdateStatus={updateRequestorStatus}
      />
      {approvedRequestors.length != 0 && user.data?.role === "WORKER" && (
        <PDFViewer className="w-full h-screen mt-6">
          <BulkMedicalCertificate recipients={approvedRequestors} />
        </PDFViewer>
      )}
    </main>
  );
}
