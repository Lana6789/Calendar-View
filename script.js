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
let currentMode = 'month'; // 'month' | 'week' | 'matrix' | 'overdue' | 'subtask' | 'course'
let currentDate = new Date();
let selectedDateStr = formatDate(new Date());
let editingTaskId = null;
let editingCourseId = null; // 正在編輯的 Course ID
let selectedAttDateStr = ''; // 正在編輯出缺勤的 Date String

// 學期時間範圍：2026/09/07 - 2026/12/25 (115-1，16週)
const semesterStart = new Date('2026-09-07');
const semesterEnd = new Date('2026-12-25');
let currentWeekOffset = 0; // 0 代表第1週 (0~15 共 16 週)

let tasks = loadTasks(); // 主月檢視的核心任務
let subtaskPageTasks = loadSubtaskPageTasks();
let courses = loadCourses(); // 課表定義 Master List
let courseAttendance = loadCourseAttendance(); // 每週各堂課狀態 Record

// 初始化
subtaskDateInput.value = selectedDateStr;
initTimeLabels();
renderView();
setInterval(updateCurrentTimeLine, 60000);

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

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadSubtaskPageTasks() {
  const saved = localStorage.getItem('subtask_page_tasks');
  return saved ? JSON.parse(saved) : [];
}

function saveSubtaskPageTasks() {
  localStorage.setItem('subtask_page_tasks', JSON.stringify(subtaskPageTasks));
}

// 載入預設課程（將原本紅色的課程全數改為淡粉紅色 #ffb6c1）
function loadCourses() {
  const saved = localStorage.getItem('master_courses');
  if (saved) return JSON.parse(saved);

  return [
    { id: 'c1', name: '組織行為-E', location: 'E1-306', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', color: '#f2994a' },
    { id: 'c2', name: '邏輯思考概論-A', location: 'TR-412-1', dayOfWeek: 1, startTime: '13:00', endTime: '15:00', color: '#ffb6c1' },
    { id: 'c3', name: '體育 (網球) (上)', location: '', dayOfWeek: 1, startTime: '16:30', endTime: '18:30', color: '#ffb6c1' },
    { id: 'c4', name: '管理與企業倫理', location: 'IB-510-2', dayOfWeek: 2, startTime: '09:00', endTime: '12:00', color: '#56ccf2' },
    { id: 'c5', name: '經濟學 (上)', location: 'IB-409-1', dayOfWeek: 2, startTime: '13:20', endTime: '16:20', color: '#56ccf2' },
    { id: 'c6', name: '口語表達-D', location: 'T4-304', dayOfWeek: 2, startTime: '16:30', endTime: '18:30', color: '#ffb6c1' },
    { id: 'c7', name: '英文小老師', location: '', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', color: '#7bc676' },
    { id: 'c8', name: '英語口語訓練 (上)', location: 'TR-611', dayOfWeek: 4, startTime: '08:00', endTime: '10:00', color: '#f2994a' },
    { id: 'c9', name: '英文字彙與閱讀 (上)', location: 'TR-612', dayOfWeek: 4, startTime: '10:00', endTime: '12:00', color: '#f2994a' },
    { id: 'c10', name: '數位商業與行銷', location: 'MA-206', dayOfWeek: 4, startTime: '15:30', endTime: '18:30', color: '#56ccf2' },
    { id: 'c11', name: '商業品牌故事力：英語實務寫作', location: 'T4-302', dayOfWeek: 5, startTime: '08:00', endTime: '10:00', color: '#56ccf2' },
    { id: 'c12', name: '新生中文說寫專題', location: 'TR-212', dayOfWeek: 5, startTime: '13:00', endTime: '16:00', color: '#ffb6c1' }
  ];
}

function saveCourses() {
  localStorage.setItem('master_courses', JSON.stringify(courses));
}

function loadCourseAttendance() {
  const saved = localStorage.getItem('course_attendance');
  return saved ? JSON.parse(saved) : {};
}

function saveCourseAttendance() {
  localStorage.setItem('course_attendance', JSON.stringify(courseAttendance));
}

// 計算今天落於學期第幾週
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
  monthView.classList.add('hidden');
  weekView.classList.add('hidden');
  matrixView.classList.add('hidden');
  overdueView.classList.add('hidden');
  subtaskView.classList.add('hidden');
  courseView.classList.add('hidden');
  navBtnsGroup.style.display = 'flex';

  if (currentMode === 'month') {
    monthView.classList.remove('hidden');
    renderCalendar();
  } else if (currentMode === 'week') {
    weekView.classList.remove('hidden');
    renderWeekView();
  } else if (currentMode === 'matrix') {
    matrixView.classList.remove('hidden');
    navBtnsGroup.style.display = 'none';
    viewTitle.textContent = 'Eisenhower Matrix 艾森豪象限表';
    renderMatrixView();
  } else if (currentMode === 'overdue') {
    overdueView.classList.remove('hidden');
    navBtnsGroup.style.display = 'none';
    viewTitle.textContent = 'Overdue Tasks 逾期未完成事項';
    renderOverdueView();
  } else if (currentMode === 'subtask') {
    subtaskView.classList.remove('hidden');
    renderSubtaskCalendar();
  } else if (currentMode === 'course') {
    courseView.classList.remove('hidden');
    navBtnsGroup.style.display = 'none';
    viewTitle.textContent = '115學年度 第一學期 課表 (115-1)';
    renderCourseView();
  }
}

// 取得特定日期的課堂事件 (期中考/期末考無條件以紅色顯示)
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
        color: isExam ? '#eb5757' : (c.color || '#ffb6c1'), // 考試顯示鮮紅色，平時顯示課程代表色
        date: dateStr,
        isCourse: true
      });
    }
  });

  return activeEvents;
}

