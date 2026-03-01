import { jsPDF } from "jspdf";

export const generatePrescriptionPDF = (prescription, patient, doctor) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ── Header ──
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("AI Clinic", 20, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Smart Clinic Management System", 20, 27);
  doc.text("PRESCRIPTION", pageWidth - 20, 22, { align: "right" });
  doc.setFontSize(9);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 32, { align: "right" });

  y = 55;
  doc.setTextColor(0, 0, 0);

  // ── Doctor Info ──
  doc.setFillColor(243, 244, 246);
  doc.rect(14, y - 5, pageWidth - 28, 25, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Dr. ${doctor?.name || prescription.doctorId?.name || "N/A"}`, 20, y + 3);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(doctor?.specialization || prescription.doctorId?.specialization || "General Practitioner", 20, y + 10);

  y += 35;
  doc.setTextColor(0, 0, 0);

  // ── Patient Info ──
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION", 20, y);
  doc.setLineWidth(0.3);
  doc.line(20, y + 2, pageWidth - 20, y + 2);
  y += 10;

  doc.setFont("helvetica", "normal");
  const patientName = patient?.name || prescription.patientId?.name || "N/A";
  const patientAge = patient?.age || prescription.patientId?.age;
  const patientGender = patient?.gender || prescription.patientId?.gender;
  const patientPhone = patient?.phone || prescription.patientId?.phone;

  doc.text(`Name: ${patientName}`, 20, y);
  doc.text(`Age/Gender: ${patientAge || "—"} yrs / ${patientGender || "—"}`, 110, y);
  y += 7;
  doc.text(`Phone: ${patientPhone || "—"}`, 20, y);
  y += 15;

  // ── Diagnosis ──
  doc.setFont("helvetica", "bold");
  doc.text("DIAGNOSIS", 20, y);
  doc.line(20, y + 2, pageWidth - 20, y + 2);
  y += 10;
  doc.setFont("helvetica", "normal");
  const diagLines = doc.splitTextToSize(prescription.diagnosis, pageWidth - 40);
  doc.text(diagLines, 20, y);
  y += diagLines.length * 7 + 10;

  // ── Medicines ──
  doc.setFont("helvetica", "bold");
  doc.text("MEDICATIONS", 20, y);
  doc.line(20, y + 2, pageWidth - 20, y + 2);
  y += 8;

  // Table header
  doc.setFillColor(37, 99, 235);
  doc.rect(14, y - 2, pageWidth - 28, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("#", 18, y + 4);
  doc.text("Medicine", 28, y + 4);
  doc.text("Dosage", 90, y + 4);
  doc.text("Frequency", 120, y + 4);
  doc.text("Duration", 158, y + 4);
  y += 10;

  doc.setTextColor(0, 0, 0);
  prescription.medicines.forEach((med, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(14, y - 4, pageWidth - 28, 9, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${i + 1}`, 18, y + 1);
    doc.text(med.name.substring(0, 28), 28, y + 1);
    doc.text(med.dosage.substring(0, 18), 90, y + 1);
    doc.text(med.frequency.substring(0, 20), 120, y + 1);
    doc.text(med.duration.substring(0, 15), 158, y + 1);
    if (med.instructions) {
      y += 7;
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(`  ↳ ${med.instructions}`, 28, y);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
    }
    y += 8;
  });

  y += 8;

  // ── Notes ──
  if (prescription.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("NOTES", 20, y);
    doc.line(20, y + 2, pageWidth - 20, y + 2);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const noteLines = doc.splitTextToSize(prescription.notes, pageWidth - 40);
    doc.text(noteLines, 20, y);
    y += noteLines.length * 6 + 10;
  }

  // ── Follow up ──
  if (prescription.followUpDate) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Follow-up Date: `, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(prescription.followUpDate).toLocaleDateString(), 60, y);
    y += 15;
  }

  // ── Signature ──
  y = Math.max(y, 240);
  doc.line(pageWidth - 80, y, pageWidth - 20, y);
  doc.setFontSize(9);
  doc.text("Doctor's Signature", pageWidth - 65, y + 6);

  // ── Footer ──
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 280, pageWidth, 17, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("This prescription was generated digitally by AI Clinic Management System.", pageWidth / 2, 288, { align: "center" });
  doc.text("Prescription ID: " + prescription._id, pageWidth / 2, 293, { align: "center" });

  doc.save(`prescription-${prescription._id}.pdf`);
};
