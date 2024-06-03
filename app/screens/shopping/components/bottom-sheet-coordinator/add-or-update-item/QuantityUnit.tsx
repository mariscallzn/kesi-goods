import React, {Component} from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {Chip, Divider, IconButton, Text} from 'react-native-paper';
import ControlledTextInput, {
  ControlledTextInputRef,
} from '../../../../../components/ControlledTextInput';
import {translate} from '../../../../../i18n/translate';
import {AppTheme} from '../../../../../theme/theme';

type QuantityUnitState = {
  isDecrementDisabled: boolean;
};
type QuantityUnitProps = {
  theme: AppTheme;
  viewProps?: ViewProps;
  units?: string[];
};
export interface QuantityUnitRef {
  getQuantity(): number | undefined;
  setQuantity(quantity: number | undefined): void;
  getUnit(): string | undefined;
  setUnit(unit: string | undefined): void;
}

export class QuantityUnit
  extends Component<QuantityUnitProps, QuantityUnitState>
  implements QuantityUnitRef
{
  private quantityRef!: React.RefObject<ControlledTextInputRef>;
  private unitRef!: React.RefObject<ControlledTextInputRef>;

  constructor(props: QuantityUnitProps) {
    super(props);
    this.quantityRef = React.createRef();
    this.unitRef = React.createRef();
    this.state = {
      isDecrementDisabled: true,
    };
  }

  getQuantity(): number | undefined {
    return Number(this.quantityRef.current?.getText());
  }

  setQuantity(quantity: number | undefined): void {
    this.quantityRef.current?.setText(quantity ? `${quantity}` : undefined);
    this.setState({
      ...this.state,
      isDecrementDisabled: quantity === 0,
    });
  }

  getUnit(): string | undefined {
    return this.unitRef.current?.getText();
  }

  setUnit(unit: string | undefined): void {
    this.unitRef.current?.setText(unit);
  }

  render() {
    return (
      <View style={{...this.props.viewProps}}>
        <View style={$quantityContainer}>
          <ControlledTextInput
            //@ts-ignore
            ref={this.quantityRef}
            editable={false}
            style={[
              $commonTextInput,
              $quantityTextInput,
              {borderRadius: this.props.theme.roundness},
            ]}
            label={translate(
              'ShoppingListScreen.AddOrUpdateBottomSheet.quantity',
            )}
            mode="outlined"
          />
          <ControlledTextInput
            //@ts-ignore
            ref={this.unitRef}
            editable={false}
            style={[
              $commonTextInput,
              $unitTextInput,
              {borderRadius: this.props.theme.roundness},
            ]}
            label={translate('ShoppingListScreen.AddOrUpdateBottomSheet.unit')}
            mode="outlined"
          />
          <IconButton
            mode={'contained-tonal'}
            size={32}
            icon={'minus'}
            disabled={this.state.isDecrementDisabled}
            onPress={() => {
              let count = Number(this.quantityRef.current?.getText() ?? 0);
              count--;

              this.quantityRef.current?.setText(
                count === 0 ? undefined : `${count}`,
              );

              if (count === 0) {
                this.setState({isDecrementDisabled: true});
              }
            }}
          />
          <IconButton
            mode={'contained-tonal'}
            size={32}
            icon={'plus'}
            onPress={() => {
              let count = Number(this.quantityRef.current?.getText() ?? 0);
              count++;

              this.quantityRef.current?.setText(`${count}`);

              if (count >= 0 && this.state.isDecrementDisabled) {
                //Hack to cause a rerender when quantity is 0
                this.setState({isDecrementDisabled: false});
              }
            }}
          />
        </View>
        <Divider />
        <View style={$unitsContainer}>
          <Text style={$unitText} variant="labelMedium">
            {translate('ShoppingListScreen.AddOrUpdateBottomSheet.unitCP')}
          </Text>
          {this.props.units?.map(_unit => (
            <Chip
              style={$chip}
              key={_unit}
              mode="flat"
              onPress={() => {
                this.unitRef.current?.setText(_unit);
              }}>
              {_unit}
            </Chip>
          ))}
        </View>
      </View>
    );
  }
}

const $quantityContainer: ViewStyle = {
  flexDirection: 'row',
  marginBottom: 16,
  marginHorizontal: 16,
};

const $unitsContainer: ViewStyle = {
  flexDirection: 'row',
  margin: 16,
  alignItems: 'center',
};

const $commonTextInput: ViewStyle = {
  flex: 1,
};

const $quantityTextInput: ViewStyle = {
  marginEnd: 8,
};
const $unitTextInput: ViewStyle = {
  marginEnd: 16,
  marginStart: 8,
};

const $chip: ViewStyle = {
  marginHorizontal: 4,
  borderRadius: 8,
};

const $unitText: ViewStyle = {
  marginEnd: 4,
};

export default QuantityUnit;