// 渲染「115-1 課表」頁面
function renderCourseView() {
  courseDaysGrid.innerHTML = '';

  const weekStart = new Date(semesterStart);
  weekStart.setDate(semesterStart.getDate() + currentWeekOffset * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);

  const weekNum = currentWeekOffset + 1;
  courseWeekTitle.textContent = `第 ${weekNum} 週 (${formatSlashDate(weekStart)} - ${formatSlashDate(weekEnd)})`;

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

      // 只要是期中考或期末考，整張卡片顯示醒目紅色邊框與背景
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

// 開啟課程編輯與出缺勤 Modal
function openCourseEditModal(course = null, dateStr = '') {
  editingCourseId = course ? course.id : null;
  selectedAttDateStr = dateStr;

  if (course) {
    courseModalTitle.textContent = `編輯課程：${course.name}`;
    document.getElementById('c-name').value = course.name;
    document.getElementById('c-location').value = course.location || '';
    document.getElementById('c-dayofweek').value = course.dayOfWeek;
    document.getElementById('c-start-time').value = course.startTime;
    document.getElementById('c-end-time').value = course.endTime;
    document.getElementById('c-color').value = course.color || '#ffb6c1';

    deleteCourseBtn.style.display = 'block';

    if (dateStr) {
      attendanceSection.style.display = 'block';
      const dateObj = new Date(dateStr);
      const currentAtt = courseAttendance[`${course.id}_${dateStr}`] || '出席';
      attSectionTitle.textContent = `日期 ${formatSlashDate(dateObj)} 出缺席與考試狀態 (目前：${currentAtt})`;

      // 更新按鈕的 active 狀態
      updateModalButtonStates(currentAtt);
    } else {
      attendanceSection.style.display = 'none';
    }

    masterCourseSection.style.display = 'none';
  } else {
    courseModalTitle.textContent = '新增 115-1 課程定義';
    document.getElementById('c-name').value = '';
    document.getElementById('c-location').value = '';
    document.getElementById('c-dayofweek').value = 1;
    document.getElementById('c-start-time').value = '13:20';
    document.getElementById('c-end-time').value = '16:20';
    document.getElementById('c-color').value = '#ffb6c1';

    deleteCourseBtn.style.display = 'none';
    attendanceSection.style.display = 'none';
    masterCourseSection.style.display = 'block';
    renderCourseMasterList();
  }

  courseModal.style.display = 'flex';
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

// 點擊出缺席與期中/期末考按鈕邏輯 (切換與點擊取消功能)
document.querySelectorAll('.att-status-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!editingCourseId || !selectedAttDateStr) return;
    const clickedStatus = btn.getAttribute('data-status');
    const key = `${editingCourseId}_${selectedAttDateStr}`;
    const prevStatus = courseAttendance[key] || '出席';
    const course = courses.find((c) => c.id === editingCourseId);

    let newStatus = clickedStatus;

    // 如果點擊目前已選取的狀態，代表「取消選擇」，自動恢復為「出席」
    if (prevStatus === clickedStatus) {
      newStatus = '出席';
    }

    courseAttendance[key] = newStatus;
    saveCourseAttendance();

    // 處理同步至「主月檢視」的考試行程
    if (course) {
      const midExamTitle = `${course.name} 期中考`;
      const finalExamTitle = `${course.name} 期末考`;

      // 先先清除舊的同日對應考試行程
      tasks = tasks.filter(
        (t) => !(t.date === selectedAttDateStr && (t.text === midExamTitle || t.text === finalExamTitle))
      );

      // 若新狀態為考試，新增紅色考試行程至主月檢視
      if (newStatus === '期中考' || newStatus === '期末考') {
        const examTitle = `${course.name} ${newStatus}`;
        tasks.push({
          id: 'exam_' + Date.now(),
          text: examTitle,
          description: `課堂 ${newStatus} (${course.location || ''})`,
          startTime: course.startTime,
          endTime: course.endTime,
          color: '#eb5757', // 鮮紅色
          important: true,
          completed: false,
          date: selectedAttDateStr
        });
      }
      saveTasks();
    }

    courseModal.style.display = 'none';
    renderCourseView();
  });
});

