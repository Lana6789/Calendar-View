// Firebase SDK 模組匯入
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase 設定
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

const viewPersonalBtn = document.getElementById('view-personal-btn');
const viewMonthBtn = document.getElementById('view-month-btn');
const viewWeekBtn = document.getElementById('view-week-btn');
const viewMatrixBtn = document.getElementById('view-matrix-btn');
const viewSubtaskBtn = document.getElementById('view-subtask-btn');
const viewOverdueBtn = document.getElementById('view-overdue-btn');
const viewCourseBtn = document.getElementById('view-course-btn');

const personalView = document.getElementById('personal-view');
const personalCalendarDays = document.getElementById('personal-calendar-days');
const personalColorLegendBar = document.getElementById('personal-color-legend-bar');
const personalShowLegendContainer = document.getElementById('personal-show-legend-container');
const personalBtnShowLegend = document.getElementById('personal-btn-show-legend');
const personalBtnToggleLegend = document.getElementById('personal-btn-toggle-legend');
const personalBtnAddLegend = document.getElementById('personal-btn-add-legend');
const personalLegendItems = document.getElementById('personal-legend-items');

const monthView = document.getElementById('month-view');
const weekView = document.getElementById('week-view');
const matrixView = document.getElementById('matrix-view');
const overdueView = document.getElementById('overdue-view');
const overdueList = document.getElementById('overdue-list');

const colorLegendBar = document.getElementById('color-legend-bar');
const showLegendContainer = document.getElementById('show-legend-container');
const btnShowLegend = document.getElementById('btn-show-legend');
const btnToggleLegend = document.getElementById('btn-toggle-legend');
const btnAddLegend = document.getElementById('btn-add-legend');
const legendItems = document.getElementById('legend-items');

const legendModal = document.getElementById('legend-modal');
const closeLegendModalBtn = document.getElementById('close-legend-modal-btn');
const saveLegendBtn = document.getElementById('save-legend-btn');
const legendLabelInput = document.getElementById('legend-label-input');
let legendSelectedColorHex = '#2563eb';

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

// 刪除對話框 DOM
const deleteScopeModal = document.getElementById('delete-scope-modal');
const closeDeleteScopeModalBtn = document.getElementById('close-delete-scope-modal-btn');
const confirmDeleteScopeBtn = document.getElementById('confirm-delete-scope-btn');
const cancelDeleteScopeBtn = document.getElementById('cancel-delete-scope-btn');
let deletingTargetTask = null;

// 全域狀態
let currentMode = 'personal';
let currentDate = new Date();
let selectedDateStr = formatDate(new Date());
let editingTaskId = null;
let editingCourseId = null;
let selectedAttDateStr = '';
let editingSubtaskTarget = null;

// 重複設定暫存
let pendingRepeatConfig = null;

// 擴充預設顏色選項，新增圖片中的暖黃色 (#fbbf24)
const PRESET_BASE_COLORS = [
  // 第一列
  { name: '暗紅', hex: '#9f1239' },
  { name: '桃紅', hex: '#e11d48' },
  { name: '珊瑚紅', hex: '#f87171' },
  { name: '鮮紅', hex: '#dc2626' },
  { name: '紅橙', hex: '#ea580c' },
  { name: '橙', hex: '#f97316' },
  { name: '深黃', hex: '#d97706' },
  { name: '明黃', hex: '#f59e0b' },
  { name: '暖黃', hex: '#fbbf24' },
  { name: '亮黃', hex: '#facc15' },
  { name: '淺黃', hex: '#fef08a' },
  { name: '黃綠', hex: '#84cc16' },
  { name: '草綠', hex: '#65a30d' },
  { name: '深綠', hex: '#15803d' },
  { name: '薄荷綠', hex: '#10b981' },
  // 第二列
  { name: '藍綠', hex: '#0d9488' },
  { name: '天藍', hex: '#0284c7' },
  { name: '亮藍', hex: '#2563eb' },
  { name: '灰藍', hex: '#4f46e5' },
  { name: '深藍', hex: '#1d4ed8' },
  { name: '淺紫', hex: '#a855f7' },
  { name: '紫', hex: '#9333ea' },
  { name: '深紫', hex: '#7e22ce' },
  { name: '棕', hex: '#78350f' },
  { name: '深灰', hex: '#4b5563' },
  { name: '淺灰', hex: '#9ca3af' }
];

// 預設選取顏色設定為明黃色（#f59e0b）[cite: 72]
let selectedColorHex = '#2563eb';

const DEFAULT_COLOR_LEGENDS = PRESET_BASE_COLORS.slice(0, 11).map((c, i) => ({
  id: `c-base-${i}`,
  color: c.hex,
  label: c.name
}));

// 將主月檢視與個人行程的 Task Color Legend 獨立開來[cite: 72]
let colorLegends = JSON.parse(localStorage.getItem('calendar_color_legends') || 'null') || [...DEFAULT_COLOR_LEGENDS];
let isLegendHidden = JSON.parse(localStorage.getItem('calendar_is_legend_hidden') || 'false');

let personalColorLegends = JSON.parse(localStorage.getItem('calendar_personal_color_legends') || 'null') || [...DEFAULT_COLOR_LEGENDS];
let isPersonalLegendHidden = JSON.parse(localStorage.getItem('calendar_is_personal_legend_hidden') || 'false');

