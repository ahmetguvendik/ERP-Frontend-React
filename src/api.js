// Merkezi API Servisi
import axios from 'axios';

const BASE_URL = 'http://localhost:5293/api';

// Login
export const login = (data) => axios.post(`${BASE_URL}/Login`, data);

// Kullanıcı Bilgisi
export const getUser = (id) => axios.get(`${BASE_URL}/User/${id}`);
export const createUser = (data) => axios.post(`${BASE_URL}/User`, data);

// Satın Alma Talepleri
export const getPurchasesByUser = (userId) => axios.get(`${BASE_URL}/Purchase?userId=${userId}`);
export const getPurchasesByManager = (managerId) => axios.get(`${BASE_URL}/Purchase/GetPurchaseByManagerId?managerId=${managerId}`);
export const createPurchase = (data) => axios.post(`${BASE_URL}/Purchase`, data);
export const approvePurchase = (id) => axios.put(`${BASE_URL}/Purchase/UpdateApprovedPurchase`, { id, statues: 'Onaylandı' });
export const rejectPurchase = (id, rejectionReason) => axios.put(`${BASE_URL}/Purchase/UpdateRejectPurchase`, { id, statues: 'Reddedildi', rejectionReason });

// İzin Talepleri
export const getLeaveRequestsByUser = (employeeId) => axios.get(`${BASE_URL}/LeaveRequestByEmployeeId?employeeId=${employeeId}`);
export const getLeaveRequestsByManager = (managerId) => axios.get(`${BASE_URL}/LeaveRequestByManagerId/LeaveRequestByManagerId/${managerId}`);
export const getLeaveRequestsByApproved = () => axios.get(`${BASE_URL}/LeaveRequestByApproved/LeaveRequestByApproved`);
export const createLeaveRequest = (data) => axios.post(`${BASE_URL}/LeaveRequest`, data);
export const approveLeaveRequest = (id) => axios.put(`${BASE_URL}/UpdateLeaveRequest`, { id, status: 'Müdür Onayladı', rejectionReason: '' });
export const rejectLeaveRequest = (id, rejectionReason) => axios.put(`${BASE_URL}/UpdateLeaveRequest`, { id, status: 'Reddedildi', rejectionReason });
export const approveHrLeaveRequest = (id) => axios.put(`${BASE_URL}/UpdateHrLeaveRequest/UpdateHrLeaveRequest`, { id, status: 'HR Onayladı' });
export const rejectHrLeaveRequest = (id, rejectionReason) => axios.put(`${BASE_URL}/UpdateHrRejectLeaveRequest/UpdateHrRejectLeaveRequest`, { id, status: 'HR Reddetti', rejectionReason });

// İzin Kotaları
export const getLeaveQuotas = (id) => axios.get(`${BASE_URL}/LeaveQuota?id=${id}`); 