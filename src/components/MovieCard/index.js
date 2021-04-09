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

import {imageList} from '../../assets/imgs/imageList';

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: this.props.movieToShow,
      navigator: this.props.navigator,
    };
  }

  render = () => {
    const {feed, navigator} = this.state;

    return (
      <TouchableOpacity
        onPress={() => {
          navigator.navigate('Details', {
            movieId: feed._id,
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
            <CardImage source={imageList[`capa_${feed._id}`]} />
            <CardContent>
              <MovieName>{feed.movie.name}</MovieName>
            </CardContent>
            <CardContent>
              <MovieDecription>{feed.movie.description}</MovieDecription>
            </CardContent>
            <CardContent>
              <Property>{feed.movie.genre} </Property>
              <LeftOfTheSameLine>
                <Icon name="heart" size={18} color={'#b00'}>
                  <Likes> {feed.likes}</Likes>
                </Icon>
              </LeftOfTheSameLine>
            </CardContent>
            <CardContent>
              <LeftOfTheSameLine>
                <Avatar source={imageList[`service_${feed.service_id}`]} />
              </LeftOfTheSameLine>
            </CardContent>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };
}
