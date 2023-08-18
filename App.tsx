import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Button, Text, View } from 'react-native';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

async function initPushNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      console.log('@setNotificationHandler#handleNotification');
      return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowAlert: true,
      };
    },
    handleSuccess: () => {
      console.log('@setNotificationHandler#handleSuccess');
    },
    handleError: () => {
      console.log('@setNotificationHandler#handleError');
    },
  });

  Notifications.addNotificationReceivedListener(() => {
    console.log('@addNotificationReceivedListener');
  });

  Notifications.addNotificationResponseReceivedListener(() => {
    console.log('@addNotificationResponseReceivedListener');
  });

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, () => {
    alert('@backgroundNotificationTask');
    console.log('@backgroundNotificationTask');
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
}

initPushNotifications();

export default function () {
  const [permissionStatus, setPermissionStatus] =
    useState<Notifications.NotificationPermissionsStatus>();
  const [deviceToken, setDeviceToken] = useState('');

  const syncPermissionStatus = useCallback(async () => {
    const existingStatus = await Notifications.getPermissionsAsync();
    setPermissionStatus(existingStatus);
  }, []);

  const syncDeviceToken = useCallback(async () => {
    const { data } = await Notifications.getDevicePushTokenAsync();
    setDeviceToken(data);
  }, []);

  useEffect(() => {
    const sync = async () => {
      syncPermissionStatus();
      syncDeviceToken();
    };

    sync();
    AppState.addEventListener('change', sync);
  }, []);

  if (permissionStatus === undefined) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  if (permissionStatus.status !== 'granted') {
    if (permissionStatus.canAskAgain) {
      return (
        <Screen>
          <Button
            title="Enable Push Notifications"
            onPress={async () => {
              const nextStatus = await Notifications.requestPermissionsAsync();
              setPermissionStatus(nextStatus);
            }}
          />
        </Screen>
      );
    } else {
      return (
        <Screen>
          <Text style={{ textAlign: 'center' }}>
            Push notification permission status is "{permissionStatus.status}".
          </Text>
          <Text style={{ textAlign: 'center' }}>
            Please go to Settings and enable push notifications.
          </Text>
        </Screen>
      );
    }
  }

  return (
    <Screen>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        Device Token
      </Text>
      <Text selectable style={{ textAlign: 'center' }}>
        {deviceToken || '–'}
      </Text>
    </Screen>
  );
}

type ScreenProps = {
  children: ReactNode;
};

function Screen({ children }: ScreenProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 16,
      }}
    >
      {children}
    </View>
  );
}
