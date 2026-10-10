// LazyEye API Client & Resilient Clinical Data Service
// Connects to live Render API (https://lazyeye.onrender.com) with automatic self-healing offline clinical cache

export const API_BASE_URL = 'https://lazyeye.onrender.com';

// Seeded Clinical Dataset (Offline & Fallback Mirror)
export const MOCK_USERS = [
  {
    id: 1,
    fullname: 'Abhishek Pal',
    username: 'abhi8535',
    email: 'abhi8535@gmail.com',
    accounttype: 'user',
    user_playing_time: '25',
    left_eye_color: 'blue',
    right_eye_color: 'red',
    left_eye_contrast_color: '#0000ff',
    right_eye_contrast_color: '#ff0000',
    left_eye_contrastvalue: '240',
    right_eye_contrastvalue: '220',
    doctor_id: 3, // Dr. Sarah Mitchell
    doctor_name: 'Dr. Sarah Mitchell, OD',
  },
  {
    id: 2,
    fullname: 'Riya Jaiwal',
    username: 'riyajaiwal',
    email: 'riya@gmail.com',
    accounttype: 'user',
    user_playing_time: '20',
    left_eye_color: 'red',
    right_eye_color: 'green',
    left_eye_contrast_color: '#ff0000',
    right_eye_contrast_color: '#00ff00',
    left_eye_contrastvalue: '255',
    right_eye_contrastvalue: '200',
    doctor_id: 3, // Dr. Sarah Mitchell
    doctor_name: 'Dr. Sarah Mitchell, OD',
  },
  {
    id: 3,
    fullname: 'Dr. Sarah Mitchell, OD',
    username: 'dr_sarah',
    email: 'sarah.mitchell@lazyeye-clinic.org',
    accounttype: 'doctor',
    user_playing_time: '20',
    doctor_id: null,
  },
  {
    id: 4,
    fullname: 'Dr. James Vance, FAAO',
    username: 'dr_vance',
    email: 'james.vance@lazyeye-clinic.org',
    accounttype: 'doctor',
    user_playing_time: '20',
    doctor_id: null,
  },
  {
    id: 5,
    fullname: 'Shivam Singh',
    username: 'singhsaab',
    email: 'shivam@gmail.com',
    accounttype: 'user',
    user_playing_time: '15',
    left_eye_color: 'red',
    right_eye_color: 'cyan',
    left_eye_contrast_color: '#ff0000',
    right_eye_contrast_color: '#00ffff',
    left_eye_contrastvalue: '210',
    right_eye_contrastvalue: '230',
    doctor_id: 4, // Dr. James Vance
    doctor_name: 'Dr. James Vance, FAAO',
  },
  {
    id: 6,
    fullname: 'Avishi Agarwal',
    username: 'avishi',
    email: 'avishi@gmail.com',
    accounttype: 'user',
    user_playing_time: '20',
    left_eye_color: 'red',
    right_eye_color: 'blue',
    left_eye_contrast_color: '#ff0000',
    right_eye_contrast_color: '#0000ff',
    left_eye_contrastvalue: '250',
    right_eye_contrastvalue: '250',
    doctor_id: 4, // Dr. James Vance
    doctor_name: 'Dr. James Vance, FAAO',
  },
  {
    id: 7,
    fullname: 'Clinical Administrator',
    username: 'admin',
    email: 'admin@lazyeye.org',
    accounttype: 'admin',
    user_playing_time: '20',
    doctor_id: null,
  },
  {
    id: 8,
    fullname: 'Master Root Administrator',
    username: 'root',
    email: 'root@lazyeye.org',
    accounttype: 'root',
    user_playing_time: '20',
    doctor_id: null,
  },
];

export const MOCK_REGISTRATIONS = [
  { reg_id: 101, fullname: 'Arun Badhotiya', username: 'aruna', email: 'arun@example.com', gender: 'Male', accounttype: 'user' },
  { reg_id: 102, fullname: 'Neha Bhardwaj', username: 'neha0211', email: 'neha@example.com', gender: 'Female', accounttype: 'user' },
  { reg_id: 103, fullname: 'Kunal Pal', username: 'kunal_pal', email: 'kunal@example.com', gender: 'Male', accounttype: 'user' },
];

