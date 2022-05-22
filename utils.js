import { auth, db } from "./firebase"
import * as Notifications from 'expo-notifications';

export function hasValue (variable) {
    return variable === undefined || variable === null ? false : true
}

export async function getTenantsUid () {
  let tenantsUids = []
  const querySnapshot = await db.collection('address').doc(global.currentAddress).collection('tenants').get()
  querySnapshot.forEach((documentSnapshot) => {
    tenantsUids.push(documentSnapshot.id)
  })
  return tenantsUids
}

async function getNotificationToken (uid) {
    let notificationToken = ''
    if (uid) {
        const result = await db.collection('users').doc(uid).get()
        notificationToken = result.data().notificationToken
    }
    return notificationToken
} 

export async function sendPushNotification (uid, title, body) {
    let notificationToken = await getNotificationToken(uid)
    console.log("from send push notif: " + notificationToken)
    if (notificationToken && notificationToken !== '') {
      let response = fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: notificationToken,
            data: { extraData: 'Some data' },
            title: title,
            body: body,
          }),
        })
    }
}

export async function schedulePushNotification() {
  console.log("aa")
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "APPartement",
      body: "Perioada de transmitere a indexului a început!"
    },
    trigger: {
      type: "calendar",
      repeats: true,
      dateComponents: {
        day: 15,
        hour: 17,
        minute: 56,
      }},
  });
  console.log("notif id on scheduling", id)
  return id;
}