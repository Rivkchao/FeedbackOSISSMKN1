// YearNow
document.getElementById("year").textContent = new Date().getFullYear();

//Char counters 
function initCharCounter(textareaId, counterId) {
    const el = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (!el || !counter) return;
    el.addEventListener('input', () => {
        const len = el.value.length;
        counter.textContent = `${len} / 500`;
        counter.classList.toggle('warn', len >= 450);
    });
}
initCharCounter('positif', 'cc-positif');
initCharCounter('saran', 'cc-saran');

//Progress update
function updateProgress() {
    const fields = ['nama', 'kelas', 'jurusan', 'kegiatan', 'saran'];
    const hasRating = document.querySelector('input[name="rating"]:checked');
    let filled = fields.filter(id => {
        const el = document.getElementById(id);
        return el && el.value.trim() !== '';
    }).length + (hasRating ? 1 : 0);
    const total = fields.length + 1;
    const pct = Math.round((filled / total) * 100);
    document.getElementById('progress-fill').style.width = `${pct}%`;
    document.getElementById('step-pct').textContent = `${pct}%`;

    const step = pct < 45 ? 1 : pct < 80 ? 2 : 3;
    document.getElementById('step-label').textContent = `Langkah ${step} dari 3`;
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`dot-${i}`);
        dot.className = 'step-dot ' + (i < step ? 'done' : i === step ? 'active' : 'pending');
    }
}

document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
});

//Anonim toggle
let isAnon = false;
const anonToggle = document.getElementById('anon-toggle');
const anonThumb = document.getElementById('anon-thumb');
anonToggle.addEventListener('click', () => {
    isAnon = !isAnon;
    anonToggle.setAttribute('aria-checked', isAnon);
    anonToggle.classList.toggle('bg-brand-500', isAnon);
    anonToggle.classList.toggle('bg-ink-200', !isAnon);
    anonThumb.style.transform = isAnon ? 'translateX(20px)' : 'translateX(0)';
});

//Select label fix
document.querySelectorAll('.field-group select').forEach(sel => {
    sel.addEventListener('change', () => {
        sel.closest('.field-group').classList.toggle('has-value', sel.value !== '');
    });
});

//Validation helper
function setError(groupId, show) {
    const el = document.getElementById(groupId);
    if (!el) return;
    el.classList.toggle('error', show);
}
function showRatingError(show) {
    document.getElementById('rating-error').style.display = show ? 'block' : 'none';
    document.getElementById('emoji-grid').style.outline = show ? '2px solid #fca5a5' : 'none';
    document.getElementById('emoji-grid').style.borderRadius = show ? '14px' : '';
}

//Submit
document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    const jurusan = document.getElementById('jurusan').value;
    const kegiatan = document.getElementById('kegiatan').value;
    const rating = document.querySelector('input[name="rating"]:checked');
    const saran = document.getElementById('saran').value.trim();

    // Validate
    let valid = true;

    setError('fg-nama', !nama); if (!nama) valid = false;
    setError('fg-kelas', !kelas); if (!kelas) valid = false;
    setError('fg-jurusan', !jurusan); if (!jurusan) valid = false;
    setError('fg-kegiatan', !kegiatan); if (!kegiatan) valid = false;
    showRatingError(!rating); if (!rating) valid = false;
    setError('fg-saran', !saran); if (!saran) valid = false;

    if (!valid) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops, ada yang kurang!',
            text: 'Harap lengkapi semua kolom yang wajib diisi ya.',
            confirmButtonText: 'Oke, saya perbaiki',
            confirmButtonColor: '#3560ea',
            customClass: { popup: 'font-sans' },
        });

        //Scroll to first error
        const firstError = document.querySelector('.field-group.error, #emoji-grid[style*="2px"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    //Clear errors
    ['fg-nama', 'fg-kelas', 'fg-jurusan', 'fg-kegiatan', 'fg-saran'].forEach(id => setError(id, false));
    showRatingError(false);

    //Emoji map
    const emojiMap = { '1': '😡', '2': '😟', '3': '😐', '4': '😊', '5': '🤩' };
    const labelMap = { '1': 'Sangat Kecewa', '2': 'Kurang Puas', '3': 'Biasa Saja', '4': 'Puas', '5': 'Sangat Puas' };

    //Loading
    Swal.fire({
        title: 'Mengirim feedback...',
        text: 'Sebentar ya!',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => { Swal.showLoading(); },
        customClass: { popup: 'font-sans' },
    });

    //Simulate send
    const FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSe06jl9twCZyR7ynZDaH7nPBNKpmTxNyRBn7rTRImtVX16Kqg/formResponse';

    // Di dalam event listener 'submit', tepat setelah validasi:
    const formData = new FormData();
    formData.append('entry.824721340', isAnon ? '🎭 Anonim' : nama);
    formData.append('entry.130318823', kelas);
    formData.append('entry.287867008', jurusan);
    formData.append('entry.1763406822', kegiatan);
    formData.append('entry.191177856', rating.value);
    formData.append('entry.1632395372', document.getElementById('positif').value);
    formData.append('entry.892136975', saran);

    try {
        await fetch(FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });

        // Karena mode no-cors, kita asumsikan berhasil terkirim
        Swal.fire({
            icon: 'success',
            title: 'Feedback Terkirim! 🎉',
            html: `
            <div style="text-align:left; background:#f0f4ff; border-radius:14px; padding:14px 16px; margin-top:8px; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.875rem; line-height:1.8; color:#47475a;">
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #dce6fd; padding-bottom:8px; margin-bottom:8px;">
                <span style="color:#8e8ea8; font-weight:600;">Nama</span>
                <span style="font-weight:600; color:#24242e;">${isAnon ? '🎭 Anonim' : nama}</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #dce6fd; padding-bottom:8px; margin-bottom:8px;">
                <span style="color:#8e8ea8; font-weight:600;">Kegiatan</span>
                <span style="font-weight:600; color:#24242e;">${kegiatan}</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:#8e8ea8; font-weight:600;">Rating</span>
                <span style="font-weight:600; color:#24242e;">${emojiMap[rating.value]} ${labelMap[rating.value]}</span>
              </div>
            </div>
        `,
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#3560ea',
        }).then(() => {
            //Reset form
            document.getElementById('feedbackForm').reset();
            document.querySelectorAll('.field-group').forEach(fg => {
                fg.classList.remove('error', 'has-value');
            });
            showRatingError(false);
            ['cc-positif', 'cc-saran'].forEach(id => {
                document.getElementById(id).textContent = '0 / 500';
                document.getElementById(id).classList.remove('warn');
            });
            isAnon = false;
            anonToggle.setAttribute('aria-checked', false);
            anonToggle.classList.remove('bg-brand-500');
            anonToggle.classList.add('bg-ink-200');
            anonThumb.style.transform = 'translateX(0)';
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    } catch (error) {
        console.error('Error!', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal mengirim',
            text: 'Coba periksa koneksi internetmu ya.',
        });
    }
});

//Live clear error on input
['nama', 'kelas', 'jurusan', 'kegiatan', 'saran'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => setError(`fg-${id}`, false));
    el.addEventListener('change', () => setError(`fg-${id}`, false));
});
document.querySelectorAll('input[name="rating"]').forEach(r => {
    r.addEventListener('change', () => showRatingError(false));
});