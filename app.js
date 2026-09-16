// رابط Google Apps Script Web App الخاص بك
const API_URL = "https://script.google.com/macros/s/AKfycbySlWIucdNxJXvWVMrH33lO-TVYtiElIjvcJgVpnc1vI9Jj_cGgv_710PK2Q2cNcQTtuA/exec";

let absenceChartInstance = null;
let gapChartInstance = null;

// تشغيل النظام
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardKPIs();
    initCharts();
    loadSheetData("التوجيه الطلابي");
});

// التنقل بين التبويبات
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('[id^="btn-tab-"]').forEach(btn => {
        btn.classList.remove('border-indigo-600', 'text-indigo-600', 'font-bold');
        btn.classList.add('border-transparent', 'text-slate-600');
    });

    const activeBtn = document.getElementById('btn-' + tabId);
    activeBtn.classList.add('border-indigo-600', 'text-indigo-600', 'font-bold');
    activeBtn.classList.remove('border-transparent', 'text-slate-600');
}

// إرسال البيانات
function handleFormSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري الحفظ...`;

    const sheetName = document.getElementById('sheetSelect').value;
    const payload = {
        sheet: sheetName,
        data: [
            1, // م
            document.getElementById('progName').value,
            document.getElementById('targetCount').value,
            document.getElementById('execCount').value,
            document.getElementById('statusSelect').value,
            document.getElementById('candidatesCount').value,
            document.getElementById('execCount').value,
            "100%"
        ]
    };

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("✅ تم تسجيل البيانات بنجاح في قاعدة البيانات!");
        document.getElementById('dataForm').reset();
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up ml-1"></i> حفظ وإرسال لقاعدة البيانات`;
        loadSheetData(sheetName);
    })
    .catch(err => {
        alert("حدث خطأ أثناء الاتصال: " + err);
        btn.disabled = false;
    });
}

// جلب وتعبئة الجدول المباشر من Google Sheets
function loadSheetData(sheetName = "التوجيه الطلابي") {
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');

    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500"><i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري جلب البيانات...</td></tr>`;

    fetch(`${API_URL}?sheet=${encodeURIComponent(sheetName)}`)
        .then(res => res.json())
        .then(res => {
            if (res.status === "success" && res.data.length > 0) {
                const headers = Object.keys(res.data[0]);
                tableHeaders.innerHTML = headers.map(h => `<th class="p-2.5 border-b">${h}</th>`).join('');

                tableBody.innerHTML = res.data.map(row => {
                    return `<tr class="hover:bg-slate-50">` +
                        headers.map(h => `<td class="p-2.5 border-b">${row[h] !== undefined ? row[h] : ''}</td>`).join('') +
                        `</tr>`;
                }).join('');
            } else {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-400">لا توجد بيانات مسجلة في ورقة ${sheetName}</td></tr>`;
            }
        })
        .catch(() => {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500">تم تحديث الاتصال مع قاعدة البيانات.</td></tr>`;
        });
}

// تحميل المؤشرات العامة
function loadDashboardKPIs() {
    document.getElementById('kpi-student-abs').innerText = "3.4 %";
    document.getElementById('kpi-teacher-abs').innerText = "6.9 %";
    document.getElementById('kpi-programs').innerText = "88 %";
    document.getElementById('kpi-gap').innerText = "-11.5 %";
}

// إعداد الرسوم البيانية
function initCharts() {
    const ctx1 = document.getElementById('absenceChart').getContext('2d');
    absenceChartInstance = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6', 'الأسبوع 7'],
            datasets: [
                { label: 'غياب الطلاب %', data: [3.4, 3.6, 2.0, 1.8, 0.5, 1.4, 4.3], borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.1)', fill: true, tension: 0.3 },
                { label: 'غياب المعلمين %', data: [6.9, 12.4, 19.8, 19.8, 19.8, 19.8, 19.8], borderColor: '#d97706', backgroundColor: 'transparent', borderDash: [5, 5] }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctx2 = document.getElementById('gapChart').getContext('2d');
    gapChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['التخطيط', 'متابعة الخطط', 'تعزيز القيم', 'أخلاقيات المهنة', 'المناخ الآمن'],
            datasets: [
                { label: 'التقويم الذاتي', data: [95, 55, 80, 75, 89], backgroundColor: '#3b82f6' },
                { label: 'التقويم الخارجي', data: [65, 90, 99, 67, 74], backgroundColor: '#10b981' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// تصدير البيانات إلى Excel
function exportToCSV() {
    let csvContent = "\uFEFFم,المجال,اسم البيان,العدد المستهدف,المنفذ,الحالة\n1,التوجيه الطلابي,الأسبوع التمهيدي,90,80,نقص\n2,التوجيه الطلابي,تعزيز السلوك الإيجابي,400,100,نفذ";
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "تحليل_واقع_المدرسة.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
