// Firebase SDK 模組匯入 (新增 Auth 模組)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase 設定資訊
const firebaseConfig = {
  apiKey: "AIzaSyC1-PdiVSf86rt9BiCWJC5FyKtXQLqUbVs",
  authDomain: "to-do-4fab9.firebaseapp.com",
  projectId: "to-do-4fab9",
  storageBucket: "to-do-4fab9.firebasestorage.app",
  messagingSenderId: "546507802862",
  appId: "1:546507802862:web:d86e905dd9b24052a34bff",
  measurementId: "G-KRJE3K4Q3Q"
};

// 初始化 Firebase、Firestore 與 Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 全域使用者與資料監聽控制
let currentUser = null;
let unsubscribeFirestore = null;
let docRef = null;

// DOM 元素：Auth 登入相關
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoSection = document.getElementById('user-info');
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');

// 1. DOM 元素取得
const viewTitle = document.getElementById('view-title');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const todayBtn = document.getElementById('today-btn');
const navBtnsGroup = document.getElementById('nav-btns-group');

const viewMonthBtn = document.getElementById('view-month-btn');
const viewWeekBtn = document.getElementById('view-week-btn');
const viewMatrixBtn = document.getElementById('view-matrix-btn');
const viewSubtaskBtn = document.getElementById('view-subtask-btn');
const viewOverdueBtn = document.getElementById('view-overdue-btn');
const viewCourseBtn = document.getElementById('view-course-btn');

const monthView = document.getElementById('month-view');
const weekView = document.getElementById('week-view');
const matrixView = document.getElementById('matrix-view');
const overdueView = document.getElementById('overdue-view');
const overdueList = document.getElementById('overdue-list');

const subtaskView = document.getElementById('subtask-view');
const subtaskCalendarDays = document.getElementById('subtask-calendar-days');
const subtaskDateInput = document.getElementById('subtask-date-input');
const subtaskStartTime = document.getElementById('subtask-start-time');
const subtaskEndTime = document.getElementById('subtask-end-time');
const subtaskTaskInput = document.getElementById('subtask-task-input');
const subtaskDescInput = document.getElementById('subtask-desc-input');
const subtaskAddBtn = document.getElementById('subtask-add-btn');
const subtaskTimelineList = document.getElementById('subtask-timeline-list');

const courseView = document.getElementById('course-view');
const courseDaysGrid = document.getElementById('course-days-grid');
const coursePrevWeekBtn = document.getElementById('course-prev-week');
const courseNextWeekBtn = document.getElementById('course-next-week');
const courseWeekTitle = document.getElementById('course-week-title');
const openAddCourseBtn = document.getElementById('open-add-course-btn');

const courseModal = document.getElementById('course-modal');
const courseModalTitle = document.getElementById('course-modal-title');
const closeCourseModalBtn = document.getElementById('close-course-modal-btn');
const saveCourseBtn = document.getElementById('save-course-btn');
const deleteCourseBtn = document.getElementById('delete-course-btn');
const courseMasterList = document.getElementById('course-master-list');
const attendanceSection = document.getElementById('attendance-section');
const attSectionTitle = document.getElementById('att-section-title');
const masterCourseSection = document.getElementById('master-course-section');

const calendarDays = document.getElementById('calendar-days');
const weekHeaderRow = document.getElementById('week-header-row');
const timeLabels = document.getElementById('time-labels');
const weekColumns = document.getElementById('week-columns');

const q1List = document.getElementById('q1-list');
const q2List = document.getElementById('q2-list');
const q3List = document.getElementById('q3-list');
const q4List = document.getElementById('q4-list');

const taskModal = document.getElementById('task-modal');
const modalDateTitle = document.getElementById('modal-date-title');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalTaskDate = document.getElementById('modal-task-date');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const importantCheckbox = document.getElementById('important-checkbox');
const taskInput = document.getElementById('task-input');
const taskDescInput = document.getElementById('task-desc-input');
const addBtn = document.getElementById('add-btn');
const modalTaskList = document.getElementById('modal-task-list');

// 全域狀態
let currentMode = 'month';
let currentDate = new Date();
let selectedDateStr = formatDate(new Date());
let editingTaskId = null;
let editingCourseId = null;
let selectedAttDateStr = '';

// 學期時間範圍：2026/09/07 - 2026/12/25
const semesterStart = new Date('2026-09-07');
const semesterEnd = new Date('2026-12-25');
let currentWeekOffset = 0;

// 核心資料變數
let tasks = [];
let subtaskPageTasks = [];
let courses = [];
let courseAttendance = {};

// 頁面初始化
if (subtaskDateInput) subtaskDateInput.value = selectedDateStr;
initTimeLabels();

// 預先繪製一次空白月曆與畫面
renderView();

// ------------------------------------------------------------------
// Firebase Auth 登入 / 登出邏輯
// ------------------------------------------------------------------

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, googleProvider).catch((err) => {
      console.error("登入失敗:", err);
      alert("Google 登入失敗，請確認 Firebase Console 已啟用 Google 驗證服務！");
    });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert("已成功登出！");
    });
  });
}

