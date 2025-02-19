importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object
firebase.initializeApp({
  apiKey: 'AIzaSyAnwwaeeiM_KFWRrOlI9MGTigCBx6Z7pW4',
  authDomain: 'luckydoki-1ccea.firebaseapp.com',
  projectId: 'luckydoki-1ccea',
  storageBucket: 'luckydoki-1ccea.firebasestorage.app',
  messagingSenderId: '317154671908',
  appId: '1:317154671908:web:6e99a170d6d926a20847b1',
  measurementId: 'G-6K2F9LGTLK',
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
