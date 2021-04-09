import React from 'react';
import {View} from 'react-native';
import {Header} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import CardView from 'react-native-cardview';

import Icon from 'react-native-vector-icons/AntDesign';
import SyncStorage from 'sync-storage';
import Toast from 'react-native-simple-toast';

import {
  Avatar,
  MovieNameBar,
  MovieDecription,
  Property,
  Likes,
  CenteredOnTheSameLine,
  LeftOfTheSameLine,
  HorizontalSpacer,
  VerticalSpacer,
  Value,
} from '../../assets/styles';

import Sharer from '../../components/Sharer';

import {imageList} from '../../assets/imgs/imageList';

import staticMovies from '../../assets/dictionary/movies.json';
import {ScrollView} from 'react-native-gesture-handler';

export default class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieId: this.props.navigation.state.params.movieId,
      movieInfo: null,

      liked: false,
    };
  }

  loadMovie = () => {
    const {movieId} = this.state;
    const movies = staticMovies.movies;
    const filteredMovies = movies.filter(movie => movie._id === movieId);

    if (filteredMovies.length) {
      this.setState({
        movieInfo: filteredMovies[0],
      });
    }
  };

  componentDidMount = () => {
    this.loadMovie();
  };

  showSlides = movieId => {
    const slide1 = imageList[`slide1_${movieId}`];
    const slide2 = imageList[`slide2_${movieId}`];
    const slide3 = imageList[`slide3_${movieId}`];
    const slides = [slide1, slide2, slide3];

    return (
      <SliderBox
        dotColor={'#ccc'}
        circleLoop={true}
        autoplay={true}
        inactiveDotColor={'#383838'}
        resizeMethod={'resize'}
        resizeMode={'cover'}
        dotStyle={{
          width: 15,
          height: 15,
          borderRadius: 15,
          marginHorizontal: 5,
        }}
        images={slides}
      />
    );
  };

  like = () => {
    const {movieInfo} = this.state;

    movieInfo.likes++;

    this.setState(
      {
        movieInfo: movieInfo,
        liked: true,
      },
      () => {
        Toast.show('Obrigado pelo seu feedbak!', Toast.LONG);
      },
    );
  };

  dislike = () => {
    const {movieInfo} = this.state;

    movieInfo.likes--;

    this.setState({
      movieInfo: movieInfo,
      liked: false,
    });
  };

  render = () => {
    const {movieInfo, liked} = this.state;
    const user = SyncStorage.get('user');

    if (movieInfo) {
      return (
        <View style={{backgroundColor: '#333444', flex: 1}}>
          <Header
            backgroundColor={'#333444'}
            leftComponent={
              <Icon
                size={28}
                color={'#aaa'}
                name="left"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            }
            centerComponent={
              <MovieNameBar>{movieInfo.movie.name}</MovieNameBar>
            }
            rightComponent={
              <CenteredOnTheSameLine>
                <Sharer movieToShare={movieInfo} />
                <HorizontalSpacer />
                {liked && user && (
                  <Icon
                    name="heart"
                    size={28}
                    color={'#b00'}
                    onPress={() => {
                      this.dislike();
                    }}
                  />
                )}
                {!liked && user && (
                  <Icon
                    name="hearto"
                    size={28}
                    color={'#b00'}
                    onPress={() => {
                      this.like();
                    }}
                  />
                )}
              </CenteredOnTheSameLine>
            }></Header>
          <ScrollView>
            <CardView cardElevation={2} cornerRadius={0}>
              {this.showSlides(movieInfo._id)}
              <View style={{padding: 10, backgroundColor: '#404254'}}>
                <HorizontalSpacer />
                <MovieDecription>{movieInfo.movie.description}</MovieDecription>
                <HorizontalSpacer />
                <LeftOfTheSameLine>
                  <Icon name="heart" size={18} color={'#b00'}>
                    <Likes> {movieInfo.likes}</Likes>
                  </Icon>
                </LeftOfTheSameLine>
                <LeftOfTheSameLine>
                  <Property>{'Gênero: '}</Property>
                  <Value>{movieInfo.movie.genre}</Value>
                </LeftOfTheSameLine>
                <LeftOfTheSameLine>
                  <Property>{'Ano: '}</Property>
                  <Value>{movieInfo.movie.year}</Value>
                </LeftOfTheSameLine>
                <LeftOfTheSameLine>
                  <Property>{'Diretor: '}</Property>
                  <Value>{movieInfo.movie.director}</Value>
                </LeftOfTheSameLine>
                <LeftOfTheSameLine>
                  <Property>{'Elenco: '}</Property>
                  <Value>{movieInfo.movie.cast}</Value>
                </LeftOfTheSameLine>
                <LeftOfTheSameLine>
                  <Property>{'Disponível em:    '}</Property>
                  <Avatar
                    source={imageList[`service_${movieInfo.service_id}`]}
                  />
                </LeftOfTheSameLine>
                <VerticalSpacer />
                <LeftOfTheSameLine>
                  <Property>{'Comentários: '}</Property>
                  <HorizontalSpacer />
                  {user && (
                    <Icon
                      name="message1"
                      size={18}
                      color={'#aaa'}
                      onPress={() => {
                        this.props.navigation.navigate('Comments', {
                          movieId: movieInfo._id,
                          movieName: movieInfo.movie.name,
                        });
                      }}
                    />
                  )}
                </LeftOfTheSameLine>
                <HorizontalSpacer />
              </View>
            </CardView>
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  };
}