// 監聽使用者 Auth 登入狀態
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 已登入狀態
    currentUser = user;
    if (userPhoto) userPhoto.src = user.photoURL || '';
    if (userName) userName.textContent = user.displayName || '使用者';
    if (userInfoSection) userInfoSection.style.display = 'flex';
    if (loginBtn) loginBtn.style.display = 'none';

    // 動態定錨當前使用者的專屬資料路徑
    docRef = doc(db, "users", currentUser.uid, "data", "miniTaskManagerData");

    // 啟動專屬資料雲端監聽
    if (unsubscribeFirestore) unsubscribeFirestore();
    unsubscribeFirestore = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        tasks = cloudData.tasks || [];
        subtaskPageTasks = cloudData.subtaskPageTasks || [];
        courses = cloudData.courses || [];
        courseAttendance = cloudData.courseAttendance || {};
      } else {
        // 如果是新使用者，初始清空
        tasks = [];
        subtaskPageTasks = [];
        courses = [];
        courseAttendance = {};
      }
      renderView();
    });

  } else {
    // 未登入狀態
    currentUser = null;
    if (userInfoSection) userInfoSection.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'flex';

    if (unsubscribeFirestore) unsubscribeFirestore();
    docRef = null;

    // 清空記憶體資料，繪製空白表格
    tasks = [];
    subtaskPageTasks = [];
    courses = [];
    courseAttendance = {};
    renderView();
  }
});

function saveAllDataToFirebase() {
  if (!currentUser || !docRef) {
    alert("請先登入 Google 帳號以儲存或更動行程資料！");
    return;
  }

  const payload = {
    tasks: tasks,
    subtaskPageTasks: subtaskPageTasks,
    courses: courses,
    courseAttendance: courseAttendance,
    updatedAt: new Date().toISOString()
  };

  setDoc(docRef, payload, { merge: true }).catch((err) => {
    console.error("Firebase 寫入失敗:", err);
  });
}

// Helper Functions
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatSlashDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

function formatPaddedSlashDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
}

function calculateCurrentSemesterWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(semesterStart);
  start.setHours(0, 0, 0, 0);
  if (today < start) return 0;
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekIndex = Math.floor(diffDays / 7);
  return Math.min(Math.max(weekIndex, 0), 15);
}

function sortTasksByChronologicalOrder(taskList) {
  return taskList.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const timeA = a.startTime || '00:00';
    const timeB = b.startTime || '00:00';
    return timeA.localeCompare(timeB);
  });
}

function isTaskUrgent(taskDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tDate = new Date(taskDateStr);
  tDate.setHours(0, 0, 0, 0);
  const diffTime = tDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
}

function initTimeLabels() {
  if (!timeLabels) return;
  timeLabels.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const label = document.createElement('div');
    label.className = 'time-label';
    const period = i < 12 ? 'AM' : 'PM';
    const hour = i % 12 === 0 ? 12 : i % 12;
    label.textContent = `${period}${hour}`;
    timeLabels.appendChild(label);
  }
}

function renderView() {
  if (monthView) monthView.classList.add('hidden');
  if (weekView) weekView.classList.add('hidden');
  if (matrixView) matrixView.classList.add('hidden');
  if (overdueView) overdueView.classList.add('hidden');
  if (subtaskView) subtaskView.classList.add('hidden');
  if (courseView) courseView.classList.add('hidden');
  if (navBtnsGroup) navBtnsGroup.style.display = 'flex';

  if (currentMode === 'month' && monthView) {
    monthView.classList.remove('hidden');
    renderCalendar();
  } else if (currentMode === 'week' && weekView) {
    weekView.classList.remove('hidden');
    renderWeekView();
  } else if (currentMode === 'matrix' && matrixView) {
    matrixView.classList.remove('hidden');
    if (navBtnsGroup) navBtnsGroup.style.display = 'none';
    if (viewTitle) viewTitle.textContent = 'Eisenhower Matrix 艾森豪象限表';
    renderMatrixView();
  } else if (currentMode === 'overdue' && overdueView) {
    overdueView.classList.remove('hidden');
    if (navBtnsGroup) navBtnsGroup.style.display = 'none';
    if (viewTitle) viewTitle.textContent = 'Overdue Tasks 逾期未完成事項';
    renderOverdueView();
  } else if (currentMode === 'subtask' && subtaskView) {
    subtaskView.classList.remove('hidden');
    renderSubtaskCalendar();
  } else if (currentMode === 'course' && courseView) {
    courseView.classList.remove('hidden');
    if (navBtnsGroup) navBtnsGroup.style.display = 'none';
    if (viewTitle) viewTitle.textContent = '115學年度 第一學期 課表 (115-1)';
    renderCourseView();
  }
}

function renderCalendar() {
  const targetContainer = document.getElementById('calendar-days');
  if (!targetContainer) return;

  targetContainer.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (viewTitle) {
    viewTitle.textContent = `${year}年 ${month + 1}月`;
  }

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = formatDate(new Date());

  // 1. 生成月初前空白格子
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day-cell empty';
    targetContainer.appendChild(emptyCell);
  }

  // 2. 渲染當月 1日 ~ 31日 表格內容
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';

    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'cell-header';

    const dayNumSpan = document.createElement('span');
    dayNumSpan.className = 'day-number';
    dayNumSpan.textContent = day;
    if (cellDateStr === todayStr) dayNumSpan.classList.add('today-num');

    headerDiv.appendChild(dayNumSpan);
    dayCell.appendChild(headerDiv);

    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'cell-tasks';

    let cellTasks = tasks.filter((t) => t.date === cellDateStr);
    cellTasks = sortTasksByChronologicalOrder(cellTasks);

    cellTasks.forEach((task) => {
      const taskBadge = document.createElement('div');
      taskBadge.className = 'task-badge';
      if (task.completed) taskBadge.classList.add('completed');

      if (!task.completed && task.color) {
        taskBadge.style.backgroundColor = task.color + '22';
        taskBadge.style.color = task.color;
        taskBadge.style.borderLeft = `3px solid ${task.color}`;
      }

      const impMark = task.important ? '❗ ' : '';
      const timeRange = task.startTime ? `${task.startTime} ` : '';
      taskBadge.textContent = `${impMark}${timeRange}${task.text}`;
      tasksContainer.appendChild(taskBadge);
    });

    dayCell.appendChild(tasksContainer);

    dayCell.addEventListener('click', () => {
      selectedDateStr = cellDateStr;
      openModal();
    });

    targetContainer.appendChild(dayCell);
  }
}

