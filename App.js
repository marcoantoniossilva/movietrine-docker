import React from 'react';

import {StatusBar} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import MoviesList from './src/screens/MoviesList';
import Details from './src/screens/Details';
import Comments from './src/screens/Comments';

const Navigator = createStackNavigator(
  {
    MoviesList: {screen: MoviesList},
    Details: {screen: Details},
    Comments: {screen: Comments},
  },
  {
    headerMode: 'none',
  },
);

const Container = createAppContainer(Navigator);

export default function App() {
  return (
    <MenuProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#383838"
        translucent
      />
      <Container />
    </MenuProvider>
  );
}
