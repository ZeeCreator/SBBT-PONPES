import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "grading",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const error = ref("");
    const classes = ref([]);
    const academicYears = ref([]);
    const students = ref([]);
    const subjects = ref([]);
    const grades = ref([]);
    const selectedClass = ref("");
    const selectedSemester = ref("Ganjil");
    const selectedAcademicYear = ref("2025/2026");
    const printStudentId = ref("");
    const showGradeModal = ref(false);
    const showDeleteModal = ref(false);
    const deleteTarget = ref(null);
    const gradeForm = reactive({ id: "", studentId: "", subject: "", score: 0 });
    const filteredStudents = computed(
      () => selectedClass.value ? students.value.filter((s) => s.class === selectedClass.value) : students.value
    );
    const studentRows = computed(() => {
      const gradeMap = {};
      grades.value.forEach((g) => {
        if (!gradeMap[g.studentId]) gradeMap[g.studentId] = {};
        gradeMap[g.studentId][g.subject] = { score: Number(g.score) || 0, gradeId: g.id };
      });
      return filteredStudents.value.map((s) => {
        const studentGrades = gradeMap[s.id] || {};
        const scores = {};
        const gradeIds = {};
        subjects.value.forEach((sub) => {
          if (studentGrades[sub.name]) {
            scores[sub.name] = studentGrades[sub.name].score;
            gradeIds[sub.name] = studentGrades[sub.name].gradeId;
          } else {
            scores[sub.name] = null;
          }
        });
        const vals = Object.values(scores).filter((v) => v !== null);
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return {
          id: s.id,
          name: s.name,
          nis: s.nis || "",
          scores,
          gradeIds,
          average: avg ? avg.toFixed(1) : "-",
          passed: avg >= 75
        };
      });
    });
    const stats = computed(() => {
      const rows = studentRows.value;
      const total = rows.length;
      const allAverages = rows.map((r) => parseFloat(r.average)).filter((v) => !isNaN(v));
      const overallAvg = allAverages.length ? allAverages.reduce((a, b) => a + b, 0) / allAverages.length : 0;
      const passedCount = rows.filter((r) => r.passed).length;
      return [
        { label: "Total Santri", value: total.toString(), color: "text-primary" },
        { label: "Rata-rata Kelas", value: overallAvg ? overallAvg.toFixed(1) : "-", color: "text-secondary" },
        { label: "Tingkat Kelulusan", value: total ? Math.round(passedCount / total * 100) + "%" : "-", color: "text-tertiary" },
        { label: "Mata Pelajaran", value: subjects.value.length.toString(), color: "text-green-600" }
      ];
    });
    const gradeDistribution = computed(() => {
      const allScores = [];
      studentRows.value.forEach((row) => {
        Object.values(row.scores).forEach((v) => {
          if (v !== null) allScores.push(v);
        });
      });
      const total = allScores.length;
      if (!total) return [];
      const a = allScores.filter((v) => v >= 90).length;
      const b = allScores.filter((v) => v >= 80 && v < 90).length;
      const c = allScores.filter((v) => v >= 70 && v < 80).length;
      const d = allScores.filter((v) => v < 70).length;
      return [
        { label: "A (90-100)", percentage: Math.round(a / total * 100), barColor: "bg-green-500" },
        { label: "B (80-89)", percentage: Math.round(b / total * 100), barColor: "bg-primary-container" },
        { label: "C (70-79)", percentage: Math.round(c / total * 100), barColor: "bg-amber-500" },
        { label: "D (<70)", percentage: Math.round(d / total * 100), barColor: "bg-red-500" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "px-gutter max-w-container-max mx-auto",
        style: { "padding-top": "6rem", "padding-bottom": "3rem" }
      }, _attrs))}><div class="mb-stack-lg flex flex-wrap items-center justify-between gap-stack-md"><div><h2 class="font-display text-headline-lg text-primary">Management Penilaian</h2><p class="text-on-surface-variant text-body-md">Kelola nilai santri per mata pelajaran dan cetak rapor.</p></div><div class="flex items-center gap-3"><button class="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">add</span> Tambah Nilai </button><button class="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all"><span class="material-symbols-outlined text-sm">print</span> Cetak Rekap </button></div></div><div class="flex flex-wrap items-center gap-4 mb-stack-lg"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant whitespace-nowrap">Kelas:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary min-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedClass)) ? ssrLooseContain(unref(selectedClass), "") : ssrLooseEqual(unref(selectedClass), "")) ? " selected" : ""}>-- Semua Kelas --</option><!--[-->`);
      ssrRenderList(unref(classes), (c) => {
        _push(`<option${ssrRenderAttr("value", c.name || c.nama)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedClass)) ? ssrLooseContain(unref(selectedClass), c.name || c.nama) : ssrLooseEqual(unref(selectedClass), c.name || c.nama)) ? " selected" : ""}>${ssrInterpolate(c.name || c.nama)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant whitespace-nowrap">Semester:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary"><option value="Ganjil"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSemester)) ? ssrLooseContain(unref(selectedSemester), "Ganjil") : ssrLooseEqual(unref(selectedSemester), "Ganjil")) ? " selected" : ""}>Ganjil</option><option value="Genap"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSemester)) ? ssrLooseContain(unref(selectedSemester), "Genap") : ssrLooseEqual(unref(selectedSemester), "Genap")) ? " selected" : ""}>Genap</option></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant whitespace-nowrap">Tahun Ajaran:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary min-w-[130px]"><!--[-->`);
      ssrRenderList(unref(academicYears), (ay) => {
        _push(`<option${ssrRenderAttr("value", ay.name || ay.code)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedAcademicYear)) ? ssrLooseContain(unref(selectedAcademicYear), ay.name || ay.code) : ssrLooseEqual(unref(selectedAcademicYear), ay.name || ay.code)) ? " selected" : ""}>${ssrInterpolate(ay.name || ay.code)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
      if (unref(error)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><span class="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
        ssrRenderList(unref(stats), (s) => {
          _push(`<div class="glass-card p-stack-md rounded-xl shadow-sm text-center"><p class="${ssrRenderClass([s.color, "font-display text-headline-md"])}">${ssrInterpolate(s.value)}</p><p class="text-label-sm text-on-surface-variant">${ssrInterpolate(s.label)}</p></div>`);
        });
        _push(`<!--]--></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg"><div class="lg:col-span-2 glass-card rounded-xl p-6 shadow-sm overflow-hidden"><h3 class="font-display text-title-lg text-primary mb-4">Daftar Nilai</h3><div class="overflow-x-auto"><table class="w-full text-left"><thead class="bg-surface-container-low"><tr><th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap sticky left-0 bg-surface-container-low z-10">Santri</th><!--[-->`);
        ssrRenderList(unref(subjects), (s) => {
          _push(`<th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">${ssrInterpolate(s.name)}</th>`);
        });
        _push(`<!--]--><th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">Rata-rata</th><th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">Status</th><th class="px-3 py-3 text-label-sm text-on-surface-variant whitespace-nowrap text-center">Aksi</th></tr></thead><tbody class="divide-y divide-outline-variant/10">`);
        if (unref(filteredStudents).length === 0) {
          _push(`<tr><td${ssrRenderAttr("colspan", unref(subjects).length + 4)} class="px-4 py-8 text-center text-on-surface-variant text-label-md">Belum ada data santri. Pilih kelas terlebih dahulu.</td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(studentRows), (row) => {
          _push(`<tr class="hover:bg-primary-fixed/5 transition-colors"><td class="px-3 py-2 text-label-md font-medium sticky left-0 bg-surface z-10">${ssrInterpolate(row.name)}</td><!--[-->`);
          ssrRenderList(unref(subjects), (s) => {
            _push(`<td class="px-2 py-2 text-center cursor-pointer">`);
            if (row.scores[s.name] !== void 0 && row.scores[s.name] !== null) {
              _push(`<span class="${ssrRenderClass(["px-2 py-0.5 rounded text-label-sm font-bold", row.scores[s.name] >= 90 ? "bg-green-100 text-green-700" : row.scores[s.name] >= 80 ? "bg-primary-fixed text-on-primary-fixed" : row.scores[s.name] >= 70 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"])}">${ssrInterpolate(row.scores[s.name])}</span>`);
            } else {
              _push(`<span class="text-on-surface-variant/40 text-label-sm">-</span>`);
            }
            _push(`</td>`);
          });
          _push(`<!--]--><td class="px-3 py-2 text-center font-bold text-primary">${ssrInterpolate(row.average)}</td><td class="px-3 py-2 text-center"><span class="${ssrRenderClass(["px-2 py-1 text-[10px] font-bold rounded-full uppercase whitespace-nowrap", row.passed ? "bg-green-100 text-green-700" : "bg-red-50 text-red-700"])}">${ssrInterpolate(row.passed ? "Lulus" : "Remedial")}</span></td><td class="px-3 py-2 text-center"><button class="text-error hover:text-red-700 transition-colors p-1" title="Hapus semua nilai santri"><span class="material-symbols-outlined text-sm">delete</span></button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div><div class="space-y-gutter"><div class="glass-card rounded-xl p-6 shadow-sm"><h3 class="font-display text-title-lg text-primary mb-4">Distribusi Nilai</h3>`);
        if (unref(gradeDistribution).length === 0) {
          _push(`<div class="text-on-surface-variant text-label-md">Belum ada data</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(gradeDistribution), (dist) => {
          _push(`<div class="space-y-1 mb-3"><div class="flex justify-between text-label-sm"><span class="text-on-surface-variant">${ssrInterpolate(dist.label)}</span><span class="font-bold">${ssrInterpolate(dist.percentage)}%</span></div><div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div class="${ssrRenderClass([dist.barColor, "h-full rounded-full transition-all duration-500"])}" style="${ssrRenderStyle({ width: dist.percentage + "%" })}"></div></div></div>`);
        });
        _push(`<!--]--></div><div class="glass-card rounded-xl p-6 shadow-sm"><h3 class="font-display text-title-lg text-primary mb-4">Cetak per Santri</h3><div class="space-y-3"><select class="w-full bg-surface-container-low border-none rounded-lg text-label-md py-2 px-3 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(printStudentId)) ? ssrLooseContain(unref(printStudentId), "") : ssrLooseEqual(unref(printStudentId), "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
        ssrRenderList(unref(filteredStudents), (s) => {
          _push(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(printStudentId)) ? ssrLooseContain(unref(printStudentId), s.id) : ssrLooseEqual(unref(printStudentId), s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
        });
        _push(`<!--]--></select><button class="w-full bg-tertiary text-on-tertiary py-2 rounded-lg text-label-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40"${ssrIncludeBooleanAttr(!unref(printStudentId)) ? " disabled" : ""}><span class="material-symbols-outlined text-sm">badge</span> Cetak Nilai Santri </button></div></div></div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (unref(showGradeModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-modal-enter"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><h2 class="font-display text-headline-md text-on-primary">${ssrInterpolate(unref(gradeForm).id ? "Edit Nilai" : "Tambah Nilai")}</h2><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Santri</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required${ssrIncludeBooleanAttr(!!unref(gradeForm).id) ? " disabled" : ""}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(gradeForm).studentId) ? ssrLooseContain(unref(gradeForm).studentId, "") : ssrLooseEqual(unref(gradeForm).studentId, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(filteredStudents), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(gradeForm).studentId) ? ssrLooseContain(unref(gradeForm).studentId, s.id) : ssrLooseEqual(unref(gradeForm).studentId, s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Mata Pelajaran</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(gradeForm).subject) ? ssrLooseContain(unref(gradeForm).subject, "") : ssrLooseEqual(unref(gradeForm).subject, "")) ? " selected" : ""}>-- Pilih Mapel --</option><!--[-->`);
          ssrRenderList(unref(subjects), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(gradeForm).subject) ? ssrLooseContain(unref(gradeForm).subject, s.name) : ssrLooseEqual(unref(gradeForm).subject, s.name)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nilai (0-100)</label><input type="number" min="0" max="100"${ssrRenderAttr("value", unref(gradeForm).score)} class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" required></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all" type="submit">Simpan</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Semua Nilai</h3><p class="text-on-surface-variant text-label-md">Yakin ingin menghapus semua nilai <strong>${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)}</strong>?</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm">Hapus</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/akademik/grading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=grading-Cs643tZt.mjs.map
