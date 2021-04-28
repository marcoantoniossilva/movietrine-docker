import React from 'react';
import {View, Text, Modal, TextInput, Alert} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import SyncStorage from 'sync-storage';
import Swipeable from 'react-native-swipeable-row';
import {Header, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Moment from 'react-moment';
import 'moment-timezone';
import Toast from 'react-native-simple-toast';

import {
  getComments,
  getAddComment,
  getRemoveComments,
  commentsAlive,
} from '../../api';

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
  Message,
  MessageContainer,
} from '../../assets/styles';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieName: this.props.navigation.state.params.movieName,
      movieId: this.props.navigation.state.params.movieId,
      comments: [],
      refreshing: false,
      loading: false,
      nextPage: 1,
      viewAddVisible: false,
      textNewComment: '',
      allowComment: true,
    };
  }

  componentDidMount = () => {
    this.loadComments();
  };

  loadComments = () => {
    const {nextPage, movieId, comments} = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {},
    );

    commentsAlive()
      .then(result => {
        if (result.alive === 'yes') {
          this.setState(
            {
              allowComment: true,
            },
            () => {
              getComments(movieId, nextPage)
                .then(moreComments => {
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
                    Toast.show('Sem comentários para exibir.', Toast.LONG);
                  }
                })
                .catch(error => {
                  console.error('erro ao recuperar os comentários: ', error);
                });
            },
          );
        } else {
          this.setState({
            allowComment: false,
          });
        }
      })
      .catch(error => {
        console.error(
          'Erro ao verificar a disponibilidade do serviço de comentários: ' +
            error,
        );
      });
  };

  confirmDelete = comment => {
    Alert.alert(null, 'Remover o seu comentário?', [
      {text: 'Não', style: 'cancel'},
      {text: 'Sim', onPress: () => this.removeComment(comment)},
    ]);
  };

  removeComment = commentForRemove => {
    getRemoveComments(commentForRemove._id)
      .then(result => {
        if (result.status === 'ok') {
          this.setState(
            {
              nextPage: 1,
              comments: [],
            },
            () => {
              this.loadComments();
            },
          );
        }
      })
      .catch(error => {
        console.error('erro ao remover o comentário: ' + error);
      });
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
        nextPage: 1,
        comments: [],
      },
      () => {
        this.loadComments();
      },
    );
  };

  addComment = () => {
    const {movieId, textNewComment} = this.state;

    commentsAlive()
      .then(result => {
        if (result.alive === 'yes') {
          this.setState(
            {
              allowComment: true,
            },
            () => {
              getAddComment(movieId, textNewComment)
                .then(result => {
                  if (result.status === 'ok') {
                    this.setState(
                      {
                        nextPage: 1,
                        comments: [],
                      },
                      () => {
                        this.loadComments();
                      },
                    );
                  }
                })
                .catch(error => {
                  console.error('erro ao gravar o comentário: ' + error);
                });
            },
          );
        } else {
          this.setState({
            allowComment: false,
          });
        }
      })
      .catch(error => {
        console.error('Erro ao conectar ao serviço de comentários: ' + error);
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
            style={{backgroundColor: '#404254', color: '#eeeeee', fontSize: 18}}
            placeholderTextColor={'#eeeeee'}
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
              if (item.user.email == user.account) {
                return this.showCommentUser(item);
              } else {
                return this.showCommentOtherUser(item);
              }
            }}></FlatList>
        </CommentContainer>
      </View>
    );
  };

  showLoadingMessage = () => {
    return (
      <MessageContainer>
        <Message> Carregando comentários, aguarde...</Message>
      </MessageContainer>
    );
  };

  showRefreshButton = () => {
    return (
      <MessageContainer>
        <Message> O serviço de comentários não está funcionando :(</Message>
        <Message> Tente novamente mais tarde</Message>
        <VerticalSpacer />
        <Button
          title={'  Tentar agora'}
          icon={<Icon name={'reload1'} size={22} color={'#fff'} />}
          type={'solid'}
          buttonStyle={{backgroundColor: '#404254'}}
          onPress={() => {
            this.loadComments();
          }}
        />
      </MessageContainer>
    );
  };

  render = () => {
    const {comments, viewAddVisible, allowComment} = this.state;

    if (allowComment) {
      if (comments.length) {
        return (
          <>
            {this.showComments()}
            {viewAddVisible && this.showViewNewComment()}
          </>
        );
      } else {
        return this.showLoadingMessage();
      }
    } else {
      return this.showRefreshButton();
    }
  };
}
