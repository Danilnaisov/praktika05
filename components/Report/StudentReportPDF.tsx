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
  ISvoStatus,
  IOvzStatus,
  IRiskGroupSop,
  ISocialScholarship,
  ISppp,
  IDormitory,
} from "@/types";

Font.register({ family: "Roboto", src: "/Roboto-Regular.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Roboto",
    fontSize: 11,
    backgroundColor: "#fff",
    color: "#222",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    minWidth: 120,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  value: {
    marginLeft: 8,
  },
  block: {
    marginBottom: 10,
  },
  note: {
    marginTop: 4,
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#222",
    padding: 6,
    fontSize: 11,
  },
  tableCellHeader: {
    fontWeight: "bold",
    backgroundColor: "#e5e5e5",
    fontSize: 12,
  },
});

// Функция для форматирования даты приказа
function formatOrderDate(dateStr?: string | Date) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
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
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г`;
}

// Функция для отображения статуса
function renderStatusSection(
  title: string,
  status:
    | IOrphanStatus
    | IDisabilityStatus
    | ISvoStatus
    | IOvzStatus
    | IRiskGroupSop
    | ISocialScholarship
    | ISppp
    | null
    | undefined
) {
  if (!status) return null;

  const typedStatus = status as {
    order?: string;
    document?: string;
    type?: string;
    disabilityType?: string;
    startDate?: Date;
    endDate?: Date;
    registrationDate?: Date;
    deregistrationDate?: Date;
    registrationReason?: string;
    registrationBasis?: string;
    deregistrationReason?: string;
    deregistrationBasis?: string;
    attendeesEmployees?: string;
    attendeesRepresentatives?: string;
    reason?: string;
    basis?: string;
    decision?: string;
    note?: string;
  };

  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>
        {typedStatus.order && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Приказ о присвоении статуса
            </Text>
            <Text style={styles.tableCell}>{`Приказ № ${
              typedStatus.order || "___"
            } от ${formatOrderDate(typedStatus.startDate)}`}</Text>
          </View>
        )}
        {typedStatus.document && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Документ
            </Text>
            <Text style={styles.tableCell}>{typedStatus.document}</Text>
          </View>
        )}
        {typedStatus.type && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Вид статуса
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.type === "risk"
                ? "Группа риска"
                : typedStatus.type === "sop"
                ? "СОП"
                : typedStatus.type}
            </Text>
          </View>
        )}
        {typedStatus.disabilityType && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Вид инвалидности
            </Text>
            <Text style={styles.tableCell}>{typedStatus.disabilityType}</Text>
          </View>
        )}
        {typedStatus.startDate && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Начало статуса
            </Text>
            <Text style={styles.tableCell}>
              {new Date(typedStatus.startDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        {typedStatus.endDate && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Конец статуса
            </Text>
            <Text style={styles.tableCell}>
              {new Date(typedStatus.endDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        {typedStatus.registrationDate && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Дата регистрации
            </Text>
            <Text style={styles.tableCell}>
              {new Date(typedStatus.registrationDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        {typedStatus.deregistrationDate && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Дата снятия с учета
            </Text>
            <Text style={styles.tableCell}>
              {new Date(typedStatus.deregistrationDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        {typedStatus.registrationReason && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Причина регистрации
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.registrationReason}
            </Text>
          </View>
        )}
        {typedStatus.registrationBasis && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Основание регистрации
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.registrationBasis}
            </Text>
          </View>
        )}
        {typedStatus.deregistrationReason && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Причина снятия с учета
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.deregistrationReason}
            </Text>
          </View>
        )}
        {typedStatus.deregistrationBasis && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Основание снятия с учета
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.deregistrationBasis}
            </Text>
          </View>
        )}
        {typedStatus.attendeesEmployees && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Присутствующие сотрудники
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.attendeesEmployees}
            </Text>
          </View>
        )}
        {typedStatus.attendeesRepresentatives && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Присутствующие представители
            </Text>
            <Text style={styles.tableCell}>
              {typedStatus.attendeesRepresentatives}
            </Text>
          </View>
        )}
        {typedStatus.reason && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Причина
            </Text>
            <Text style={styles.tableCell}>{typedStatus.reason}</Text>
          </View>
        )}
        {typedStatus.basis && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Основание
            </Text>
            <Text style={styles.tableCell}>{typedStatus.basis}</Text>
          </View>
        )}
        {typedStatus.decision && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Решение
            </Text>
            <Text style={styles.tableCell}>{typedStatus.decision}</Text>
          </View>
        )}
        {typedStatus.note && (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Примечание
            </Text>
            <Text style={styles.tableCell}>{typedStatus.note}</Text>
          </View>
        )}
      </View>
    </>
  );
}

export default function StudentReportPDF({
  student,
}: {
  student: IStudent & {
    orphanStatus?: IOrphanStatus;
    disabilityStatus?: IDisabilityStatus;
    svoStatus?: ISvoStatus;
    ovzStatus?: IOvzStatus;
    riskGroupSop?: IRiskGroupSop;
    socialScholarship?: ISocialScholarship;
    sppp?: ISppp[];
    dormitory?: IDormitory & { roomId?: { _id: string; name: string } };
    departmentId?: { name: string };
  };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Пермский авиационный техникум им. А.Д. Швецова
        </Text>
        <Text style={styles.sectionTitle}>
          База данных по воспитательной работе
        </Text>

        {/* Основная информация о студенте */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>ФИО</Text>
            <Text style={styles.tableCell}>
              {student.lastName} {student.firstName} {student.middleName}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Пол</Text>
            <Text style={styles.tableCell}>{student.gender || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Дата рождения
            </Text>
            <Text style={styles.tableCell}>
              {student.birthDate
                ? new Date(student.birthDate).toLocaleDateString()
                : ""}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Номер телефона
            </Text>
            <Text style={styles.tableCell}>{student.phone || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Образование
            </Text>
            <Text style={styles.tableCell}>{student.education || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Группа
            </Text>
            <Text style={styles.tableCell}>{student.group || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Отделение
            </Text>
            <Text style={styles.tableCell}>
              {student.departmentId?.name || ""}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Финансирование
            </Text>
            <Text style={styles.tableCell}>{student.funding || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Год поступления
            </Text>
            <Text style={styles.tableCell}>{student.admissionYear || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Год окончания
            </Text>
            <Text style={styles.tableCell}>{student.graduationYear || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Отчисление
            </Text>
            <Text style={styles.tableCell}>{student.expulsionInfo || ""}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Дата отчисления
            </Text>
            <Text style={styles.tableCell}>
              {student.expulsionDate
                ? new Date(student.expulsionDate).toLocaleDateString()
                : ""}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Примечание
            </Text>
            <Text style={styles.tableCell}>{student.note || ""}</Text>
          </View>
        </View>

        {/* Общежитие */}
        {student.dormitory && (
          <>
            <Text style={styles.sectionTitle}>Общежитие</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellHeader]}>
                  Комната
                </Text>
                <Text style={styles.tableCell}>
                  {student.dormitory.roomId?.name || ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellHeader]}>
                  Дата первого заселения
                </Text>
                <Text style={styles.tableCell}>
                  {student.dormitory.startDate
                    ? new Date(student.dormitory.startDate).toLocaleDateString()
                    : ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellHeader]}>
                  Дата окончательного выселения
                </Text>
                <Text style={styles.tableCell}>
                  {student.dormitory.endDate
                    ? new Date(student.dormitory.endDate).toLocaleDateString()
                    : ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellHeader]}>
                  Примечание
                </Text>
                <Text style={styles.tableCell}>
                  {student.dormitory.note || ""}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Статусы студента */}
        {renderStatusSection("Сирота", student.orphanStatus)}
        {renderStatusSection("Инвалид", student.disabilityStatus)}
        {renderStatusSection("СВО", student.svoStatus)}
        {renderStatusSection("ОВЗ", student.ovzStatus)}
        {renderStatusSection("Группа риска СОП", student.riskGroupSop)}
        {renderStatusSection("Социальная стипендия", student.socialScholarship)}
        {student.sppp && student.sppp.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>СППП</Text>
            {student.sppp.map((sppp, index) => (
              <View key={index} style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>
                    Дата
                  </Text>
                  <Text style={styles.tableCell}>
                    {new Date(sppp.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>
                    Причина
                  </Text>
                  <Text style={styles.tableCell}>{sppp.reason}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>
                    Основание
                  </Text>
                  <Text style={styles.tableCell}>{sppp.basis}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>
                    Решение
                  </Text>
                  <Text style={styles.tableCell}>{sppp.decision}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>
                    Присутствующие сотрудники
                  </Text>
                  <Text style={styles.tableCell}>
                    {sppp.attendeesEmployees}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>
                    Присутствующие представители
                  </Text>
                  <Text style={styles.tableCell}>
                    {sppp.attendeesRepresentatives}
                  </Text>
                </View>
                {sppp.note && (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>
                      Примечание
                    </Text>
                    <Text style={styles.tableCell}>{sppp.note}</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}
