import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import React from "react"; // Add this import

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 20 },
  title: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f3f3f3",
    padding: 5,
    flex: 1,
  },
  tableCell: { padding: 5, flex: 1 },
});

export const DiagnosticReport = ({ diagnostics }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Diagnostic Summary</Text>
          <View style={styles.table}>
            {/* Table Header */}
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
            {/* Table Rows */}
            {diagnostics.map((diagnostic) => (
              <View style={styles.tableRow} key={diagnostic.id}>
                <Text style={styles.tableCell}>{diagnostic.appointmentId}</Text>
                <Text style={styles.tableCell}>
                  {diagnostic.medicines.map((medicine, index) => (
                    <React.Fragment key={index}>
                      {medicine.itemName} (Qty: {medicine.quantity})
                      {index < diagnostic.medicines.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </Text>
                <Text style={styles.tableCell}>
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
