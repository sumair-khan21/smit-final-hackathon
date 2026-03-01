const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");
const { ROLES } = require("../constants");

const startOfMonth = () => {
  const d = new Date();
  d.setDate(1); d.setHours(0, 0, 0, 0);
  return d;
};
const endOfMonth = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0); d.setHours(23, 59, 59, 999);
  return d;
};
const startOfDay = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const endOfDay = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d; };

class AnalyticsService {
  async getAdminAnalytics() {
    const som = startOfMonth(), eom = endOfMonth(), sod = startOfDay(), eod = endOfDay();

    const [
      totalPatients, totalDoctors, totalReceptionists,
      monthlyAppointments, todayAppointments,
      pendingAppointments, completedAppointments,
      topDiagnoses, monthlyStats,
    ] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      User.countDocuments({ role: ROLES.DOCTOR, isActive: true }),
      User.countDocuments({ role: ROLES.RECEPTIONIST, isActive: true }),
      Appointment.countDocuments({ date: { $gte: som, $lte: eom } }),
      Appointment.countDocuments({ date: { $gte: sod, $lte: eod } }),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "completed" }),
      Prescription.aggregate([
        { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { name: "$_id", count: 1, _id: 0 } },
      ]),
      Appointment.aggregate([
        {
          $group: {
            _id: { $month: "$date" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]),
    ]);

    // Simulated revenue: completed appointments * avg fee
    const AVG_FEE = 500;
    const simulatedRevenue = completedAppointments * AVG_FEE;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const appointmentsByMonth = months.map((name, i) => {
      const found = monthlyStats.find(s => s._id === i + 1);
      return { name, count: found?.count || 0 };
    });

    return {
      totalPatients, totalDoctors, totalReceptionists,
      monthlyAppointments, todayAppointments,
      pendingAppointments, completedAppointments,
      simulatedRevenue,
      topDiagnoses,
      appointmentsByMonth,
    };
  }

  async getDoctorAnalytics(doctorId) {
    const sod = startOfDay(), eod = endOfDay(), som = startOfMonth(), eom = endOfMonth();

    const [
      todayAppointments, monthlyAppointments,
      totalPrescriptions, pendingToday, completedThisMonth,
      weeklyStats,
    ] = await Promise.all([
      Appointment.countDocuments({ doctorId, date: { $gte: sod, $lte: eod } }),
      Appointment.countDocuments({ doctorId, date: { $gte: som, $lte: eom } }),
      Prescription.countDocuments({ doctorId }),
      Appointment.countDocuments({ doctorId, date: { $gte: sod, $lte: eod }, status: "pending" }),
      Appointment.countDocuments({ doctorId, date: { $gte: som, $lte: eom }, status: "completed" }),
      Appointment.aggregate([
        { $match: { doctorId, date: { $gte: som, $lte: eom } } },
        { $group: { _id: { $dayOfMonth: "$date" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
      ]),
    ]);

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const dailyStats = Array.from({ length: daysInMonth }, (_, i) => {
      const found = weeklyStats.find(s => s._id === i + 1);
      return { day: i + 1, count: found?.count || 0 };
    });

    return { todayAppointments, monthlyAppointments, totalPrescriptions, pendingToday, completedThisMonth, dailyStats };
  }
}

module.exports = new AnalyticsService();
