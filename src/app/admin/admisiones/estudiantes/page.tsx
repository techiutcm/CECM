import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { AdmissionStatusBadge } from "@/components/admin/admisiones/admission-status-badge";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getEnrolledStudents } from "@/lib/admissions/admin/queries";
import { formatDate } from "@/lib/utils/date";

export default async function EstudiantesPage() {
  const user = await requireAdminAccess("editor");
  const students = await getEnrolledStudents();

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Estudiantes"
        description="Estudiantes inscritos a través del proceso de admisión"
      />

      <div className="flex-1 p-6">
        <div className="overflow-hidden rounded-2xl border border-[#083148]/10 bg-white shadow-sm">
          <div className="border-b border-[#083148]/10 px-5 py-4">
            <h2 className="font-semibold text-[#083148]">
              Inscritos ({students.length})
            </h2>
          </div>
          <div className="divide-y divide-[#083148]/5">
            {students.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-[#083148]/50">
                Aún no hay estudiantes inscritos.
              </p>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-[#083148]">{student.studentName}</p>
                    <p className="text-sm text-[#083148]/55">
                      {student.grade} · {student.representativeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AdmissionStatusBadge status={student.status} />
                    <span className="text-xs text-[#083148]/45">{formatDate(student.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
