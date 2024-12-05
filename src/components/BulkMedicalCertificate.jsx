import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the certificate
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 20,
  },
  body: {
    marginTop: 20,
    lineHeight: 1.5,
  },
  signature: {
    marginTop: 50,
    textAlign: "center",
  },
});

// BulkMedicalCertificate component
export default function BulkMedicalCertificate({ recipients }) {
  return (
    <Document>
      {recipients.map((recipient, index) => (
        <Page size="A4" style={styles.page} key={index}>
          <View style={styles.header}>
            <Text>St. Peter's College Clinic</Text>
            <Text>Sabayle Iligan City</Text>
            <Text>Tel: (123) 456-7890</Text>
          </View>
          <View>
            <Text style={styles.title}>Medical Certificate</Text>
          </View>
          <View style={styles.body}>
            <Text>To Whom It May Concern,</Text>
            <Text style={{ marginTop: 10 }}>
              This is to certify that {recipient.firstname} {recipient.lastname}{" "}
              has been examined and treated in our clinic. Based on our
              findings, they are advised to take a rest from their usual
              activities from{" "}
              <Text style={{ fontWeight: "bold" }}>2024-12-01</Text> to{" "}
              <Text style={{ fontWeight: "bold" }}>2024-12-10</Text>.
            </Text>
            <Text style={{ marginTop: 10 }}>
              This certificate is issued upon the request of the individual for
              whatever purpose it may serve.
            </Text>
          </View>
          <View style={styles.signature}>
            <Text>Mommy joy</Text>
            <Text>Attending Nurse</Text>
            <Text>License No.: 123456</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
