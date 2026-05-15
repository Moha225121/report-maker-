document.addEventListener('DOMContentLoaded', () => {
    const driversBody = document.getElementById('drivers-body');
    const addRowBtn = document.getElementById('add-row-btn');
    const previewBtn = document.getElementById('preview-btn');
    const printBtn = document.getElementById('print-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewSection = document.getElementById('preview-section');
    
    // Inputs
    const fromCityInput = document.getElementById('from-city');
    const toCityInput = document.getElementById('to-city');
    const reportDateInput = document.getElementById('report-date');

    // Default row
    addRow();

    addRowBtn.addEventListener('click', addRow);

    function addRow() {
        const rowId = Date.now();
        const tr = document.createElement('tr');
        tr.id = `row-${rowId}`;
        tr.innerHTML = `
            <td class="row-number" data-label="#"></td>
            <td data-label="إسم السائق"><input type="text" class="driver-name" placeholder="اسم السائق"></td>
            <td data-label="رقم الرخصة"><input type="text" class="license-num" placeholder="رقم الرخصة"></td>
            <td data-label="نوع السيارة"><input type="text" class="car-type" placeholder="نوع السيارة"></td>
            <td data-label="لون السيارة"><input type="text" class="car-color" placeholder="لون السيارة"></td>
            <td data-label="رقم السيارة"><input type="text" class="car-num" placeholder="رقم السيارة"></td>
            <td data-label="نوع الحمولة"><input type="text" class="load-type" placeholder="نوع الحمولة"></td>
            <td>
                <button type="button" class="btn-remove" onclick="removeRow(${rowId})">×</button>
            </td>
        `;
        driversBody.appendChild(tr);
        updateRowNumbers();
    }

    window.removeRow = (id) => {
        const row = document.getElementById(`row-${id}`);
        if (driversBody.children.length > 1) {
            row.remove();
            updateRowNumbers();
        } else {
            alert('يجب أن يحتوي التقرير على سائق واحد على الأقل.');
        }
    };

    function updateRowNumbers() {
        const rows = driversBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('.row-number').textContent = index + 1;
        });
    }

    previewBtn.addEventListener('click', () => {
        updatePreview();
        previewSection.classList.remove('hidden');
        previewSection.scrollIntoView({ behavior: 'smooth' });
    });

    printBtn.addEventListener('click', async () => {
        updatePreview();
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        await new Promise(requestAnimationFrame);
        window.print();
    });

    downloadBtn.addEventListener('click', async () => {
        const originalBtnText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = 'جاري فتح نافذة الحفظ...';
        downloadBtn.disabled = true;

        updatePreview();
        const isHidden = previewSection.classList.contains('hidden');
        previewSection.classList.remove('hidden');

        try {
            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }

            await new Promise(requestAnimationFrame);
            window.print();
        } catch (err) {
            console.error('Print Error:', err);
            alert('حدث خطأ أثناء فتح نافذة الحفظ. يرجى المحاولة مرة أخرى.');
        } finally {
            setTimeout(() => {
                if (isHidden) previewSection.classList.add('hidden');
                downloadBtn.innerHTML = originalBtnText;
                downloadBtn.disabled = false;
            }, 500);
        }
    });

    function updatePreview() {
        // Update Header
        const dateVal = reportDateInput.value || '..../../..';
        document.querySelector('#view-report-title span').textContent = dateVal;
        document.getElementById('view-from').textContent = fromCityInput.value || '.......';
        document.getElementById('view-to').textContent = toCityInput.value || '.......';

        // Update Rows
        const viewRows = document.getElementById('view-rows');
        viewRows.innerHTML = '';

        const rows = driversBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const driverName = row.querySelector('.driver-name').value;
            const licenseNum = row.querySelector('.license-num').value;
            const carType = row.querySelector('.car-type').value;
            const carColor = row.querySelector('.car-color').value;
            const carNum = row.querySelector('.car-num').value;
            const loadType = row.querySelector('.load-type').value;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${driverName}</td>
                <td>${licenseNum}</td>
                <td>${carType}</td>
                <td>${carColor}</td>
                <td>${carNum}</td>
                <td>${loadType}</td>
            `;
            viewRows.appendChild(tr);
        });
    }
});
