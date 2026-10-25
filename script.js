// Firebase SDK 模組匯入
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let currentUser = null;
let unsubscribeFirestore = null;
let docRef = null;

// DOM 元素
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoSection = document.getElementById('user-info');
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');

const sidebarLoginBtn = document.getElementById('sidebar-login-btn');
const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');
const sidebarUserInfo = document.getElementById('sidebar-user-info');
const sidebarUserPhoto = document.getElementById('sidebar-user-photo');
const sidebarUserName = document.getElementById('sidebar-user-name');

const viewTitle = document.getElementById('view-title');
const viewGuideText = document.getElementById('view-guide-text');
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

const colorLegendWrapper = document.getElementById('color-legend-wrapper');
const colorLegendBar = document.getElementById('color-legend-bar');
const showLegendContainer = document.getElementById('show-legend-container');
const btnShowLegend = document.getElementById('btn-show-legend');
const btnToggleLegend = document.getElementById('btn-toggle-legend');
const btnLegendAddColor = document.getElementById('btn-legend-add-color');
const legendItems = document.getElementById('legend-items');

const subtaskView = document.getElementById('subtask-view');
const subtaskCalendarDays = document.getElementById('subtask-calendar-days');
const subtaskDateInput = document.getElementById('subtask-date-input');
const subtaskStartTime = document.getElementById('subtask-start-time');
const subtaskEndTime = document.getElementById('subtask-end-time');
const subtaskTaskInput = document.getElementById('subtask-task-input');
const subtaskDescInput = document.getElementById('subtask-desc-input');
const subtaskAddBtn = document.getElementById('subtask-add-btn');
const subtaskTimelineList = document.getElementById('subtask-timeline-list');

const subtaskEditModal = document.getElementById('subtask-edit-modal');
const closeSubtaskEditModalBtn = document.getElementById('close-subtask-edit-modal-btn');
const subtaskEditDate = document.getElementById('subtask-edit-date');
const subtaskEditStartTime = document.getElementById('subtask-edit-start-time');
const subtaskEditEndTime = document.getElementById('subtask-edit-end-time');
const subtaskEditTaskInput = document.getElementById('subtask-edit-task-input');
const subtaskEditDescInput = document.getElementById('subtask-edit-desc-input');
const subtaskEditSaveBtn = document.getElementById('subtask-edit-save-btn');
const subtaskEditCancelBtn = document.getElementById('subtask-edit-cancel-btn');

const courseView = document.getElementById('course-view');
const courseDaysGrid = document.getElementById('course-days-grid');
const coursePrevWeekBtn = document.getElementById('course-prev-week');
const courseNextWeekBtn = document.getElementById('course-next-week');
const courseWeekTitle = document.getElementById('course-week-title');
const courseTodayBtn = document.getElementById('course-today-btn');
const openAddCourseBtn = document.getElementById('open-add-course-btn');
const semesterTabsBar = document.getElementById('semester-tabs-bar');
const toggleLinkWeekBtn = document.getElementById('toggle-link-week-btn');
const openAddSemesterBtn = document.getElementById('open-add-semester-btn');
const editSemesterInfoBtn = document.getElementById('edit-semester-info-btn');

const courseModal = document.getElementById('course-modal');
const courseModalTitle = document.getElementById('course-modal-title');
const closeCourseModalBtn = document.getElementById('close-course-modal-btn');
const saveCourseBtn = document.getElementById('save-course-btn');
const deleteCourseBtn = document.getElementById('delete-course-btn');
const courseMasterList = document.getElementById('course-master-list');
const attendanceSection = document.getElementById('attendance-section');
const attSectionTitle = document.getElementById('att-section-title');
const masterCourseSection = document.getElementById('master-course-section');

const semesterModal = document.getElementById('semester-modal');
const semesterModalTitle = document.getElementById('semester-modal-title');
const closeSemesterModalBtn = document.getElementById('close-semester-modal-btn');
const saveSemesterBtn = document.getElementById('save-semester-btn');
const deleteSemesterBtn = document.getElementById('delete-semester-btn');

const guideModal = document.getElementById('guide-modal');
const guideModalTitle = document.getElementById('guide-modal-title');
const guideModalIcon = document.getElementById('guide-modal-icon');
const guideModalDesc = document.getElementById('guide-modal-desc');
const closeGuideModalBtn = document.getElementById('close-guide-modal-btn');

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
const modalTaskStartDate = document.getElementById('modal-task-start-date');
const modalTaskEndDate = document.getElementById('modal-task-end-date');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const importantCheckbox = document.getElementById('important-checkbox');
const taskInput = document.getElementById('task-input');
const taskDescInput = document.getElementById('task-desc-input');
const addBtn = document.getElementById('add-btn');
const modalTaskList = document.getElementById('modal-task-list');

const modalColorPickerGroup = document.getElementById('modal-color-picker-group');
const modalCustomColorInput = document.getElementById('modal-custom-color-input');
const btnAddModalColor = document.getElementById('btn-add-modal-color');

// 全域狀態
let currentMode = 'month';
let currentDate = new Date();
let selectedDateStr = formatDate(new Date());
let editingTaskId = null;
let editingCourseId = null;
let selectedAttDateStr = '';
let editingSubtaskTarget = null;

const DEFAULT_COLOR_LEGENDS = [
  { id: 'c-blue', color: '#1a73e8', label: '自己的行程' },
  { id: 'c-yellow', color: '#f2994a', label: '報告' },
  { id: 'c-red', color: '#eb5757', label: '期中/期末考' },
  { id: 'c-purple', color: '#9b51e0', label: '社團/校園大使' }
];

let colorLegends = JSON.parse(localStorage.getItem('calendar_color_legends') || 'null') || [...DEFAULT_COLOR_LEGENDS];
let isLegendHidden = JSON.parse(localStorage.getItem('calendar_is_legend_hidden') || 'false');

