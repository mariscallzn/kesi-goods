import React, {Component} from 'react';
import {View, ViewStyle} from 'react-native';
import {Chip, IconButton} from 'react-native-paper';
import {ThemeProp} from 'react-native-paper/lib/typescript/types';
import ControlledTextInput, {
  ControlledTextInputRef,
} from '../../../../../components/ControlledTextInput';
import {translate} from '../../../../../i18n/translate';
import {ActionCallback} from '../../../../../inf/multiViewRenderer';
import {Product} from '../../../../../model/types';
import {bottomSheetActions} from '../types';
import {appComponent} from '../../../../../di/appComponent';
import {FlatList} from 'react-native-gesture-handler';

type HeaderProps = {
  theme: ThemeProp;
  action: ActionCallback;
};

type HeaderState = {
  product?: Product;
  suggestions: Product[];
};

export interface HeaderRef {
  getProduct(): Product;
}

class Header extends Component<HeaderProps, HeaderState> implements HeaderRef {
  private productNameRef!: React.RefObject<ControlledTextInputRef>;
  private flatListRef!: React.RefObject<FlatList<Product[]>>;

  constructor(props: HeaderProps) {
    super(props);
    this.productNameRef = React.createRef();
    this.flatListRef = React.createRef();
    this.state = {
      product: undefined,
      suggestions: [],
    };
    this.fetchSuggestions();
  }

  private async fetchSuggestions(name?: string) {
    const suggestions = await appComponent
      .shoppingListService()
      .findByNameOrFetch(name);
    this.setState({...this.state, suggestions: suggestions.slice(0, 5)});
    this.flatListRef.current?.scrollToIndex({index: 0, animated: false});
  }

  getProduct(): Product {
    return this.state.product ?? {id: 'invalid', name: 'invalid'};
  }

  render(): React.ReactNode {
    return (
      <View>
        <View style={$navigationContainer}>
          <IconButton
            size={26}
            icon="arrow-left"
            onPress={() =>
              this.props.action({
                metadata: {type: bottomSheetActions.back, value: {}},
              })
            }
          />
          <ControlledTextInput
            //@ts-ignore
            ref={this.productNameRef}
            style={[
              $commonTextInput,
              {borderRadius: this.props.theme.roundness},
            ]}
            placeholder={translate(
              'ShoppingListScreen.AddOrUpdateBottomSheet.addTextInput',
            )}
            underlineStyle={$textInputUnderLine}
            autoFocus={true}
            onChangeText={async e => {
              await this.fetchSuggestions(e);
              this.setState({
                product: {id: this.state.product?.id ?? '', name: e},
              });
            }}
          />
          {/* <IconButton icon="open-in-new" onPress={() => props.action()} /> */}
        </View>
        <FlatList
          //@ts-ignore
          ref={this.flatListRef}
          contentContainerStyle={$flatList}
          data={this.state.suggestions}
          keyboardShouldPersistTaps={'always'}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View style={$chipsSeparator} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <Chip
              style={$suggestionChip}
              onPress={() => {
                this.setState({suggestions: [], product: item});
                this.productNameRef.current?.setText(item.name);
              }}>
              {item.name}
            </Chip>
          )}
        />
      </View>
    );
  }
}

const $navigationContainer: ViewStyle = {
  flexDirection: 'row',
  marginBottom: 16,
  marginEnd: 16,
};

const $commonTextInput: ViewStyle = {
  flex: 1,
};

const $textInputUnderLine: ViewStyle = {
  backgroundColor: 'transparent',
};

const $flatList: ViewStyle = {
  paddingHorizontal: 16,
};

const $chipsSeparator: ViewStyle = {
  width: 12,
};

const $suggestionChip: ViewStyle = {
  marginVertical: 8,
};

export default Header;