function getActiveCourseEventsForDate(dateStr) {
  const targetDate = new Date(dateStr);
  if (targetDate < semesterStart || targetDate > semesterEnd) return [];
  const dayOfWeek = targetDate.getDay();
  const matchedCourses = courses.filter((c) => Number(c.dayOfWeek) === dayOfWeek);

  const activeEvents = [];
  matchedCourses.forEach((c) => {
    const key = `${c.id}_${dateStr}`;
    const status = courseAttendance[key] || '出席';
    if (status !== '停課') {
      const isExam = status === '期中考' || status === '期末考';
      activeEvents.push({
        id: 'course_event_' + key,
        text: isExam ? `📝 ${c.name} ${status}` : `📚 ${c.name} (${c.location || ''})`,
        startTime: c.startTime,
        endTime: c.endTime,
        color: isExam ? '#eb5757' : (c.color || '#ffb6c1'),
        date: dateStr,
        isCourse: true
      });
    }
  });

  return activeEvents;
}

function renderCourseView() {
  if (!courseDaysGrid) return;
  courseDaysGrid.innerHTML = '';
  const weekStart = new Date(semesterStart);
  weekStart.setDate(semesterStart.getDate() + currentWeekOffset * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);

  const weekNum = currentWeekOffset + 1;
  if (courseWeekTitle) {
    courseWeekTitle.textContent = `第 ${weekNum} 週 (${formatSlashDate(weekStart)} - ${formatSlashDate(weekEnd)})`;
  }

  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const dayDateStr = formatDate(dayDate);
    const dayOfWeek = dayDate.getDay();

    const col = document.createElement('div');
    col.className = 'course-day-col';

    const header = document.createElement('div');
    header.className = 'course-day-header';
    header.textContent = formatPaddedSlashDate(dayDate);
    col.appendChild(header);

    const dayCourses = courses.filter((c) => Number(c.dayOfWeek) === dayOfWeek);

    dayCourses.forEach((c) => {
      const key = `${c.id}_${dayDateStr}`;
      const status = courseAttendance[key] || '出席';

      const card = document.createElement('div');
      card.className = 'course-card';
      if (status === '停課') card.classList.add('cancelled');

      if (status === '期中考' || status === '期末考') {
        card.style.backgroundColor = '#fce8e6';
        card.style.borderLeft = '5px solid #eb5757';
      } else {
        card.style.backgroundColor = '#f1f3f4';
        card.style.borderLeft = `4px solid ${c.color || '#ffb6c1'}`;
      }

      card.innerHTML = `
        <div class="course-name">${c.name}</div>
        <div class="course-time">🕒 ${c.startTime} - ${c.endTime}</div>
        ${c.location ? `<div class="course-loc">📍 ${c.location}</div>` : ''}
        <div class="course-status-badge ${status === '期中考' || status === '期末考' ? 'status-exam' : (status === '停課' ? 'status-cancelled' : '')}">狀態: ${status}</div>
      `;

      card.addEventListener('click', () => {
        openCourseEditModal(c, dayDateStr);
      });

      col.appendChild(card);
    });

    courseDaysGrid.appendChild(col);
  }
}

function openCourseEditModal(course = null, dateStr = '') {
  editingCourseId = course ? course.id : null;
  selectedAttDateStr = dateStr;

  if (course) {
    if (courseModalTitle) courseModalTitle.textContent = `編輯課程：${course.name}`;
    document.getElementById('c-name').value = course.name;
    document.getElementById('c-location').value = course.location || '';
    document.getElementById('c-dayofweek').value = course.dayOfWeek;
    document.getElementById('c-start-time').value = course.startTime;
    document.getElementById('c-end-time').value = course.endTime;
    document.getElementById('c-color').value = course.color || '#ffb6c1';

    if (deleteCourseBtn) deleteCourseBtn.style.display = 'block';

    if (dateStr) {
      if (attendanceSection) attendanceSection.style.display = 'block';
      const dateObj = new Date(dateStr);
      const currentAtt = courseAttendance[`${course.id}_${dateStr}`] || '出席';
      if (attSectionTitle) attSectionTitle.textContent = `日期 ${formatSlashDate(dateObj)} 出缺席與考試狀態 (目前：${currentAtt})`;
      updateModalButtonStates(currentAtt);
    } else {
      if (attendanceSection) attendanceSection.style.display = 'none';
    }

    if (masterCourseSection) masterCourseSection.style.display = 'none';
  } else {
    if (courseModalTitle) courseModalTitle.textContent = '新增 115-1 課程定義';
    document.getElementById('c-name').value = '';
    document.getElementById('c-location').value = '';
    document.getElementById('c-dayofweek').value = 1;
    document.getElementById('c-start-time').value = '13:20';
    document.getElementById('c-end-time').value = '16:20';
    document.getElementById('c-color').value = '#ffb6c1';

    if (deleteCourseBtn) deleteCourseBtn.style.display = 'none';
    if (attendanceSection) attendanceSection.style.display = 'none';
    if (masterCourseSection) masterCourseSection.style.display = 'block';
    renderCourseMasterList();
  }

  if (courseModal) courseModal.style.display = 'flex';
}

