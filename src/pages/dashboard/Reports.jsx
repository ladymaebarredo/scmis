import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

// Example styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 20,
    border: "1px solid black",
    borderCollapse: "collapse", // Collapse borders for better alignment
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
  },
  tableCell: {
    padding: 5,
    borderRight: "1px solid black",
    fontSize: "10px",
    textAlign: "left", // Ensure text alignment
    minWidth: "150px", // Set a minimum width for consistent column size
  },
  tableCellLast: {
    padding: 5,
    textAlign: "left",
    fontSize: "5px", // Align the last column as well
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    fontSize: 12,
    color: "#999",
  },
});

// Create a summary report component for appointments
const SummaryReport = ({ appointments }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Appointments Summary Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Appointments Summary Report</Text>
          <Text style={{ fontSize: 12, color: "#333" }}>
            This is a summary report of all appointments.
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>ID</Text>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Appointee
            </Text>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Status
            </Text>
            <Text style={[styles.tableCellLast, { fontWeight: "bold" }]}>
              Created At
            </Text>
          </View>

          {appointments.map((appointment) => (
            <View style={styles.tableRow} key={appointment.id}>
              <Text style={styles.tableCell}>{appointment.id}</Text>
              <Text style={styles.tableCell}>{appointment.appointee}</Text>
              <Text style={styles.tableCell}>
                {appointment.appointmentStatus}
              </Text>
              <Text style={styles.tableCellLast}>
                {new Date(
                  appointment.createdAt.seconds * 1000
                ).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Inventory Report Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Inventory Report - Medicines Given</Text>
          <Text style={{ fontSize: 12, color: "#333" }}>
            This section summarizes the medicines given to each appointee.
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Appointee
            </Text>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Medicine
            </Text>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Quantity
            </Text>
          </View>

          {appointments.map((appointment) =>
            appointment.medicines ? (
              appointment.medicines.map((medicine, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{appointment.appointee}</Text>
                  <Text style={styles.tableCell}>{medicine.name}</Text>
                  <Text style={styles.tableCell}>{medicine.quantity}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow} key={appointment.id}>
                <Text style={styles.tableCell}>{appointment.appointee}</Text>
                <Text style={styles.tableCell}>No medicines given</Text>
                <Text style={styles.tableCell}>-</Text>
              </View>
            )
          )}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleString()}
        </Text>
      </Page>
    </Document>
  );
};

export default function ReportsPage() {
  const appointments = [
    // Sample appointment data, replace with real data
    {
      id: 1,
      appointee: "Dexter Basegro",
      appointmentStatus: "Pending",
      createdAt: { seconds: 1678877253 },
      medicines: [
        { name: "Paracetamol", quantity: "2 tablets" },
        { name: "Cough Syrup", quantity: "1 bottle" },
      ],
    },
    {
      id: 2,
      appointee: "Pricess Sadernas",
      appointmentStatus: "Approved",
      createdAt: { seconds: 1678887253 },
      medicines: [{ name: "Aspirin", quantity: "1 tablet" }],
    },
    {
      id: 3,
      appointee: "Nathaniel Lucero",
      appointmentStatus: "Completed",
      createdAt: { seconds: 1678897253 },
      medicines: null, // No medicines given
    },
  ];

  return (
    <div>
      <h1 className="font-bold my-10">Reports Page</h1>
      <PDFViewer className="h-screen w-full">
        <SummaryReport appointments={appointments} />
      </PDFViewer>
    </div>
  );
}
