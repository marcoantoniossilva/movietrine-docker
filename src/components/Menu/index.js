import React from 'react';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {LoginOptionsMenu} from '../../components/Login';
import Toast from 'react-native-simple-toast';
import SyncStorage from 'sync-storage';
import {getServices, getImageService, servicesAlive} from '../../api';

import {
  Avatar,
  ServiceName,
  MenuContainer,
  MenuDivider,
  LeftOfTheSameLine,
} from '../../assets/styles';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refresh: true,
      filter: props.filter,
      closeFunction: props.closeFunction,

      services: [],
    };

    this.user;
  }

  componentDidMount = () => {
    getServices()
      .then(moreServices => {
        this.setState({
          services: moreServices,
        });
      })
      .catch(error => {
        console.error('Ocorreu um erro ao criar o menu de serviços: ' + error);
      });
  };

  showService = service => {
    const {filter} = this.state;

    return (
      <TouchableOpacity
        key={service._id}
        onPress={() => {
          filter(service);
        }}>
        <MenuDivider />
        <LeftOfTheSameLine>
          <Avatar source={getImageService(service.avatar)} />
          <ServiceName>{service.name}</ServiceName>
        </LeftOfTheSameLine>
      </TouchableOpacity>
    );
  };

  onLogin = accountService => {
    const {closeFunction} = this.state;

    this.user = SyncStorage.get('user');
    this.setState(
      {
        refresh: true,
      },
      () => {
        Toast.show(
          'Bem vindo ' +
            this.user.name +
            ', você logou com sucesso com sua conta do ' +
            accountService.signer,
          Toast.LONG,
        );
        closeFunction();
      },
    );
  };

  onLogout = signer => {
    const {closeFunction} = this.state;
    this.setState(
      {
        refresh: true,
      },
      () => {
        Toast.show(
          'Até mais ' +
            this.user.name +
            ', você deslogou com sucesso com sua conta do ' +
            signer,
        );
        closeFunction();
      },
    );
  };

  render = () => {
    const {services} = this.state;

    return (
      <SafeAreaInsetsContext.Consumer>
        {insets => (
          <ScrollView style={{paddingTop: insets.top}}>
            <LoginOptionsMenu onLogin={this.onLogin} onLogout={this.onLogout} />
            <MenuContainer>
              {services.map(service => this.showService(service))}
            </MenuContainer>
          </ScrollView>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  };
}