function updateModalButtonStates(currentStatus) {
  document.querySelectorAll('.att-status-btn').forEach((btn) => {
    const btnStatus = btn.getAttribute('data-status');
    if (btnStatus === currentStatus) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

document.querySelectorAll('.att-status-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!editingCourseId || !selectedAttDateStr) return;
    const clickedStatus = btn.getAttribute('data-status');
    const key = `${editingCourseId}_${selectedAttDateStr}`;
    const prevStatus = courseAttendance[key] || '出席';
    const course = courses.find((c) => c.id === editingCourseId);

    let newStatus = clickedStatus;
    if (prevStatus === clickedStatus) {
      newStatus = '出席';
    }

    courseAttendance[key] = newStatus;

    if (course) {
      const midExamTitle = `${course.name} 期中考`;
      const finalExamTitle = `${course.name} 期末考`;

      tasks = tasks.filter(
        (t) => !(t.date === selectedAttDateStr && (t.text === midExamTitle || t.text === finalExamTitle))
      );

      if (newStatus === '期中考' || newStatus === '期末考') {
        const examTitle = `${course.name} ${newStatus}`;
        tasks.push({
          id: 'exam_' + Date.now(),
          text: examTitle,
          description: `課堂 ${newStatus} (${course.location || ''})`,
          startTime: course.startTime,
          endTime: course.endTime,
          color: '#eb5757',
          important: true,
          completed: false,
          date: selectedAttDateStr
        });
      }
    }

    saveAllDataToFirebase();
    if (courseModal) courseModal.style.display = 'none';
    renderCourseView();
  });
});

if (openAddCourseBtn) openAddCourseBtn.addEventListener('click', () => { openCourseEditModal(null, ''); });
if (closeCourseModalBtn) closeCourseModalBtn.addEventListener('click', () => { if (courseModal) courseModal.style.display = 'none'; });

if (saveCourseBtn) {
  saveCourseBtn.addEventListener('click', () => {
    const name = document.getElementById('c-name').value.trim();
    const loc = document.getElementById('c-location').value.trim();
    const dow = document.getElementById('c-dayofweek').value;
    const sTime = document.getElementById('c-start-time').value;
    const eTime = document.getElementById('c-end-time').value;
    const color = document.getElementById('c-color').value;

    if (!name) {
      alert('請輸入課程名稱！');
      return;
    }

    if (editingCourseId) {
      const course = courses.find((c) => c.id === editingCourseId);
      if (course) {
        course.name = name;
        course.location = loc;
        course.dayOfWeek = Number(dow);
        course.startTime = sTime;
        course.endTime = eTime;
        course.color = color;
      }
    } else {
      const newCourse = {
        id: 'course_' + Date.now(),
        name: name,
        location: loc,
        dayOfWeek: Number(dow),
        startTime: sTime,
        endTime: eTime,
        color: color
      };
      courses.push(newCourse);
    }

    saveAllDataToFirebase();
    if (courseModal) courseModal.style.display = 'none';
    renderCourseMasterList();
    renderCourseView();
  });
}

if (deleteCourseBtn) {
  deleteCourseBtn.addEventListener('click', () => {
    if (!editingCourseId) return;
    if (confirm('確定要刪除這門課程嗎？這將會同步從課表中完全移除。')) {
      courses = courses.filter((c) => c.id !== editingCourseId);
      saveAllDataToFirebase();
      if (courseModal) courseModal.style.display = 'none';
      renderCourseView();
    }
  });
}

function renderCourseMasterList() {
  if (!courseMasterList) return;
  courseMasterList.innerHTML = '';
  courses.forEach((c) => {
    const li = document.createElement('li');
    li.className = 'modal-task-item';
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    li.innerHTML = `
      <span class="task-color-dot" style="background-color: ${c.color}"></span>
      <span class="task-text">${c.name} (週${dayNames[c.dayOfWeek]} ${c.startTime}-${c.endTime})</span>
      <button class="delete-btn" style="padding: 2px 6px;">刪除</button>
    `;

    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      courses = courses.filter((item) => item.id !== c.id);
      saveAllDataToFirebase();
      renderCourseMasterList();
      renderCourseView();
    });

    li.addEventListener('click', () => { openCourseEditModal(c, ''); });
    courseMasterList.appendChild(li);
  });
}

if (coursePrevWeekBtn) {
  coursePrevWeekBtn.addEventListener('click', () => {
    if (currentWeekOffset > 0) {
      currentWeekOffset--;
      renderCourseView();
    }
  });
}

if (courseNextWeekBtn) {
  courseNextWeekBtn.addEventListener('click', () => {
    if (currentWeekOffset < 15) {
      currentWeekOffset++;
      renderCourseView();
    }
  });
}

if (viewCourseBtn) {
  viewCourseBtn.addEventListener('click', () => {
    currentMode = 'course';
    currentWeekOffset = calculateCurrentSemesterWeek();
    setActiveNavBtn(viewCourseBtn);
    renderView();
  });
}