let semesters = [
  {
    id: 'sem_115_1',
    name: '115-1',
    startDate: '2026-09-07',
    endDate: '2026-12-25',
    isLinkedToWeek: true,
    courses: []
  }
];

let selectedSemesterId = 'sem_115_1';
let editingSemesterId = null;
let currentWeekOffset = 0;

let tasks = [];
let personalTasks = []; // 個人行程資料陣列[cite: 72]
let subtaskPageTasks = [];
let courseAttendance = {};
let courseTimeOverrides = {};

if (subtaskDateInput) subtaskDateInput.value = selectedDateStr;
initTimeLabels();
initPresetColorPalette();
renderView();

// Firebase Auth[cite: 72]
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
        personalTasks = cloudData.personalTasks || [];
        subtaskPageTasks = cloudData.subtaskPageTasks || [];
        semesters = cloudData.semesters || semesters;
        selectedSemesterId = cloudData.selectedSemesterId || selectedSemesterId;
        courseAttendance = cloudData.courseAttendance || {};
        courseTimeOverrides = cloudData.courseTimeOverrides || {};

        // 主月檢視 Color Legend 資料同步[cite: 72]
        if (cloudData.colorLegends && Array.isArray(cloudData.colorLegends)) {
          colorLegends = cloudData.colorLegends;
          localStorage.setItem('calendar_color_legends', JSON.stringify(colorLegends));
        }
        if (cloudData.isLegendHidden !== undefined) {
          isLegendHidden = !!cloudData.isLegendHidden;
          localStorage.setItem('calendar_is_legend_hidden', JSON.stringify(isLegendHidden));
        }

        // 個人行程安排 Color Legend 資料同步[cite: 72]
        if (cloudData.personalColorLegends && Array.isArray(cloudData.personalColorLegends)) {
          personalColorLegends = cloudData.personalColorLegends;
          localStorage.setItem('calendar_personal_color_legends', JSON.stringify(personalColorLegends));
        }
        if (cloudData.isPersonalLegendHidden !== undefined) {
          isPersonalLegendHidden = !!cloudData.isPersonalLegendHidden;
          localStorage.setItem('calendar_is_personal_legend_hidden', JSON.stringify(isPersonalLegendHidden));
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
    personalTasks = [];
    subtaskPageTasks = [];
    courseAttendance = {};
    courseTimeOverrides = {};
    renderView();
  }
});

function saveAllDataToFirebase(showAlertIfLoggedOut = false) {
  try {
    localStorage.setItem('calendar_color_legends', JSON.stringify(colorLegends));
    localStorage.setItem('calendar_is_legend_hidden', JSON.stringify(isLegendHidden));
    localStorage.setItem('calendar_personal_color_legends', JSON.stringify(personalColorLegends));
    localStorage.setItem('calendar_is_personal_legend_hidden', JSON.stringify(isPersonalLegendHidden));
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
    personalTasks: personalTasks,
    subtaskPageTasks: subtaskPageTasks,
    semesters: semesters,
    selectedSemesterId: selectedSemesterId,
    courseAttendance: courseAttendance,
    courseTimeOverrides: courseTimeOverrides,
    colorLegends: colorLegends,
    isLegendHidden: isLegendHidden,
    personalColorLegends: personalColorLegends,
    isPersonalLegendHidden: isPersonalLegendHidden,
    updatedAt: new Date().toISOString()
  };

  setDoc(docRef, payload, { merge: true }).catch((err) => {
    console.error("Firebase 寫入失敗:", err);
  });
}

// 初始化調色盤（直接選取顏色）[cite: 72]
function initPresetColorPalette() {
  const container = document.getElementById('preset-color-palette');
  const preview = document.getElementById('selected-color-preview');
  if (!container) return;

  container.innerHTML = '';
  PRESET_BASE_COLORS.forEach((color) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-color-btn';
    btn.style.backgroundColor = color.hex;
    btn.title = color.name;
    btn.dataset.hex = color.hex;

    if (color.hex === selectedColorHex) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      document.querySelectorAll('#preset-color-palette .preset-color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedColorHex = color.hex;
      if (preview) preview.style.backgroundColor = selectedColorHex;
    });

    container.appendChild(btn);
  });

  if (preview) preview.style.backgroundColor = selectedColorHex;
}

// 初始化新增 Legend 視窗中的調色盤[cite: 72]
function initLegendColorPalette() {
  const container = document.getElementById('legend-color-palette');
  if (!container) return;

  container.innerHTML = '';
  PRESET_BASE_COLORS.forEach((color, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-color-btn';
    btn.style.backgroundColor = color.hex;
    btn.title = color.name;

    if (color.hex === legendSelectedColorHex || (idx === 7 && !legendSelectedColorHex)) {
      btn.classList.add('selected');
      legendSelectedColorHex = color.hex;
    }

    btn.addEventListener('click', () => {
      document.querySelectorAll('#legend-color-palette .preset-color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      legendSelectedColorHex = color.hex;
    });

    container.appendChild(btn);
  });
}

// Helpers[cite: 72]
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
    label.textContent = `${String(i).padStart(2, '0')}:00`;
    timeLabels.appendChild(label);
  }
}