// 多學期結構
let semesters = [
  {
    id: 'sem_115_1',
    name: '115-1',
    startDate: '2026-09-07',
    endDate: '2026-12-25',
    isLinkedToWeek: true,
    courses: [
      { id: 'c1', name: '組織行為-E', location: 'E1-306', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', color: '#ffb6c1' },
      { id: 'c2', name: '邏輯思考概論-A', location: 'TR-412-1', dayOfWeek: 1, startTime: '13:00', endTime: '15:00', color: '#f28b82' },
      { id: 'c5', name: '經濟學 (上)', location: 'IB-409-1', dayOfWeek: 2, startTime: '13:20', endTime: '16:20', color: '#ffb6c1' }
    ]
  }
];

let selectedSemesterId = 'sem_115_1';
let editingSemesterId = null;
let currentWeekOffset = 0;

let tasks = [];
let subtaskPageTasks = [];
let courseAttendance = {};

if (subtaskDateInput) subtaskDateInput.value = selectedDateStr;
initTimeLabels();
renderView();

// Firebase Auth
const handleSignIn = () => {
  signInWithPopup(auth, googleProvider).catch((err) => {
    console.error("登入失敗:", err);
    alert("Google 登入失敗！");
  });
};

const handleSignOut = () => {
  signOut(auth).then(() => alert("已成功登出！"));
};

if (loginBtn) loginBtn.addEventListener('click', handleSignIn);
if (sidebarLoginBtn) sidebarLoginBtn.addEventListener('click', handleSignIn);
if (logoutBtn) logoutBtn.addEventListener('click', handleSignOut);
if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleSignOut);

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    if (userPhoto) userPhoto.src = user.photoURL || '';
    if (userName) userName.textContent = user.displayName || '使用者';
    if (userInfoSection) userInfoSection.style.display = 'flex';
    if (loginBtn) loginBtn.style.display = 'none';

    if (sidebarUserPhoto) sidebarUserPhoto.src = user.photoURL || '';
    if (sidebarUserName) sidebarUserName.textContent = user.displayName || '使用者';
    if (sidebarUserInfo) sidebarUserInfo.style.display = 'flex';
    if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'none';

    docRef = doc(db, "users", currentUser.uid, "data", "miniTaskManagerData");

    if (unsubscribeFirestore) unsubscribeFirestore();
    unsubscribeFirestore = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        tasks = cloudData.tasks || [];
        subtaskPageTasks = cloudData.subtaskPageTasks || [];
        semesters = cloudData.semesters || semesters;
        selectedSemesterId = cloudData.selectedSemesterId || selectedSemesterId;
        courseAttendance = cloudData.courseAttendance || {};
        if (cloudData.colorLegends && Array.isArray(cloudData.colorLegends)) {
          colorLegends = cloudData.colorLegends;
          localStorage.setItem('calendar_color_legends', JSON.stringify(colorLegends));
        }
        if (cloudData.isLegendHidden !== undefined) {
          isLegendHidden = !!cloudData.isLegendHidden;
          localStorage.setItem('calendar_is_legend_hidden', JSON.stringify(isLegendHidden));
        }
      }
      renderView();
    });

  } else {
    currentUser = null;
    if (userInfoSection) userInfoSection.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'flex';

    if (sidebarUserInfo) sidebarUserInfo.style.display = 'none';
    if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'block';

    if (unsubscribeFirestore) unsubscribeFirestore();
    docRef = null;
    tasks = [];
    subtaskPageTasks = [];
    courseAttendance = {};
    renderView();
  }
});

function saveAllDataToFirebase(showAlertIfLoggedOut = false) {
  try {
    localStorage.setItem('calendar_color_legends', JSON.stringify(colorLegends));
    localStorage.setItem('calendar_is_legend_hidden', JSON.stringify(isLegendHidden));
  } catch (e) {
    console.warn("localStorage write error:", e);
  }

  if (!currentUser || !docRef) {
    if (showAlertIfLoggedOut) {
      alert("提示：登入 Google 帳號可將資料與雲端即時同步！");
    }
    return;
  }

  const payload = {
    tasks: tasks,
    subtaskPageTasks: subtaskPageTasks,
    semesters: semesters,
    selectedSemesterId: selectedSemesterId,
    courseAttendance: courseAttendance,
    colorLegends: colorLegends,
    isLegendHidden: isLegendHidden,
    updatedAt: new Date().toISOString()
  };

  setDoc(docRef, payload, { merge: true }).catch((err) => {
    console.error("Firebase 寫入失敗:", err);
  });
}

