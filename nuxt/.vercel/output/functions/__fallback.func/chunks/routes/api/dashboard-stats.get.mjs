import { d as defineEventHandler } from '../../_/nitro.mjs';
import { getDatabase } from 'firebase-admin/database';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'firebase-admin/app';
import 'firebase-admin/auth';
import 'jose';

const dashboardStats_get = defineEventHandler(async () => {
  const db = getDatabase();
  const [studentsSnap, violationsSnap, invoicesSnap, attendanceSnap, logsSnap, guruSnap, classesSnap] = await Promise.all([
    db.ref("students").once("value"),
    db.ref("violations").once("value"),
    db.ref("invoices").once("value"),
    db.ref("attendance").once("value"),
    db.ref("activity_logs").once("value").catch(() => null),
    db.ref("guru").once("value"),
    db.ref("classes").once("value")
  ]);
  const students = studentsSnap.val() || {};
  const violations = violationsSnap.val() || {};
  const invoices = invoicesSnap.val() || {};
  const attendance = attendanceSnap.val() || {};
  const logs = (logsSnap == null ? void 0 : logsSnap.val()) || {};
  const guru = guruSnap.val() || {};
  const rawClasses = classesSnap.val() || {};
  const studentList = Object.values(students);
  const violationList = Object.values(violations);
  const invoiceList = Object.values(invoices);
  const attendanceList = Object.values(attendance);
  const logList = Object.values(logs);
  const teacherList = Object.values(guru);
  const classList = Object.entries(rawClasses).map(([id, c]) => ({ id, ...c }));
  const totalStudents = studentList.length;
  const activeStudents = studentList.filter((s) => s.status === "Active").length;
  const alumniStudents = studentList.filter((s) => s.status === "Alumni").length;
  const totalTeachers = teacherList.length;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString();
  const recentViolations = violationList.filter((v) => v.timestamp >= weekAgo).length;
  const paidInvoices = invoiceList.filter((inv) => inv.status === "paid").length;
  const totalInvoices = invoiceList.length;
  const financialHealth = totalInvoices > 0 ? Math.round(paidInvoices / totalInvoices * 1e3) / 10 : 0;
  const presentToday = attendanceList.filter((a) => a.status === "present").length;
  const totalAttendance = attendanceList.length;
  const attendanceRate = totalAttendance > 0 ? Math.round(presentToday / totalAttendance * 1e3) / 10 : 0;
  const berat = violationList.filter((v) => v.type === "Severe").length;
  const ringan = violationList.filter((v) => v.type === "Minor" || v.type === "Moderate").length;
  const activities = logList.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()).slice(0, 15).map((log) => ({
    icon: log.icon || "info",
    bg: log.color === "#ba1a1a" ? "bg-error-container" : log.color === "#9b4500" ? "bg-secondary-fixed" : "bg-primary-fixed",
    iconColor: log.color === "#ba1a1a" ? "text-error" : log.color === "#9b4500" ? "text-secondary" : "text-primary",
    title: `<span class="font-bold">${log.action}</span> \u2014 ${log.description}`,
    time: timeAgo(log.timestamp)
  }));
  const validClassNames = new Set(classList.map((c) => c.name || c.nama || ""));
  const studentClassMap = {};
  for (const s of studentList) {
    const clsName = s.class || "";
    if (!validClassNames.has(clsName)) continue;
    if (!studentClassMap[clsName]) studentClassMap[clsName] = [];
    studentClassMap[clsName].push(s);
  }
  let allGrades = [];
  try {
    const gradesSnap = await db.ref("grades").once("value");
    const gData = gradesSnap.val() || {};
    allGrades = Object.values(gData);
  } catch {
  }
  const gradeByStudent = {};
  for (const g of allGrades) {
    const sid = g.studentId;
    if (!sid) continue;
    if (!gradeByStudent[sid]) gradeByStudent[sid] = [];
    gradeByStudent[sid].push(Number(g.score) || 0);
  }
  const attendanceByStudent = {};
  for (const a of attendanceList) {
    const sid = a.studentId;
    if (!sid) continue;
    if (!attendanceByStudent[sid]) attendanceByStudent[sid] = { present: 0, total: 0 };
    attendanceByStudent[sid].total++;
    if (a.status === "present") attendanceByStudent[sid].present++;
  }
  const classes = classList.map((cls) => {
    const clsName = cls.name || cls.nama || "";
    const studentsInClass = studentClassMap[clsName] || [];
    const studentCount = studentsInClass.length;
    let totalScore = 0;
    let scoreCount = 0;
    for (const s of studentsInClass) {
      const scores = gradeByStudent[s.id || ""] || [];
      for (const sc of scores) {
        totalScore += sc;
        scoreCount++;
      }
    }
    const avgGrade = scoreCount > 0 ? totalScore / scoreCount : 0;
    let totalAtt = 0;
    let totalPresent = 0;
    for (const s of studentsInClass) {
      const att = attendanceByStudent[s.id || ""];
      if (att) {
        totalAtt += att.total;
        totalPresent += att.present;
      }
    }
    const attendancePct = totalAtt > 0 ? Math.round(totalPresent / totalAtt * 1e3) / 10 : 0;
    return {
      name: clsName,
      avgGrade: avgGrade.toFixed(1),
      attendance: attendancePct + "%",
      progress: studentCount > 0 ? Math.min(Math.round(avgGrade * 10), 100) : 0
    };
  });
  return {
    totalStudents,
    activeStudents,
    alumniStudents,
    totalTeachers,
    financialHealth,
    recentViolations,
    attendanceRate,
    totalPelanggaran: violationList.length,
    pelanggaranBerat: berat,
    pelanggaranRingan: ringan,
    ratioGuru: totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0,
    activities,
    classes
  };
});
function timeAgo(timestamp) {
  if (!timestamp) return "";
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 6e4);
  const hours = Math.floor(diff / 36e5);
  const days = Math.floor(diff / 864e5);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export { dashboardStats_get as default };
//# sourceMappingURL=dashboard-stats.get.mjs.map