function checkAndShowMobileGuide(mode) {
  if (window.innerWidth > 768) return;

  const key = `mobile_guide_shown_${mode}`;
  if (localStorage.getItem(key)) return;

  const guideInfos = {
    personal: { title: '📆 個人行程安排指南', icon: '📆', desc: '此頁面用於規劃個人專屬行程安排，點擊任意日期即可新增或編輯行程。' },
    month: { title: '📅 主月檢視指南', icon: '📅', desc: '此頁面用於規劃與管理主要任務與長期行程，點擊任意日期即可開始新增或修改行程。' },
    week: { title: '📊 周檢視指南', icon: '📊', desc: '此頁面自動整合主要任務與學期課表，提供 24 小時時段檢視，掌握一週精確時間安排。' },
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
  if (personalView) personalView.classList.add('hidden');
  if (monthView) monthView.classList.add('hidden');
  if (weekView) weekView.classList.add('hidden');
  if (matrixView) matrixView.classList.add('hidden');
  if (overdueView) overdueView.classList.add('hidden');
  if (subtaskView) subtaskView.classList.add('hidden');
  if (courseView) courseView.classList.add('hidden');

  if (navBtnsGroup) navBtnsGroup.style.display = 'flex';
  if (todayBtn) todayBtn.style.display = 'inline-block';

  checkAndShowMobileGuide(currentMode);

  if (currentMode === 'personal' && personalView) {
    personalView.classList.remove('hidden');
    if (viewGuideText) viewGuideText.textContent = '此頁面用於規劃與管理個人專屬行程安排。';
    renderPersonalCalendar();
    renderColorLegend();
  } else if (currentMode === 'month' && monthView) {
    monthView.classList.remove('hidden');
    if (viewGuideText) viewGuideText.textContent = '此頁面用於規劃與管理主要任務與長期行程。';
    renderCalendar();
    renderColorLegend();
  } else if (currentMode === 'week' && weekView) {
    weekView.classList.remove('hidden');
    if (viewGuideText) viewGuideText.textContent = '此頁面自動整合主要任務與學期課表，提供週次 24 小時時間軸檢視。';
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

// 分流渲染與維護 Color Legend[cite: 72]
function renderColorLegend() {
  const isPersonal = currentMode === 'personal';
  const targetBar = isPersonal ? personalColorLegendBar : colorLegendBar;
  const targetContainer = isPersonal ? personalShowLegendContainer : showLegendContainer;
  const targetItems = isPersonal ? personalLegendItems : legendItems;
  const currentLegends = isPersonal ? personalColorLegends : colorLegends;
  const hiddenFlag = isPersonal ? isPersonalLegendHidden : isLegendHidden;

  if (!targetBar || !targetItems) return;

  if (hiddenFlag) {
    targetBar.style.display = 'none';
    if (targetContainer) targetContainer.style.display = 'block';
  } else {
    targetBar.style.display = 'flex';
    if (targetContainer) targetContainer.style.display = 'none';
  }

  targetItems.innerHTML = '';
  currentLegends.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'legend-item';

    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.backgroundColor = item.color;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'legend-label-text';
    labelSpan.textContent = item.label;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'legend-del-btn';
    delBtn.innerHTML = '&times;';
    delBtn.title = '刪除此顏色說明';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPersonal) {
        personalColorLegends = personalColorLegends.filter(l => l.id !== item.id);
      } else {
        colorLegends = colorLegends.filter(l => l.id !== item.id);
      }
      saveAllDataToFirebase();
      renderColorLegend();
    });

    itemDiv.appendChild(dot);
    itemDiv.appendChild(labelSpan);
    itemDiv.appendChild(delBtn);

    targetItems.appendChild(itemDiv);
  });
}

// 綁定個人行程頁面與主月檢視頁面的 Color Legend 按鈕[cite: 72]
[btnAddLegend, personalBtnAddLegend].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      initLegendColorPalette();
      if (legendLabelInput) legendLabelInput.value = '';
      if (legendModal) legendModal.style.display = 'flex';
    });
  }
});

if (closeLegendModalBtn) {
  closeLegendModalBtn.addEventListener('click', () => {
    if (legendModal) legendModal.style.display = 'none';
  });
}

if (saveLegendBtn) {
  saveLegendBtn.addEventListener('click', () => {
    const label = legendLabelInput ? legendLabelInput.value.trim() : '';
    if (!label) {
      alert('請輸入代表意義名稱！');
      return;
    }

    const newLegend = {
      id: `c-custom-${Date.now()}`,
      color: legendSelectedColorHex,
      label: label
    };

    if (currentMode === 'personal') {
      personalColorLegends.push(newLegend);
    } else {
      colorLegends.push(newLegend);
    }

    saveAllDataToFirebase();
    if (legendModal) legendModal.style.display = 'none';
    renderColorLegend();
  });
}