// Helpers
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatSlashDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatPaddedSlashDate(date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

function getCurrentSemester() {
  return semesters.find((s) => s.id === selectedSemesterId) || semesters[0];
}

function getLinkedSemester() {
  return semesters.find((s) => s.isLinkedToWeek);
}

function calculateMaxWeeks(sem) {
  if (!sem) return 16;
  const start = new Date(sem.startDate);
  const end = new Date(sem.endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(Math.ceil(diffDays / 7), 1);
}

function calculateCurrentSemesterWeek(sem) {
  if (!sem) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(sem.startDate);
  start.setHours(0, 0, 0, 0);
  if (today < start) return 0;
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const maxWeeks = calculateMaxWeeks(sem);
  return Math.min(Math.max(Math.floor(diffDays / 7), 0), maxWeeks - 1);
}

function sortTasksByChronologicalOrder(taskList) {
  return taskList.sort((a, b) => {
    const dateA = a.startDate || a.date || '';
    const dateB = b.startDate || b.date || '';
    if (dateA !== dateB) return dateA.localeCompare(dateB);
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
  return Math.ceil((tDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 7;
}

function isTaskInDate(task, targetDateStr) {
  const start = task.startDate || task.date;
  const end = task.endDate || task.startDate || task.date;
  if (!start) return false;
  return targetDateStr >= start && targetDateStr <= (end || start);
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

// 行動端頁面首次點擊的引導彈窗說明
function checkAndShowMobileGuide(mode) {
  if (window.innerWidth > 768) return;

  const key = `mobile_guide_shown_${mode}`;
  if (localStorage.getItem(key)) return;

  const guideInfos = {
    month: { title: '📅 主月檢視指南', icon: '📅', desc: '此頁面用於規劃與管理主要任務與長期行程，點擊任意日期即可開始新增或修改行程。' },
    week: { title: '📊 周檢視指南', icon: '📊', desc: '此頁面自動整合主要任務與學期課表，提供週次時間軸檢視，掌握一週精確時間安排。' },
    matrix: { title: '📌 艾森豪象限表指南', icon: '📌', desc: '依緊急性與重要性自動分類任務優先順序，讓您優先處理重要且緊急的事項。' },
    course: { title: '🎓 課程頁面指南', icon: '🎓', desc: '可新增學期方案與每週課程，記錄每日出缺席與考試狀態，並可啟用連結至周檢視。' },
    subtask: { title: '📝 任務細項安排指南', icon: '📝', desc: '單向修改或新增僅屬於本頁面的細項劃分，不影響主月檢視的大任務架構。' },
    overdue: { title: '⚠️ 逾期事項指南', icon: '⚠️', desc: '彙整所有已過期且未完成的事項，可在此快捷改期或打勾標示完成。' }
  };

  const info = guideInfos[mode];
  if (info) {
    guideModalTitle.textContent = info.title;
    guideModalIcon.textContent = info.icon;
    guideModalDesc.textContent = info.desc;
    guideModal.style.display = 'flex';
    localStorage.setItem(key, 'true');
  }
}

if (closeGuideModalBtn) {
  closeGuideModalBtn.addEventListener('click', () => {
    guideModal.style.display = 'none';
  });
}

function renderView() {
  if (monthView) monthView.classList.add('hidden');
  if (weekView) weekView.classList.add('hidden');
  if (matrixView) matrixView.classList.add('hidden');
  if (overdueView) overdueView.classList.add('hidden');
  if (subtaskView) subtaskView.classList.add('hidden');
  if (courseView) courseView.classList.add('hidden');

  if (navBtnsGroup) navBtnsGroup.style.display = 'flex';
  if (todayBtn) todayBtn.style.display = 'inline-block';

  checkAndShowMobileGuide(currentMode);

  if (currentMode === 'month' && monthView) {
    monthView.classList.remove('hidden');
    if (viewGuideText) viewGuideText.textContent = '此頁面用於規劃與管理主要任務與長期行程。';
    renderCalendar();
    renderColorLegend();
  } else if (currentMode === 'week' && weekView) {
    weekView.classList.remove('hidden');
    if (viewGuideText) viewGuideText.textContent = '此頁面自動整合主要任務與學期課表，提供週次時間軸檢視。';
    renderWeekView();
  } else if (currentMode === 'matrix' && matrixView) {
    matrixView.classList.remove('hidden');
    if (navBtnsGroup) navBtnsGroup.style.display = 'none';
    if (todayBtn) todayBtn.style.display = 'none';
    if (viewTitle) viewTitle.textContent = 'Eisenhower Matrix 艾森豪象限表';
    if (viewGuideText) viewGuideText.textContent = '依緊急性與重要性分類任務優先順序';
    renderMatrixView();
  } else if (currentMode === 'overdue' && overdueView) {
    overdueView.classList.remove('hidden');
    if (navBtnsGroup) navBtnsGroup.style.display = 'none';
    if (todayBtn) todayBtn.style.display = 'none';
    if (viewTitle) viewTitle.textContent = 'Overdue Tasks 逾期未完成事項';
    if (viewGuideText) viewGuideText.textContent = '';
    renderOverdueView();
  } else if (currentMode === 'subtask' && subtaskView) {
    subtaskView.classList.remove('hidden');
    if (viewGuideText) viewGuideText.textContent = '可在此頁面單向修改或新增僅屬於本頁面的任務，不連動到主月檢視的大任務頁面';
    renderSubtaskCalendar();
  } else if (currentMode === 'course' && courseView) {
    courseView.classList.remove('hidden');
    if (navBtnsGroup) navBtnsGroup.style.display = 'none';
    if (todayBtn) todayBtn.style.display = 'none';
    const curSem = getCurrentSemester();
    if (viewTitle) viewTitle.textContent = `🎓 課程管理頁面 (${curSem ? curSem.name : ''})`;
    if (viewGuideText) viewGuideText.textContent = '新增不同學年的課程，並切換啟用哪一個學期連結至周檢視。';
    renderCourseView();
  }
}

function renderColorLegend() {
  if (!colorLegendBar || !legendItems) return;

  if (isLegendHidden) {
    colorLegendBar.style.display = 'none';
    if (showLegendContainer) showLegendContainer.style.display = 'block';
  } else {
    colorLegendBar.style.display = 'flex';
    if (showLegendContainer) showLegendContainer.style.display = 'none';
  }

  legendItems.innerHTML = '';
  colorLegends.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'legend-item';
    itemDiv.title = '點擊修改此色彩所代表的意義';

    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.backgroundColor = item.color;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'legend-label-text';
    labelSpan.textContent = item.label;

    const editIcon = document.createElement('span');
    editIcon.className = 'legend-edit-icon';
    editIcon.textContent = '✏️';

    itemDiv.appendChild(dot);
    itemDiv.appendChild(labelSpan);
    itemDiv.appendChild(editIcon);

    if (index >= 4 || !['c-blue', 'c-yellow', 'c-red', 'c-purple'].includes(item.id)) {
      const delBtn = document.createElement('button');
      delBtn.className = 'legend-del-btn';
      delBtn.textContent = '✕';
      delBtn.title = '刪除此自訂色彩';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`確定要刪除「${item.label}」色彩標籤嗎？`)) {
          colorLegends = colorLegends.filter((c) => c !== item);
          saveAllDataToFirebase();
          renderColorLegend();
          renderModalColorPicker();
        }
      });
      itemDiv.appendChild(delBtn);
    }

    itemDiv.addEventListener('click', () => {
      const newLabel = prompt(`自訂【${item.label}】所代表的意義：`, item.label);
      if (newLabel !== null && newLabel.trim()) {
        item.label = newLabel.trim();
        saveAllDataToFirebase();
        renderColorLegend();
        renderModalColorPicker();
      }
    });

    legendItems.appendChild(itemDiv);
  });
}

function renderModalColorPicker(activeColor = '#1a73e8') {
  if (!modalColorPickerGroup) return;
  modalColorPickerGroup.innerHTML = '';

  let matched = false;
  colorLegends.forEach((item, index) => {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'color-option';
    radio.id = `modal-col-${item.id || index}`;
    radio.value = item.color;
    if (item.color === activeColor || (!matched && index === colorLegends.length - 1)) {
      radio.checked = true;
      matched = true;
    }

    const label = document.createElement('label');
    label.htmlFor = radio.id;
    label.className = 'color-circle';
    label.style.backgroundColor = item.color;
    label.title = item.label || '色彩分類';

    modalColorPickerGroup.appendChild(radio);
    modalColorPickerGroup.appendChild(label);
  });
}

function renderCalendar() {
  if (!calendarDays) return;
  calendarDays.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (viewTitle) viewTitle.textContent = `${year}年 ${month + 1}月`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = formatDate(new Date());

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day-cell empty';
    calendarDays.appendChild(emptyCell);
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

    let cellTasks = tasks.filter((t) => isTaskInDate(t, cellDateStr));
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
      const isMultiDay = task.startDate && task.endDate && task.startDate !== task.endDate;
      const multiDayTag = isMultiDay ? ' (跨日)' : '';
      taskBadge.textContent = `${impMark}${timeRange}${task.text}${multiDayTag}`;
      tasksContainer.appendChild(taskBadge);
    });

    dayCell.appendChild(tasksContainer);

    dayCell.addEventListener('click', () => {
      selectedDateStr = cellDateStr;
      openModal();
    });

    calendarDays.appendChild(dayCell);
  }
}

