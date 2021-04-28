import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Card, CardContent, CardImage, CardItem} from 'react-native-cards';
import Icon from 'react-native-vector-icons/AntDesign';

import {
  Avatar,
  MovieName,
  MovieDecription,
  Property,
  LeftOfTheSameLine,
  Likes,
} from '../../assets/styles';

import {getImageService, getSkinMovie} from '../../api';

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieInfo: this.props.movieToShow,
      navigator: this.props.navigator,
      refreshFunction: this.props.refreshFunction,
    };
  }

  render = () => {
    const {movieInfo, navigator, refreshFunction} = this.state;

    return (
      <TouchableOpacity
        onPress={() => {
          navigator.navigate('Details', {
            movieId: movieInfo._id,
            refreshFunction,
          });
        }}>
        <View style={{backgroundColor: '#333444', flex: 1}}>
          <Card
            style={{
              backgroundColor: '#404254',
              borderColor: '#333444',
              borderWidth: 2,
              borderRadius: 15,
            }}>
            <CardImage source={getSkinMovie(movieInfo.movie._id)} />
            <CardContent>
              <MovieName>{movieInfo.movie.name}</MovieName>
            </CardContent>
            <CardContent>
              <MovieDecription>{movieInfo.movie.description}</MovieDecription>
            </CardContent>
            <CardContent>
              <Property>{movieInfo.movie.genre} </Property>
              <LeftOfTheSameLine>
                <Icon name="heart" size={18} color={'#b00'}>
                  <Likes> {movieInfo.likes}</Likes>
                </Icon>
              </LeftOfTheSameLine>
            </CardContent>
            <CardContent>
              <LeftOfTheSameLine>
                <Avatar source={getImageService(movieInfo.service.avatar)} />
              </LeftOfTheSameLine>
            </CardContent>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };
}