// 個人行程安排月檢視渲染[cite: 72]
function renderPersonalCalendar() {
  if (!personalCalendarDays) return;
  personalCalendarDays.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  if (viewTitle) viewTitle.textContent = `${year}年 ${month + 1}月`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = formatDate(new Date());

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'day-cell empty';
    personalCalendarDays.appendChild(emptyCell);
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

    let cellTasks = personalTasks.filter((t) => isTaskInDate(t, cellDateStr));
    cellTasks = sortTasksByChronologicalOrder(cellTasks);

    cellTasks.forEach((task) => {
      const taskBadge = document.createElement('div');
      taskBadge.className = 'task-badge';

      const isRecurringTask = !!(task.seriesId || task.repeatConfig);
      if (isRecurringTask) taskBadge.classList.add('is-recurring');

      if (task.color) {
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

    personalCalendarDays.appendChild(dayCell);
  }
}

// 主月檢視渲染[cite: 72]
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

      const isRecurringTask = !!(task.seriesId || task.repeatConfig);
      if (isRecurringTask) taskBadge.classList.add('is-recurring');

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
      const timeOverride = courseTimeOverrides[key];
      const startTime = timeOverride ? timeOverride.startTime : c.startTime;
      const endTime = timeOverride ? timeOverride.endTime : c.endTime;

      activeEvents.push({
        id: 'course_event_' + key,
        courseId: c.id,
        semesterId: linkedSem.id,
        courseObj: c,
        text: isExam ? `📝 ${c.name} ${status}` : `📚 ${c.name} (${c.location || ''})`,
        startTime: startTime,
        endTime: endTime,
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
      const timeOverride = courseTimeOverrides[key];
      const displayStart = timeOverride ? timeOverride.startTime : c.startTime;
      const displayEnd = timeOverride ? timeOverride.endTime : c.endTime;

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
        <div class="course-time">🕒 ${displayStart} - ${displayEnd}${timeOverride ? ' (已調整)' : ''}</div>
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
      const key = `${curSem.id}_${course.id}_${dateStr}`;
      const currentAtt = courseAttendance[key] || '出席';
      if (attSectionTitle) attSectionTitle.textContent = `日期 ${formatSlashDate(dateObj)} 出缺席與考試狀態 (目前：${currentAtt})`;
      updateModalButtonStates(currentAtt);

      let dayTimeContainer = document.getElementById('day-time-override-container');
      if (!dayTimeContainer) {
        dayTimeContainer = document.createElement('div');
        dayTimeContainer.id = 'day-time-override-container';
        dayTimeContainer.style.marginTop = '12px';
        dayTimeContainer.style.paddingTop = '12px';
        dayTimeContainer.style.borderTop = '1px dashed #dadce0';
        attendanceSection.appendChild(dayTimeContainer);
      }

      const override = courseTimeOverrides[key];
      const curStart = override ? override.startTime : course.startTime;
      const curEnd = override ? override.endTime : course.endTime;

      dayTimeContainer.innerHTML = `
        <div class="status-sub-title">⏰ 當日專屬時間調整 (24小時制) (${formatSlashDate(dateObj)})</div>
        <div class="form-row" style="margin-top: 6px;">
          <input type="time" id="day-override-start" value="${curStart}" step="60">
          <span>至</span>
          <input type="time" id="day-override-end" value="${curEnd}" step="60">
          <button type="button" id="btn-save-day-time" class="btn-secondary" style="background-color: #1a73e8; color: white; padding: 4px 10px; border: none; border-radius: 4px;">儲存當日時間</button>
          ${override ? `<button type="button" id="btn-reset-day-time" class="btn-secondary" style="padding: 4px 8px;">重設預設</button>` : ''}
        </div>
      `;

      const btnSaveDayTime = document.getElementById('btn-save-day-time');
      if (btnSaveDayTime) {
        btnSaveDayTime.onclick = () => {
          const sTime = document.getElementById('day-override-start').value;
          const eTime = document.getElementById('day-override-end').value;
          if (sTime >= eTime) {
            alert('結束時間必須晚於開始時間！');
            return;
          }
          courseTimeOverrides[key] = { startTime: sTime, endTime: eTime };
          saveAllDataToFirebase();
          if (courseModal) courseModal.style.display = 'none';
          renderView();
        };
      }

      const btnResetDayTime = document.getElementById('btn-reset-day-time');
      if (btnResetDayTime) {
        btnResetDayTime.onclick = () => {
          delete courseTimeOverrides[key];
          saveAllDataToFirebase();
          if (courseModal) courseModal.style.display = 'none';
          renderView();
        };
      }
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
        const timeOverride = courseTimeOverrides[key];
        const examStart = timeOverride ? timeOverride.startTime : course.startTime;
        const examEnd = timeOverride ? timeOverride.endTime : course.endTime;

        tasks.push({
          id: 'exam_' + Date.now(),
          text: `${course.name} ${newStatus}`,
          description: `課堂 ${newStatus} (${course.location || ''})`,
          startTime: examStart,
          endTime: examEnd,
          color: '#eb5757',
          important: true,
          completed: false,
          date: selectedAttDateStr,
          startDate: selectedAttDateStr,
          endDate: selectedAttDateStr,
          isCourseExam: true,
          courseId: course.id,
          semesterId: curSem.id
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

// 周檢視 render
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

    // 周檢視同時包含主任務與個人行程安排[cite: 72]
    const dayTasks = tasks.filter((t) => isTaskInDate(t, dateStr) && !t.isCourseExam);
    const dayPersonalTasks = personalTasks.filter((t) => isTaskInDate(t, dateStr));
    const dayCourseEvents = getActiveCourseEventsForDate(dateStr);
    const combinedWeekEvents = [...dayTasks, ...dayPersonalTasks, ...dayCourseEvents];

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
        card.style.color = '#ffffff';
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
      } else {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          if (task.courseObj) {
            openCourseEditModal(task.courseObj, dateStr);
          }
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
    overdueList.innerHTML = '<div class="empty-msg" style="font-size: 1rem; color: #3c4043; padding: 24px 0;">🎉 目前沒有逾期的未完成事項。</div>';
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
  pendingRepeatConfig = null;
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
  updateRepeatSummaryUI();
  const scopeRow = document.getElementById('repeat-edit-scope-row');
  if (scopeRow) scopeRow.style.display = 'none';

  // 開啟 Modal 時，預設選取明黃色（#f59e0b）[cite: 72]
  selectedColorHex = '#2563eb';
  initPresetColorPalette();

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

  selectedColorHex = task.color || '#2563eb';
  initPresetColorPalette();

  if (addBtn) addBtn.textContent = '儲存修改';

  const targetList = currentMode === 'personal' ? personalTasks : tasks;
  const isRecurring = !!(task.seriesId || task.repeatConfig);
  if (isRecurring) {
    const parentTask = targetList.find(t => t.id === (task.seriesId || task.id) && t.repeatConfig);
    pendingRepeatConfig = parentTask ? { ...parentTask.repeatConfig } : (task.repeatConfig ? { ...task.repeatConfig } : null);
  } else {
    pendingRepeatConfig = task.repeatConfig ? { ...task.repeatConfig } : null;
  }
  updateRepeatSummaryUI();

  const scopeRow = document.getElementById('repeat-edit-scope-row');
  if (scopeRow) {
    scopeRow.style.display = isRecurring ? 'flex' : 'none';
    const thisRadio = scopeRow.querySelector('input[value="this"]');
    if (thisRadio) thisRadio.checked = true;
  }

  renderModalTasks();
  if (taskModal) taskModal.style.display = 'flex';
}

function closeModal() {
  if (taskModal) taskModal.style.display = 'none';
  editingTaskId = null;
  renderView();
}

function openDeleteScopeModal(task) {
  deletingTargetTask = task;
  if (deleteScopeModal) deleteScopeModal.style.display = 'flex';
}

function closeDeleteScopeModal() {
  if (deleteScopeModal) deleteScopeModal.style.display = 'none';
  deletingTargetTask = null;
}

if (closeDeleteScopeModalBtn) closeDeleteScopeModalBtn.addEventListener('click', closeDeleteScopeModal);
if (cancelDeleteScopeBtn) cancelDeleteScopeBtn.addEventListener('click', closeDeleteScopeModal);

if (confirmDeleteScopeBtn) {
  confirmDeleteScopeBtn.addEventListener('click', () => {
    if (!deletingTargetTask) return;
    const scopeVal = document.querySelector('input[name="repeat-delete-scope"]:checked')?.value || 'this';
    const seriesId = deletingTargetTask.seriesId || deletingTargetTask.id;

    if (currentMode === 'personal') {
      if (scopeVal === 'this') {
        personalTasks = personalTasks.filter((t) => t.id !== deletingTargetTask.id);
      } else if (scopeVal === 'this_and_after') {
        const thisDate = deletingTargetTask.startDate || deletingTargetTask.date;
        personalTasks = personalTasks.filter((t) => !(((t.seriesId === seriesId) || t.id === seriesId) && (t.startDate || t.date) >= thisDate));
      } else if (scopeVal === 'all') {
        personalTasks = personalTasks.filter((t) => t.id !== seriesId && t.seriesId !== seriesId);
      }
    } else {
      if (scopeVal === 'this') {
        tasks = tasks.filter((t) => t.id !== deletingTargetTask.id);
      } else if (scopeVal === 'this_and_after') {
        const thisDate = deletingTargetTask.startDate || deletingTargetTask.date;
        tasks = tasks.filter((t) => !(((t.seriesId === seriesId) || t.id === seriesId) && (t.startDate || t.date) >= thisDate));
      } else if (scopeVal === 'all') {
        tasks = tasks.filter((t) => t.id !== seriesId && t.seriesId !== seriesId);
      }
    }

    saveAllDataToFirebase();
    closeDeleteScopeModal();
    renderModalTasks();
    renderView();
  });
}

function renderModalTasks() {
  if (!modalTaskList) return;
  modalTaskList.innerHTML = '';
  
  const isPersonal = currentMode === 'personal';
  const targetList = isPersonal ? personalTasks : tasks;

  let filteredTasks = targetList.filter((t) => isTaskInDate(t, selectedDateStr));
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

    // 個人行程安排頁面不包含核取方塊 (checkbox)[cite: 72]
    if (!isPersonal) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveAllDataToFirebase();
        renderModalTasks();
        renderView();
      });
      li.appendChild(checkbox);
    }

    const colorDot = document.createElement('span');
    colorDot.className = 'task-color-dot';
    colorDot.style.backgroundColor = task.color || '#f59e0b';

    const isRecurring = !!(task.seriesId || task.repeatConfig);
    const span = document.createElement('span');
    span.className = 'task-text';
    // 個人行程不使用刪除線[cite: 72]
    if (!isPersonal && task.completed) span.classList.add('completed');
    span.textContent = `${task.startTime ? `[${task.startTime}-${task.endTime}] ` : ''}${task.text}${task.important ? ' [重要]' : ''}${isRecurring ? ' 🔁' : ''}`;

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-reschedule';
    editBtn.style.padding = '2px 6px';
    editBtn.textContent = '編輯';
    editBtn.addEventListener('click', () => openModalForEdit(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', () => {
      if (isRecurring) {
        openDeleteScopeModal(task);
      } else {
        if (isPersonal) {
          personalTasks = personalTasks.filter((t) => t.id !== task.id);
        } else {
          tasks = tasks.filter((t) => t.id !== task.id);
        }
        saveAllDataToFirebase();
        renderModalTasks();
        renderView();
      }
    });

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

  const colorVal = selectedColorHex;

  if (!text) {
    alert('請輸入任務內容！');
    return;
  }

  if (startVal >= endVal) {
    alert('結束時間必須晚於開始時間！');
    return;
  }

  const isPersonal = currentMode === 'personal';
  let targetList = isPersonal ? personalTasks : tasks;

  if (editingTaskId) {
    const task = targetList.find((t) => t.id === editingTaskId);
    if (task) {
      const scopeRow = document.getElementById('repeat-edit-scope-row');
      const isSeriesTask = !!(task.seriesId || task.repeatConfig);
      const scopeVal = scopeRow && scopeRow.style.display !== 'none'
        ? (document.querySelector('input[name="repeat-edit-scope"]:checked')?.value || 'this')
        : 'this';

      const baseChanges = {
        text, description: desc,
        startTime: startVal, endTime: endVal,
        important: isImp, color: colorVal,
        date: startDateVal, startDate: startDateVal, endDate: endDateVal
      };

      if (isSeriesTask && scopeVal !== 'this') {
        const seriesId = task.seriesId || task.id;
        const seriesTasks = targetList.filter(t => t.seriesId === seriesId || t.id === seriesId);
        seriesTasks.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

        if (scopeVal === 'all') {
          seriesTasks.forEach(t => {
            Object.assign(t, {
              text, description: desc,
              startTime: startVal, endTime: endVal,
              important: isImp, color: colorVal
            });
            if (t.repeatConfig && pendingRepeatConfig) t.repeatConfig = { ...pendingRepeatConfig };
          });
        } else if (scopeVal === 'this_and_after') {
          const thisDate = task.startDate;
          const filtered = targetList.filter(t => !(((t.seriesId === seriesId) || t.id === seriesId) && t.startDate >= thisDate && t.id !== task.id));
          if (isPersonal) personalTasks = filtered;
          else tasks = filtered;

          Object.assign(task, baseChanges);
          const parentConfig = pendingRepeatConfig || (targetList.find(t => t.id === seriesId) || {}).repeatConfig;
          if (parentConfig) {
            const newInstances = generateRecurringInstances(
              { ...baseChanges, id: seriesId, seriesId, repeatConfig: parentConfig },
              parentConfig,
              task.startDate
            ).slice(1);
            if (isPersonal) personalTasks.push(...newInstances);
            else tasks.push(...newInstances);
          }
        }
      } else {
        Object.assign(task, baseChanges);
        if (!task.seriesId && pendingRepeatConfig) {
          task.repeatConfig = { ...pendingRepeatConfig };
          task.seriesId = task.id;
          const newInstances = generateRecurringInstances(task, pendingRepeatConfig, startDateVal).slice(1);
          if (isPersonal) personalTasks.push(...newInstances);
          else tasks.push(...newInstances);
        } else if (!task.seriesId && !pendingRepeatConfig && task.repeatConfig) {
          delete task.repeatConfig;
          delete task.seriesId;
        }
      }

      if (!isPersonal && task.isCourseExam && task.courseId && task.semesterId) {
        const targetSem = semesters.find((s) => s.id === task.semesterId);
        if (targetSem && targetSem.courses) {
          const targetCourse = targetSem.courses.find((c) => c.id === task.courseId);
          if (targetCourse) {
            targetCourse.startTime = startVal;
            targetCourse.endTime = endVal;
          }
        }
      }
    }
  } else {
    const newId = Date.now();
    const baseTask = {
      id: newId,
      text, description: desc,
      startTime: startVal, endTime: endVal,
      color: colorVal, important: isImp,
      completed: false,
      date: startDateVal, startDate: startDateVal, endDate: endDateVal,
      isPersonal: isPersonal
    };

    if (pendingRepeatConfig) {
      baseTask.repeatConfig = { ...pendingRepeatConfig };
      baseTask.seriesId = newId;
      const instances = generateRecurringInstances(baseTask, pendingRepeatConfig, startDateVal);
      if (isPersonal) personalTasks.push(...instances);
      else tasks.push(...instances);
    } else {
      if (isPersonal) personalTasks.push(baseTask);
      else tasks.push(baseTask);
    }
  }

  saveAllDataToFirebase();
  closeModal();
  renderView();
}

// 重複功能 helper[cite: 72]
function generateRecurringInstances(baseTask, cfg, fromDateStr) {
  const instances = [];
  const maxInstances = 500;
  const { freq, interval = 1, weekdays = [], endType, endDate, endCount } = cfg;

  const endDateObj = endDate ? new Date(endDate) : null;
  const baseStart = new Date(baseTask.startDate);
  const baseEnd = new Date(baseTask.endDate || baseTask.startDate);
  const durationDays = Math.round((baseEnd - baseStart) / 86400000);

  function pushInstance(dateObj, idx) {
    if (endType === 'on_date' && endDateObj && dateObj > endDateObj) return false;
    if (endType === 'after_count' && instances.length >= endCount) return false;
    const instanceDateStr = formatDate(dateObj);
    const instanceEndDate = new Date(dateObj);
    instanceEndDate.setDate(instanceEndDate.getDate() + durationDays);
    const isFirst = instances.length === 0;
    instances.push({
      ...baseTask,
      id: isFirst ? baseTask.id : (String(baseTask.id) + '_r' + instances.length),
      seriesId: baseTask.id,
      date: instanceDateStr,
      startDate: instanceDateStr,
      endDate: formatDate(instanceEndDate),
      repeatConfig: isFirst ? cfg : undefined,
      completed: false
    });
    return true;
  }

  const hardStop = new Date(fromDateStr);
  hardStop.setFullYear(hardStop.getFullYear() + 2);

  if (freq === 'weekly' && weekdays.length > 0) {
    const from = new Date(fromDateStr);
    const weekStart = new Date(from);
    weekStart.setDate(from.getDate() - from.getDay());

    let weekCursor = new Date(weekStart);
    let safety = 0;
    while (instances.length < maxInstances && safety++ < 2000) {
      const sortedDays = [...weekdays].sort((a, b) => a - b);
      for (const dow of sortedDays) {
        const d = new Date(weekCursor);
        d.setDate(weekCursor.getDate() + dow);
        if (d >= from && d <= hardStop) {
          if (!pushInstance(d, instances.length)) break;
        }
      }
      if (instances.length >= maxInstances) break;
      weekCursor.setDate(weekCursor.getDate() + 7 * interval);
      if (weekCursor > hardStop) break;
    }
  } else {
    let current = new Date(fromDateStr);
    let safety = 0;
    while (instances.length < maxInstances && safety++ < 2000) {
      if (current > hardStop) break;
      if (!pushInstance(current, instances.length)) break;
      const next = new Date(current);
      if (freq === 'daily') next.setDate(next.getDate() + interval);
      else if (freq === 'monthly') next.setMonth(next.getMonth() + interval);
      else if (freq === 'yearly') next.setFullYear(next.getFullYear() + interval);
      current = next;
    }
  }

  return instances;
}

function buildRepeatSummaryText(cfg) {
  if (!cfg) return '不重複';
  const freqMap = { daily: '日', weekly: '週', monthly: '月', yearly: '年' };
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  let s = `每 ${cfg.interval > 1 ? cfg.interval + ' ' : ''}${freqMap[cfg.freq]}`;

  if (cfg.freq === 'weekly' && cfg.weekdays && cfg.weekdays.length > 0) {
    s += `（週${cfg.weekdays.map(d => dayNames[d]).join('、')}）`;
  }

  if (cfg.endType === 'on_date' && cfg.endDate) {
    s += `，至 ${cfg.endDate}`;
  } else if (cfg.endType === 'after_count') {
    s += `，共 ${cfg.endCount} 次`;
  } else {
    s += '，持續';
  }
  return s;
}

function updateRepeatSummaryUI() {
  const summaryText = document.getElementById('repeat-summary-text');
  const clearBtn = document.getElementById('btn-clear-repeat');
  if (summaryText) summaryText.textContent = buildRepeatSummaryText(pendingRepeatConfig);
  if (clearBtn) clearBtn.style.display = pendingRepeatConfig ? 'flex' : 'none';
}

// 重複設定 Modal 控制[cite: 72]
const repeatConfigModal = document.getElementById('repeat-config-modal');
const closeRepeatConfigBtn = document.getElementById('close-repeat-config-btn');
const rcCancelBtn = document.getElementById('rc-cancel-btn');
const rcConfirmBtn = document.getElementById('rc-confirm-btn');
const rcFreqSelect = document.getElementById('rc-freq');
const rcIntervalInput = document.getElementById('rc-interval');
const rcIntervalUnit = document.getElementById('rc-interval-unit');
const rcWeekdaysSection = document.getElementById('rc-weekdays-section');
const rcEndDateInput = document.getElementById('rc-end-date');
const rcEndCountInput = document.getElementById('rc-end-count');
const btnOpenRepeat = document.getElementById('btn-open-repeat');
const btnClearRepeat = document.getElementById('btn-clear-repeat');

const FREQ_UNIT_MAP = { daily: '天', weekly: '週', monthly: '月', yearly: '年' };

function openRepeatConfigModal() {
  const cfg = pendingRepeatConfig || { freq: 'weekly', interval: 1, weekdays: [], endType: 'never', endDate: '', endCount: 10 };

  if (rcFreqSelect) rcFreqSelect.value = cfg.freq;
  if (rcIntervalInput) rcIntervalInput.value = cfg.interval || 1;
  if (rcIntervalUnit) rcIntervalUnit.textContent = FREQ_UNIT_MAP[cfg.freq] || '週';
  if (rcWeekdaysSection) rcWeekdaysSection.style.display = cfg.freq === 'weekly' ? 'flex' : 'none';

  document.querySelectorAll('input[name="rc-weekday"]').forEach(cb => {
    cb.checked = (cfg.weekdays || []).includes(Number(cb.value));
  });

  if (cfg.freq === 'weekly' && (!cfg.weekdays || cfg.weekdays.length === 0)) {
    const startDate = document.getElementById('modal-task-start-date')?.value || selectedDateStr;
    const d = new Date(startDate);
    const dow = d.getDay();
    const cb = document.querySelector(`input[name="rc-weekday"][value="${dow}"]`);
    if (cb) cb.checked = true;
  }

  const endRadio = document.querySelector(`input[name="rc-end"][value="${cfg.endType || 'never'}"]`);
  if (endRadio) endRadio.checked = true;

  if (rcEndDateInput) {
    const defaultEnd = new Date();
    defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);
    rcEndDateInput.value = cfg.endDate || formatDate(defaultEnd);
  }
  if (rcEndCountInput) rcEndCountInput.value = cfg.endCount || 10;

  if (repeatConfigModal) repeatConfigModal.style.display = 'flex';
}

function closeRepeatConfigModal() {
  if (repeatConfigModal) repeatConfigModal.style.display = 'none';
}

function confirmRepeatConfig() {
  const freq = rcFreqSelect ? rcFreqSelect.value : 'weekly';
  const interval = parseInt(rcIntervalInput?.value || 1);
  const weekdays = [...document.querySelectorAll('input[name="rc-weekday"]:checked')].map(cb => Number(cb.value));
  const endType = document.querySelector('input[name="rc-end"]:checked')?.value || 'never';
  const endDate = rcEndDateInput?.value || '';
  const endCount = parseInt(rcEndCountInput?.value || 10);

  if (freq === 'weekly' && weekdays.length === 0) {
    alert('每週重複：請至少選擇一個星期幾！');
    return;
  }

  pendingRepeatConfig = { freq, interval, weekdays, endType, endDate, endCount };
  closeRepeatConfigModal();
  updateRepeatSummaryUI();
}

if (btnOpenRepeat) btnOpenRepeat.addEventListener('click', openRepeatConfigModal);
if (btnClearRepeat) btnClearRepeat.addEventListener('click', () => {
  pendingRepeatConfig = null;
  updateRepeatSummaryUI();
});
if (closeRepeatConfigBtn) closeRepeatConfigBtn.addEventListener('click', closeRepeatConfigModal);
if (rcCancelBtn) rcCancelBtn.addEventListener('click', closeRepeatConfigModal);
if (rcConfirmBtn) rcConfirmBtn.addEventListener('click', confirmRepeatConfig);

if (rcFreqSelect) {
  rcFreqSelect.addEventListener('change', () => {
    const freq = rcFreqSelect.value;
    if (rcIntervalUnit) rcIntervalUnit.textContent = FREQ_UNIT_MAP[freq] || '週';
    if (rcWeekdaysSection) rcWeekdaysSection.style.display = freq === 'weekly' ? 'flex' : 'none';
  });
}

if (rcEndDateInput) rcEndDateInput.addEventListener('focus', () => {
  const r = document.querySelector('input[name="rc-end"][value="on_date"]');
  if (r) r.checked = true;
});
if (rcEndCountInput) rcEndCountInput.addEventListener('focus', () => {
  const r = document.querySelector('input[name="rc-end"][value="after_count"]');
  if (r) r.checked = true;
});

window.addEventListener('click', (e) => {
  if (e.target === repeatConfigModal) closeRepeatConfigModal();
});

if (addBtn) addBtn.addEventListener('click', saveOrAddTask);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

[btnToggleLegend, personalBtnToggleLegend].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      if (currentMode === 'personal') {
        isPersonalLegendHidden = true;
      } else {
        isLegendHidden = true;
      }
      saveAllDataToFirebase();
      renderColorLegend();
    });
  }
});

