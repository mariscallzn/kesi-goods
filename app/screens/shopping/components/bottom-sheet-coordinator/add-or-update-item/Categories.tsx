import React, {Component} from 'react';
import {View, ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {TouchableRipple, useTheme} from 'react-native-paper';
import {appComponent} from '../../../../../di/appComponent';
import {Category} from '../../../../../model/types';
import {CategoryProps} from './types';

type CategoriesState = {
  categories: Category[];
  selectedCategory?: Category;
};
type CategoriesProps = {};
export interface CategoriesRef {
  getCategory(): Category | undefined;
}

class Categories
  extends Component<CategoriesProps, CategoriesState>
  implements CategoriesRef
{
  constructor(props: CategoriesProps) {
    super(props);
    this.state = {
      categories: [],
    };
    this.fetchCategories();
  }

  getCategory(): Category | undefined {
    return this.state.selectedCategory;
  }

  private async fetchCategories() {
    const categories = await appComponent
      .shoppingListService()
      .fetchCategories();
    this.setState({...this.state, categories: categories});
  }

  render() {
    return (
      <View>
        <FlatList
          contentContainerStyle={$flatListContentContainer}
          horizontal
          keyboardShouldPersistTaps="always"
          data={this.state.categories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <CategoryItem
              category={item}
              isSelected={this.state.selectedCategory === item}
              onCategoryPress={category =>
                this.setState({
                  ...this.state,
                  selectedCategory:
                    this.state.selectedCategory === category
                      ? undefined
                      : category,
                })
              }
            />
          )}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View style={$itemSeparator} />}
        />
      </View>
    );
  }
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: 16,
};

const $itemSeparator: ViewStyle = {
  width: 8,
};

const CategoryItem: React.FC<CategoryProps> = props => {
  const {colors} = useTheme();

  return (
    <TouchableRipple
      borderless
      style={$categoryContainer}
      onPress={() => {
        props.onCategoryPress(props.category);
      }}>
      <View
        style={[$categoryContainer, {backgroundColor: props.category.color}]}>
        <View
          style={
            props.isSelected
              ? {
                  ...$selectedCategoryBorder,
                  borderColor: colors.background,
                }
              : undefined
          }
        />
      </View>
    </TouchableRipple>
  );
};

const $categoryContainer: ViewStyle = {
  borderRadius: 8,
  height: 32,
  width: 32,
  alignItems: 'center',
  justifyContent: 'center',
};

const $selectedCategoryBorder: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  height: 28,
  width: 28,
  borderRadius: 6,
  backgroundColor: 'transparent',
  borderWidth: 5,
};

export default Categories;
