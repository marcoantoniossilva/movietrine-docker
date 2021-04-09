import React from 'react';

import {View, FlatList} from 'react-native';
import {Header} from 'react-native-elements';

import staticsMovies from '../../assets/dictionary/movies.json';
import MovieCard from '../../components/MovieCard';
import Icon from 'react-native-vector-icons/AntDesign';

import {EntryNameMovie, CenteredOnTheSameLine} from '../../assets/styles';
import Menu from '../../components/Menu';
import {DrawerLayout} from 'react-native-gesture-handler';

const MOVIES_PER_PAGE = 4;

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props);

    this.filterByService = this.filterByService.bind(this);

    this.state = {
      nextPage: 0,
      moviesList: [],

      serviceSelected: null,
      loading: false,
      refreshing: false,
    };
  }

  showMovies = () => {
    const {nextPage, moviesList, movieName, serviceSelected} = this.state;

    this.setState({
      loading: true,
    });
    if (serviceSelected) {
      const moreMovies = staticsMovies.movies.filter(
        moviesList => moviesList.service_id == serviceSelected._id,
      );

      this.setState({
        moviesList: moreMovies,
        refreshing: false,
        loading: false,
      });
    } else if (movieName) {
      const moreMovies = staticsMovies.movies.filter(moviesList =>
        moviesList.movie.name.toLowerCase().includes(movieName.toLowerCase()),
      );

      this.setState({
        moviesList: moreMovies,
        refreshing: false,
        loading: false,
      });
    } else {
      const initialId = nextPage * MOVIES_PER_PAGE + 1;
      const finalId = initialId + MOVIES_PER_PAGE - 1;
      const moreMovies = staticsMovies.movies.filter(
        moviesList => moviesList._id >= initialId && moviesList._id <= finalId,
      );
      if (moreMovies.length) {
        this.setState({
          nextPage: nextPage + 1,
          moviesList: [...moviesList, ...moreMovies],
          loading: false,
          refreshing: false,
          movieName: null,
          serviceSelected: null,
        });
      } else {
        this.setState({
          loading: false,
          refreshing: false,
        });
      }
    }
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
        nextPage: 0,
        movieName: null,
        serviceSelected: null,
      },
      () => {
        this.showMovies();
      },
    );
  };

  showMovie = movie => {
    return <MovieCard movieToShow={movie} navigator={this.props.navigation} />;
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
            this.showMovies();
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

  render = () => {
    const {moviesList} = this.state;

    if (moviesList.length) {
      return this.showMovieList(moviesList);
    } else {
      return null;
    }
  };
}