function getActiveCourseEventsForDate(dateStr) {
  const linkedSem = getLinkedSemester();
  if (!linkedSem) return [];

  const targetDate = new Date(dateStr);
  const semStart = new Date(linkedSem.startDate);
  const semEnd = new Date(linkedSem.endDate);
  if (targetDate < semStart || targetDate > semEnd) return [];

  const dayOfWeek = targetDate.getDay();
  const matchedCourses = (linkedSem.courses || []).filter((c) => Number(c.dayOfWeek) === dayOfWeek);

  const activeEvents = [];
  matchedCourses.forEach((c) => {
    const key = `${linkedSem.id}_${c.id}_${dateStr}`;
    const status = courseAttendance[key] || '出席';

    if (status !== '停課' && status !== '請假') {
      const isExam = status === '期中考' || status === '期末考';
      activeEvents.push({
        id: 'course_event_' + key,
        text: isExam ? `📝 ${c.name} ${status}` : `📚 ${c.name} (${c.location || ''})`,
        startTime: c.startTime,
        endTime: c.endTime,
        color: isExam ? '#eb5757' : (c.color || '#ffb6c1'),
        date: dateStr,
        startDate: dateStr,
        endDate: dateStr,
        isCourse: true
      });
    }
  });

  return activeEvents;
}

function renderCourseView() {
  if (!semesterTabsBar || !courseDaysGrid) return;

  const curSem = getCurrentSemester();
  if (!curSem) return;

  if (viewTitle) viewTitle.textContent = `🎓 課程管理頁面 (${curSem.name})`;

  semesterTabsBar.innerHTML = '';
  semesters.forEach((sem) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'btn-secondary';
    if (sem.id === selectedSemesterId) {
      tabBtn.style.backgroundColor = '#e8f0fe';
      tabBtn.style.color = '#1a73e8';
      tabBtn.style.fontWeight = 'bold';
    }
    tabBtn.innerHTML = `${sem.name} ${sem.isLinkedToWeek ? '🔗' : ''}`;
    tabBtn.addEventListener('click', () => {
      selectedSemesterId = sem.id;
      currentWeekOffset = calculateCurrentSemesterWeek(sem);
      renderCourseView();
    });
    semesterTabsBar.appendChild(tabBtn);
  });

  if (toggleLinkWeekBtn) {
    if (curSem.isLinkedToWeek) {
      toggleLinkWeekBtn.textContent = '🔗 連結至周檢視：已開啟';
      toggleLinkWeekBtn.style.backgroundColor = '#27ae60';
      toggleLinkWeekBtn.style.color = '#ffffff';
    } else {
      toggleLinkWeekBtn.textContent = '🔗 連結至周檢視：已關閉';
      toggleLinkWeekBtn.style.backgroundColor = '#ffffff';
      toggleLinkWeekBtn.style.color = '#3c4043';
    }
  }

  courseDaysGrid.innerHTML = '';
  const semStart = new Date(curSem.startDate);
  const maxWeeks = calculateMaxWeeks(curSem);

  const weekStart = new Date(semStart);
  weekStart.setDate(semStart.getDate() + currentWeekOffset * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);

  if (courseWeekTitle) {
    courseWeekTitle.textContent = `${curSem.name} - 第 ${currentWeekOffset + 1} 週 / 共 ${maxWeeks} 週 (${formatSlashDate(weekStart)} - ${formatSlashDate(weekEnd)})`;
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

    let dayCourses = (curSem.courses || []).filter((c) => Number(c.dayOfWeek) === dayOfWeek);
    dayCourses.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

    dayCourses.forEach((c) => {
      const key = `${curSem.id}_${c.id}_${dayDateStr}`;
      const status = courseAttendance[key] || '出席';

      const card = document.createElement('div');
      card.className = 'course-card';
      
      if (status === '停課' || status === '請假') {
        card.classList.add('cancelled');
      }

      if (status === '期中考' || status === '期末考') {
        card.style.backgroundColor = '#fce8e6';
        card.style.borderLeft = '5px solid #eb5757';
      } else if (status !== '停課' && status !== '請假') {
        card.style.backgroundColor = '#f1f3f4';
        card.style.borderLeft = `4px solid ${c.color || '#ffb6c1'}`;
      }

      const isWarning = status === '遲到' || status === '曠課';
      const statusClass = status === '期中考' || status === '期末考' ? 'status-exam' : ((status === '停課' || status === '請假') ? 'status-cancelled' : (isWarning ? 'status-warning' : ''));

      card.innerHTML = `
        <div class="course-name">${c.name}</div>
        <div class="course-time">🕒 ${c.startTime} - ${c.endTime}</div>
        ${c.location ? `<div class="course-loc">📍 ${c.location}</div>` : ''}
        <div class="course-status-badge ${statusClass}">狀態: ${status}</div>
      `;

      card.addEventListener('click', () => {
        openCourseEditModal(c, dayDateStr);
      });

      col.appendChild(card);
    });

    courseDaysGrid.appendChild(col);
  }
}