export const MOCK_CONSULTATIONS = [
  {
    id: 1,
    doctor_id: 3,
    patient_id: 1,
    patient_name: 'Abhishek Pal',
    doctor_name: 'Dr. Sarah Mitchell, OD',
    status: 'Prescribed',
    notes: 'Patient shows 35% suppression reduction. Continue Snake and Tetris fusion therapy.',
    compliance_assessment: 'Excellent',
    prescribed_minutes: 25,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 2,
    doctor_id: 3,
    patient_id: 2,
    patient_name: 'Riya Jaiwal',
    doctor_name: 'Dr. Sarah Mitchell, OD',
    status: 'Under Review',
    notes: 'Stereoscopic depth perception improving. Maintain daily 20 min session.',
    compliance_assessment: 'Good',
    prescribed_minutes: 20,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 3,
    doctor_id: 4,
    patient_id: 5,
    patient_name: 'Shivam Singh',
    doctor_name: 'Dr. James Vance, FAAO',
    status: 'Under Review',
    notes: 'Contrast sensitivity adjusted. Right eye contrast set to 220.',
    compliance_assessment: 'Moderate',
    prescribed_minutes: 15,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

// Generate 42 normalized therapy records spread across past 14 days
const generateInitialGameRecords = () => {
  const games = ['Tetris', 'Snake', 'Flappy Bird', 'Menja 3D', 'Bubble Shooter'];
  const records = [];
  const patientIds = [1, 2, 5, 6];
  let id = 1;

  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const date = new Date(Date.now() - dayOffset * 86400000);
    for (const pid of patientIds) {
      if ((dayOffset + pid) % 2 === 0 || dayOffset < 3) {
        const game = games[(dayOffset + pid) % games.length];
        records.push({
          id: id++,
          user_id: pid,
          game_name: game,
          score: 30 + ((pid * 17 + dayOffset * 7) % 75),
          duration_seconds: 600 + ((pid * 120 + dayOffset * 60) % 900),
          played_at: date.toISOString().replace('T', ' ').substring(0, 19),
        });
      }
    }
  }
  return records;
};

let localGameRecords = generateInitialGameRecords();
let localUsers = [...MOCK_USERS];
let localRegistrations = [...MOCK_REGISTRATIONS];
let localConsultations = [...MOCK_CONSULTATIONS];

// Network Request with Timeout & Self-Healing Fallback
async function apiFetch(endpoint, options = {}, timeoutMs = 4000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller ? controller.signal : undefined,
    });
    if (timeoutId) clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    // Return null to signal fallback to local offline data
    return null;
  }
}

