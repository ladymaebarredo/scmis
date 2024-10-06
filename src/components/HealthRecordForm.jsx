import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import { assignRecord, getRecord } from "../utils/record";
import { LoadingPage } from "../pages/LoadingPage";

export const HealthRecordForm = () => {
  const { userData } = useUser();
  const { register, handleSubmit, reset } = useForm();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get("id");

  const isOwner = userData?.id === profileId;

  const fetchRecord = async () => {
    try {
      const record = await getRecord(profileId);
      setRecord(record);
      reset(record); // Set default values for the form
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  const onSubmit = async (data) => {
    try {
      await assignRecord(data, userData.id);
      fetchRecord();
    } catch (error) {}
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Individual Health Record
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div>
          <label className="block mt-4 mb-2">Birthdate</label>
          {isOwner ? (
            <input
              type="date"
              {...register("birthdate")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.birthdate}</p>
          )}

          <label className="block mt-4 mb-2">Contact Nos.</label>
          {isOwner ? (
            <input
              {...register("contactNos")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.contactNos}</p>
          )}

          <label className="block mt-4 mb-2">City Address</label>
          {isOwner ? (
            <input
              {...register("cityAddress")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.cityAddress}</p>
          )}

          <label className="block mt-4 mb-2">Home Address</label>
          {isOwner ? (
            <input
              {...register("homeAddress")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.homeAddress}</p>
          )}

          <label className="block mt-4 mb-2">Father's Name</label>
          {isOwner ? (
            <input
              {...register("fatherName")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.fatherName}</p>
          )}

          <label className="block mt-4 mb-2">Mother's Name</label>
          {isOwner ? (
            <input
              {...register("motherName")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.motherName}</p>
          )}

          <label className="block mt-4 mb-2">Spouse Name (if married)</label>
          {isOwner ? (
            <input
              {...register("spouseName")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.spouseName}</p>
          )}

          <label className="block mt-4 mb-2">Guardian</label>
          {isOwner ? (
            <input
              {...register("guardian")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.guardian}</p>
          )}

          <label className="block mt-4 mb-2">
            Person to Notify in Case of Emergency
          </label>
          {isOwner ? (
            <input
              {...register("emergencyContact")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.emergencyContact}</p>
          )}
        </div>

        {/* Right Column */}
        <div>
          <label className="block mt-4 mb-2">Date</label>
          {isOwner ? (
            <input
              type="date"
              {...register("date")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.date}</p>
          )}

          <label className="block mt-4 mb-2">Sex</label>
          {isOwner ? (
            <select
              {...register("sex")}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{record?.sex}</p>
          )}

          {/* Other fields for right column */}
          <label className="block mt-4 mb-2">Civil Status</label>
          {isOwner ? (
            <input
              {...register("civilStatus")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.civilStatus}</p>
          )}

          <label className="block mt-4 mb-2">Religion</label>
          {isOwner ? (
            <input
              {...register("religion")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.religion}</p>
          )}

          <label className="block mt-4 mb-2">Height</label>
          {isOwner ? (
            <input
              {...register("height")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.height}</p>
          )}

          <label className="block mt-4 mb-2">Weight</label>
          {isOwner ? (
            <input
              {...register("weight")}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p>{record?.weight}</p>
          )}

          {/* Immunization Section */}
          <div className="mt-4">
            <h2 className="font-bold">Immunization</h2>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.bcg")}
                  defaultChecked={record?.immunization?.bcg || false}
                />{" "}
                BCG
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.opv")}
                  defaultChecked={record?.immunization?.opv || false}
                />{" "}
                OPV
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.dpt")}
                  defaultChecked={record?.immunization?.dpt || false}
                />{" "}
                DPT
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.hepB")}
                  defaultChecked={record?.immunization?.hepB || false}
                />{" "}
                Hep B
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.measles")}
                  defaultChecked={record?.immunization?.measles || false}
                />{" "}
                Measles
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.covidFirstDose")}
                  defaultChecked={record?.immunization?.covidFirstDose || false}
                />{" "}
                COVID - 1st Dose
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.covidSecondDose")}
                  defaultChecked={
                    record?.immunization?.covidSecondDose || false
                  }
                />{" "}
                COVID - 2nd Dose
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.covidBooster1")}
                  defaultChecked={record?.immunization?.covidBooster1 || false}
                />{" "}
                COVID - Booster 1
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("immunization.covidBooster2")}
                  defaultChecked={record?.immunization?.covidBooster2 || false}
                />{" "}
                COVID - Booster 2
              </label>
            </div>
          </div>

          {/* Family Medical History */}
          <div className="mt-4">
            <h2 className="font-bold">Family Medical History</h2>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.asthma")}
                  defaultChecked={record?.familyMedicalHistory?.asthma || false}
                />{" "}
                Asthma
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.hypertension")}
                  defaultChecked={
                    record?.familyMedicalHistory?.hypertension || false
                  }
                />{" "}
                Hypertension
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.diabetes")}
                  defaultChecked={
                    record?.familyMedicalHistory?.diabetes || false
                  }
                />{" "}
                Diabetes
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.heartProblems")}
                  defaultChecked={
                    record?.familyMedicalHistory?.heartProblems || false
                  }
                />{" "}
                Heart Problems
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.kidneyProblems")}
                  defaultChecked={
                    record?.familyMedicalHistory?.kidneyProblems || false
                  }
                />{" "}
                Kidney Problems
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.cancer")}
                  defaultChecked={record?.familyMedicalHistory?.cancer || false}
                />{" "}
                Cancer
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("familyMedicalHistory.tuberculosis")}
                  defaultChecked={
                    record?.familyMedicalHistory?.tuberculosis || false
                  }
                />{" "}
                Tuberculosis
              </label>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
