import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { getAllAppointments } from "../../utils/appointment";
import { getAllDiagnostics } from "../../utils/diagnostic";

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
    fontSize: "8px",
    textAlign: "left", // Ensure text alignment
    minWidth: "150px", // Set a minimum width for consistent column size
  },
  tableCellLast: {
    padding: 5,
    textAlign: "left",
    fontSize: "2px", // Align the last column as well
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    fontSize: 12,
    color: "#999",
  },
});

const SummaryReport = ({ appointments, diagnostics }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Appointment Table */}
        <View style={styles.section}>
          <Text style={styles.title}>Appointment Summary</Text>
          <View style={styles.table}>
            {/* Appointment Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Appointment Status
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Worker Type
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Appointee
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Date</Text>
            </View>
            {/* Appointment Table Rows */}
            {appointments.map((appointment) => (
              <View style={styles.tableRow} key={appointment.id}>
                <Text style={styles.tableCell}>
                  {appointment.appointmentStatus}
                </Text>
                <Text style={styles.tableCell}>{appointment.workerType}</Text>
                <Text style={styles.tableCell}>{appointment.appointee}</Text>
                <Text style={styles.tableCell}>{appointment.selectedDate}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Diagnostic Table */}
        <View style={styles.section}>
          <Text style={styles.title}>Diagnostic Summary</Text>
          <View style={styles.table}>
            {/* Diagnostic Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Appointment ID
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Medicines
              </Text>

              <Text style={[styles.tableCell, styles.tableHeader]}>
                Given At
              </Text>
            </View>
            {/* Diagnostic Table Rows */}
            {diagnostics.map((diagnostic) => (
              <View style={styles.tableRow} key={diagnostic.id}>
                <Text style={styles.tableCell}>{diagnostic.appointmentId}</Text>
                <Text style={styles.tableCell}>
                  {/* List all medicines with quantities */}
                  {diagnostic.medicines.map((medicine, index) => (
                    <React.Fragment key={index}>
                      {medicine.itemName} (Qty: {medicine.quantity})
                      {index < diagnostic.medicines.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </Text>
                <Text style={styles.tableCell}>
                  {/* Format the createdAt timestamp */}
                  {new Date(
                    diagnostic.createdAt.seconds * 1000
                  ).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function ReportsPage() {
  const [appointments, setAppointments] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);

  useEffect(() => {
    async function Fetch() {
      const appointments = await getAllAppointments();
      const diagnostics = await getAllDiagnostics();

      console.log(diagnostics);

      setAppointments(appointments);
      setDiagnostics(diagnostics);
    }
    Fetch();
  }, []);

  return (
    <div>
      <h1 className="font-bold my-10">Reports Page</h1>
      <PDFViewer className="h-screen w-full">
        <SummaryReport appointments={appointments} diagnostics={diagnostics} />
      </PDFViewer>
    </div>
  );
}
