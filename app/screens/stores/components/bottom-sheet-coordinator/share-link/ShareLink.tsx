import {bottomSheetActions} from '@/components/types';
import {translate} from '@/i18n/translate';
import React from 'react';
import {Platform, View, ViewStyle} from 'react-native';
import {IconButton, Snackbar, Text} from 'react-native-paper';
import {ShareLinkProps} from './types';
import Clipboard from '@react-native-clipboard/clipboard';

const ShareLink: React.FC<ShareLinkProps> = props => {
  const store = props.metadata.store;

  const [buttonPressed, setButtonPressed] = React.useState('');
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const copyLinkLabel = translate('StoreScreen.ShareBottomSheet.copyLink');
  const messageLabel = translate('StoreScreen.ShareBottomSheet.message');
  const moreLabel = translate('StoreScreen.ShareBottomSheet.more');

  const handleUpdate = React.useCallback(
    (button: string) => {
      switch (button) {
        case copyLinkLabel:
          Clipboard.setString(
            translate('StoreScreen.ShareBottomSheet.linkContent', {
              cloudId: store.cloudId,
              storeLink:
                //TODO: find the right link: web page with the 2 stores
                Platform.OS === 'android'
                  ? 'http://www.android-link.com'
                  : 'http://www.ios-link.com',
            }),
          );
          setShowSnackbar(true);
          break;

        default:
          break;
      }
      setButtonPressed('');
    },
    [copyLinkLabel, store.cloudId],
  );

  React.useEffect(() => {
    if (props.metadata.button && props.metadata.store.cloudId) {
      handleUpdate(props.metadata.button);
    }
  }, [props.metadata, handleUpdate]);

  const handleAction = (button: string) => {
    setButtonPressed(button);
    if (store.cloudId) {
      handleUpdate(button);
    } else {
      props.action({
        metadata: {
          type: bottomSheetActions.createLink,
          value: {store: store, button: button},
        },
      });
    }
  };

  return (
    <View style={$container}>
      <Text variant="headlineSmall">
        {translate('StoreScreen.ShareBottomSheet.shareList')}
      </Text>
      <View style={$buttonsContainer}>
        <ShareButton
          loading={buttonPressed === copyLinkLabel}
          icon="link-variant"
          label={copyLinkLabel}
          onPress={() => handleAction(copyLinkLabel)}
        />
        <ShareButton
          loading={buttonPressed === messageLabel}
          icon="message-processing-outline"
          label={messageLabel}
          onPress={() => handleAction(messageLabel)}
        />
        <ShareButton
          loading={buttonPressed === moreLabel}
          icon="share-variant"
          label={moreLabel}
          onPress={() => handleAction(moreLabel)}
        />
      </View>
      <Snackbar
        onDismiss={() => {
          setShowSnackbar(false);
        }}
        style={$snackbar}
        duration={3000}
        visible={showSnackbar}>
        {translate('common.linkCopied')}
      </Snackbar>
    </View>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};

const $buttonsContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 32,
  marginVertical: 16,
  justifyContent: 'space-between',
};

const ShareButton: React.FC<{
  label: string;
  loading: boolean;
  icon: string;
  onPress: () => void;
}> = props => {
  return (
    <View style={$container}>
      <View>
        <IconButton
          loading={props.loading}
          mode="contained"
          icon={props.icon}
          size={30}
          onPress={props.onPress}
        />
      </View>
      <Text variant="labelSmall">{props.label}</Text>
    </View>
  );
};

const $snackbar: ViewStyle = {};

export default ShareLink;
