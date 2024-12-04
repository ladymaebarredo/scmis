import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "../../providers/UserProvider";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MedicalCertificate from "../../components/MedicalCertificate"; // Import the certificate component
import { createNotification } from "../../utils/notifications";

export default function CertPage() {
  const { id } = useParams();
  const { user, userData } = useUser();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Fetch certificate request details from Firestore
  const fetchRequest = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "certificateRequests", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRequest({ id: docSnap.id, ...docSnap.data() });
        setStatus(docSnap.data().status);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  // Update certificate request status
  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "certificateRequests", id);
      await updateDoc(docRef, { status });
      await createNotification(
        userData.id, // Nurse ID
        request.userId,
        `Nurse ${status} your certificate request.`,
        `/dashboard/certificate`
      );
      alert("Status updated successfully!");
      fetchRequest();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Cancel certificate request
  const handleCancelRequest = async () => {
    try {
      const docRef = doc(db, "certificateRequests", id);
      await updateDoc(docRef, { status: "Cancelled" });
      alert("Request cancelled successfully!");
      navigate("/dashboard/certificate");
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  // Handle status change to Released when downloading the certificate
  const handleDownloadClick = async () => {
    try {
      const docRef = doc(db, "certificateRequests", id);
      await updateDoc(docRef, { status: "Released" });
    } catch (error) {
      console.error("Error updating status to Released:", error);
    }
  };

  if (loading) {
    return <p>Loading request details...</p>;
  }

  if (!request) {
    return <p>No request found.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Certificate Request
      </h1>

      <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
        <p>
          <strong>Name:</strong> {request.firstName} {request.lastName}
        </p>
        <p>
          <strong>Reason:</strong> {request.reason}
        </p>
        <p>
          <strong>Status:</strong> {request.status}
        </p>
        <p>
          <strong>Date Submitted:</strong>{" "}
          {new Date(request.dateCreated.seconds * 1000).toLocaleDateString()}
        </p>
      </div>

      {user.data.role === "WORKER" ? (
        <form
          onSubmit={handleStatusChange}
          className="bg-white p-6 shadow-lg rounded-lg mb-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Update Status</h2>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-2"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Released">Released</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Update Status
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Cancel Request</h2>
          <p className="text-gray-600 mb-4">
            If you no longer need this certificate, you can cancel your request.
          </p>
          <button
            onClick={handleCancelRequest}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Show Download Certificate button if status is Approved */}
      {status === "Approved" && (
        <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Download Certificate</h2>
          <PDFDownloadLink
            document={
              <MedicalCertificate
                firstname={request.firstName}
                lastname={request.lastName}
              />
            }
            fileName={`${request.firstname}_${request.lastname}_medical_certificate.pdf`}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={handleDownloadClick} // Update status to Released
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download Certificate"
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}
