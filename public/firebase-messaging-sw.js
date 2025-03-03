importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object
firebase.initializeApp({
  apiKey: "AIzaSyAnwwaeeiM_KFWRrOlI9MGTigCBx6Z7pW4",
  authDomain: "luckydoki-1ccea.firebaseapp.com",
  projectId: "luckydoki-1ccea",
  storageBucket: "luckydoki-1ccea.firebasestorage.app",
  messagingSenderId: "317154671908",
  appId: "1:317154671908:web:6e99a170d6d926a20847b1",
  measurementId: "G-6K2F9LGTLK",
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const newNotification = {
    shopId: payload.data?.shopId,
    title: payload.notification?.title || payload.data?.title,
    body: payload.notification?.body || payload.data?.body,
    type: payload.data?.type,
    timestamp: payload.data?.timestamp || new Date().toISOString(),
  };

  // 브라우저 알림 표시
  const notificationOptions = {
    body: newNotification.body,
    icon: "/logo192.png",
  };

  // Redux store에 알림 추가
  // Note: Service Worker에서는 직접 Redux store에 접근할 수 없으므로,
  // 브로드캐스트 채널을 통해 메인 앱에 알림을 전달
  const channel = new BroadcastChannel("notifications");
  channel.postMessage(newNotification);

  return self.registration.showNotification(
    newNotification.title,
    notificationOptions
  );
});
