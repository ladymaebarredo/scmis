import { useEffect, useState } from "react";
import { assignRemarks, getRemarks } from "../utils/remarks";

export function RemarksForm({ appointmentId, role }) {
  const [remarks, setRemarks] = useState("");

  async function fetchRemarks() {
    const remarks = await getRemarks(appointmentId);
    setRemarks(remarks.message || "");
  }

  useEffect(() => {
    fetchRemarks();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await assignRemarks(appointmentId, remarks);
      fetchRemarks();
      alert("Saved");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <h1 className="font-bold mb-4">Remarks</h1>
      {role === "WORKER" ? (
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-2">
            <label htmlFor="message">Message:</label>
            <textarea
              name="message"
              id="message"
              value={remarks}
              className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter remarks message..."
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      ) : (
        <div>
          <p>{remarks}</p>
        </div>
      )}
    </section>
  );
}
