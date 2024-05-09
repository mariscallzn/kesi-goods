import React, {Component} from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';

export interface ControlledTextInputRef {
  getText(): string | undefined;
  setText(text: string | undefined): void;
}

class ControlledTextInput
  extends Component<TextInputProps, {text: string | undefined}>
  implements ControlledTextInputRef
{
  constructor(props: TextInputProps) {
    super(props);
    this.state = {text: props.value};
  }

  setText(text: string | undefined): void {
    this.setState({text: text});
  }

  getText(): string | undefined {
    return this.state.text;
  }

  render(): React.ReactNode {
    return (
      <TextInput
        {...this.props}
        value={this.state.text}
        onChangeText={e => {
          this.props?.onChangeText?.(e);
          this.setState({text: e});
        }}
      />
    );
  }
}

export default ControlledTextInput;