function renderWeekView() {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const year = startOfWeek.getFullYear();
  const month = startOfWeek.getMonth() + 1;
  if (viewTitle) viewTitle.textContent = `${year}年 ${month}月`;

  const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  if (weekHeaderRow) weekHeaderRow.innerHTML = '<div class="time-corner">GMT+8</div>';

  const weekDates = [];
  const todayStr = formatDate(new Date());

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = formatDate(d);
    weekDates.push({ dateObj: d, dateStr: dateStr });

    const headerCell = document.createElement('div');
    headerCell.className = 'week-header-cell';

    const dayName = document.createElement('span');
    dayName.textContent = weekDays[i];

    const dayNum = document.createElement('span');
    dayNum.className = 'week-day-num';
    dayNum.textContent = d.getDate();
    if (dateStr === todayStr) dayNum.classList.add('today-num');

    headerCell.appendChild(dayName);
    headerCell.appendChild(dayNum);
    if (weekHeaderRow) weekHeaderRow.appendChild(headerCell);
  }

  if (!weekColumns) return;
  weekColumns.innerHTML = '';
  weekDates.forEach(({ dateStr }) => {
    const col = document.createElement('div');
    col.className = 'week-column';

    for (let h = 0; h < 24; h++) {
      const hourGrid = document.createElement('div');
      hourGrid.className = 'hour-grid';
      col.appendChild(hourGrid);
    }

    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const dayCourseEvents = getActiveCourseEventsForDate(dateStr);
    const combinedWeekEvents = [...dayTasks, ...dayCourseEvents];

    const parsedTasks = combinedWeekEvents.map((task) => {
      const start = task.startTime || '09:00';
      const end = task.endTime || '10:00';
      const [sH, sM] = start.split(':').map(Number);
      const [eH, eM] = end.split(':').map(Number);
      const startMins = sH * 60 + sM;
      const endMins = eH * 60 + eM;
      return {
        ...task,
        startMins,
        endMins,
        duration: Math.max(endMins - startMins, 25)
      };
    });

    parsedTasks.sort((a, b) => a.startMins - b.startMins);

    parsedTasks.forEach((task) => {
      let overlapGroup = parsedTasks.filter(
        (other) => Math.max(task.startMins, other.startMins) < Math.min(task.endMins, other.endMins)
      );

      let groupIndex = overlapGroup.indexOf(task);
      let totalOverlaps = overlapGroup.length;

      const card = document.createElement('div');
      card.className = 'week-task-card';
      if (task.completed) card.classList.add('completed');

      const topPx = (task.startMins / 60) * 50;
      const heightPx = (task.duration / 60) * 50;

      card.style.top = `${topPx}px`;
      card.style.height = `${Math.max(heightPx, 36)}px`;

      if (totalOverlaps > 1) {
        const widthPercent = 85 / totalOverlaps;
        const leftPercent = groupIndex * (75 / totalOverlaps);
        card.style.width = `${widthPercent}%`;
        card.style.left = `${leftPercent}%`;
        card.style.zIndex = groupIndex + 3;
      } else {
        card.style.left = '2px';
        card.style.right = '2px';
        card.style.zIndex = 2;
      }

      if (!task.completed && task.color) {
        card.style.backgroundColor = task.color;
        card.style.borderLeft = `4px solid ${task.color}`;
        card.style.color = (task.color === '#ffb6c1' || task.color === '#fff0f3') ? '#202124' : '#ffffff';
      }

      const impText = task.important ? '❗ ' : '';
      card.innerHTML = `
        <div class="card-title">${impText}${task.text}</div>
        <div class="card-time">${task.startTime || '09:00'} - ${task.endTime || '10:00'}</div>
      `;

      if (!task.isCourse) {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedDateStr = task.date;
          openModalForEdit(task);
        });
      }

      col.appendChild(card);
    });

    col.addEventListener('click', (e) => {
      if (e.target === col || e.target.classList.contains('hour-grid')) {
        selectedDateStr = dateStr;
        openModal();
      }
    });

    weekColumns.appendChild(col);
  });

  updateCurrentTimeLine();
}

function getCombinedSubtaskTasks() {
  const combined = [];
  tasks.forEach((mainTask) => {
    const overrideTask = subtaskPageTasks.find((st) => st.originalId === mainTask.id);
    if (overrideTask) {
      if (!overrideTask.isDeletedInSubtaskView) combined.push(overrideTask);
    } else {
      combined.push({ ...mainTask, isSyncedFromMain: true });
    }
  });

  subtaskPageTasks.forEach((st) => {
    if (!st.originalId && !combined.some((c) => c.id === st.id)) {
      combined.push(st);
    }
  });

  return combined;
}