if (toggleLinkWeekBtn) {
  toggleLinkWeekBtn.addEventListener('click', () => {
    const curSem = getCurrentSemester();
    if (!curSem) return;

    const willLink = !curSem.isLinkedToWeek;
    semesters.forEach((s) => s.isLinkedToWeek = false);
    curSem.isLinkedToWeek = willLink;

    saveAllDataToFirebase();
    renderCourseView();
  });
}

function openNewSemesterModal() {
  editingSemesterId = null;
  if (semesterModalTitle) semesterModalTitle.textContent = '新增學期方案';
  document.getElementById('sem-name').value = '';
  document.getElementById('sem-start-date').value = formatDate(new Date());
  const defaultEnd = new Date();
  defaultEnd.setMonth(defaultEnd.getMonth() + 4);
  document.getElementById('sem-end-date').value = formatDate(defaultEnd);
  if (deleteSemesterBtn) deleteSemesterBtn.style.display = 'none';
  if (semesterModal) semesterModal.style.display = 'flex';
}

if (openAddSemesterBtn) openAddSemesterBtn.addEventListener('click', openNewSemesterModal);

if (editSemesterInfoBtn) {
  editSemesterInfoBtn.addEventListener('click', () => {
    const curSem = getCurrentSemester();
    if (!curSem) return;
    editingSemesterId = curSem.id;
    if (semesterModalTitle) semesterModalTitle.textContent = `編輯學期：${curSem.name}`;
    document.getElementById('sem-name').value = curSem.name;
    document.getElementById('sem-start-date').value = curSem.startDate;
    document.getElementById('sem-end-date').value = curSem.endDate;
    if (deleteSemesterBtn) deleteSemesterBtn.style.display = 'block';
    if (semesterModal) semesterModal.style.display = 'flex';
  });
}

if (closeSemesterModalBtn) {
  closeSemesterModalBtn.addEventListener('click', () => {
    if (semesterModal) semesterModal.style.display = 'none';
  });
}

if (saveSemesterBtn) {
  saveSemesterBtn.addEventListener('click', () => {
    const name = document.getElementById('sem-name').value.trim();
    const sDate = document.getElementById('sem-start-date').value;
    const eDate = document.getElementById('sem-end-date').value;

    if (!name || !sDate || !eDate) {
      alert('請填寫完整學期名稱與日期區間！');
      return;
    }

    if (editingSemesterId) {
      const sem = semesters.find((s) => s.id === editingSemesterId);
      if (sem) {
        sem.name = name;
        sem.startDate = sDate;
        sem.endDate = eDate;
      }
    } else {
      const newSem = {
        id: 'sem_' + Date.now(),
        name: name,
        startDate: sDate,
        endDate: eDate,
        isLinkedToWeek: false,
        courses: []
      };
      semesters.unshift(newSem);
      selectedSemesterId = newSem.id;
    }

    saveAllDataToFirebase();
    if (semesterModal) semesterModal.style.display = 'none';
    renderCourseView();
  });
}

if (deleteSemesterBtn) {
  deleteSemesterBtn.addEventListener('click', () => {
    if (!editingSemesterId) return;
    if (semesters.length <= 1) {
      alert('至少需保留一個學期方案！');
      return;
    }
    if (confirm('確定要刪除這個學期及其所有課程資料嗎？')) {
      semesters = semesters.filter((s) => s.id !== editingSemesterId);
      selectedSemesterId = semesters[0].id;
      saveAllDataToFirebase();
      if (semesterModal) semesterModal.style.display = 'none';
      renderCourseView();
    }
  });
}

