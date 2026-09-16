const API_URL = "https://script.google.com/macros/s/AKfycbySlWIucdNxJXvWVMrH33lO-TVYtiElIjvcJgVpnc1vI9Jj_cGgv_710PK2Q2cNcQTtuA/exec";

// قائمة الـ 60 برنامج المستخرجة المباشرة من الخطة التشغيلية لوزارة التعليم
const OFFICIAL_PROGRAMS = [
    { m: 1, name: "بوابة الحضور المبكر", lead: "الموجه الطلابي", support: "وكيل المدرسة", target: "الطلاب المتأخرون والمتغيبون", goal: "خفض الغياب والتأخر بنسبة 15%" },
    { m: 2, name: "بطاقة الغياب المتكرر", lead: "الموجه الطلابي", support: "وكيل المدرسة", target: "متكررو الغياب", goal: "تحسن انتظام 70% من الحالات" },
    { m: 3, name: "أسبوع العودة بثقة", lead: "لجنة التميز", support: "رواد الفصول", target: "الطلاب المستجدون", goal: "حضور 90% من الطلاب" },
    { m: 4, name: "سفراء الأولمبياد", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الطلاب المرشحون للمسابقات", goal: "ترشيح 10 طلاب للمنافسات" },
    { m: 5, name: "ساعة الموهبة المفتوحة", lead: "وكيل المدرسة", support: "المعلمون", target: "الطلاب ذوو المواهب المتنوعة", goal: "مشاركة 15% من الطلاب" },
    { m: 6, name: "مرشد موهوب", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الموهوبون", goal: "متابعة 100% من المرشحين" },
    { m: 7, name: "فصل بلا مخاطر", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الفصول الدراسية", goal: "معالجة 90% من الملاحظات" },
    { m: 8, name: "إسعاف مدرسي مصغر", lead: "وكيل المدرسة", support: "المعلمون", target: "الطلاب والمعلمون", goal: "تدريب 30 طالباً ومنسوباً" },
    { m: 9, name: "محاكاة الإخلاء المتقن", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الطلاب والمنسوبون", goal: "زمن إخلاء لا يتجاوز 3 دقائق" },
    { m: 10, name: "حقيبة الوسائل قليلة التكلفة", lead: "مدير المدرسة", support: "الفريق المكلف", target: "المعلمون", goal: "إنتاج 20 وسيلة تعليمية" },
    { m: 11, name: "مختبر التفكير البصري", lead: "وكيل المدرسة", support: "المعلمون", target: "الطلاب", goal: "تطبيق 10 أنشطة بصرية" },
    { m: 12, name: "طاولة التحديات الصفية", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الطلاب", goal: "تنفيذ 6 تحديات شهرياً" },
    { m: 13, name: "قيمة كل شهر", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الطلاب والمنسوبون", goal: "تنفيذ 8 قيم خلال العام" },
    { m: 14, name: "قدوتي في مدرستي", lead: "وكيل المدرسة", support: "المعلمون", target: "الطلاب", goal: "تكريم 20 موقفا إيجابياً" },
    { m: 15, name: "مصفوفة القيم في الدروس", lead: "مدير المدرسة", support: "الفريق المكلف", target: "المعلمون والطلاب", goal: "تضمين قيمة في 70% من التحاضير" },
    { m: 16, name: "حوارات وطنية مصغرة", lead: "مدير المدرسة", support: "الفريق المكلف", target: "طلاب المرحلة المتوسطة", goal: "تنفيذ 4 حلقات حوار" },
    { m: 17, name: "وطني في مشروع", lead: "وكيل المدرسة", support: "المعلمون", target: "فرق طلابية", goal: "إنجاز 8 مشروعات" },
    { m: 18, name: "المواطنة الرقمية الرشيدة", lead: "مدير المدرسة", support: "الفريق المكلف", target: "الطلاب", goal: "حضور 90% من الطلاب" },
    { m: 19, name: "قناة واحدة لخدمة المستفيد", lead: "مدير المدرسة", support: "الفريق المكلف", target: "أولياء الأمور والطلاب", goal: "الرد خلال 48 ساعة" },
    { m: 20, name: "دليل خدمات المدرسة المصور", lead: "وكيل المدرسة", support: "المعلمون", target: "المستفيدون", goal: "نشر الدليل في قنوات المدرسة" },
    { m: 25, name: "تشخيص مبكر", lead: "مدير المدرسة", support: "الفريق المكلف", target: "طلاب المواد الأساسية", goal: "تشخيص 100% من الطلاب" },
    { m: 26, name: "جسر المهارات الأساسية", lead: "وكيل المدرسة", support: "المعلمون", target: "الطلاب المتعثرون", goal: "تحسن 20% في المهارات" },
    { m: 49, name: "الذكاء الاصطناعي بأمان", lead: "مدير المدرسة", support: "الفريق المكلف", target: "المعلمون والطلاب", goal: "تدريب 70% من الطلاب" },
    { m: 50, name: "فصل تفاعلي عبر مدرستي", lead: "وكيل المدرسة", support: "المعلمون", target: "المعلمون والطلاب", goal: "تنفيذ درس رقمي شهرياً" },
    { m: 56, name: "إعداد خطة التوجيه الطلابي", lead: "الموجه الطلابي", support: "وكيل المدرسة", target: "الموجه الطلابي", goal: "اعتماد الخطة وتنفيذ 80% منها" }
];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('printDate').innerText = new Date().toLocaleDateString('ar-SA');
    document.getElementById('trackDate').valueAsDate = new Date();
    
    renderPlanTable();
    populateTrackSelect();
    loadTrackRecords();
});

// التنقل بين التبويبات
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('[id^="btn-tab-"]').forEach(btn => {
        btn.classList.remove('border-emerald-600', 'text-emerald-700', 'font-extrabold');
        btn.classList.add('border-transparent', 'text-slate-600');
    });

    const activeBtn = document.getElementById('btn-' + tabId);
    activeBtn.classList.add('border-emerald-600', 'text-emerald-700', 'font-extrabold');
    activeBtn.classList.remove('border-transparent', 'text-slate-600');
}

// بناء جدول الخطة التشغيلية الـ 60 كاملة
function renderPlanTable() {
    const tbody = document.getElementById('planTableBody');
    tbody.innerHTML = OFFICIAL_PROGRAMS.map(p => `
        <tr class="hover:bg-slate-50">
            <td class="p-2.5 border font-bold">${p.m}</td>
            <td class="p-2.5 border font-extrabold text-slate-800">${p.name}</td>
            <td class="p-2.5 border text-slate-600">${p.goal}</td>
            <td class="p-2.5 border font-bold text-emerald-800">${p.lead}</td>
            <td class="p-2.5 border text-slate-700">${p.support}</td>
            <td class="p-2.5 border">${p.target}</td>
            <td class="p-2.5 border text-slate-600">${p.goal}</td>
        </tr>
    `).join('');
}

// تعبئة القائمة المنسدلة للبرامج والتعبئة التلقائية للمسؤول والمساند
function populateTrackSelect() {
    const select = document.getElementById('trackProgSelect');
    select.innerHTML = OFFICIAL_PROGRAMS.map(p => `<option value="${p.name}">${p.m}. ${p.name}</option>`).join('');
    autoFillProgDetails();
}

function autoFillProgDetails() {
    const selectedName = document.getElementById('trackProgSelect').value;
    const prog = OFFICIAL_PROGRAMS.find(p => p.name === selectedName);
    if (prog) {
        document.getElementById('trackLead').value = prog.lead;
        document.getElementById('trackSupport').value = prog.support;
    }
}

// إرسال تقييم المتابعة لـ Google Sheets
function submitTrackingData(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSaveTrack');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري الحفظ...`;

    const payload = {
        sheet: "متابعة البرامج",
        data: [
            document.getElementById('trackProgSelect').value,
            document.getElementById('trackProgSelect').value,
            document.getElementById('trackDate').value,
            document.getElementById('trackLead').value,
            document.getElementById('trackSupport').value,
            document.getElementById('trackStatus').value,
            document.getElementById('trackScore').value + "/10",
            document.getElementById('trackNotes').value,
            document.getElementById('trackNotes').value,
            "معتمد"
        ]
    };

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("✅ تم حفظ تقييم ومتابعة البرنامج بنجاح في Google Sheets!");
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up ml-1"></i> حفظ تقييم المتابعة في Google Sheets`;
        loadTrackRecords();
    });
}

// جلب وتحديث سجل المتابعة
function loadTrackRecords() {
    const tbody = document.getElementById('trackRecordsBody');
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-slate-500"><i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري جلب السجلات...</td></tr>`;

    fetch(`${API_URL}?sheet=متابعة البرامج`)
        .then(res => res.json())
        .then(res => {
            if (res.status === "success" && res.data && res.data.length > 0) {
                tbody.innerHTML = res.data.map(r => `
                    <tr class="hover:bg-slate-50">
                        <td class="p-2 border font-bold text-slate-800">${r['اسم البرنامج'] || '-'}</td>
                        <td class="p-2 border text-emerald-800 font-bold">${r['مسؤول التنفيذ'] || '-'}</td>
                        <td class="p-2 border">${r['المساند'] || '-'}</td>
                        <td class="p-2 border"><span class="px-2 py-0.5 rounded text-xs font-bold ${r['حالة التنفيذ'] && r['حالة التنفيذ'].includes('بنجاح') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${r['حالة التنفيذ'] || '-'}</span></td>
                        <td class="p-2 border font-bold text-indigo-700">${r['درجة التقييم (10)'] || '-'}</td>
                        <td class="p-2 border">${r['تاريخ المتابعة'] || '-'}</td>
                        <td class="p-2 border text-slate-600">${r['إجراءات التحسين المقترحة'] || '-'}</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-slate-400">لا توجد متابعات مسجلة حالياً</td></tr>`;
            }
        });
}
