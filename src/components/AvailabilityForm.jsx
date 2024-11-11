import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import { getAvailability, assignAvailability } from "../utils/availability";
import { LoadingPage } from "../pages/LoadingPage";

export const AvailabilityForm = () => {
  const { userData } = useUser();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get("id");

  const isOwner = userData?.id === profileId;

  const fetchAvailability = async () => {
    try {
      const availabilityData = await getAvailability(profileId);
      setAvailability(availabilityData);
      reset(availabilityData); // Set default values in the form

      // Update selectedDays based on fetched availability
      setSelectedDays({
        monday: !!availabilityData?.monday,
        tuesday: !!availabilityData?.tuesday,
        wednesday: !!availabilityData?.wednesday,
        thursday: !!availabilityData?.thursday,
        friday: !!availabilityData?.friday,
        saturday: !!availabilityData?.saturday,
        sunday: !!availabilityData?.sunday,
      });
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleDaySelection = (day) => {
    setSelectedDays((prev) => {
      const isDaySelected = !prev[day];
      if (!isDaySelected) {
        // If unchecked, clear the from/to fields for this day
        setValue(`${day}.from`, "");
        setValue(`${day}.to`, "");
      }
      return { ...prev, [day]: isDaySelected };
    });
  };

  const onSubmit = async (data) => {
    console.log(data);

    try {
      await assignAvailability(data, userData.id);
      fetchAvailability(); // Fetch again to update the form
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  if (loading) return <LoadingPage />;

  // Array of days of the week
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Availability Form</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {daysOfWeek.map((day) => (
          <div key={day}>
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                onChange={() => handleDaySelection(day)}
                checked={selectedDays[day]}
              />
              <span className="ml-2 capitalize">{day}</span>
            </label>
            {selectedDays[day] && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block mb-2">From</label>
                  <input
                    type="time"
                    {...register(`${day}.from`)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">To</label>
                  <input
                    type="time"
                    {...register(`${day}.to`)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Submit button for editing */}
        {isOwner && (
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Save Availability
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
