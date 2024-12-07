import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isToday,
  isSameDay,
} from "date-fns";

import { useUser } from "../providers/UserProvider";
import { getAllAppointments, getAppointments } from "../utils/appointment";
import { Link } from "react-router-dom";
import { getAllBulk } from "../utils/bulk";

const CalendarView = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Track selected day
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  // Get the start and end of the current month
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  // Navigate to the previous month
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to the next month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Check if there are events for a particular date
  const getEventsForDay = (day) => {
    const formattedDay = format(day, "MM/dd/yyyy");
    return events.filter((event) => event.date === formattedDay);
  };

  // Handle day click to open the modal
  const handleDayClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="text-xl font-semibold text-gray-500 hover:text-gray-700"
        >
          &#60;
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={nextMonth}
          className="text-xl font-semibold text-gray-500 hover:text-gray-700"
        >
          &#62;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Days of the week */}
        <div className="font-semibold text-gray-600">Sun</div>
        <div className="font-semibold text-gray-600">Mon</div>
        <div className="font-semibold text-gray-600">Tue</div>
        <div className="font-semibold text-gray-600">Wed</div>
        <div className="font-semibold text-gray-600">Thu</div>
        <div className="font-semibold text-gray-600">Fri</div>
        <div className="font-semibold text-gray-600">Sat</div>

        {/* Blank spaces before the start of the month */}
        {Array.from({ length: startOfCurrentMonth.getDay() }).map(
          (_, index) => (
            <div key={index} className="h-20"></div>
          )
        )}

        {/* Days of the month */}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className={`h-20 flex flex-col items-center justify-start p-2 border rounded-lg cursor-pointer ${
              isToday(day) ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            } ${isSameDay(day, new Date()) ? "bg-blue-100" : ""}`}
            onClick={() => handleDayClick(day)} // Handle day click
          >
            <div className="text-lg font-semibold">{format(day, "d")}</div>
            {/* Display event count for the day */}
            <div className="mt-2 text-sm text-gray-600">
              {getEventsForDay(day).length > 0 && (
                <span className="bg-blue-500 text-white rounded-full px-2 text-xs">
                  {getEventsForDay(day).length} agenda
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying events of the selected day */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-1/3 max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-semibold">
              Events on {format(selectedDate, "MMMM dd, yyyy")}
            </h3>
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {getEventsForDay(selectedDate).map((event, index) => (
                <div key={index} className="border-b py-2">
                  <div className="font-semibold">{event.title}</div>
                  <Link className="text-sm text-gray-600" to={event.link}>
                    {event.description}
                  </Link>
                  <div className="text-xs text-gray-500">{event.status}</div>
                </div>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export function Calendar() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      let appointments;

      if (user.data.role == "WORKER") {
        appointments = await getAllAppointments();
      } else {
        appointments = await getAppointments(user.id, "userId");
      }

      const formattedAppointments = appointments.map((appointment) => {
        return {
          date: format(new Date(appointment.selectedDate), "MM/dd/yyyy"),
          title: "Appointment",
          status: appointment.appointmentStatus,
          description: `${appointment.workerType} Appointment`,
          link: `/dashboard/appointments/${appointment.id}`,
          type: "Appointment",
        };
      });

      setEvents(formattedAppointments);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBulkRequests = async () => {
    if (user.data.role != "WORKER") return;
    try {
      const bulk = await getAllBulk(); // Assuming you have a function to fetch bulk data
      const formattedBulk = bulk.map((appointment) => {
        return {
          date: appointment.appointmentDate
            ? format(new Date(appointment.appointmentDate), "MM/dd/yyyy")
            : "None",
          title: `Bulk Request - ${appointment.reason}`,
          status: appointment.status,
          description: `Requested by ${appointment.deanName}`,
          link: `/dashboard/certificate/bulk/${appointment.id}`,
          type: "Bulk Request",
        };
      });

      setEvents((prevEvents) => [...prevEvents, ...formattedBulk]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchBulkRequests();
  }, []);

  if (loading) return <>Loading Calendar</>;

  return <CalendarView events={events} />;
}
