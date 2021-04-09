import styled from 'styled-components/native';

export const Avatar = styled.Image`
  padding: 4px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
`;

export const ServiceName = styled.Text`
  padding: 8px;
  font-size: 16px;
  color: #fff;
`;

export const MovieName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

export const MovieNameBar = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

export const MovieDecription = styled.Text`
  font-size: 16px;
  color: #fff;

  text-align: justify;
`;

export const Property = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

export const Value = styled.Text`
  font-size: 16px;
  color: #fff;
`;

export const Likes = styled.Text`
  font-size: 16px;
  color: #fff;
`;

export const EntryNameMovie = styled.TextInput`
  height: 40px;
  flex: 1;
  background-color: #404254;
  border-color: #aaa;
  border-width: 1px;
  border-radius: 8px;
`;

export const CenteredOnTheSameLine = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const LeftOfTheSameLine = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: justify;
  width: 85%;
`;

export const JustifiedAlignment = styled.Text`
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
`;

export const MenuContainer = styled.View`
  flex: 1px;
  font-size: 18px;
  background-color: #333444;
`;

export const HorizontalSpacer = styled.View`
  flex-direction: row;
  padding: 8px;
`;

export const VerticalSpacer = styled.View`
  margin-top: 10px;
`;

export const MenuDivider = styled.View`
  margin: 5px;

  border-bottom-width: 2px;
  border-color: #404254;
`;

export const CommentDivider = styled.View`
  margin-vertical: 5px;
  margin-horizontal: 5px;

  border-bottom-width: 1px;
  border-color: #fff;
`;

export const CommentContainer = styled.View`
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #333444;
`;

export const NewUserCommentContainer = styled.View`
  margin-top: 100px;
  align-self: center;
  width: 95%;
  border-color: #fff;
  border-width: 1;
  border-radius: 6;
  background-color: #fff;
`;

export const AuthorComment = styled.Text`
  padding: 6px;
  font-size: 18px;
  color: #fff;
  text-align: center;
  font-weight: bold;
`;

export const Comment = styled.Text`
  padding: 6px;
  font-size: 16px;
  text-align: justify;
  color: #fff;
`;

export const DateComment = styled.Text`
  padding: 6px;
  font-size: 14px;
  color: #fff;
`;

export const UserCommentContainer = styled.View`
  background-color: #757899;
  border-radius: 6px;
  align-self: center;
  width: 95%;
`;

export const OtherUserCommentContainer = styled.View`
  background-color: #404254;
  border-radius: 6px;
  align-self: center;
  width: 95%;
`;

export const CommentSpacer = styled.View`
  margin-vertical: 10px;
`;