[btnShowLegend, personalBtnShowLegend].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      if (currentMode === 'personal') {
        isPersonalLegendHidden = false;
      } else {
        isLegendHidden = false;
      }
      saveAllDataToFirebase();
      renderColorLegend();
    });
  }
});

if (subtaskEditSaveBtn) subtaskEditSaveBtn.addEventListener('click', saveSubtaskEdit);
if (subtaskEditCancelBtn) subtaskEditCancelBtn.addEventListener('click', closeSubtaskEditModal);
if (closeSubtaskEditModalBtn) closeSubtaskEditModalBtn.addEventListener('click', closeSubtaskEditModal);

window.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal();
  if (e.target === courseModal && courseModal) courseModal.style.display = 'none';
  if (e.target === semesterModal && semesterModal) semesterModal.style.display = 'none';
  if (e.target === subtaskEditModal && subtaskEditModal) closeSubtaskEditModal();
  if (e.target === guideModal && guideModal) guideModal.style.display = 'none';
  if (e.target === deleteScopeModal && deleteScopeModal) closeDeleteScopeModal();
  if (e.target === legendModal && legendModal) legendModal.style.display = 'none';
});

// 側邊欄切換與點擊事件[cite: 72]
if (viewPersonalBtn) viewPersonalBtn.addEventListener('click', () => { currentMode = 'personal'; setActiveNavBtn(viewPersonalBtn); renderView(); });
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
    if (repeatConfigModal && repeatConfigModal.style.display !== 'none') {
      closeRepeatConfigModal();
    } else {
      closeModal();
      if (courseModal) courseModal.style.display = 'none';
      if (semesterModal) semesterModal.style.display = 'none';
      if (subtaskEditModal) closeSubtaskEditModal();
      if (guideModal) guideModal.style.display = 'none';
      if (deleteScopeModal) closeDeleteScopeModal();
      if (legendModal) legendModal.style.display = 'none';
    }
  }
});

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentMode === 'month' || currentMode === 'personal' || currentMode === 'subtask') currentDate.setMonth(currentDate.getMonth() - 1);
    else if (currentMode === 'week') currentDate.setDate(currentDate.getDate() - 7);
    renderView();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentMode === 'month' || currentMode === 'personal' || currentMode === 'subtask') currentDate.setMonth(currentDate.getMonth() + 1);
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