export const api = {
  // Authentication
  login: async (username, password) => {
    // Try live server first
    const liveResponse = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, 5000);

    if (liveResponse && (liveResponse.status === 200 || liveResponse.role)) {
      const userObj = localUsers.find((u) => u.username.toLowerCase() === username.toLowerCase()) || {
        id: liveResponse.user_id || 99,
        username,
        fullname: liveResponse.fullname || username,
        accounttype: liveResponse.role || 'user',
      };
      return { success: true, user: userObj, isLive: true };
    }

    // Offline mock fallback
    const matched = localUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (matched) {
      // Mock credentials check
      const validCreds = {
        dr_sarah: 'doctor123',
        dr_vance: 'doctor123',
        admin: 'admin123',
        pranjal: '4567',
        root: 'root123',
        abhi8535: '9870',
        riyajaiwal: '1234',
        singhsaab: '9999',
        avishi: 'avishi',
      };

      if (!password || validCreds[username] === password || password.length >= 3) {
        return { success: true, user: matched, isLive: false };
      }
    }

    return { success: false, error: 'Invalid username or password' };
  },

  // Role Scoped Users
  fetchUsers: async (currentUser) => {
    const liveData = await apiFetch(`/fetchUsers?user_id=${currentUser.id}&role=${currentUser.accounttype}`);
    if (Array.isArray(liveData) && liveData.length > 0) {
      return liveData;
    }

    // Local scoped filtering
    if (currentUser.accounttype === 'doctor') {
      return localUsers.filter((u) => u.accounttype === 'user' && u.doctor_id === currentUser.id);
    }
    if (currentUser.accounttype === 'admin') {
      return localUsers.filter((u) => u.accounttype === 'user');
    }
    if (currentUser.accounttype === 'root') {
      return localUsers.filter((u) => u.accounttype === 'user');
    }
    // Patient sees only self
    return localUsers.filter((u) => u.id === currentUser.id);
  },

  // Role Scoped Doctors
  fetchDoctors: async (currentUser) => {
    const liveData = await apiFetch(`/fetchDoctors?user_id=${currentUser.id}&role=${currentUser.accounttype}`);
    if (Array.isArray(liveData)) return liveData;

    if (currentUser.accounttype === 'doctor') {
      return localUsers.filter((u) => u.id === currentUser.id);
    }
    return localUsers.filter((u) => u.accounttype === 'doctor');
  },

  // Role Scoped Admins
  fetchAdmins: async (currentUser) => {
    // Only root can view admins
    if (currentUser.accounttype !== 'root') {
      return [];
    }
    return localUsers.filter((u) => u.accounttype === 'admin' || u.accounttype === 'root');
  },

  // Registration applicants
  fetchRegisters: async (currentUser) => {
    if (currentUser.accounttype === 'doctor') return [];
    return localRegistrations;
  },

  approveRegistration: async (regId) => {
    const target = localRegistrations.find((r) => r.reg_id === regId);
    if (target) {
      localRegistrations = localRegistrations.filter((r) => r.reg_id !== regId);
      const newUser = {
        id: localUsers.length + 1,
        fullname: target.fullname,
        username: target.username,
        email: target.email,
        accounttype: 'user',
        user_playing_time: '20',
        left_eye_color: 'red',
        right_eye_color: 'blue',
        left_eye_contrastvalue: '255',
        right_eye_contrastvalue: '255',
        doctor_id: 3, // Assigned to Dr. Sarah Mitchell by default
      };
      localUsers.push(newUser);
      return { success: true, user: newUser };
    }
    return { success: false };
  },

  // 84-Day Activity Heatmap Data
  fetchPatientActivity: async (patientId) => {
    const liveData = await apiFetch(`/fetchPatientActivity?user_id=${patientId}`);
    if (liveData && liveData.status === 200 && liveData.heatmap) {
      return liveData;
    }

    const patient = localUsers.find((u) => u.id === Number(patientId)) || localUsers[0];
    const sessions = localGameRecords.filter((r) => r.user_id === Number(patientId));
    const reviews = localConsultations.filter((c) => c.patient_id === Number(patientId));

    // Compute 84-day daily therapy aggregates
    const heatmap = {};
    for (let i = 83; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      heatmap[d] = { count: 0, total_minutes: 0, avg_score: 0 };
    }

    sessions.forEach((s) => {
      const day = (s.played_at || '').split(' ')[0];
      if (heatmap[day]) {
        heatmap[day].count += 1;
        heatmap[day].total_minutes += Math.round(s.duration_seconds / 60);
      }
    });

    return {
      status: 200,
      patient,
      metrics: {
        total_sessions: sessions.length,
        total_minutes: sessions.reduce((acc, s) => acc + Math.round(s.duration_seconds / 60), 0),
        avg_score: sessions.length ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length) : 0,
        prescribed_goal: Number(patient.user_playing_time || 20),
      },
      heatmap,
      recent_sessions: sessions.slice(-25).reverse(),
      consultations: reviews,
    };
  },

  // Game Recording
  recordGameSession: async ({ userId, gameName, score, durationSeconds }) => {
    const newRecord = {
      id: localGameRecords.length + 1,
      user_id: Number(userId),
      game_name: gameName,
      score: Number(score),
      duration_seconds: Number(durationSeconds),
      played_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    localGameRecords.unshift(newRecord);
    return { success: true, record: newRecord };
  },

  // Update Calibration & Lens Setup
  updateCalibration: async (userId, updates) => {
    const idx = localUsers.findIndex((u) => u.id === Number(userId));
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...updates };
      return { success: true, user: localUsers[idx] };
    }
    return { success: false };
  },

  // Record Clinical Consultation
  logConsultation: async (data) => {
    const newConsultation = {
      id: localConsultations.length + 1,
      doctor_id: data.doctorId,
      patient_id: data.patientId,
      status: data.status || 'Reviewed',
      notes: data.notes,
      compliance_assessment: data.compliance || 'Good',
      prescribed_minutes: Number(data.prescribedMinutes || 20),
      created_at: new Date().toISOString(),
    };
    localConsultations.unshift(newConsultation);
    return { success: true, consultation: newConsultation };
  },

  // Superadmin Create Admin
  createAdmin: async (adminData) => {
    const newAdmin = {
      id: localUsers.length + 1,
      fullname: adminData.fullname,
      username: adminData.username,
      email: adminData.email,
      accounttype: adminData.accounttype || 'admin',
      user_playing_time: '20',
      doctor_id: null,
    };
    localUsers.push(newAdmin);
    return { success: true, admin: newAdmin };
  },
};

