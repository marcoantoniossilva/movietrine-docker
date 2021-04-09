import React from 'react';
import {Share} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {displayName as appName} from '../../../app.json';

export default class Sharer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieInfo: this.props.movieToShare,
    };
  }

  share = () => {
    const {movieInfo} = this.state;

    const message =
      movieInfo.movie.url +
      '\n\nRecomandação enviada por ' +
      appName +
      '\nBaixe agora: http://play.google.com/store';

    const result = Share.share({
      title: movieInfo.movie.name,
      message: message,
    });
  };

  render = () => {
    return (
      <Icon
        name="sharealt"
        color={'#aaa'}
        size={28}
        onPress={() => {
          this.share();
        }}
      />
    );
  };
}
