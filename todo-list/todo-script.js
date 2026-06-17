/* =====================================
   TO-DO LIST APPLICATION
   JavaScript Functionality
===================================== */

// تخزين المهام
let tasks = [];
let sortOrder = 'newest';
let currentFilter = 'all';
let searchTerm = '';

// عناصر DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const toast = document.getElementById('toast');

// تحميل المهام من Local Storage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// حفظ المهام في Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// إضافة مهمة جديدة
function addTask() {
    const text = taskInput.value.trim();
    
    if (!text) {
        showToast('❌ الرجاء إدخال مهمة');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: 'medium', // يمكن تغييره لاحقاً
        createdAt: new Date().toLocaleString('ar-EG'),
        dueDate: null
    };

    tasks.unshift(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateStats();
    showToast('✅ تمت إضافة المهمة بنجاح');
}

// حذف مهمة
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    showToast('🗑️ تم حذف المهمة');
}

// إكمال مهمة
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
        if (task.completed) {
            showToast('✅ تم إكمال المهمة');
        } else {
            showToast('↩️ تم إعادة تنشيط المهمة');
        }
    }
}

// تصفية المهام
function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
    
    // تحديث الأزرار
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
}

// البحث
function searchTasks(term) {
    searchTerm = term.toLowerCase();
    renderTasks();
}

// ترتيب المهام
function toggleSort() {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    sortBtn.textContent = sortOrder === 'newest' 
        ? '↕️ ترتيب: الأحدث أولاً' 
        : '↕️ ترتيب: الأقدم أولاً';
    renderTasks();
    showToast(sortOrder === 'newest' ? '📥 ترتيب: الأحدث أولاً' : '📤 ترتيب: الأقدم أولاً');
}

// حذف المهام المكتملة
function clearCompleted() {
    const before = tasks.length;
    tasks = tasks.filter(task => !task.completed);
    const removed = before - tasks.length;
    
    if (removed > 0) {
        saveTasks();
        renderTasks();
        updateStats();
        showToast(`🗑️ تم حذف ${removed} مهمة مكتملة`);
    } else {
        showToast('✓ لا توجد مهام مكتملة للحذف');
    }
}

// تحديث الإحصائيات
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// عرض الإشعارات
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// تصفية وترتيب المهام
function getFilteredAndSortedTasks() {
    let filtered = tasks;

    // التصفية حسب الحالة
    if (currentFilter === 'pending') {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
    }

    // البحث
    if (searchTerm) {
        filtered = filtered.filter(task => 
            task.text.toLowerCase().includes(searchTerm)
        );
    }

    // الترتيب
    if (sortOrder === 'oldest') {
        filtered.reverse();
    }

    return filtered;
}

// عرض المهام
function renderTasks() {
    const filtered = getFilteredAndSortedTasks();

    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        noResults.style.display = 'none';
        return;
    }

    if (filtered.length === 0) {
        emptyState.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    noResults.style.display = 'none';

    filtered.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskEl.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            >
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="priority-badge ${task.priority}">${getPriorityText(task.priority)}</span>
                    <span>📅 ${task.createdAt}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn delete" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;
        tasksList.appendChild(taskEl);
    });
}

// تحويل نص الأولوية
function getPriorityText(priority) {
    const priorities = {
        urgent: 'عاجل',
        high: 'مرتفع',
        medium: 'متوسط',
        low: 'منخفض'
    };
    return priorities[priority] || 'متوسط';
}

// تنظيف HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// تصدير المهام
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks_${new Date().toLocaleDateString('ar-EG')}.json`;
    link.click();
    showToast('📥 تم تصدير المهام');
}

// استيراد المهام
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                tasks = imported;
                saveTasks();
                renderTasks();
                updateStats();
                showToast(`📤 تم استيراد ${imported.length} مهمة`);
            } else {
                showToast('❌ صيغة الملف غير صحيحة');
            }
        } catch (error) {
            showToast('❌ خطأ في استيراد الملف');
            console.error(error);
        }
    };
    reader.readAsText(file);
    
    // إعادة تعيين الملف
    event.target.value = '';
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', (e) => {
    searchTasks(e.target.value);
});

sortBtn.addEventListener('click', toggleSort);
clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTasks(btn.dataset.filter);
    });
});

exportBtn.addEventListener('click', exportTasks);
importBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', importTasks);

// تحميل البيانات عند البدء
loadTasks();
renderTasks();
updateStats();