function renderSubtaskCalendar() {
  if (!subtaskCalendarDays) return;
  subtaskCalendarDays.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (viewTitle) viewTitle.textContent = `任務細項安排 - ${year}年 ${month + 1}月`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = formatDate(new Date());

  const allSubtaskViewTasks = getCombinedSubtaskTasks();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day-cell empty';
    subtaskCalendarDays.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';

    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'cell-header';

    const dayNumSpan = document.createElement('span');
    dayNumSpan.className = 'day-number';
    dayNumSpan.textContent = day;
    if (cellDateStr === todayStr) dayNumSpan.classList.add('today-num');

    headerDiv.appendChild(dayNumSpan);
    dayCell.appendChild(headerDiv);

    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'cell-tasks';

    let cellTasks = allSubtaskViewTasks.filter((t) => t.date === cellDateStr);
    cellTasks = sortTasksByChronologicalOrder(cellTasks);

    cellTasks.forEach((task) => {
      const taskBadge = document.createElement('div');
      if (task.isSubtask) {
        taskBadge.className = 'subtask-badge';
      } else {
        taskBadge.className = 'task-badge';
        if (!task.completed && task.color) {
          taskBadge.style.backgroundColor = task.color + '22';
          taskBadge.style.color = task.color;
          taskBadge.style.borderLeft = `3px solid ${task.color}`;
        }
      }

      if (task.completed) taskBadge.classList.add('completed');

      const timeRange = task.startTime ? `${task.startTime} ` : '';
      taskBadge.textContent = `${timeRange}${task.text}`;
      tasksContainer.appendChild(taskBadge);
    });

    dayCell.appendChild(tasksContainer);

    dayCell.addEventListener('click', () => {
      if (subtaskDateInput) subtaskDateInput.value = cellDateStr;
      renderSubtaskTimeline();
    });

    subtaskCalendarDays.appendChild(dayCell);
  }

  renderSubtaskTimeline();
}

function renderSubtaskTimeline() {
  if (!subtaskTimelineList) return;
  subtaskTimelineList.innerHTML = '';
  const selDate = (subtaskDateInput && subtaskDateInput.value) ? subtaskDateInput.value : formatDate(new Date());

  const allSubtasks = getCombinedSubtaskTasks();
  let daySubtasks = allSubtasks.filter((t) => t.date === selDate);
  daySubtasks = sortTasksByChronologicalOrder(daySubtasks);

  if (daySubtasks.length === 0) {
    subtaskTimelineList.innerHTML = '<div class="empty-msg">該日期尚無細項任務安排，請從上方新增！</div>';
    return;
  }

  daySubtasks.forEach((task) => {
    const row = document.createElement('div');
    row.className = 'timeline-row';
    if (task.completed) row.classList.add('completed');

    const left = document.createElement('div');
    left.className = 'timeline-time-col';
    left.textContent = `${task.startTime || '09:00'}-${task.endTime || '10:00'}`;

    const body = document.createElement('div');
    body.className = 'timeline-body-col';

    const textDiv = document.createElement('div');
    textDiv.className = 'timeline-text';
    textDiv.textContent = task.text;

    body.appendChild(textDiv);

    if (task.description) {
      const descDiv = document.createElement('div');
      descDiv.className = 'timeline-desc';
      descDiv.textContent = task.description;
      body.appendChild(descDiv);
    }

    const actions = document.createElement('div');
    actions.className = 'timeline-actions';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      updateOrAddSubtaskPageOverride(task, { completed: checkbox.checked });
      renderSubtaskCalendar();
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-reschedule btn-subtask-action';
    editBtn.style.padding = '2px 8px';
    editBtn.textContent = '編輯';
    editBtn.addEventListener('click', () => {
      const newText = prompt('修改細項頁面中的任務內容 (不會變更主任務)：', task.text);
      if (newText !== null && newText.trim() !== '') {
        updateOrAddSubtaskPageOverride(task, { text: newText.trim() });
        renderSubtaskCalendar();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.padding = '2px 8px';
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', () => {
      if (task.originalId) {
        updateOrAddSubtaskPageOverride(task, { isDeletedInSubtaskView: true });
      } else {
        subtaskPageTasks = subtaskPageTasks.filter((t) => t.id !== task.id);
        saveAllDataToFirebase();
      }
      renderSubtaskCalendar();
    });

    actions.appendChild(checkbox);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(left);
    row.appendChild(body);
    row.appendChild(actions);

    subtaskTimelineList.appendChild(row);
  });
}

function updateOrAddSubtaskPageOverride(task, changes) {
  let existingIndex = subtaskPageTasks.findIndex((st) => st.id === task.id || (task.originalId && st.originalId === task.originalId));

  if (existingIndex !== -1) {
    subtaskPageTasks[existingIndex] = { ...subtaskPageTasks[existingIndex], ...changes };
  } else {
    const override = {
      ...task,
      originalId: task.id,
      id: 'st_override_' + Date.now(),
      ...changes
    };
    subtaskPageTasks.push(override);
  }
  saveAllDataToFirebase();
}

if (subtaskAddBtn) {
  subtaskAddBtn.addEventListener('click', () => {
    const text = subtaskTaskInput.value.trim();
    const desc = subtaskDescInput.value.trim();
    const dateVal = subtaskDateInput.value;
    const startVal = subtaskStartTime.value;
    const endVal = subtaskEndTime.value;

    if (!text) {
      alert('請輸入細項任務內容！');
      return;
    }

    const newSubtask = {
      id: 'sub_' + Date.now(),
      text: text,
      description: desc,
      startTime: startVal,
      endTime: endVal,
      color: '#27ae60',
      date: dateVal,
      completed: false,
      isSubtask: true
    };

    subtaskPageTasks.push(newSubtask);
    saveAllDataToFirebase();
    subtaskTaskInput.value = '';
    subtaskDescInput.value = '';
    renderSubtaskCalendar();
  });
}

if (subtaskDateInput) {
  subtaskDateInput.addEventListener('change', () => {
    renderSubtaskTimeline();
  });
}

function renderMatrixView() {
  if (!q1List || !q2List || !q3List || !q4List) return;
  q1List.innerHTML = '';
  q2List.innerHTML = '';
  q3List.innerHTML = '';
  q4List.innerHTML = '';

  let activeTasks = tasks.filter((t) => !t.completed);
  activeTasks = sortTasksByChronologicalOrder(activeTasks);

  activeTasks.forEach((task) => {
    const urgent = isTaskUrgent(task.date);
    const important = !!task.important;

    const card = document.createElement('div');
    card.className = 'matrix-item';

    if (task.color) {
      card.style.borderLeft = `4px solid ${task.color}`;
    }

    const dateObj = new Date(task.date);
    card.innerHTML = `
      <div class="matrix-item-title">${task.text}</div>
      <div class="matrix-item-date">📅 ${formatSlashDate(dateObj)} [${task.startTime || '09:00'} - ${task.endTime || '10:00'}]</div>
      ${task.description ? `<div class="task-desc-preview">📝 ${task.description}</div>` : ''}
    `;

    card.addEventListener('click', () => {
      selectedDateStr = task.date;
      openModalForEdit(task);
    });

    if (important && urgent) q1List.appendChild(card);
    else if (important && !urgent) q2List.appendChild(card);
    else if (!important && !urgent) q3List.appendChild(card);
    else if (!important && urgent) q4List.appendChild(card);
  });
}

function renderOverdueView() {
  if (!overdueList) return;
  overdueList.innerHTML = '';
  const todayStr = formatDate(new Date());

  let overdueTasks = tasks.filter((t) => t.date < todayStr && !t.completed);
  overdueTasks = sortTasksByChronologicalOrder(overdueTasks);

  if (overdueTasks.length === 0) {
    overdueList.innerHTML = '<div class="empty-msg">🎉 太棒了！目前沒有逾期的未完成事項。</div>';
    return;
  }

  overdueTasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = 'overdue-item';
    if (task.color) {
      card.style.borderLeft = `5px solid ${task.color}`;
    }

    const leftSection = document.createElement('div');
    leftSection.className = 'overdue-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'overdue-checkbox';
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveAllDataToFirebase();
      renderOverdueView();
    });

    const infoDiv = document.createElement('div');
    infoDiv.className = 'overdue-info';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'overdue-title';
    titleSpan.textContent = `${task.important ? '❗ ' : ''}${task.text}`;

    const dateObj = new Date(task.date);
    const oldDateSpan = document.createElement('span');
    oldDateSpan.className = 'overdue-old-date';
    oldDateSpan.textContent = `原定日期：${formatSlashDate(dateObj)} (${task.startTime || '09:00'} - ${task.endTime || '10:00'})`;

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(oldDateSpan);

    if (task.description) {
      const descSpan = document.createElement('span');
      descSpan.className = 'task-desc-preview';
      descSpan.textContent = `📝 ${task.description}`;
      infoDiv.appendChild(descSpan);
    }

    leftSection.appendChild(checkbox);
    leftSection.appendChild(infoDiv);

    const rightSection = document.createElement('div');
    rightSection.className = 'overdue-right';

    const rescheduleBtn = document.createElement('button');
    rescheduleBtn.className = 'btn-reschedule';
    rescheduleBtn.textContent = '重新安排 (改期)';
    rescheduleBtn.addEventListener('click', () => {
      selectedDateStr = todayStr;
      openModalForEdit(task);
    });

    rightSection.appendChild(rescheduleBtn);

    card.appendChild(leftSection);
    card.appendChild(rightSection);

    overdueList.appendChild(card);
  });
}

