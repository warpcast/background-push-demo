# Background Push Demo

1. In `app.json` and `Info.plist`, replace the bundle identifier (`com.merkle-manufactory.background-push-demo`) with a unique value.
2. Run `yarn install` to install dependencies.
3. Plug in a physical iPhone via USB.
4. Run `yarn ios` and choose the physical device to build the app.
5. Visit [App Store Connect](https://appstoreconnect.apple.com/apps) and create a new iOS app with the new bundle ID. Be sure to enable the Push Notification capability.
6. Run `yarn ios` to rebuild the app.
7. Enable push notifications.
8. Copy the device token.
9. Visit the [Apple Push Notification Console](https://icloud.developer.apple.com/dashboard/notifications) and navigate to the new push notification form.
10. Paste the copied device token, and with the app foregrounded, send a normal alert notification.
11. Observe `setNotificationHandler#handleNotification`, `addNotificationReceivedListener`, and `setNotificationHandler#handleSuccess` in the console logs, indicating that the app is receiving the notification.
12. Start a new test push form in the Apple Push Notification Console. Paste the device token, and with the app backgrounded, send a background notification (i.e. change the `apns-push-type` to `background`, which will add `content-available: 1` to the payload).
13.  Observe `backgroundNotificationTask` in the console logs, indicating that the app is receiving the notification.
14. Return once more to the Apple Push Notification Console to create a new test notification. Send a background notification to the device, but this time with the app in the foreground.
15. Observe that there are no logs from `setNotificationHandler#handleNotification`, `addNotificationReceivedListener`, `addNotificationResponseReceivedListener`, or `backgroundNotificationTask`.
