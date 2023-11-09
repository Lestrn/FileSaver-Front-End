import axios from 'axios';
const baseURL = 'https://localhost:7115';
axios.defaults.baseURL = baseURL;

const routeAuth = "/api/Auth/"

export async function register(newUser) {
  const { data } = await axios.post(`${routeAuth}Register`, newUser);
  console.log(data);
  return data;
}

export async function login(loginUser) {
  const { data } = await axios.post(`${routeAuth}LogIn`, loginUser);
  console.log(data);
  return data;
}

export async function confirmCode(code) {
  const { data } = await axios.post(`${routeAuth}ConfirmCode`, code);
  console.log(data);
  return data;
}

export async function recoverAccount(email) {
  const { data } = await axios.post(`${routeAuth}RecoverAccount`, email);
  console.log(data);
  return data;
}

export async function confirmRecovery(code) {
  const { data } = await axios.post(`${routeAuth}ConfirmRecoveryCode`, code);
  console.log(data);
  return data;
}
// gets user
const ruoteUser = "/api/User/"
export async function downloadFile(fileId,  ownerId, token) {
  
  const  response  = await fetch(`${baseURL}${ruoteUser}DownloadFile?fileId=${fileId}&ownerId=${ownerId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  });
  return response;
}

export async function getAllUsers(token) {
  const { data } = await axios.get(`${ruoteUser}GetAllUsers`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getUserInfo(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetUserInfo?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getAllFilesByUserId(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetAllFilesByUserId?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getFilesThatUserShares(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetFilesThatUserShares?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getPendingFriendRequests(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetPendingFriendRequests?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getAcceptedFriendRequests(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetAcceptedFriendRequests?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getDeclinedFriendRequests(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetDeclinedFriendRequests?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getReceivedMessages(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetReceivedMessages?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function getSentMessages(userId, token) {
  const { data } = await axios.get(`${ruoteUser}GetSentMessages?userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

// end gets

//post

export async function uploadFile(userId, fileBinary, token) {
  const { data } = await axios.post(`${ruoteUser}UploadFile?userId=${userId}`, fileBinary, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function shareFile(fileShareDTO, token) {
  const { data } = await axios.post(`${ruoteUser}ShareFile`, fileShareDTO, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function sendMessage(sendMessageDTO, token) {
  const { data } = await axios.post(`${ruoteUser}SendMessage`, sendMessageDTO, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

//end  posts

//put

export async function updateRole(userId, role, token) {
  const { data } = await axios.put(`${ruoteUser}UpdateRole?userId=${userId}&role=${role}`, null, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function uploadAvatar(userId, imageBinary, token) {
  const { data } = await axios.put(`${ruoteUser}UploadAvatar?userId=${userId}`, imageBinary, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function changePassword(userId, newPassword, token) {
  const { data } = await axios.put(`${ruoteUser}ChangePassword?userId=${userId}&newPassword=${newPassword}`, null,  {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function sendFriendRequest(senderId, receiverUsername, token) {
  const { data } = await axios.put(`${ruoteUser}SendFriendRequest?senderId=${senderId}&receiverUsername=${receiverUsername}`, null ,{
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function acceptFriendRequest(senderId, receiverId, token) {
  const { data } = await axios.put(`${ruoteUser}AcceptFriendRequest?senderId=${senderId}&receiverId=${receiverId}`, null, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function denyFriendRequest(senderId, receiverId, token) {
  const { data } = await axios.put(`${ruoteUser}DenyFriendRequest?senderId=${senderId}&receiverId=${receiverId}`,  null, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

//end puts

//delete

export async function stopSharingFile(fileId, ownerId, sharedWithId,  token) {
  const { data } = await axios.delete(`${ruoteUser}StopSharingFile?fileId=${fileId}&ownerId=${ownerId}&sharedWithId=${sharedWithId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function deleteFileById(fileId, ownerId, token) {
  const { data } = await axios.delete(`${ruoteUser}DeleteFileById?fileId=${fileId}&ownerId=${ownerId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function deleteFriendship(userId, friendId, token) {
  const { data } = await axios.delete(`${ruoteUser}DeleteFriendship?userId=${userId}&friendId=${friendId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}

export async function deleteMessage(msgId, userId, token) {
  const { data } = await axios.delete(`${ruoteUser}DeleteMessage?msgId=${msgId}&userId=${userId}`, {
    headers: {
      Authorization: `bearer ${token}`,
    } });
  return data;
}
//end deletes

