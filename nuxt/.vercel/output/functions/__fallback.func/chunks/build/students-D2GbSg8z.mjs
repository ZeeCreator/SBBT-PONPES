import { defineComponent, ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderStyle, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "students",
  __ssrInlineRender: true,
  setup(__props) {
    const students = ref([]);
    const classes = ref([]);
    const dormitories = ref([]);
    ref([]);
    const loading = ref(true);
    const error = ref("");
    const success = ref("");
    const showModal = ref(false);
    const showViolationModal = ref(false);
    const showDeleteModal = ref(false);
    const showBulkDeleteModal = ref(false);
    const isEditing = ref(false);
    const saving = ref(false);
    const violationSaving = ref(false);
    const deleting = ref(false);
    const deleteTarget = ref(null);
    const selectedStudent = ref(null);
    const selectedStudents = ref([]);
    ref(null);
    const filterClass = ref("");
    const filterDormitory = ref("");
    const filterStatus = ref("");
    const searchQuery = ref("");
    const violationForm = reactive({
      studentId: "",
      type: "Ringan",
      category: "Kedisiplinan",
      description: ""
    });
    const form = reactive({
      id: "",
      name: "",
      nis: "",
      classId: "",
      className: "",
      gender: "Laki-laki",
      dormitoryId: "",
      dormitoryName: "",
      roomId: "",
      roomName: "",
      city: "",
      phone: "",
      address: "",
      parentName: "",
      parentPhone: "",
      status: "Active",
      photo: ""
    });
    const rooms = computed(() => {
      if (!form.dormitoryId) return [];
      const dorm = dormitories.value.find((d) => d.id === form.dormitoryId);
      if (!dorm) return [];
      if (dorm.rooms && typeof dorm.rooms === "object" && !Array.isArray(dorm.rooms)) {
        return Object.entries(dorm.rooms).map(([id, val]) => ({ id, ...typeof val === "string" ? { name: val } : val }));
      }
      if (Array.isArray(dorm.rooms)) {
        return dorm.rooms.map((r) => typeof r === "string" ? { id: r, name: r } : r);
      }
      return [];
    });
    const classList = computed(() => classes.value);
    const filteredStudents = computed(() => {
      let result = students.value;
      if (filterClass.value) result = result.filter((s) => s.class === filterClass.value);
      if (filterDormitory.value) result = result.filter((s) => s.dormitoryName === filterDormitory.value);
      if (filterStatus.value) result = result.filter((s) => s.status === filterStatus.value);
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter((s) => (s.name || "").toLowerCase().includes(q) || (s.nis || "").toLowerCase().includes(q));
      }
      return result;
    });
    const stats = computed(() => {
      const total = students.value.length;
      const active = students.value.filter((s) => s.status === "Active").length;
      const kelas = new Set(students.value.map((s) => s.class).filter(Boolean)).size;
      return [
        { label: "Total Santri", icon: "groups", value: String(total), badge: `${active} aktif`, badgeClass: "bg-primary-fixed text-on-primary-fixed", subtext: "terdaftar", iconColor: "text-primary", valueColor: "text-primary", border: "" },
        { label: "Rata-rata Skor", icon: "gavel", value: total ? Math.round(students.value.reduce((sum, s) => sum + (s.score || 0), 0) / total) + "%" : "-", badge: "", badgeClass: "", subtext: "", iconColor: "text-secondary", valueColor: "text-secondary", border: "" },
        { label: "Keaktifan", icon: "how_to_reg", value: total ? `${Math.round(active / total * 100)}%` : "-", badge: "", badgeClass: "", subtext: "", iconColor: "text-tertiary-container", valueColor: "text-on-background", border: "" },
        { label: "Total Kelas", icon: "school", value: String(kelas), badge: "", badgeClass: "", subtext: "kelas aktif", iconColor: "text-error", valueColor: "text-on-background", border: "border-l-4 border-secondary-container" }
      ];
    });
    const disciplineStats = computed(() => {
      const total = students.value.length;
      if (!total) return [];
      const avg = students.value.reduce((sum, s) => sum + (s.score || 100), 0) / total;
      return [
        { label: "Kedisiplinan", rating: avg >= 80 ? "Baik" : avg >= 60 ? "Cukup" : "Kurang", value: Math.round(avg), color: avg >= 80 ? "text-primary" : avg >= 60 ? "text-secondary" : "text-error", barColor: avg >= 80 ? "bg-primary-container" : avg >= 60 ? "bg-secondary-container" : "bg-error" },
        { label: "Kepatuhan", rating: avg >= 75 ? "Baik" : "Perlu Perbaikan", value: Math.round(Math.min(100, avg + 5)), color: "text-secondary", barColor: "bg-secondary-container" },
        { label: "Partisipasi", rating: "Aktif", value: Math.round(Math.min(100, avg + 10)), color: "text-primary", barColor: "bg-primary-container" }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(error)) {
        _push(`<div class="mb-stack-lg p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-label-md">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(success)) {
        _push(`<div class="mb-stack-lg p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-label-md">${ssrInterpolate(unref(success))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="${ssrRenderClass(["glass-card p-stack-md rounded-xl shadow-sm", stat.border])}"><div class="flex items-center justify-between mb-2"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(stat.label)}</span><span class="${ssrRenderClass([stat.iconColor, "material-symbols-outlined"])}">${ssrInterpolate(stat.icon)}</span></div><p class="${ssrRenderClass([stat.valueColor, "font-display text-headline-md"])}">${ssrInterpolate(stat.value)}</p><div class="flex items-center gap-1 mt-1">`);
        if (stat.badge) {
          _push(`<span class="${ssrRenderClass(["text-[10px] px-1.5 py-0.5 rounded-full", stat.badgeClass])}">${ssrInterpolate(stat.badge)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-on-surface-variant text-[10px]">${ssrInterpolate(stat.subtext)}</span></div></div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md"><div><h2 class="font-display text-headline-md text-primary">Database Santri</h2><p class="text-on-surface-variant text-body-md">Kelola data santri terintegrasi dengan master data kelas, kamar, dan guru.</p></div><div class="flex items-center gap-stack-sm"><button class="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-label-md transition-all shadow-md hover:brightness-110 active:scale-95"><span class="material-symbols-outlined text-sm">add</span> Tambah Santri </button><button class="flex items-center gap-2 px-4 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg text-label-md transition-all shadow-md hover:brightness-110 active:scale-95"><span class="material-symbols-outlined text-sm">add_alert</span> Tambah Pelanggaran </button></div></div><div class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/50"><div class="p-stack-md border-b border-surface-variant/30 flex flex-wrap items-center gap-stack-md"><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Kelas:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterClass)) ? ssrLooseContain(unref(filterClass), "") : ssrLooseEqual(unref(filterClass), "")) ? " selected" : ""}>Semua Kelas</option><!--[-->`);
      ssrRenderList(unref(classList), (cls) => {
        _push(`<option${ssrRenderAttr("value", cls.name || cls)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterClass)) ? ssrLooseContain(unref(filterClass), cls.name || cls) : ssrLooseEqual(unref(filterClass), cls.name || cls)) ? " selected" : ""}>${ssrInterpolate(cls.name || cls)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Kamar:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterDormitory)) ? ssrLooseContain(unref(filterDormitory), "") : ssrLooseEqual(unref(filterDormitory), "")) ? " selected" : ""}>Semua Kamar</option><!--[-->`);
      ssrRenderList(unref(dormitories), (d) => {
        _push(`<option${ssrRenderAttr("value", d.name)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterDormitory)) ? ssrLooseContain(unref(filterDormitory), d.name) : ssrLooseEqual(unref(filterDormitory), d.name)) ? " selected" : ""}>${ssrInterpolate(d.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-center gap-2"><label class="text-label-sm text-on-surface-variant">Status:</label><select class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 focus:ring-primary-container px-3"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua Status</option><option value="Active"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Active") : ssrLooseEqual(unref(filterStatus), "Active")) ? " selected" : ""}>Active</option><option value="On Leave"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "On Leave") : ssrLooseEqual(unref(filterStatus), "On Leave")) ? " selected" : ""}>On Leave</option><option value="Alumni"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "Alumni") : ssrLooseEqual(unref(filterStatus), "Alumni")) ? " selected" : ""}>Alumni</option></select></div><div class="flex items-center gap-2 ml-auto"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari santri..." class="bg-surface-container-low border-none rounded-lg text-label-md py-1.5 px-3 focus:ring-primary-container w-48"><button class="p-2 hover:bg-surface-container-high rounded-lg transition-colors" title="Refresh"><span class="${ssrRenderClass([{ "animate-spin": unref(loading) }, "material-symbols-outlined text-on-surface-variant"])}">refresh</span></button></div></div>`);
      if (unref(selectedStudents).length > 0) {
        _push(`<div class="px-stack-md py-3 bg-primary-fixed/20 border-b border-surface-variant/30 flex items-center gap-4"><span class="text-label-sm font-semibold text-primary">${ssrInterpolate(unref(selectedStudents).length)} santri terpilih</span><button class="text-label-sm bg-error text-on-error px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1"><span class="material-symbols-outlined text-sm">delete</span> Hapus </button><button class="text-label-sm bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1"><span class="material-symbols-outlined text-sm">check_circle</span> Set Active </button><button class="text-label-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1"><span class="material-symbols-outlined text-sm">pause_circle</span> Set On Leave </button><button class="ml-auto text-label-sm text-on-surface-variant hover:text-primary flex items-center gap-1"><span class="material-symbols-outlined text-sm">close</span> Batal </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-surface-container-low"><tr><th class="px-4 py-4 text-label-md text-on-surface-variant w-10"><input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedStudents).length === unref(filteredStudents).length && unref(filteredStudents).length > 0) ? " checked" : ""} class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"></th><th class="px-6 py-4 text-label-md text-on-surface-variant">Nama Santri</th><th class="px-6 py-4 text-label-md text-on-surface-variant">NIS</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Kelas</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Kamar</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Gender</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Skor Disiplin</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Status</th><th class="px-6 py-4 text-label-md text-on-surface-variant">Aksi</th></tr></thead><tbody class="divide-y divide-surface-variant/30">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="9" class="px-6 py-12 text-center text-on-surface-variant text-label-md"><span class="material-symbols-outlined animate-spin align-middle mr-2">refresh</span> Memuat data... </td></tr>`);
      } else if (unref(filteredStudents).length === 0) {
        _push(`<tr><td colspan="9" class="px-6 py-12 text-center text-on-surface-variant text-label-md">Tidak ada data santri</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(filteredStudents), (student) => {
        var _a;
        _push(`<tr class="${ssrRenderClass([{ "bg-primary-fixed/10": ((_a = unref(selectedStudent)) == null ? void 0 : _a.id) === student.id }, "hover:bg-primary-container/5 transition-colors group"])}"><td class="px-4 py-4"><input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedStudents).includes(student.id)) ? " checked" : ""} class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"></td><td class="px-6 py-4"><div class="flex items-center gap-3">`);
        if (student.photo) {
          _push(`<div class="w-9 h-9 rounded-full overflow-hidden shrink-0"><img${ssrRenderAttr("src", student.photo)} alt="" class="w-full h-full object-cover"></div>`);
        } else {
          _push(`<div class="${ssrRenderClass(["w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0", student.avatarBg])}">${ssrInterpolate(student.initials)}</div>`);
        }
        _push(`<div><p class="text-label-md text-on-surface font-medium cursor-pointer hover:text-primary">${ssrInterpolate(student.name)}</p><p class="text-[11px] text-on-surface-variant">${ssrInterpolate(student.city || "-")}</p></div></div></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(student.nis || "-")}</td><td class="px-6 py-4"><span class="bg-surface-container-low px-2 py-0.5 rounded text-label-sm text-on-surface-variant">${ssrInterpolate(student.class || "-")}</span></td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(student.roomName || student.dormitoryName || "-")}</td><td class="px-6 py-4 text-label-md text-on-surface-variant">${ssrInterpolate(student.gender || "-")}</td><td class="px-6 py-4"><div class="flex items-center gap-2"><div class="flex-1 h-1.5 w-20 bg-surface-container-highest rounded-full overflow-hidden"><div class="${ssrRenderClass(["h-full rounded-full", student.scoreBar])}" style="${ssrRenderStyle({ width: student.score + "%" })}"></div></div><span class="${ssrRenderClass(["text-label-sm font-bold", student.scoreColor])}">${ssrInterpolate(student.score)}</span></div></td><td class="px-6 py-4"><span class="${ssrRenderClass(["px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider", student.statusClass])}">${ssrInterpolate(student.status)}</span></td><td class="px-6 py-4"><div class="flex items-center gap-1"><button class="p-1.5 rounded-lg hover:bg-primary-fixed/20 text-primary transition-colors" title="Edit"><span class="material-symbols-outlined text-sm">edit</span></button><button class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus"><span class="material-symbols-outlined text-sm">delete</span></button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="p-4 border-t border-surface-variant/30 flex items-center justify-between"><span class="text-on-surface-variant text-label-md">${ssrInterpolate(unref(filteredStudents).length)} dari ${ssrInterpolate(unref(students).length)} santri</span></div></div>`);
      if (unref(selectedStudent)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-stack-lg"><div class="lg:col-span-2 glass-card rounded-2xl p-gutter flex flex-col md:flex-row gap-gutter"><div class="md:w-1/3">`);
        if (unref(selectedStudent).photo) {
          _push(`<div class="w-full aspect-[4/5] rounded-xl shadow-lg overflow-hidden"><img${ssrRenderAttr("src", unref(selectedStudent).photo)} alt="" class="w-full h-full object-cover"></div>`);
        } else {
          _push(`<div class="w-full aspect-[4/5] rounded-xl shadow-lg bg-primary-fixed/30 flex items-center justify-center"><span class="material-symbols-outlined text-6xl text-primary">person</span></div>`);
        }
        _push(`</div><div class="md:w-2/3 space-y-stack-md"><div class="flex justify-between items-start"><div><h3 class="font-display text-headline-md text-primary">${ssrInterpolate(unref(selectedStudent).name)}</h3><p class="text-on-surface-variant text-label-md">NIS: ${ssrInterpolate(unref(selectedStudent).nis || "-")} \u2022 ${ssrInterpolate(unref(selectedStudent).class || "-")}</p></div><span class="${ssrRenderClass(["px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider", unref(selectedStudent).score < 60 ? "bg-error-container text-on-error-container" : "bg-primary-fixed text-on-primary-fixed"])}"> Skor: ${ssrInterpolate(unref(selectedStudent).score)}</span></div><div class="grid grid-cols-2 gap-stack-md"><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kota</p><p class="text-title-sm font-bold text-primary">${ssrInterpolate(unref(selectedStudent).city || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Gender</p><p class="text-title-sm font-bold text-on-background">${ssrInterpolate(unref(selectedStudent).gender || "-")}</p></div><div class="p-3 bg-surface-container-low rounded-xl"><p class="text-[10px] uppercase text-on-surface-variant font-semibold">Kamar</p><p class="text-title-sm font-bold text-primary">${ssrInterpolate(unref(selectedStudent).roomName || unref(selectedStudent).dormitoryName || "-")}</p></div></div><div class="space-y-2"><p class="text-label-sm text-on-surface-variant uppercase">Info</p><p class="text-label-md text-on-surface">Status: <span class="font-bold">${ssrInterpolate(unref(selectedStudent).status)}</span></p><p class="text-label-md text-on-surface">Skor Disiplin: <span class="${ssrRenderClass([unref(selectedStudent).score >= 80 ? "text-green-600" : unref(selectedStudent).score >= 60 ? "text-amber-600" : "text-red-600", "font-bold"])}">${ssrInterpolate(unref(selectedStudent).score)}</span></p><p class="text-label-md text-on-surface">Orang Tua: <span class="font-medium">${ssrInterpolate(unref(selectedStudent).parentName || "-")} (${ssrInterpolate(unref(selectedStudent).parentPhone || "-")})</span></p></div><div class="pt-2 flex gap-3"><button class="flex-1 py-2 bg-primary text-on-primary rounded-lg text-label-md hover:brightness-110 transition-all">Edit Santri</button><button class="flex-1 py-2 border border-red-500 text-red-600 rounded-lg text-label-md hover:bg-red-50 transition-all">Hapus</button></div></div></div><div class="glass-card rounded-2xl p-gutter space-y-stack-md"><h3 class="font-display text-title-lg text-on-background flex items-center justify-between"> Statistik Disiplin <span class="material-symbols-outlined text-on-surface-variant text-sm">info</span></h3><!--[-->`);
        ssrRenderList(unref(disciplineStats), (stat) => {
          _push(`<div class="space-y-2"><div class="flex items-center justify-between"><p class="text-label-md text-on-surface-variant">${ssrInterpolate(stat.label)}</p><span class="${ssrRenderClass(["font-bold", stat.color])}">${ssrInterpolate(stat.rating)}</span></div><div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div class="${ssrRenderClass(["h-full rounded-full", stat.barColor])}" style="${ssrRenderStyle({ width: stat.value + "%" })}"></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b, _c, _d, _e, _f;
        if (unref(showModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm overflow-y-auto py-10"><div class="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-modal-enter my-auto"><div class="bg-primary px-gutter py-stack-md flex justify-between items-center"><div class="text-on-primary"><h2 class="font-display text-headline-md">${ssrInterpolate(unref(isEditing) ? "Edit Santri" : "Tambah Santri")}</h2><p class="text-[11px] text-on-primary opacity-80 uppercase tracking-widest">Terintegrasi Master Data</p></div><button class="text-on-primary/60 hover:text-on-primary p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md max-h-[70vh] overflow-y-auto"><div class="flex items-center gap-4 mb-2"><div class="relative group cursor-pointer">`);
          if (unref(form).photo) {
            _push2(`<div class="w-[100px] h-[100px] rounded-full overflow-hidden shadow-md border-2 border-primary-fixed"><img${ssrRenderAttr("src", unref(form).photo)} alt="foto" class="w-full h-full object-cover"></div>`);
          } else {
            _push2(`<div class="w-[100px] h-[100px] rounded-full bg-primary-fixed/30 flex items-center justify-center shadow-md border-2 border-dashed border-primary-fixed group-hover:border-primary transition-colors"><span class="material-symbols-outlined text-3xl text-primary-fixed">add_a_photo</span></div>`);
          }
          _push2(`<div class="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all"><span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">camera_alt</span></div></div><div class="flex-1"><p class="text-label-sm text-on-surface-variant">Foto Santri <span class="text-on-surface-variant/60">(opsional)</span></p><p class="text-[10px] text-on-surface-variant/60">Klik untuk upload. Foto akan di-crop 100x100.</p><input type="file" accept="image/*" class="hidden">`);
          if (unref(form).photo) {
            _push2(`<button type="button" class="mt-2 text-label-xs text-error hover:underline">Hapus Foto</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Santri <span class="text-error">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama lengkap"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">NIS <span class="text-xs text-on-surface-variant">(otomatis)</span></label><input${ssrRenderAttr("value", unref(form).nis)} type="text" disabled class="w-full bg-surface-container-low border-none rounded-lg text-body-md p-3 outline-none opacity-60 cursor-not-allowed"${ssrRenderAttr("placeholder", unref(isEditing) ? "Nomor induk" : "Akan digenerate otomatis")}></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kelas <span class="text-error">*</span></label>`);
          if (unref(classes).length > 0) {
            _push2(`<select required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).classId) ? ssrLooseContain(unref(form).classId, "") : ssrLooseEqual(unref(form).classId, "")) ? " selected" : ""}>-- Pilih Kelas --</option><!--[-->`);
            ssrRenderList(unref(classes), (cls) => {
              _push2(`<option${ssrRenderAttr("value", cls.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).classId) ? ssrLooseContain(unref(form).classId, cls.id) : ssrLooseEqual(unref(form).classId, cls.id)) ? " selected" : ""}>${ssrInterpolate(cls.name)} (${ssrInterpolate(cls.level || "")}${ssrInterpolate(cls.group || "")})</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            _push2(`<input${ssrRenderAttr("value", unref(form).className)} type="text" required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Ketik nama kelas, contoh: Kelas 10 - Al-Azhar">`);
          }
          _push2(`</div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Gender</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Laki-laki"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gender) ? ssrLooseContain(unref(form).gender, "Laki-laki") : ssrLooseEqual(unref(form).gender, "Laki-laki")) ? " selected" : ""}>Laki-laki</option><option value="Perempuan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).gender) ? ssrLooseContain(unref(form).gender, "Perempuan") : ssrLooseEqual(unref(form).gender, "Perempuan")) ? " selected" : ""}>Perempuan</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Gedung/Kamar</label>`);
          if (unref(dormitories).length > 0) {
            _push2(`<select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).dormitoryId) ? ssrLooseContain(unref(form).dormitoryId, "") : ssrLooseEqual(unref(form).dormitoryId, "")) ? " selected" : ""}>-- Pilih Gedung --</option><!--[-->`);
            ssrRenderList(unref(dormitories), (d) => {
              _push2(`<option${ssrRenderAttr("value", d.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).dormitoryId) ? ssrLooseContain(unref(form).dormitoryId, d.id) : ssrLooseEqual(unref(form).dormitoryId, d.id)) ? " selected" : ""}>${ssrInterpolate(d.name)} (${ssrInterpolate(d.gender || "-")})</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            _push2(`<input${ssrRenderAttr("value", unref(form).dormitoryName)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Ketik nama gedung/kamar">`);
          }
          _push2(`</div></div>`);
          if (unref(form).dormitoryId && unref(rooms).length > 0) {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kamar</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).roomId) ? ssrLooseContain(unref(form).roomId, "") : ssrLooseEqual(unref(form).roomId, "")) ? " selected" : ""}>-- Pilih Kamar --</option><!--[-->`);
            ssrRenderList(unref(rooms), (r) => {
              _push2(`<option${ssrRenderAttr("value", r.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).roomId) ? ssrLooseContain(unref(form).roomId, r.id) : ssrLooseEqual(unref(form).roomId, r.id)) ? " selected" : ""}>${ssrInterpolate(r.name)}</option>`);
            });
            _push2(`<!--]--></select></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kota Asal</label><input${ssrRenderAttr("value", unref(form).city)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Kota"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">No. Telepon</label><input${ssrRenderAttr("value", unref(form).phone)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="No. HP"></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Alamat</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Alamat lengkap" rows="2">${ssrInterpolate(unref(form).address)}</textarea></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Nama Orang Tua / Wali</label><input${ssrRenderAttr("value", unref(form).parentName)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Nama orang tua"></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">No. HP Orang Tua</label><input${ssrRenderAttr("value", unref(form).parentPhone)} type="text" class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="No. HP orang tua"></div></div>`);
          if (unref(isEditing)) {
            _push2(`<div class="space-y-1"><label class="text-label-md text-on-surface-variant">Status</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Active") : ssrLooseEqual(unref(form).status, "Active")) ? " selected" : ""}>Active</option><option value="On Leave"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "On Leave") : ssrLooseEqual(unref(form).status, "On Leave")) ? " selected" : ""}>On Leave</option><option value="Alumni"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "Alumni") : ssrLooseEqual(unref(form).status, "Alumni")) ? " selected" : ""}>Alumni</option></select></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex justify-end gap-stack-sm pt-stack-sm border-t border-outline-variant/20"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-primary text-on-primary text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2" type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>`);
          if (unref(saving)) {
            _push2(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(saving) ? "Menyimpan..." : "Simpan")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showViolationModal)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-enter"><div class="bg-secondary-container px-gutter py-stack-md flex justify-between items-center"><div class="text-on-secondary-container"><h2 class="font-display text-headline-md">Tambah Pelanggaran</h2><p class="text-[11px] text-on-secondary-container opacity-80 uppercase tracking-widest">Kesantrian Module</p></div><button class="text-on-secondary-container/60 hover:text-on-secondary-container p-2"><span class="material-symbols-outlined">close</span></button></div><form class="p-gutter space-y-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Pilih Santri <span class="text-error">*</span></label><select required class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).studentId) ? ssrLooseContain(unref(violationForm).studentId, "") : ssrLooseEqual(unref(violationForm).studentId, "")) ? " selected" : ""}>-- Pilih Santri --</option><!--[-->`);
          ssrRenderList(unref(students), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).studentId) ? ssrLooseContain(unref(violationForm).studentId, s.id) : ssrLooseEqual(unref(violationForm).studentId, s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)} (${ssrInterpolate(s.class || "-")})</option>`);
          });
          _push2(`<!--]--></select></div><div class="grid grid-cols-2 gap-stack-md"><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Tipe Pelanggaran</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Ringan"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).type) ? ssrLooseContain(unref(violationForm).type, "Ringan") : ssrLooseEqual(unref(violationForm).type, "Ringan")) ? " selected" : ""}>Ringan</option><option value="Sedang"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).type) ? ssrLooseContain(unref(violationForm).type, "Sedang") : ssrLooseEqual(unref(violationForm).type, "Sedang")) ? " selected" : ""}>Sedang</option><option value="Berat"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).type) ? ssrLooseContain(unref(violationForm).type, "Berat") : ssrLooseEqual(unref(violationForm).type, "Berat")) ? " selected" : ""}>Berat</option></select></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Kategori</label><select class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none"><option value="Kedisiplinan"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).category) ? ssrLooseContain(unref(violationForm).category, "Kedisiplinan") : ssrLooseEqual(unref(violationForm).category, "Kedisiplinan")) ? " selected" : ""}>Kedisiplinan</option><option value="Ibadah"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).category) ? ssrLooseContain(unref(violationForm).category, "Ibadah") : ssrLooseEqual(unref(violationForm).category, "Ibadah")) ? " selected" : ""}>Ibadah</option><option value="Kebersihan"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).category) ? ssrLooseContain(unref(violationForm).category, "Kebersihan") : ssrLooseEqual(unref(violationForm).category, "Kebersihan")) ? " selected" : ""}>Kebersihan</option><option value="Akhlak"${ssrIncludeBooleanAttr(Array.isArray(unref(violationForm).category) ? ssrLooseContain(unref(violationForm).category, "Akhlak") : ssrLooseEqual(unref(violationForm).category, "Akhlak")) ? " selected" : ""}>Akhlak</option></select></div></div><div class="space-y-1"><label class="text-label-md text-on-surface-variant">Deskripsi Pelanggaran</label><textarea class="w-full bg-surface-container-low border-none rounded-lg text-body-md focus:ring-primary p-3 outline-none" placeholder="Deskripsi kejadian..." rows="3">${ssrInterpolate(unref(violationForm).description)}</textarea></div><div class="flex items-center gap-2 p-3 bg-secondary-fixed/30 border border-secondary-container/20 rounded-xl"><span class="material-symbols-outlined text-secondary">info</span><p class="text-label-sm text-on-secondary-fixed-variant leading-tight">Pelanggaran akan mengurangi skor disiplin santri secara otomatis.</p></div><div class="flex justify-end gap-stack-sm pt-stack-sm"><button class="px-6 py-2.5 text-on-surface-variant text-label-md hover:bg-surface-container-high rounded-lg" type="button">Batal</button><button class="px-8 py-2.5 bg-secondary-container text-on-secondary-container text-label-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2" type="submit"${ssrIncludeBooleanAttr(unref(violationSaving)) ? " disabled" : ""}>`);
          if (unref(violationSaving)) {
            _push2(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(violationSaving) ? "Menyimpan..." : "Submit")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showBulkDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus ${ssrInterpolate(unref(selectedStudents).length)} Santri</h3><p class="text-on-surface-variant text-label-md">Yakin ingin menghapus ${ssrInterpolate(unref(selectedStudents).length)} santri terpilih? Tindakan ini tidak dapat dibatalkan.</p></div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm flex items-center gap-2"${ssrIncludeBooleanAttr(unref(deleting)) ? " disabled" : ""}>`);
          if (unref(deleting)) {
            _push2(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(deleting) ? "Menghapus..." : "Hapus Semua")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(showDeleteModal)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-gutter bg-black/40 backdrop-blur-sm"><div class="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter"><div class="p-6 text-center"><div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><span class="material-symbols-outlined text-red-500 text-3xl">warning</span></div><h3 class="font-display text-title-lg text-on-surface mb-2">Hapus Santri</h3><p class="text-on-surface-variant text-label-md mb-1">Apakah Anda yakin ingin menghapus santri berikut?</p><p class="font-bold text-on-surface text-body-md">${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.name)}</p>`);
          if (((_b = unref(deleteTarget)) == null ? void 0 : _b.class) || ((_c = unref(deleteTarget)) == null ? void 0 : _c.roomName)) {
            _push2(`<p class="text-label-sm text-on-surface-variant mt-1">${ssrInterpolate((_d = unref(deleteTarget)) == null ? void 0 : _d.class)} \u2022 ${ssrInterpolate(((_e = unref(deleteTarget)) == null ? void 0 : _e.roomName) || ((_f = unref(deleteTarget)) == null ? void 0 : _f.dormitoryName) || "-")}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="p-6 border-t border-outline-variant/20 flex justify-end gap-3"><button class="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-label-md hover:bg-surface-container-higher transition-all">Batal</button><button class="px-4 py-2 bg-error text-on-error rounded-lg text-label-md hover:brightness-110 transition-all shadow-sm flex items-center gap-2"${ssrIncludeBooleanAttr(unref(deleting)) ? " disabled" : ""}>`);
          if (unref(deleting)) {
            _push2(`<span class="material-symbols-outlined animate-spin text-sm">refresh</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(` ${ssrInterpolate(unref(deleting) ? "Menghapus..." : "Hapus")}</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kesantrian/students.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=students-D2GbSg8z.mjs.map
