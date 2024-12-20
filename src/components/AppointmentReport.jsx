import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { getWorkerType } from "../utils/globals";

// Define the styles for the document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f9f9f9", // Subtle background color for the page
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center", // Centered title
    color: "#2d3e50", // Darker, more professional color
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 20,
    textAlign: "center", // Centered subtitle for the clinic name
    color: "#2d3e50",
  },
  filterSummary: {
    fontSize: 14,
    fontWeight: "normal",
    marginBottom: 20,
    textAlign: "center",
    color: "#444", // Slightly lighter color for the filter summary
  },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0", // Lighter border color for the table
    borderRadius: 5,
    overflow: "hidden", // Rounded corners
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8, // Padding for each row for spacing
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f3f3f3", // Subtle background for headers
    padding: 8,
    textAlign: "center", // Centered text for headers
    color: "#333", // Dark color for headers
  },
  tableCell: {
    padding: 8,
    flex: 1,
    textAlign: "center", // Centered text in cells
    fontSize: 12,
    color: "#333", // Darker text for better readability
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9", // Alternating row color for better contrast
  },
});

export const AppointmentsReport = ({
  appointments,
  workerType,
  fromDate,
  toDate,
  college,
}) => {
  // Filtered appointment title
  const workerTitle = workerType
    ? `${workerType} Appointments`
    : "All Appointments";

  // Date range display logic
  const dateRange =
    fromDate && toDate ? `${fromDate} to ${toDate}` : "From * to *";

  // College display logic
  const collegeTitle = college ? `From ${college}` : "From All Colleges";

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>St. Peter's College Clinic</Text>

          {/* Filter summary */}
          <Text style={styles.filterSummary}>
            {workerTitle} | {collegeTitle} | {dateRange}
          </Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Status</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Appointee
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                College
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Date & Time
              </Text>
            </View>

            {/* Table Rows */}
            {appointments.map((appointment, index) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowAlt, // Alternate row colors
                ]}
                key={appointment.id}
              >
                <Text style={styles.tableCell}>
                  {appointment.appointmentStatus}
                </Text>
                <Text style={styles.tableCell}>
                  {getWorkerType(appointment.workerType)}
                </Text>
                <Text style={styles.tableCell}>{appointment.appointee}</Text>
                <Text style={styles.tableCell}>
                  {appointment.appointeeCollege}
                </Text>
                <Text style={styles.tableCell}>
                  {appointment.selectedDate} {appointment.selectedTime} (
                  {appointment.selectedDay})
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