openAddCourseBtn.addEventListener('click', () => {
  openCourseEditModal(null, '');
});

closeCourseModalBtn.addEventListener('click', () => {
  courseModal.style.display = 'none';
});

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

  saveCourses();
  courseModal.style.display = 'none';
  renderCourseMasterList();
  renderCourseView();
});

deleteCourseBtn.addEventListener('click', () => {
  if (!editingCourseId) return;
  if (confirm('確定要刪除這門課程嗎？這將會同步從課表中完全移除。')) {
    courses = courses.filter((c) => c.id !== editingCourseId);
    saveCourses();
    courseModal.style.display = 'none';
    renderCourseView();
  }
});

function renderCourseMasterList() {
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
      saveCourses();
      renderCourseMasterList();
      renderCourseView();
    });

    li.addEventListener('click', () => {
      openCourseEditModal(c, '');
    });

    courseMasterList.appendChild(li);
  });
}

coursePrevWeekBtn.addEventListener('click', () => {
  if (currentWeekOffset > 0) {
    currentWeekOffset--;
    renderCourseView();
  }
});

courseNextWeekBtn.addEventListener('click', () => {
  if (currentWeekOffset < 15) {
    currentWeekOffset++;
    renderCourseView();
  }
});

// 點擊「115-1」側邊欄時，自動跳至當週
viewCourseBtn.addEventListener('click', () => {
  currentMode = 'course';
  currentWeekOffset = calculateCurrentSemesterWeek();
  setActiveNavBtn(viewCourseBtn);
  renderView();
});

// 周檢視
function renderWeekView() {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const year = startOfWeek.getFullYear();
  const month = startOfWeek.getMonth() + 1;
  viewTitle.textContent = `${year}年 ${month}月`;

  const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  weekHeaderRow.innerHTML = '<div class="time-corner">GMT+8</div>';

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
    weekHeaderRow.appendChild(headerCell);
  }

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
        // 深淺字體顏色優化：若色彩為淡粉色則使用深色字
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
  subtaskCalendarDays.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  viewTitle.textContent = `任務細項安排 - ${year}年 ${month + 1}月`;

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
      subtaskDateInput.value = cellDateStr;
      renderSubtaskTimeline();
    });

    subtaskCalendarDays.appendChild(dayCell);
  }

  renderSubtaskTimeline();
}

