// رابط الـ API المباشر لـ Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbySlWIucdNxJXvWVMrH33lO-TVYtiElIjvcJgVpnc1vI9Jj_cGgv_710PK2Q2cNcQTtuA/exec";

document.addEventListener("DOMContentLoaded", () => {
    // ضبط تاريخ التقرير اليوم
    document.getElementById('print-date').innerText = new Date().toLocaleDateString('ar-SA');
    
    // بناء الحقول المبدئية للنموذج
    updateFormFields();
    
    // جلب البيانات الأولية
    loadReportData();
    initReportCharts();

    // الاستماع لأي رسائل قادمة من مواقع تفاعلية عبر window.postMessage
    window.addEventListener("message", receiveExternalInteractiveData, false);
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

    if(tabId === 'tab-database') {
        loadDatabaseTable();
    }
}

// تحديث حقول نموذج الإدخال ديناميكياً حسب الورقة المختارة
function updateFormFields() {
    const sheetTarget = document.getElementById('entrySheetTarget').value;
    const container = document.getElementById('dynamicFieldsContainer');

    if (sheetTarget === "بيانات الخطط المدرسية") {
        container.innerHTML = `
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">نوع الخطة المدرسية</label>
                <input type="text" id="field_1" required class="w-full border rounded-lg p-2.5 text-xs bg-slate-50" placeholder="مثال: خطة النمو المهني">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">حالة الخطة</label>
                <select id="field_2" class="w-full border rounded-lg p-2.5 text-xs bg-slate-50">
                    <option value="موجودة">موجودة</option>
                    <option value="ناقصة">ناقصة</option>
                    <option value="غير موجودة">غير موجودة</option>
                </select>
            </div>
            <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظات وتوصيات</label>
                <input type="text" id="field_3" class="w-full border rounded-lg p-2.5 text-xs bg-slate-50" placeholder="أدخل التوصيات إن وجدت">
            </div>
        `;
    } else {
        // حقول البرامج العامة (توجيه طلابي / نشاط / موهوبين ...)
        container.innerHTML = `
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم البرنامج / البيان</label>
                <input type="text" id="field_1" required class="w-full border rounded-lg p-2.5 text-xs bg-slate-50" placeholder="أدخل اسم البرنامج">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">العدد المستهدف</label>
                <input type="number" id="field_2" required class="w-full border rounded-lg p-2.5 text-xs bg-slate-50" placeholder="100">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">العدد المنفذ</label>
                <input type="number" id="field_3" required class="w-full border rounded-lg p-2.5 text-xs bg-slate-50" placeholder="85">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">حالة التنفيذ</label>
                <select id="field_4" class="w-full border rounded-lg p-2.5 text-xs bg-slate-50">
                    <option value="نفذ">نفذ</option>
                    <option value="نقص">نقص</option>
                    <option value="فائض">فائض</option>
                    <option value="لم ينفذ">لم ينفذ</option>
                </select>
            </div>
        `;
    }
}

// حفظ النموذج إلى Google Sheets
function submitFormEntry(event) {
    event.preventDefault();
    const btn = document.getElementById('btnSaveData');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري الحفظ...`;

    const sheetName = document.getElementById('entrySheetTarget').value;
    let rowData = [1]; // م

    if (sheetName === "بيانات الخطط المدرسية") {
        rowData.push(
            document.getElementById('field_1').value,
            document.getElementById('field_2').value,
            document.getElementById('field_3').value
        );
    } else {
        const target = Number(document.getElementById('field_2').value) || 1;
        const exec = Number(document.getElementById('field_3').value) || 0;
        const pct = Math.round((exec / target) * 100) + "%";

        rowData.push(
            document.getElementById('field_1').value,
            target,
            exec,
            document.getElementById('field_4').value,
            target,
            exec,
            pct
        );
    }

    sendToGoogleSheets(sheetName, rowData, () => {
        alert("✅ تم حفظ البيانات والخطط بنجاح في Google Sheets!");
        document.getElementById('dynamicEntryForm').reset();
        updateFormFields();
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up ml-1"></i> حفظ وإرسال البيانات`;
        loadReportData();
    });
}

// دالة الإرسال لـ Apps Script
function sendToGoogleSheets(sheetName, rowDataArray, callback) {
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sheet: sheetName,
            data: rowDataArray
        })
    })
    .then(() => { if (callback) callback(); })
    .catch(err => {
        alert("خطأ في الاتصال: " + err);
    });
}

