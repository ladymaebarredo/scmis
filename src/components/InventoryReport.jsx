import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

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
  items: {
    padding: 8,
    flex: 1,
    textAlign: "center", // Centered text in cells
    fontSize: 6,
    color: "#333", // Darker text for better readability
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9", // Alternating row color for better contrast
  },
});

export const InventoryReport = ({ data, type, from, to }) => {
  // Filtered type display logic
  const typeTitle = type !== "" ? `Type: ${type}` : "All Types";

  // Date range display logic
  const dateRange = from && to ? `${from} to ${to}` : "From * to *";

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>St. Peter's College Clinic</Text>
          <Text style={styles.title}>Distributed Items Inventory Report</Text>

          {/* Filter summary */}
          <Text style={styles.filterSummary}>
            {typeTitle} | {dateRange}
          </Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Given To
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Date</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Items</Text>
            </View>

            {/* Table Rows */}
            {data.map((record, index) => (
              <View
                style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
                key={index}
              >
                <Text style={styles.tableCell}>{record.type}</Text>
                <Text style={styles.tableCell}>{record.givenTo}</Text>
                <Text style={styles.tableCell}>{record.dateGiven}</Text>
                <Text style={styles.items}>
                  {record.items
                    .map((item) => `${item.itemName} (x${item.quantity})`)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