function openCourseEditModal(course = null, dateStr = '') {
  editingCourseId = course ? course.id : null;
  selectedAttDateStr = dateStr;
  const curSem = getCurrentSemester();

  if (course) {
    if (courseModalTitle) courseModalTitle.textContent = `編輯課程：${course.name}`;
    document.getElementById('c-name').value = course.name;
    document.getElementById('c-location').value = course.location || '';
    document.getElementById('c-dayofweek').value = course.dayOfWeek;
    document.getElementById('c-start-time').value = course.startTime;
    document.getElementById('c-end-time').value = course.endTime;
    document.getElementById('c-color').value = course.color || '#ffb6c1';

    if (deleteCourseBtn) deleteCourseBtn.style.display = 'block';

    if (dateStr && curSem) {
      if (attendanceSection) attendanceSection.style.display = 'block';
      const dateObj = new Date(dateStr);
      const currentAtt = courseAttendance[`${curSem.id}_${course.id}_${dateStr}`] || '出席';
      if (attSectionTitle) attSectionTitle.textContent = `日期 ${formatSlashDate(dateObj)} 出缺席與考試狀態 (目前：${currentAtt})`;
      updateModalButtonStates(currentAtt);
    } else {
      if (attendanceSection) attendanceSection.style.display = 'none';
    }

    if (masterCourseSection) masterCourseSection.style.display = 'none';
  } else {
    if (courseModalTitle) courseModalTitle.textContent = `新增課程至 ${curSem ? curSem.name : ''}`;
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
    if (btn.getAttribute('data-status') === currentStatus) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

document.querySelectorAll('.att-status-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const curSem = getCurrentSemester();
    if (!editingCourseId || !selectedAttDateStr || !curSem) return;

    const clickedStatus = btn.getAttribute('data-status');
    const key = `${curSem.id}_${editingCourseId}_${selectedAttDateStr}`;
    const prevStatus = courseAttendance[key] || '出席';
    const course = (curSem.courses || []).find((c) => c.id === editingCourseId);

    let newStatus = clickedStatus;
    if (prevStatus === clickedStatus) {
      newStatus = '出席';
    }

    courseAttendance[key] = newStatus;

    if (course) {
      const midExamTitle = `${course.name} 期中考`;
      const finalExamTitle = `${course.name} 期末考`;

      tasks = tasks.filter(
        (t) => !(isTaskInDate(t, selectedAttDateStr) && (t.text === midExamTitle || t.text === finalExamTitle))
      );

      if (newStatus === '期中考' || newStatus === '期末考') {
        tasks.push({
          id: 'exam_' + Date.now(),
          text: `${course.name} ${newStatus}`,
          description: `課堂 ${newStatus} (${course.location || ''})`,
          startTime: course.startTime,
          endTime: course.endTime,
          color: '#eb5757',
          important: true,
          completed: false,
          date: selectedAttDateStr,
          startDate: selectedAttDateStr,
          endDate: selectedAttDateStr,
          isCourseExam: true
        });
      }
    }

    saveAllDataToFirebase();
    if (courseModal) courseModal.style.display = 'none';
    renderCourseView();
  });
});

if (openAddCourseBtn) openAddCourseBtn.addEventListener('click', () => openCourseEditModal(null, ''));
if (closeCourseModalBtn) closeCourseModalBtn.addEventListener('click', () => { if (courseModal) courseModal.style.display = 'none'; });

if (saveCourseBtn) {
  saveCourseBtn.addEventListener('click', () => {
    const curSem = getCurrentSemester();
    if (!curSem) return;

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

    if (!curSem.courses) curSem.courses = [];

    if (editingCourseId) {
      const course = curSem.courses.find((c) => c.id === editingCourseId);
      if (course) {
        course.name = name;
        course.location = loc;
        course.dayOfWeek = Number(dow);
        course.startTime = sTime;
        course.endTime = eTime;
        course.color = color;
      }
    } else {
      curSem.courses.push({
        id: 'course_' + Date.now(),
        name: name,
        location: loc,
        dayOfWeek: Number(dow),
        startTime: sTime,
        endTime: eTime,
        color: color
      });
    }

    curSem.courses.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

    saveAllDataToFirebase();
    if (courseModal) courseModal.style.display = 'none';
    renderCourseMasterList();
    renderCourseView();
  });
}

if (deleteCourseBtn) {
  deleteCourseBtn.addEventListener('click', () => {
    const curSem = getCurrentSemester();
    if (!editingCourseId || !curSem) return;

    if (confirm('確定要刪除這門課程嗎？')) {
      curSem.courses = curSem.courses.filter((c) => c.id !== editingCourseId);
      saveAllDataToFirebase();
      if (courseModal) courseModal.style.display = 'none';
      renderCourseView();
    }
  });
}

function renderCourseMasterList() {
  if (!courseMasterList) return;
  courseMasterList.innerHTML = '';
  const curSem = getCurrentSemester();
  if (!curSem) return;

  const masterCourses = [...(curSem.courses || [])].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

  masterCourses.forEach((c) => {
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
      curSem.courses = curSem.courses.filter((item) => item.id !== c.id);
      saveAllDataToFirebase();
      renderCourseMasterList();
      renderCourseView();
    });

    li.addEventListener('click', () => openCourseEditModal(c, ''));
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
    const curSem = getCurrentSemester();
    const maxWeeks = calculateMaxWeeks(curSem);
    if (currentWeekOffset < maxWeeks - 1) {
      currentWeekOffset++;
      renderCourseView();
    }
  });
}

if (courseTodayBtn) {
  courseTodayBtn.addEventListener('click', () => {
    const curSem = getCurrentSemester();
    currentWeekOffset = calculateCurrentSemesterWeek(curSem);
    renderCourseView();
  });
}

