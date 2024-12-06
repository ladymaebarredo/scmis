import BulkCertificateForm from "../../components/BulkCertificateForm";
import { useUser } from "../../providers/UserProvider";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useEffect, useState } from "react";
import { LoadingPage } from "../LoadingPage";
import BulkRequestsTable from "../../components/BulkRequestTable";

export default function Bulk() {
  const { userData } = useUser();

  const [bulkRequests, setBulkRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBulkRequests = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "bulkCertificate"),
        where("deanId", "==", userData.id),
        orderBy("dateCreated", "desc")
      );

      const querySnapshot = await getDocs(q);
      console.log("Snapshot size:", querySnapshot.size);

      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Requests fetched:", requests);

      setBulkRequests(requests);
    } catch (error) {
      console.error("Error fetching bulk requests:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData?.id) fetchBulkRequests();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <section>
      <BulkCertificateForm userData={userData} revalidate={fetchBulkRequests} />
      <BulkRequestsTable requests={bulkRequests} />
    </section>
  );
}