function openModal() {
  editingTaskId = null;
  const dateObj = new Date(selectedDateStr);
  if (modalDateTitle) modalDateTitle.textContent = `${formatSlashDate(dateObj)} 行程管理`;
  if (modalTaskDate) modalTaskDate.value = selectedDateStr;
  if (startTimeInput) startTimeInput.value = '09:00';
  if (endTimeInput) endTimeInput.value = '10:00';
  if (taskInput) taskInput.value = '';
  if (taskDescInput) taskDescInput.value = '';
  if (importantCheckbox) importantCheckbox.checked = false;
  if (addBtn) addBtn.textContent = '新增行程';
  renderModalTasks();
  if (taskModal) taskModal.style.display = 'flex';
}

function openModalForEdit(task) {
  editingTaskId = task.id;
  selectedDateStr = task.date;
  if (modalDateTitle) modalDateTitle.textContent = `編輯行程：${task.text}`;
  if (modalTaskDate) modalTaskDate.value = task.date;
  if (startTimeInput) startTimeInput.value = task.startTime || '09:00';
  if (endTimeInput) endTimeInput.value = task.endTime || '10:00';
  if (taskInput) taskInput.value = task.text;
  if (taskDescInput) taskDescInput.value = task.description || '';
  if (importantCheckbox) importantCheckbox.checked = !!task.important;

  const colorRadios = document.querySelectorAll('input[name="color-option"]');
  colorRadios.forEach((r) => {
    r.checked = r.value === (task.color || '#1a73e8');
  });

  if (addBtn) addBtn.textContent = '儲存修改';
  renderModalTasks();
  if (taskModal) taskModal.style.display = 'flex';
}

function closeModal() {
  if (taskModal) taskModal.style.display = 'none';
  editingTaskId = null;
  renderView();
}

