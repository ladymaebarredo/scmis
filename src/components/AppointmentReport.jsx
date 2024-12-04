import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

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

export const AppointmentsReport = ({ appointments }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Appointment Summary</Text>
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
            {appointments.map((appointment) => (
              <View style={styles.tableRow} key={appointment.id}>
                <Text style={styles.tableCell}>
                  {appointment.appointmentStatus}
                </Text>
                <Text style={styles.tableCell}>{appointment.workerType}</Text>
                <Text style={styles.tableCell}>{appointment.appointee}</Text>
                <Text style={styles.tableCell}>
                  {appointment.appointeeCollege}
                </Text>
                <Text style={styles.tableCell}>
                  {appointment.selectedDate} {appointment.selectedTime}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
