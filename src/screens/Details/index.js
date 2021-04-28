import React from 'react';
import {View} from 'react-native';
import {Header} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import CardView from 'react-native-cardview';

import Icon from 'react-native-vector-icons/AntDesign';
import SyncStorage from 'sync-storage';
import Toast from 'react-native-simple-toast';

import {
  getMovie,
  getSlideMovie,
  getImageService,
  getUserLiked,
  getUserLike,
  getUserUnlike,
  likesAlive,
  commentsAlive,
} from '../../api';

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

import {ScrollView} from 'react-native-gesture-handler';

export default class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieId: this.props.navigation.state.params.movieId,
      refreshFunction: this.props.navigation.state.params.refreshFunction,
      movieInfo: null,

      allowLike: false,
      allowComment: false,

      liked: false,
    };
  }

  loadMovie = () => {
    const user = SyncStorage.get('user');
    const {movieId} = this.state;
    getMovie(movieId)
      .then(movieFromBd => {
        this.setState(
          {
            movieInfo: movieFromBd,
          },
          () => {
            if (user) {
              this.verifyUserLiked();
            }
          },
        );
      })
      .catch(error => {
        console.error('Erro ao carregar filme: ' + error);
      });
  };

  verifyUserLiked = () => {
    const {movieId} = this.state;

    getUserLiked(movieId)
      .then(result => {
        this.setState({liked: result.likes > 0});
      })
      .catch(error => {
        console.error(
          'erro ao verificar se o usuário deu like no filme: ' + error,
        );
      });
  };

  componentDidMount = () => {
    const {allowComment, allowLike} = this.state;

    likesAlive()
      .then(result => {
        if (result.alive === 'yes') {
          this.setState({
            allowLike: true,
          });
        } else {
          this.setState(
            {
              allowLike: false,
            },
            () => {
              Toast.show('Não é possível registrar likes agora :(', Toast.LONG);
            },
          );
        }
      })
      .catch(error => {
        console.error(
          'Erro ao verificar a disponibilidade do serviço de likes: ' + error,
        );
      });

    commentsAlive()
      .then(result => {
        if (result.alive === 'yes') {
          this.setState({
            allowComment: true,
          });
        } else {
          this.setState(
            {
              allowComment: false,
            },
            () => {
              Toast.show(
                'Não é possível registrar comentários agora :(',
                Toast.LONG,
              );
            },
          );
        }
      })
      .catch(error => {
        console.error(
          'Erro ao verificar a disponibilidade do serviço de comentários: ' +
            error,
        );
      });

    this.loadMovie();
  };

  showSlides = movieId => {
    const slide1 = getSlideMovie(movieId, 1);
    const slide2 = getSlideMovie(movieId, 2);
    const slide3 = getSlideMovie(movieId, 3);
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
    const {movieId, refreshFunction} = this.state;

    getUserLike(movieId)
      .then(result => {
        if (result.status === 'ok') {
          this.loadMovie();
          Toast.show('Obrigado pelo seu feedback!', Toast.LONG);
          refreshFunction();
        } else {
          Toast.show(
            'Ocorreu um erro ao registrar o like no filme, tente novamente mais tarde',
            Toast.LONG,
          );
        }
      })
      .catch(error => {
        console.error('erro ao registrar o like no filme: ' + error);
      });
  };

  dislike = () => {
    const {movieId, refreshFunction} = this.state;

    getUserUnlike(movieId)
      .then(result => {
        if (result.status === 'ok') {
          this.loadMovie();
          refreshFunction();
        } else {
          Toast.show(
            'Ocorreu um erro ao registrar o like no filme, tente novamente mais tarde',
            Toast.LONG,
          );
        }
      })
      .catch(error => {
        console.error('erro ao registrar o deslike no filme: ' + error);
      });
  };

  render = () => {
    const {movieInfo, liked, allowLike, allowComment} = this.state;
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
                {allowLike && liked && user && (
                  <Icon
                    name="heart"
                    size={28}
                    color={'#b00'}
                    onPress={() => {
                      this.dislike();
                    }}
                  />
                )}
                {allowLike && !liked && user && (
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
                  <Avatar source={getImageService(movieInfo.service.avatar)} />
                </LeftOfTheSameLine>
                <VerticalSpacer />
                <LeftOfTheSameLine>
                  <Property>{'Comentários: '}</Property>
                  <HorizontalSpacer />
                  {allowComment && user && (
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
