const FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSe06jl9twCZyR7ynZDaH7nPBNKpmTxNyRBn7rTRImtVX16Kqg/formResponse';

// ===== STATE =====
let selectedRating = 0;
let isSubmitting = false;

// ===== ELEMENTS =====
const form = document.getElementById('feedback-form');
const stars = document.querySelectorAll('.star-btn');
const statusEl = document.getElementById('fb-message-status');
const submitBtn = document.getElementById('fb-submit');

// ===== STAR RATING =====
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.star);

        stars.forEach(s => {
            s.classList.remove('text-yellow-400', 'scale-110');
            s.classList.add('text-slate-300');
        });

        stars.forEach(s => {
            if (parseInt(s.dataset.star) <= selectedRating) {
                s.classList.remove('text-slate-300');
                s.classList.add('text-yellow-400', 'scale-110');
            }
        });

        updateProgress();
    });
});

// ===== PROGRESS =====
function updateProgress() {
    const name = document.getElementById('fb-name').value.trim();
    const category = document.getElementById('fb-category').value;
    const message = document.getElementById('fb-message').value.trim();

    let filled = 0;
    if (name) filled++;
    if (category) filled++;
    if (message) filled++;
    if (selectedRating > 0) filled++;

    const pct = Math.round((filled / 4) * 100);

    // Optional: bisa kamu tampilkan kalau mau
    console.log("Progress:", pct + "%");
}

// ===== STATUS UI =====
function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.classList.remove('hidden');

    statusEl.className = 'text-center text-sm font-bold p-3 rounded-2xl';

    if (type === 'success') {
        statusEl.classList.add('bg-green-100', 'text-green-600');
    } else if (type === 'error') {
        statusEl.classList.add('bg-red-100', 'text-red-600');
    } else {
        statusEl.classList.add('bg-slate-100', 'text-slate-600');
    }
}

// ===== VALIDATION =====
function validateForm(category, message) {
    if (selectedRating === 0) {
        showStatus('⭐ Pilih rating dulu ya!', 'error');
        return false;
    }
    if (!category) {
        showStatus('📂 Pilih kategori feedback.', 'error');
        return false;
    }
    if (!message) {
        showStatus('✍️ Isi pesan dulu ya.', 'error');
        return false;
    }
    return true;
}

// ===== SUBMIT =====
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (isSubmitting) return;

    const name = document.getElementById('fb-name').value.trim();
    const category = document.getElementById('fb-category').value;
    const message = document.getElementById('fb-message').value.trim();

    if (!validateForm(category, message)) return;

    isSubmitting = true;

    // BUTTON LOADING
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Mengirim...';
    submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

    showStatus('Mengirim aspirasi kamu...', 'loading');

    const formData = new FormData();

    formData.append('entry.824721340', name || '🎭 Anonim');
    formData.append('entry.191177856', selectedRating);
    formData.append('entry.1763406822', category);
    formData.append('entry.892136975', message);

    try {
        await fetch(FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });

        showStatus('🎉 Aspirasi berhasil dikirim! Terima kasih 🙌', 'success');

        // RESET FORM
        form.reset();
        selectedRating = 0;

        stars.forEach(s => {
            s.classList.remove('text-yellow-400', 'scale-110');
            s.classList.add('text-slate-300');
        });

        // SCROLL TOP (biar kelihatan feedback)
        window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });

    } catch (err) {
        console.error(err);
        showStatus('❌ Gagal mengirim. Coba lagi ya.', 'error');
    }

    // RESET BUTTON
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Kirim Aspirasi Saya';
    submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');

    isSubmitting = false;
});

// ===== LIVE UPDATE =====
['fb-name', 'fb-category', 'fb-message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', updateProgress);
    el.addEventListener('change', updateProgress);
});