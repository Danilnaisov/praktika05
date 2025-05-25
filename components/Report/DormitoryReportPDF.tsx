import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({ family: "Roboto", src: "/Roboto-Regular.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Roboto",
    fontSize: 10,
    backgroundColor: "#FFFFFF",
  },
  headerSchool: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 2,
    color: "#333333",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333333",
  },
  table: {
    display: "flex",
    width: "auto",
    marginVertical: 8,
    borderColor: "#666666",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#CCCCCC",
    fontSize: 12,
    color: "#333333",
  },
  cell: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#666666",
    borderRightStyle: "solid",
    flex: 1,
    color: "#333333",
  },
  cellHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#333333",
  },
  cellHeader: {
    backgroundColor: "#CCCCCC",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    fontSize: 10,
    color: "#333333",
  },
  footerLeft: {
    textAlign: "left",
  },
  footerRight: {
    textAlign: "right",
  },
});

// Импорт типов (или определяю их здесь, если нет отдельного файла)
interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  group?: string;
  phone?: string;
  dormitory?: {
    startDate?: string;
    endDate?: string;
    note?: string;
  };
}

interface Room {
  _id: string;
  name: string;
  capacity: number;
  students?: Student[];
}

export default function DormitoryReportPDF({
  rooms,
  date,
}: {
  rooms: Room[];
  date: string;
}) {
  // Считаем количество записей (студентов)
  const total = rooms.reduce(
    (acc, room) => acc + (room.students?.length || 0),
    0
  );
  const printDate = new Date().toLocaleDateString();
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.headerSchool}>
          Пермский авиационный техникум им. А.Д. Швецова
        </Text>
        <Text style={styles.headerTitle}>
          База данных по воспитательной работе
        </Text>
        <Text style={styles.title}>Отчёт по общежитию</Text>
        <Text style={{ color: "#333333", marginBottom: 8 }}>Дата: {date}</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Комната</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>ФИО</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Дата рождения</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Группа</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Контактный номер</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Дата заселения</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Дата выселения</Text>
            </Text>
            <Text style={[styles.cell, styles.cellHeader]}>
              <Text style={styles.cellHeaderText}>Примечание</Text>
            </Text>
          </View>
          {rooms
            .filter((room) => room.students && room.students.length > 0)
            .flatMap((room) =>
              room.students!.map((student) => (
                <View style={styles.tableRow} key={room._id + student._id}>
                  <Text style={styles.cell}>{room.name}</Text>
                  <Text style={styles.cell}>
                    {student.lastName} {student.firstName}{" "}
                    {student.middleName || ""}
                  </Text>
                  <Text style={styles.cell}>
                    {student.birthDate
                      ? new Date(student.birthDate).toLocaleDateString()
                      : ""}
                  </Text>
                  <Text style={styles.cell}>{student.group || ""}</Text>
                  <Text style={styles.cell}>{student.phone || ""}</Text>
                  <Text style={styles.cell}>
                    {student.dormitory?.startDate
                      ? new Date(
                          student.dormitory.startDate
                        ).toLocaleDateString()
                      : ""}
                  </Text>
                  <Text style={styles.cell}>
                    {student.dormitory?.endDate
                      ? new Date(student.dormitory.endDate).toLocaleDateString()
                      : ""}
                  </Text>
                  <Text style={styles.cell}>
                    {student.dormitory?.note || ""}
                  </Text>
                </View>
              ))
            )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Количество записей: {total}</Text>
          <Text style={styles.footerRight}>Дата печати: {printDate}</Text>
        </View>
      </Page>
    </Document>
  );
}
