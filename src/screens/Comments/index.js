import React from 'react';
import {View, Text, Modal, TextInput, Alert} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import SyncStorage from 'sync-storage';
import Swipeable from 'react-native-swipeable-row';
import {Header, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Moment from 'react-moment';
import 'moment-timezone';

const COMMENTS_PER_PAGE = 8;
const MAX_LENGTH_COMMENT = 100;

import {
  MovieNameBar,
  OtherUserCommentContainer,
  UserCommentContainer,
  Comment,
  AuthorComment,
  NewUserCommentContainer,
  CommentContainer,
  DateComment,
  CommentDivider,
  HorizontalSpacer,
  CommentSpacer,
  CenteredOnTheSameLine,
  VerticalSpacer,
} from '../../assets/styles';

import staticComments from '../../assets/dictionary/comments.json';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieName: this.props.navigation.state.params.movieName,
      movieId: this.props.navigation.state.params.movieId,
      comments: [],
      refreshing: false,
      loading: false,
      nextPage: 0,
      viewAddVisible: false,
      textNewComment: '',
    };
  }

  componentDidMount = () => {
    this.loadComments();
  };

  loadComments = () => {
    const {nextPage, movieId, comments} = this.state;

    this.setState({
      loading: true,
    });

    const initialId = nextPage * COMMENTS_PER_PAGE + 1;
    const finalId = initialId + COMMENTS_PER_PAGE - 1;
    const moreComments = staticComments.comments.filter(
      comment =>
        comment._id >= initialId &&
        comment._id <= finalId &&
        comment.movieId == movieId,
    );

    if (moreComments.length) {
      this.setState({
        nextPage: nextPage + 1,
        comments: [...comments, ...moreComments],
        loading: false,
        refreshing: false,
      });
    } else {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  };

  confirmDelete = comment => {
    Alert.alert(null, 'Remover o seu comentário?', [
      {text: 'Não', style: 'cancel'},
      {text: 'Sim', onPress: () => this.removeComment(comment)},
    ]);
  };

  removeComment = commentForRemove => {
    const {comments} = this.state;
    const filteredComments = comments.filter(comment => {
      comment._id !== commentForRemove._id;
    });

    this.setState(
      {
        comments: filteredComments,
      },
      () => {
        this.refresh();
      },
    );
  };

  showCommentUser = comment => {
    return (
      <>
        <Swipeable
          rightButtonWidth={50}
          rightButtons={[
            <View style={{padding: 13}}>
              <HorizontalSpacer />
              <Icon
                name="delete"
                color="#b00"
                size={28}
                onPress={() => {
                  this.confirmDelete(comment);
                }}
              />
            </View>,
          ]}>
          <UserCommentContainer>
            <AuthorComment>{'Você:'}</AuthorComment>
            <Comment>{comment.content}</Comment>
            <DateComment>
              <Moment
                element={Text}
                parse="YYYY-MM-DD HH:mm"
                format="DD/MM/YYYY HH:mm">
                {comment.datetime}
              </Moment>
            </DateComment>
          </UserCommentContainer>
        </Swipeable>
        <CommentSpacer />
      </>
    );
  };

  loadMoreComments = () => {
    const {loading} = this.state;
    if (loading) {
      return;
    }
    this.loadComments();
  };

  showCommentOtherUser = comment => {
    return (
      <>
        <OtherUserCommentContainer>
          <AuthorComment>{comment.user.name}</AuthorComment>
          <Comment>{comment.content}</Comment>
          <DateComment>
            <Moment
              element={Text}
              parse="YYYY-MM-DD HH:mm"
              format="DD/MM/YYYY HH:mm">
              {comment.datetime}
            </Moment>
          </DateComment>
        </OtherUserCommentContainer>
        <CommentSpacer />
      </>
    );
  };

  refresh = () => {
    this.setState(
      {
        refreshing: true,
        loading: false,
        nextPage: 0,
        comments: [],
      },
      () => {
        this.loadComments();
      },
    );
  };

  addComment = () => {
    const {movieId, comments, textNewComment} = this.state;

    const user = SyncStorage.get('user');
    const comment = [
      {
        _id: comments.length + 100,
        movieId: movieId,
        user: {
          userId: 2,
          email: user.email,
          name: user.name,
        },
        datetime: '2020-03-26T12:00-0500',
        content: textNewComment,
      },
    ];
    this.setState({
      comments: [...comment, ...comments],
    });

    this.switchVisibilityViewAdd();
  };

  switchVisibilityViewAdd = () => {
    const {viewAddVisible} = this.state;
    this.setState({viewAddVisible: !viewAddVisible});
  };

  updateTextNewComment = text => {
    this.setState({
      textNewComment: text,
    });
  };

  showViewNewComment = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.refresh();
        }}>
        <CommentContainer>
          <TextInput
            multiline
            editable
            backgroundColor={'#404254'}
            placeholder={'Digite um comentário'}
            maxLength={MAX_LENGTH_COMMENT}
            onChangeText={text => {
              this.updateTextNewComment(text);
            }}
          />
          <CommentDivider />
          <HorizontalSpacer />
          <CenteredOnTheSameLine>
            <Button
              icon={<Icon name="check" size={22} color={'#aaa'} />}
              buttonStyle={{backgroundColor: '#404254'}}
              title="   Gravar"
              type="solid"
              onPress={() => {
                this.addComment();
              }}
            />
            <HorizontalSpacer />
            <Button
              icon={<Icon name="closecircle" size={22} color={'#aaa'} />}
              buttonStyle={{backgroundColor: '#404254'}}
              title="  Cancelar"
              type="solid"
              onPress={() => {
                this.switchVisibilityViewAdd();
              }}
            />
          </CenteredOnTheSameLine>
          <HorizontalSpacer />
        </CommentContainer>
      </Modal>
    );
  };

  showComments = () => {
    const {comments, refreshing, movieName} = this.state;
    const user = SyncStorage.get('user');

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
          centerComponent={<MovieNameBar>{movieName}</MovieNameBar>}
          rightComponent={
            <Icon
              size={28}
              color={'#aaa'}
              name="pluscircleo"
              onPress={() => {
                this.switchVisibilityViewAdd();
              }}
            />
          }
        />
        <CommentContainer>
          <VerticalSpacer />
          <FlatList
            style={{marginBottom: 20}}
            data={comments}
            onEndReached={() => {
              this.loadMoreComments();
            }}
            onEndReachedThreshold={0.1}
            onRefresh={() => this.refresh()}
            refreshing={refreshing}
            keyExtractor={item => String(item._id)}
            renderItem={({item}) => {
              if (item.user.email == user.email) {
                return this.showCommentUser(item);
              } else {
                return this.showCommentOtherUser(item);
              }
            }}></FlatList>
        </CommentContainer>
      </View>
    );
  };

  render = () => {
    const {comments, viewAddVisible} = this.state;

    if (comments) {
      return (
        <>
          {this.showComments()}
          {viewAddVisible && this.showViewNewComment()}
        </>
      );
    } else {
      return null;
    }
  };
}
