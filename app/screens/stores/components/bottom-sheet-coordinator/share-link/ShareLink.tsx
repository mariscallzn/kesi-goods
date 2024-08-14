import LoginBanner from '@/components/login-banner/LoginBanner';
import {bottomSheetActions} from '@/components/types';
import {translate} from '@/i18n/translate';
import {useAppSelector} from '@/redux/store';
import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {Linking, Platform, Share, View, ViewStyle} from 'react-native';
import {IconButton, Snackbar, Text, useTheme} from 'react-native-paper';
import {ShareLinkProps} from './types';

const ShareLink: React.FC<ShareLinkProps> = props => {
  const accountSelect = useAppSelector(state => state.stores.user);
  const {colors} = useTheme();
  const store = props.metadata.store;

  const [buttonPressed, setButtonPressed] = React.useState('');
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const copyLinkLabel = translate('StoreScreen.ShareBottomSheet.copyLink');
  const messageLabel = translate('StoreScreen.ShareBottomSheet.message');
  const moreLabel = translate('StoreScreen.ShareBottomSheet.more');

  const messageText = translate('StoreScreen.ShareBottomSheet.linkContent', {
    cloudId: store.cloudId,
    storeLink:
      //TODO: find the right link: web page with the 2 stores
      Platform.OS === 'android'
        ? 'http://www.android-link.com'
        : 'http://www.ios-link.com',
  });

  const handleUpdate = React.useCallback(
    (button: string) => {
      switch (button) {
        case copyLinkLabel:
          Clipboard.setString(messageText);
          setShowSnackbar(true);
          break;

        case messageLabel:
          const url = `sms:?body=${encodeURIComponent(messageText)}`;
          Linking.openURL(url);
          break;

        case moreLabel:
          Share.share({message: messageText});
          break;

        default:
          break;
      }
      setButtonPressed('');
    },
    [messageText, copyLinkLabel, messageLabel, moreLabel],
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
      {!accountSelect ? (
        <View style={$loginBannerContainer}>
          <LoginBanner
            onPress={() => {
              props.action({
                metadata: {
                  type: bottomSheetActions.login,
                  value: {store: store, button: 'login'},
                },
              });
            }}
          />
          <View style={$dividerContainer}>
            <View
              style={[$divider, {backgroundColor: colors.onSurfaceDisabled}]}
            />
          </View>
        </View>
      ) : null}
      <View style={$buttonsContainer}>
        <ShareButton
          disable={!accountSelect}
          loading={buttonPressed === copyLinkLabel}
          icon="link-variant"
          label={copyLinkLabel}
          onPress={() => handleAction(copyLinkLabel)}
        />
        <ShareButton
          disable={!accountSelect}
          loading={buttonPressed === messageLabel}
          icon="message-processing-outline"
          label={messageLabel}
          onPress={() => handleAction(messageLabel)}
        />
        <ShareButton
          disable={!accountSelect}
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

const $loginBannerContainer: ViewStyle = {
  marginTop: 16,
  width: '100%',
};

const $dividerContainer: ViewStyle = {width: '100%', flexDirection: 'column'};

const $divider: ViewStyle = {height: 1, margin: 16};

const $container: ViewStyle = {
  alignItems: 'center',
};

const $buttonsContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 32,
  marginBottom: 16,
  marginTop: 8,
  justifyContent: 'space-between',
};

const ShareButton: React.FC<{
  label: string;
  disable: boolean;
  loading: boolean;
  icon: string;
  onPress: () => void;
}> = props => {
  const {colors} = useTheme();
  return (
    <View style={$container}>
      <View>
        <IconButton
          disabled={props.disable}
          loading={props.loading}
          mode="contained"
          icon={props.icon}
          size={30}
          onPress={props.onPress}
        />
      </View>
      <Text
        disabled={props.disable}
        style={{
          color: props.disable ? colors.onSurfaceDisabled : colors.onBackground,
        }}
        variant="labelSmall">
        {props.label}
      </Text>
    </View>
  );
};

const $snackbar: ViewStyle = {};

export default ShareLink;
