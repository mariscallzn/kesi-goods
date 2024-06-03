import React, {Component} from 'react';
import {View, ViewStyle} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {ThemeProp} from 'react-native-paper/lib/typescript/types';
import {ControlledTextInputRef} from '../../../../../components/ControlledTextInput';
import {ActionCallback} from '../../../../../inf/multiViewRenderer';
import {Product} from '../../../../../model/types';
import {CONTENT_ACTIONS} from '../../../types';

type HeaderProps = {
  theme: ThemeProp;
  action: ActionCallback;
};

type HeaderState = {
  product?: Product;
};

export interface HeaderRef {
  getProduct(): Product;
  setProduct(product?: Product): void;
}

class Header extends Component<HeaderProps, HeaderState> implements HeaderRef {
  private productNameRef!: React.RefObject<ControlledTextInputRef>;

  constructor(props: HeaderProps) {
    super(props);
    this.productNameRef = React.createRef();
    this.state = {
      product: {id: '', name: ''},
    };
  }

  getProduct(): Product {
    return this.state.product ?? {id: 'invalid', name: 'invalid'};
  }

  setProduct(product?: Product): void {
    if (product) {
      this.setState({...this.state, product: product});
      this.productNameRef.current?.setText(product.name);
    }
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
                metadata: {type: CONTENT_ACTIONS.header.back, value: {}},
              })
            }
          />
          <View
            style={[
              $productContainer,
              {
                borderRadius: this.props.theme.roundness,
                borderColor: this.props.theme.colors?.primary,
              },
            ]}>
            <Text variant="titleLarge">{this.getProduct().name}</Text>
          </View>
          <IconButton
            icon="open-in-new"
            onPress={() =>
              this.props.action({
                metadata: {
                  type: CONTENT_ACTIONS.header.navigateToProducts,
                  value: undefined,
                },
              })
            }
          />
        </View>
      </View>
    );
  }
}

const $navigationContainer: ViewStyle = {
  flexDirection: 'row',
  marginBottom: 16,
  marginEnd: 16,
};

const $productContainer: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  padding: 16,
  justifyContent: 'center',
};

export default Header;