if (viewCourseBtn) {
  viewCourseBtn.addEventListener('click', () => {
    currentMode = 'course';
    const curSem = getCurrentSemester();
    currentWeekOffset = calculateCurrentSemesterWeek(curSem);
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

    const dayTasks = tasks.filter((t) => isTaskInDate(t, dateStr) && !t.isCourseExam);
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
          selectedDateStr = task.startDate || task.date;
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

    let cellTasks = allSubtaskViewTasks.filter((t) => isTaskInDate(t, cellDateStr));
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
      taskBadge.style.cursor = 'pointer';
      taskBadge.title = '點擊修改細項任務';
      taskBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        openSubtaskEditModal(task);
      });
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

function openSubtaskEditModal(task) {
  editingSubtaskTarget = task;
  if (subtaskEditDate) subtaskEditDate.value = task.startDate || task.date || selectedDateStr;
  if (subtaskEditStartTime) subtaskEditStartTime.value = task.startTime || '09:00';
  if (subtaskEditEndTime) subtaskEditEndTime.value = task.endTime || '10:00';
  if (subtaskEditTaskInput) subtaskEditTaskInput.value = task.text || '';
  if (subtaskEditDescInput) subtaskEditDescInput.value = task.description || '';
  if (subtaskEditModal) subtaskEditModal.style.display = 'flex';
}

function closeSubtaskEditModal() {
  if (subtaskEditModal) subtaskEditModal.style.display = 'none';
  editingSubtaskTarget = null;
}

function saveSubtaskEdit() {
  if (!editingSubtaskTarget) return;
  const newText = subtaskEditTaskInput.value.trim();
  const newDate = subtaskEditDate.value;
  const newStart = subtaskEditStartTime.value;
  const newEnd = subtaskEditEndTime.value;
  const newDesc = subtaskEditDescInput.value.trim();

  if (!newText) {
    alert('請輸入細項任務名稱！');
    return;
  }
  if (!newDate) {
    alert('請選擇執行日期！');
    return;
  }
  if (newStart >= newEnd) {
    alert('結束時間必須晚於開始時間！');
    return;
  }

  const changes = {
    text: newText,
    date: newDate,
    startDate: newDate,
    endDate: newDate,
    startTime: newStart,
    endTime: newEnd,
    description: newDesc
  };

  const idx = subtaskPageTasks.findIndex((t) => t.id === editingSubtaskTarget.id);
  if (idx !== -1) {
    subtaskPageTasks[idx] = { ...subtaskPageTasks[idx], ...changes };
  } else {
    updateOrAddSubtaskPageOverride(editingSubtaskTarget, changes);
  }

  saveAllDataToFirebase();
  closeSubtaskEditModal();

  if (subtaskDateInput) subtaskDateInput.value = newDate;
  renderSubtaskCalendar();
}

function renderSubtaskTimeline() {
  if (!subtaskTimelineList) return;
  subtaskTimelineList.innerHTML = '';
  const selDate = (subtaskDateInput && subtaskDateInput.value) ? subtaskDateInput.value : formatDate(new Date());

  const allSubtasks = getCombinedSubtaskTasks();
  let daySubtasks = allSubtasks.filter((t) => isTaskInDate(t, selDate));
  daySubtasks = sortTasksByChronologicalOrder(daySubtasks);

  if (daySubtasks.length === 0) {
    subtaskTimelineList.innerHTML = '<div class="empty-msg">該日期尚無細項任務安排！</div>';
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
    body.title = '點擊修改細項任務';

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

    body.addEventListener('click', () => {
      openSubtaskEditModal(task);
    });

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
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSubtaskEditModal(task);
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

    subtaskPageTasks.push({
      id: 'sub_' + Date.now(),
      text: text,
      description: desc,
      startTime: startVal,
      endTime: endVal,
      color: '#27ae60',
      date: dateVal,
      startDate: dateVal,
      endDate: dateVal,
      completed: false,
      isSubtask: true
    });

    saveAllDataToFirebase();
    subtaskTaskInput.value = '';
    subtaskDescInput.value = '';
    renderSubtaskCalendar();
  });
}

if (subtaskDateInput) {
  subtaskDateInput.addEventListener('change', () => renderSubtaskTimeline());
}

