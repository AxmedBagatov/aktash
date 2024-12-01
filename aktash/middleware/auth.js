// middleware/test.js
export default function ({ route }) {
  console.log('Test middleware работает для маршрута:', route.path);
}
