import React from 'react';

import {View, FlatList} from 'react-native';
import {Header, Button} from 'react-native-elements';

import MovieCard from '../../components/MovieCard';
import Icon from 'react-native-vector-icons/AntDesign';

import {
  EntryNameMovie,
  CenteredOnTheSameLine,
  MessageContainer,
  Message,
  VerticalSpacer,
} from '../../assets/styles';
import Menu from '../../components/Menu';
import {DrawerLayout} from 'react-native-gesture-handler';
import {
  getMovies,
  getMoviesByName,
  getMoviesByService,
  moviesAlive,
} from '../../api';

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props);

    this.filterByService = this.filterByService.bind(this);

    this.state = {
      nextPage: 1,
      moviesList: [],

      allowShowFeeds: true,
      serviceSelected: null,
      loading: false,
      refreshing: false,
    };
  }

  showMovies = () => {
    const {nextPage, movieName, serviceSelected} = this.state;

    this.setState({
      loading: true,
    });

    moviesAlive()
      .then(result => {
        if (result.alive === 'yes') {
          this.setState(
            {
              allowShowFeeds: true,
            },
            () => {
              if (serviceSelected) {
                getMoviesByService(serviceSelected._id, nextPage)
                  .then(moreMovies => {
                    this.appendMoreMovies(moreMovies);
                  })
                  .catch(error => {
                    console.error('Erro ao carregar filmes: ' + error);
                  });
              } else if (movieName) {
                getMoviesByName(movieName, nextPage)
                  .then(moreMovies => {
                    this.appendMoreMovies(moreMovies);
                  })
                  .catch(error => {
                    console.error('Erro ao carregar filmes: ' + error);
                  });
              } else {
                getMovies(nextPage)
                  .then(response => {
                    this.appendMoreMovies(response);
                  })
                  .catch(error => {
                    console.error('Erro ao carregar filmes: ' + error);
                  });
              }
            },
          );
        } else {
          this.setState({
            allowShowFeeds: false,
          });
        }
      })
      .catch(error => {
        console.error(
          'Erro ao verificar a disponibilidade do serviço: ' + error,
        );
      });
  };

  appendMoreMovies = moreMovies => {
    const {nextPage, moviesList} = this.state;

    if (moreMovies.length) {
      this.setState({
        nextPage: nextPage + 1,
        moviesList: [...moviesList, ...moreMovies],
      });
    }
    this.setState({
      loading: false,
      refreshing: false,
    });
  };

  componentDidMount = () => {
    this.showMoreMovies();
  };

  showMoreMovies = () => {
    const {loading} = this.state;
    if (loading) {
      return;
    }
    this.showMovies();
  };

  update = () => {
    this.setState(
      {
        refreshing: true,
        moviesList: [],
        nextPage: 1,
        movieName: null,
        serviceSelected: null,
      },
      () => this.showMovies(),
    );
  };

  showMovie = movie => {
    return (
      <MovieCard
        movieToShow={movie}
        navigator={this.props.navigation}
        refreshFunction={this.update}
      />
    );
  };

  updateMovieName = name => {
    this.setState({
      movieName: name,
    });
  };

  showSearchBar = () => {
    const {movieName} = this.state;

    return (
      <CenteredOnTheSameLine>
        <EntryNameMovie
          onChangeText={name => {
            this.updateMovieName(name);
          }}
          value={movieName}></EntryNameMovie>
        <Icon
          style={{paddingLeft: 8}}
          size={20}
          name="search1"
          color={'#aaa'}
          onPress={() => {
            this.setState(
              {
                nextPage: 1,
                moviesList: [],
              },
              () => {
                this.showMovies();
              },
            );
          }}></Icon>
      </CenteredOnTheSameLine>
    );
  };

  showMenu = () => {
    this.menu.openDrawer();
  };

  hideMenu = () => {
    this.menu.closeDrawer();
  };

  filterByService = service => {
    this.setState(
      {
        serviceSelected: service,
        nextPage: 1,
        moviesList: [],
      },
      () => {
        this.showMovies();
      },
    );

    this.menu.closeDrawer();
  };

  showMovieList = moviesList => {
    const {refreshing} = this.state;

    return (
      <DrawerLayout
        drawerWidth={250}
        drawerPosition={DrawerLayout.positions.Left}
        ref={drawerElement => {
          this.menu = drawerElement;
        }}
        renderNavigationView={() => (
          <Menu filter={this.filterByService} closeFunction={this.hideMenu} />
        )}>
        <Header
          backgroundColor={'#333444'}
          leftComponent={
            <Icon
              size={28}
              color={'#aaa'}
              name="menuunfold"
              onPress={() => {
                this.showMenu();
              }}
            />
          }
          centerComponent={this.showSearchBar()}
          rightComponent={<></>}></Header>

        <FlatList
          data={moviesList}
          numColumns={1}
          onEndReached={() => this.showMoreMovies()}
          onEndReachedThreshold={0.1}
          onRefresh={() => this.update()}
          refreshing={refreshing}
          keyExtractor={item => String(item._id)}
          renderItem={({item}) => {
            return <View style={{width: '100%'}}>{this.showMovie(item)}</View>;
          }}></FlatList>
      </DrawerLayout>
    );
  };

  showRefreshButton = () => {
    return (
      <MessageContainer>
        <Message> O serviço de filmes não está funcionando :(</Message>
        <Message> Tente novamente mais tarde</Message>
        <VerticalSpacer />
        <Button
          title={'  Tentar agora'}
          icon={<Icon name={'reload1'} size={22} color={'#fff'} />}
          type={'solid'}
          buttonStyle={{backgroundColor: '#404254'}}
          onPress={() => {
            this.showMovies();
          }}
        />
      </MessageContainer>
    );
  };

  showLoadingMessage = () => {
    return (
      <MessageContainer>
        <Message> Carregando filmes, aguarde...</Message>
      </MessageContainer>
    );
  };

  render = () => {
    const {moviesList, allowShowFeeds} = this.state;

    if (!allowShowFeeds) {
      return this.showRefreshButton();
    }

    if (moviesList.length) {
      return this.showMovieList(moviesList);
    }
    return this.showLoadingMessage();
  };
}