// جلب بيانات التقرير الرسمي
function loadReportData() {
    const tableBody = document.getElementById('reportProgramsTable');
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-slate-500"><i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري التحميل...</td></tr>`;

    fetch(`${API_URL}?sheet=التوجيه الطلابي`)
        .then(res => res.json())
        .then(res => {
            if (res.status === "success" && res.data && res.data.length > 0) {
                tableBody.innerHTML = res.data.map((row, idx) => `
                    <tr class="hover:bg-slate-50">
                        <td class="p-2.5 border font-bold">${idx + 1}</td>
                        <td class="p-2.5 border font-bold text-slate-800">${row['مسمى البرنامج'] || row['البرامج'] || '-'}</td>
                        <td class="p-2.5 border">${row['عدد البرامج'] || row['العدد المستهدف'] || '-'}</td>
                        <td class="p-2.5 border">${row['التنفيذ'] || row['البرامج المنفذة'] || '-'}</td>
                        <td class="p-2.5 border"><span class="px-2 py-0.5 rounded text-xs font-bold ${row['الحالة'] === 'نفذ' ? 'bg-emerald-100 text-emerald-800 badge-style' : 'bg-amber-100 text-amber-800 badge-style'}">${row['الحالة'] || 'نفذ'}</span></td>
                        <td class="p-2.5 border">${row['عدد المستفيدين'] || '-'}</td>
                        <td class="p-2.5 border font-bold text-emerald-700">${row['نسبة المشاركة %'] || row['نسبة المشاركة'] || '100%'}</td>
                    </tr>
                `).join('');
            } else {
                tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-slate-400">لا توجد بيانات مسجلة حالياً في ورقة التوجيه الطلابي</td></tr>`;
            }
        })
        .catch(() => {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-slate-400">جاهز لعرض البيانات الحية بمجرد تسجيل البيانات.</td></tr>`;
        });
}

// عرض جدول القاعدة الحية
function loadDatabaseTable() {
    const sheetName = document.getElementById('dbSheetSelector').value;
    const headersEl = document.getElementById('dbTableHeaders');
    const bodyEl = document.getElementById('dbTableBody');

    bodyEl.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500"><i class="fa-solid fa-spinner fa-spin ml-1"></i> جاري جلب ورقة ${sheetName}...</td></tr>`;

    fetch(`${API_URL}?sheet=${encodeURIComponent(sheetName)}`)
        .then(res => res.json())
        .then(res => {
            if (res.status === "success" && res.data && res.data.length > 0) {
                const keys = Object.keys(res.data[0]);
                headersEl.innerHTML = keys.map(k => `<th class="p-2.5 border">${k}</th>`).join('');
                bodyEl.innerHTML = res.data.map(r => `<tr class="hover:bg-slate-50">` + keys.map(k => `<td class="p-2.5 border">${r[k] !== undefined ? r[k] : ''}</td>`).join('') + `</tr>`).join('');
            } else {
                bodyEl.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-400">ورقة ${sheetName} فارغة حالياً</td></tr>`;
            }
        });
}

// إنشاء الرسوم البيانية في التقرير
function initReportCharts() {
    new Chart(document.getElementById('reportAbsenceChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6'],
            datasets: [{ label: 'غياب الطلاب %', data: [3.4, 3.6, 2.0, 1.8, 0.5, 1.4], borderColor: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.1)', fill: true, tension: 0.3 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('reportGapChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['التخطيط', 'متابعة الخطط', 'تعزيز القيم', 'أخلاقيات المهنة'],
            datasets: [
                { label: 'الذاتي', data: [95, 55, 80, 75], backgroundColor: '#1e293b' },
                { label: 'الخارجي', data: [65, 90, 99, 67], backgroundColor: '#059669' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// استقبال البيانات والبرامج من موقع تفاعلي خارجي
function receiveExternalInteractiveData(event) {
    if (event.data && event.data.type === "MASAAR_IMPORT_PROGRAMS") {
        const payload = event.data.payload; // [{sheet: "التوجيه الطلابي", data: [...]}]
        payload.forEach(item => {
            sendToGoogleSheets(item.sheet, item.data);
        });
        alert("✅ تم استقبال وتخزين البرامج من الموقع التفاعلي الخارجي بنجاح!");
        loadReportData();
    }
}

// وظائف نافذة الاستيراد المباشر
function openImportModal() { document.getElementById('importModal').classList.remove('hidden'); }
function closeImportModal() { document.getElementById('importModal').classList.add('hidden'); }

function processExternalImport() {
    try {
        const raw = document.getElementById('externalDataInput').value;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            parsed.forEach(item => sendToGoogleSheets(item.sheet || "التوجيه الطلابي", item.data));
            alert("✅ تم استيراد البيانات وإرسالها لقاعدة البيانات!");
            closeImportModal();
            loadReportData();
        }
    } catch (e) {
        alert("صيغة البيانات غير صحيحة، يرجى التأكد من تنسيق JSON.");
    }
}

// تصدير ملف Excel/CSV
function exportDataExcel() {
    let csv = "\uFEFFم,مسمى البرنامج,المستهدف,المنفذ,الحالة,المستفيدون,نسبة المشاركة\n1,برنامج الأسبوع التمهيدي,90,80,نقص,80,88%\n2,تعزيز السلوك الإيجابي,400,100,نفذ,100,25%";
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'تقرير_تحليل_واقع_المدرسة.csv';
    a.click();
}