function renderModalTasks() {
  if (!modalTaskList) return;
  modalTaskList.innerHTML = '';
  let filteredTasks = tasks.filter((t) => t.date === selectedDateStr);
  filteredTasks = sortTasksByChronologicalOrder(filteredTasks);

  if (filteredTasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-msg';
    empty.textContent = '本日尚無行程';
    modalTaskList.appendChild(empty);
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'modal-task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveAllDataToFirebase();
      renderModalTasks();
    });

    const colorDot = document.createElement('span');
    colorDot.className = 'task-color-dot';
    colorDot.style.backgroundColor = task.color || '#1a73e8';

    const span = document.createElement('span');
    span.className = 'task-text';
    if (task.completed) span.classList.add('completed');
    const impMark = task.important ? ' [重要]' : '';
    const timeStr = task.startTime ? `[${task.startTime}-${task.endTime}] ` : '';
    span.textContent = `${timeStr}${task.text}${impMark}`;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-reschedule';
    editBtn.style.padding = '2px 6px';
    editBtn.textContent = '編輯';
    editBtn.addEventListener('click', () => {
      openModalForEdit(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveAllDataToFirebase();
      renderModalTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(colorDot);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    modalTaskList.appendChild(li);
  });
}

function saveOrAddTask() {
  const text = taskInput.value.trim();
  const desc = taskDescInput.value.trim();
  const targetDate = modalTaskDate.value;
  const startVal = startTimeInput.value;
  const endVal = endTimeInput.value;
  const isImp = importantCheckbox.checked;

  const selectedColorInput = document.querySelector('input[name="color-option"]:checked');
  const colorVal = selectedColorInput ? selectedColorInput.value : '#1a73e8';

  if (!text) {
    alert('請輸入任務內容！');
    return;
  }

  if (startVal >= endVal) {
    alert('結束時間必須晚於開始時間！');
    return;
  }

  if (editingTaskId) {
    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.text = text;
      task.description = desc;
      task.date = targetDate;
      task.startTime = startVal;
      task.endTime = endVal;
      task.important = isImp;
      task.color = colorVal;
    }
  } else {
    const newTask = {
      id: Date.now(),
      text: text,
      description: desc,
      startTime: startVal,
      endTime: endVal,
      color: colorVal,
      important: isImp,
      completed: false,
      date: targetDate
    };
    tasks.push(newTask);
  }

  saveAllDataToFirebase();
  closeModal();
}

function updateCurrentTimeLine() {
  const existingLine = document.querySelector('.time-indicator-line');
  if (existingLine) existingLine.remove();

  if (currentMode !== 'week') return;

  const now = new Date();
  const todayStr = formatDate(now);

  const weekDaysCols = document.querySelectorAll('.week-column');
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    if (formatDate(d) === todayStr && weekDaysCols[i]) {
      const hrs = now.getHours();
      const mins = now.getMinutes();
      const topPx = hrs * 50 + (mins / 60) * 50;

      const line = document.createElement('div');
      line.className = 'time-indicator-line';
      line.style.top = `${topPx}px`;

      const badge = document.createElement('span');
      badge.className = 'time-badge';
      badge.textContent = `${hrs}:${String(mins).padStart(2, '0')}`;

      line.appendChild(badge);
      weekDaysCols[i].appendChild(line);

      const weekScroll = document.querySelector('.week-body-scroll');
      if (weekScroll && !weekScroll.dataset.scrolled) {
        weekScroll.scrollTop = topPx - 150;
        weekScroll.dataset.scrolled = 'true';
      }
      break;
    }
  }
}

// 事件綁定
if (addBtn) addBtn.addEventListener('click', saveOrAddTask);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal();
  if (e.target === courseModal && courseModal) courseModal.style.display = 'none';
});

if (viewMonthBtn) {
  viewMonthBtn.addEventListener('click', () => {
    currentMode = 'month';
    setActiveNavBtn(viewMonthBtn);
    renderView();
  });
}

if (viewWeekBtn) {
  viewWeekBtn.addEventListener('click', () => {
    currentMode = 'week';
    setActiveNavBtn(viewWeekBtn);
    renderView();
  });
}

if (viewMatrixBtn) {
  viewMatrixBtn.addEventListener('click', () => {
    currentMode = 'matrix';
    setActiveNavBtn(viewMatrixBtn);
    renderView();
  });
}

if (viewSubtaskBtn) {
  viewSubtaskBtn.addEventListener('click', () => {
    currentMode = 'subtask';
    setActiveNavBtn(viewSubtaskBtn);
    renderView();
  });
}

if (viewOverdueBtn) {
  viewOverdueBtn.addEventListener('click', () => {
    currentMode = 'overdue';
    setActiveNavBtn(viewOverdueBtn);
    renderView();
  });
}

function setActiveNavBtn(activeBtn) {
  const allBtns = document.querySelectorAll('.sidebar .nav-btn');
  allBtns.forEach((btn) => btn.classList.remove('active'));
  activeBtn.classList.add('active');
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
}

// 行動版側邊欄控制
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (sidebar) sidebar.classList.add('open');
  if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  document.body.classList.add('sidebar-open');
}

function closeSidebar() {
  if (sidebar) sidebar.classList.remove('open');
  if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  document.body.classList.remove('sidebar-open');
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
    closeModal();
    if (courseModal) courseModal.style.display = 'none';
  }
});

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentMode === 'month' || currentMode === 'subtask') {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentMode === 'week') {
      currentDate.setDate(currentDate.getDate() - 7);
    }
    renderView();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentMode === 'month' || currentMode === 'subtask') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentMode === 'week') {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    renderView();
  });
}

if (todayBtn) {
  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    renderView();
  });
}