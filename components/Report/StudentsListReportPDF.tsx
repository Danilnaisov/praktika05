import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  IStudent,
  IOrphanStatus,
  IDisabilityStatus,
  IOvzStatus,
  ISvoStatus,
  IRiskGroupSop,
  ISocialScholarship,
} from "@/types";

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
  subtitle: {
    fontSize: 12,
    marginBottom: 8,
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
    fontSize: 10,
    color: "#333333",
  },
  cell: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#666666",
    borderRightStyle: "solid",
    flex: 1,
    color: "#333333",
    wordBreak: "break-word",
    fontSize: 9,
    maxWidth: 110,
  },
  cellHeaderText: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#333333",
    wordBreak: "break-word",
    maxWidth: 110,
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
  cellFio: {
    maxWidth: 180,
    wordBreak: "break-word",
    hyphens: "auto",
  },
  cellPhone: {
    maxWidth: 130,
    wordBreak: "break-word",
    hyphens: "auto",
  },
  cellBirthDate: {
    maxWidth: 70,
    wordBreak: "break-word",
    hyphens: "auto",
  },
  cellEducation: {
    maxWidth: 60,
    wordBreak: "break-word",
    hyphens: "auto",
  },
});

// Функция для форматирования даты приказа
function formatOrderDate(dateStr?: string | Date) {
  if (!dateStr) return "___";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "___";
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    return `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()} г`;
  } catch (error) {
    console.error(`Ошибка форматирования даты: ${dateStr}`, error);
    return "___";
  }
}

export default function StudentsListReportPDF({
  students,
  filters,
}: {
  students: (IStudent & {
    orphanStatus?: IOrphanStatus;
    disabilityStatus?: IDisabilityStatus;
    ovzStatus?: IOvzStatus;
    svoStatus?: ISvoStatus;
    riskGroupSop?: IRiskGroupSop;
    socialScholarship?: ISocialScholarship;
  })[];
  filters: {
    lastName: string;
    firstName: string;
    group: string;
    room: string;
    admissionYear: string;
    graduationYear: string;
    sppp: boolean;
    penalties: boolean;
    adult: string;
    status: string;
    orphan: string;
    disabled: string;
    ovz: string;
    svo: string;
    scholarship: string;
    riskGroup: string;
    sop: string;
    date: string;
  };
  date: string;
}) {
  const total = students?.length || 0;
  const printDate = new Date().toLocaleDateString();

  // Формируем подзаголовок на основе активных фильтров по статусам
  const activeFilters = [];
  if (filters.orphan === "true") activeFilters.push("Сироты (Действующие)");
  if (filters.disabled === "true") activeFilters.push("Инвалиды (Действующие)");
  if (filters.ovz === "true") activeFilters.push("ОВЗ (Действующие)");
  if (filters.riskGroup === "true")
    activeFilters.push("Группа риска (Действующие)");
  if (filters.sop === "true") activeFilters.push("СОП (Действующие)");
  if (filters.svo === "true") activeFilters.push("СВО (Действующие)");
  if (filters.scholarship === "true")
    activeFilters.push("Социальная стипендия (Действующие)");

  // Проверяем и подготавливаем данные студентов
  const preparedStudents = Array.isArray(students) ? students : [];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.headerSchool}>
          Пермский авиационный техникум им. А.Д. Швецова
        </Text>
        <Text style={styles.headerTitle}>
          База данных по воспитательной работе
        </Text>
        <Text style={styles.title}>Список студентов</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text
              style={[
                styles.cell,
                styles.cellHeader,
                styles.cellHeaderText,
                styles.cellFio,
              ]}
            >
              ФИО
            </Text>
            <Text
              style={[
                styles.cell,
                styles.cellHeader,
                styles.cellHeaderText,
                styles.cellBirthDate,
              ]}
            >
              Дата рождения
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Группа
            </Text>
            <Text
              style={[
                styles.cell,
                styles.cellHeader,
                styles.cellHeaderText,
                styles.cellPhone,
              ]}
            >
              Контактный номер
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Финансирование
            </Text>
            <Text
              style={[
                styles.cell,
                styles.cellHeader,
                styles.cellHeaderText,
                styles.cellEducation,
              ]}
            >
              Образование
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Приказ о присвоении статуса &quot;сирота&quot;
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Приказ о присвоении статуса &quot;инвалид&quot;
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Приказ о присвоении статуса &quot;ОВЗ&quot;
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Документ основание (сирота)
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Документ основание (инвалид)
            </Text>
            <Text
              style={[styles.cell, styles.cellHeader, styles.cellHeaderText]}
            >
              Отчисление
            </Text>
          </View>
          {preparedStudents.map((student, index) => (
            <View style={styles.tableRow} key={`student-${index}`}>
              <Text style={[styles.cell, styles.cellFio]}>
                {`${student?.lastName || ""} ${student?.firstName || ""} ${
                  student?.middleName || ""
                }`.trim()}
              </Text>
              <Text style={[styles.cell, styles.cellBirthDate]}>
                {student?.birthDate
                  ? new Date(student.birthDate).toLocaleDateString()
                  : ""}
              </Text>
              <Text style={styles.cell}>{student?.group || ""}</Text>
              <Text style={[styles.cell, styles.cellPhone]}>
                {student?.phone || ""}
              </Text>
              <Text style={styles.cell}>{student?.funding || ""}</Text>
              <Text style={[styles.cell, styles.cellEducation]}>
                {student?.education || ""}
              </Text>
              <Text style={styles.cell}>
                {student?.orphanStatus
                  ? `Приказ № ${
                      student.orphanStatus.order || "___"
                    } от "${formatOrderDate(student.orphanStatus.startDate)}"`
                  : ""}
              </Text>
              <Text style={styles.cell}>
                {student?.disabilityStatus
                  ? `Приказ № ${
                      student.disabilityStatus.order || "___"
                    } от "${formatOrderDate(
                      student.disabilityStatus.startDate
                    )}"`
                  : ""}
              </Text>
              <Text style={styles.cell}>
                {student?.ovzStatus
                  ? `Приказ № ${
                      student.ovzStatus.order || "___"
                    } от "${formatOrderDate(student.ovzStatus.startDate)}"`
                  : ""}
              </Text>
              <Text style={styles.cell}>
                {student?.orphanStatus?.note || ""}
              </Text>
              <Text style={styles.cell}>
                {student?.disabilityStatus?.note || ""}
              </Text>
              <Text style={styles.cell}>{student?.expulsionInfo || ""}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Количество записей: {total}</Text>
          <Text style={styles.footerRight}>Дата печати: {printDate}</Text>
        </View>
      </Page>
    </Document>
  );
}