function renderMatrixView() {
  if (!q1List || !q2List || !q3List || !q4List) return;
  q1List.innerHTML = '';
  q2List.innerHTML = '';
  q3List.innerHTML = '';
  q4List.innerHTML = '';

  let activeTasks = tasks.filter((t) => !t.completed && !t.isCourseExam);
  activeTasks = sortTasksByChronologicalOrder(activeTasks);

  activeTasks.forEach((task) => {
    const targetDate = task.startDate || task.date;
    const urgent = isTaskUrgent(targetDate);
    const important = !!task.important;

    const card = document.createElement('div');
    card.className = 'matrix-item';
    if (task.color) card.style.borderLeft = `4px solid ${task.color}`;

    const dateObj = new Date(targetDate);
    card.innerHTML = `
      <div class="matrix-item-title">${task.text}</div>
      <div class="matrix-item-date">📅 ${formatSlashDate(dateObj)} [${task.startTime || '09:00'} - ${task.endTime || '10:00'}]</div>
      ${task.description ? `<div class="task-desc-preview">📝 ${task.description}</div>` : ''}
    `;

    card.addEventListener('click', () => {
      selectedDateStr = targetDate;
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

  let overdueTasks = tasks.filter((t) => (t.endDate || t.startDate || t.date) < todayStr && !t.completed);
  overdueTasks = sortTasksByChronologicalOrder(overdueTasks);

  if (overdueTasks.length === 0) {
    overdueList.innerHTML = '<div class="empty-msg" style="font-size: 1rem; color: #3c4043; padding: 24px 0;">🎉 太棒了！目前沒有逾期的未完成事項。</div>';
    return;
  }

  overdueTasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = 'overdue-item';
    if (task.color) card.style.borderLeft = `5px solid ${task.color}`;

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

    const dateObj = new Date(task.endDate || task.startDate || task.date);
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
  if (modalTaskStartDate) modalTaskStartDate.value = selectedDateStr;
  if (modalTaskEndDate) modalTaskEndDate.value = selectedDateStr;
  if (startTimeInput) startTimeInput.value = '09:00';
  if (endTimeInput) endTimeInput.value = '10:00';
  if (taskInput) taskInput.value = '';
  if (taskDescInput) taskDescInput.value = '';
  if (importantCheckbox) importantCheckbox.checked = false;
  if (addBtn) addBtn.textContent = '新增行程';
  renderModalColorPicker('#1a73e8');
  renderModalTasks();
  if (taskModal) taskModal.style.display = 'flex';
}

function openModalForEdit(task) {
  editingTaskId = task.id;
  selectedDateStr = task.startDate || task.date;
  if (modalDateTitle) modalDateTitle.textContent = `編輯行程：${task.text}`;
  if (modalTaskStartDate) modalTaskStartDate.value = task.startDate || task.date;
  if (modalTaskEndDate) modalTaskEndDate.value = task.endDate || task.startDate || task.date;
  if (startTimeInput) startTimeInput.value = task.startTime || '09:00';
  if (endTimeInput) endTimeInput.value = task.endTime || '10:00';
  if (taskInput) taskInput.value = task.text;
  if (taskDescInput) taskDescInput.value = task.description || '';
  if (importantCheckbox) importantCheckbox.checked = !!task.important;
  renderModalColorPicker(task.color || '#1a73e8');

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
  let filteredTasks = tasks.filter((t) => isTaskInDate(t, selectedDateStr));
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
    span.textContent = `${task.startTime ? `[${task.startTime}-${task.endTime}] ` : ''}${task.text}${task.important ? ' [重要]' : ''}`;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-reschedule';
    editBtn.style.padding = '2px 6px';
    editBtn.textContent = '編輯';
    editBtn.addEventListener('click', () => openModalForEdit(task));

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
  let startDateVal = modalTaskStartDate.value;
  let endDateVal = modalTaskEndDate.value;
  const startVal = startTimeInput.value;
  const endVal = endTimeInput.value;
  const isImp = importantCheckbox.checked;

  if (!startDateVal) startDateVal = selectedDateStr;
  if (!endDateVal) endDateVal = startDateVal;

  if (startDateVal > endDateVal) {
    alert('結束日期不可早於開始日期！');
    return;
  }

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
      task.date = startDateVal;
      task.startDate = startDateVal;
      task.endDate = endDateVal;
      task.startTime = startVal;
      task.endTime = endVal;
      task.important = isImp;
      task.color = colorVal;
    }
  } else {
    tasks.push({
      id: Date.now(),
      text: text,
      description: desc,
      startTime: startVal,
      endTime: endVal,
      color: colorVal,
      important: isImp,
      completed: false,
      date: startDateVal,
      startDate: startDateVal,
      endDate: endDateVal
    });
  }

  saveAllDataToFirebase();
  closeModal();
}

if (addBtn) addBtn.addEventListener('click', saveOrAddTask);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

if (btnAddModalColor && modalCustomColorInput) {
  btnAddModalColor.addEventListener('click', () => {
    modalCustomColorInput.click();
  });

  modalCustomColorInput.addEventListener('change', () => {
    const newColor = modalCustomColorInput.value;
    const labelName = prompt('請輸入此新顏色的任務顏色說明/代表意義：', `自訂色彩 ${colorLegends.length + 1}`);
    if (labelName !== null) {
      const newLegend = {
        id: 'col_' + Date.now(),
        color: newColor,
        label: labelName.trim() || `色彩 ${colorLegends.length + 1}`
      };
      colorLegends.push(newLegend);
      saveAllDataToFirebase();
      renderModalColorPicker(newColor);
      renderColorLegend();
    }
  });
}

if (btnLegendAddColor && modalCustomColorInput) {
  btnLegendAddColor.addEventListener('click', () => {
    modalCustomColorInput.click();
  });
}

if (btnToggleLegend) {
  btnToggleLegend.addEventListener('click', () => {
    isLegendHidden = true;
    saveAllDataToFirebase();
    renderColorLegend();
  });
}

if (btnShowLegend) {
  btnShowLegend.addEventListener('click', () => {
    isLegendHidden = false;
    saveAllDataToFirebase();
    renderColorLegend();
  });
}

if (subtaskEditSaveBtn) subtaskEditSaveBtn.addEventListener('click', saveSubtaskEdit);
if (subtaskEditCancelBtn) subtaskEditCancelBtn.addEventListener('click', closeSubtaskEditModal);
if (closeSubtaskEditModalBtn) closeSubtaskEditModalBtn.addEventListener('click', closeSubtaskEditModal);

window.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal();
  if (e.target === courseModal && courseModal) courseModal.style.display = 'none';
  if (e.target === semesterModal && semesterModal) semesterModal.style.display = 'none';
  if (e.target === subtaskEditModal && subtaskEditModal) closeSubtaskEditModal();
  if (e.target === guideModal && guideModal) guideModal.style.display = 'none';
});

if (viewMonthBtn) viewMonthBtn.addEventListener('click', () => { currentMode = 'month'; setActiveNavBtn(viewMonthBtn); renderView(); });
if (viewWeekBtn) viewWeekBtn.addEventListener('click', () => { currentMode = 'week'; setActiveNavBtn(viewWeekBtn); renderView(); });
if (viewMatrixBtn) viewMatrixBtn.addEventListener('click', () => { currentMode = 'matrix'; setActiveNavBtn(viewMatrixBtn); renderView(); });
if (viewSubtaskBtn) viewSubtaskBtn.addEventListener('click', () => { currentMode = 'subtask'; setActiveNavBtn(viewSubtaskBtn); renderView(); });
if (viewOverdueBtn) viewOverdueBtn.addEventListener('click', () => { currentMode = 'overdue'; setActiveNavBtn(viewOverdueBtn); renderView(); });

function setActiveNavBtn(activeBtn) {
  const allBtns = document.querySelectorAll('.sidebar .nav-btn');
  allBtns.forEach((btn) => btn.classList.remove('active'));
  activeBtn.classList.add('active');
  if (window.innerWidth <= 768) closeSidebar();
}

// 側邊欄收納按鈕與切換邏輯
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const mobileOpenBtn = document.getElementById('mobile-open-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
  if (window.innerWidth <= 768) {
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

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

if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', toggleSidebar);
if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
    closeModal();
    if (courseModal) courseModal.style.display = 'none';
    if (semesterModal) semesterModal.style.display = 'none';
    if (subtaskEditModal) closeSubtaskEditModal();
    if (guideModal) guideModal.style.display = 'none';
  }
});

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentMode === 'month' || currentMode === 'subtask') currentDate.setMonth(currentDate.getMonth() - 1);
    else if (currentMode === 'week') currentDate.setDate(currentDate.getDate() - 7);
    renderView();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentMode === 'month' || currentMode === 'subtask') currentDate.setMonth(currentDate.getMonth() + 1);
    else if (currentMode === 'week') currentDate.setDate(currentDate.getDate() + 7);
    renderView();
  });
}

if (todayBtn) {
  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    selectedDateStr = formatDate(currentDate);
    if (currentMode === 'course') {
      const curSem = getCurrentSemester();
      currentWeekOffset = calculateCurrentSemesterWeek(curSem);
    } else if (currentMode === 'subtask') {
      if (subtaskDateInput) subtaskDateInput.value = selectedDateStr;
    }
    renderView();
  });
}