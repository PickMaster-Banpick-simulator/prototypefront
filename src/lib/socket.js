import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // 서버 주소
export const socket = io(SOCKET_URL);