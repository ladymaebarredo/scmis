import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f9f9f9",
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2d3e50",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#2d3e50",
  },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f3f3f3",
    padding: 8,
    textAlign: "center",
    color: "#333",
  },
  tableCell: {
    padding: 8,
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#333",
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
});

// Component for Remaining Items Report
export default function RemainingItemsReport({ items }) {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          {/* Header */}
          <Text style={styles.title}>Remaining Items Inventory Report</Text>
          <Text style={styles.subTitle}>St. Peter's College Clinic</Text>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Item Name
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Brand</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Quantity
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Expiry Date
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Supplier
              </Text>
            </View>

            {/* Table Rows */}
            {items.map((item, index) => (
              <View
                style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
                key={item.id}
              >
                <Text style={styles.tableCell}>{item.itemName}</Text>
                <Text style={styles.tableCell}>{item.itemBrand}</Text>
                <Text style={styles.tableCell}>{item.itemType}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.expiryDate}</Text>
                <Text style={styles.tableCell}>{item.supplier}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