function renderSubtaskTimeline() {
  subtaskTimelineList.innerHTML = '';
  const selDate = subtaskDateInput.value || formatDate(new Date());

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
        saveSubtaskPageTasks();
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
  saveSubtaskPageTasks();
}

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
  saveSubtaskPageTasks();
  subtaskTaskInput.value = '';
  subtaskDescInput.value = '';
  renderSubtaskCalendar();
});

subtaskDateInput.addEventListener('change', () => {
  renderSubtaskTimeline();
});

function renderCalendar() {
  calendarDays.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  viewTitle.textContent = `${year}年 ${month + 1}月`;

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

    calendarDays.appendChild(dayCell);
  }
}

function renderMatrixView() {
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
      saveTasks();
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
  modalDateTitle.textContent = `${formatSlashDate(dateObj)} 行程管理`;
  modalTaskDate.value = selectedDateStr;
  startTimeInput.value = '09:00';
  endTimeInput.value = '10:00';
  taskInput.value = '';
  taskDescInput.value = '';
  importantCheckbox.checked = false;
  addBtn.textContent = '新增行程';
  renderModalTasks();
  taskModal.style.display = 'flex';
}

function openModalForEdit(task) {
  editingTaskId = task.id;
  selectedDateStr = task.date;
  modalDateTitle.textContent = `編輯行程：${task.text}`;
  modalTaskDate.value = task.date;
  startTimeInput.value = task.startTime || '09:00';
  endTimeInput.value = task.endTime || '10:00';
  taskInput.value = task.text;
  taskDescInput.value = task.description || '';
  importantCheckbox.checked = !!task.important;

  const colorRadios = document.querySelectorAll('input[name="color-option"]');
  colorRadios.forEach((r) => {
    r.checked = r.value === (task.color || '#1a73e8');
  });

  addBtn.textContent = '儲存修改';
  renderModalTasks();
  taskModal.style.display = 'flex';
}

function closeModal() {
  taskModal.style.display = 'none';
  editingTaskId = null;
  renderView();
}

function renderModalTasks() {
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
      saveTasks();
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
      saveTasks();
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

  saveTasks();
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
addBtn.addEventListener('click', saveOrAddTask);

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal();
  if (e.target === courseModal) courseModal.style.display = 'none';
});

viewMonthBtn.addEventListener('click', () => {
  currentMode = 'month';
  setActiveNavBtn(viewMonthBtn);
  renderView();
});

viewWeekBtn.addEventListener('click', () => {
  currentMode = 'week';
  setActiveNavBtn(viewWeekBtn);
  renderView();
});

viewMatrixBtn.addEventListener('click', () => {
  currentMode = 'matrix';
  setActiveNavBtn(viewMatrixBtn);
  renderView();
});

viewSubtaskBtn.addEventListener('click', () => {
  currentMode = 'subtask';
  setActiveNavBtn(viewSubtaskBtn);
  renderView();
});

viewOverdueBtn.addEventListener('click', () => {
  currentMode = 'overdue';
  setActiveNavBtn(viewOverdueBtn);
  renderView();
});

function setActiveNavBtn(activeBtn) {
  const allBtns = document.querySelectorAll('.sidebar .nav-btn');
  allBtns.forEach((btn) => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

prevBtn.addEventListener('click', () => {
  if (currentMode === 'month' || currentMode === 'subtask') {
    currentDate.setMonth(currentDate.getMonth() - 1);
  } else if (currentMode === 'week') {
    currentDate.setDate(currentDate.getDate() - 7);
  }
  renderView();
});

nextBtn.addEventListener('click', () => {
  if (currentMode === 'month' || currentMode === 'subtask') {
    currentDate.setMonth(currentDate.getMonth() + 1);
  } else if (currentMode === 'week') {
    currentDate.setDate(currentDate.getDate() + 7);
  }
  renderView();
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  renderView();
});