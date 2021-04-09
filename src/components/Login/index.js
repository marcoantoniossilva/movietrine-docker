import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

import {GoogleSignin} from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/AntDesign';
import SyncStorage from 'sync-storage';

export const SIGNERS = {
  Google: 'Google',
  None: 'None',
};

export const ERRORS = {
  NO_SIGNER: 'Falha de configuração do autenticador',
  NO_SIGNED_USER: 'Nenhum usuário encontrado',
  FAILED_TO_SIGNIN: 'Login falhou',
  FAILED_TO_SIGOUT: 'Logout falhou',
};

export const ConfigureGoogleSigner = () => {
  GoogleSignin.configure({
    webClientId:
      '991994455550-o0dibd786qeqd074lh13hdg2mqpq4ns8.apps.googleusercontent.com',
    offlineAccess: false,
  });
};

export const FromGoogleUserToUser = (guser, signer) => {
  const user = {
    name: guser.user.name,
    account: guser.user.email,
    signer: signer,
  };

  return user;
};

export const SignIn = async signer => {
  if (signer === SIGNERS.Google) {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();

      return Promise.resolve(signer);
    } catch (error) {
      return Promise.reject(error);
    }
  } else {
    return Promise.reject(ERRORS.NO_SIGNER);
  }
};

export const GetSignedUser = async signer => {
  if (signer == SIGNERS.Google) {
    const user = await GoogleSignin.getCurrentUser();

    return Promise.resolve(fromGoogleUserToUser(user, signer));
  } else {
    return Promise.reject(ERRORS.NO_SIGNER);
  }
};

export const IsSignedIn = async signer => {
  if (signer === SIGNERS.Google) {
    const is = await GoogleSignin.isSignedIn();

    if (is) {
      const user = await GoogleSignin.getCurrentUser();

      return Promise.resolve(FromGoogleUserToUser(user, signer));
    } else {
      return Promise.reject(ERRORS.NO_SIGNED_USER);
    }
  } else {
    return Promise.reject(ERRORS.NO_SIGNER);
  }
};

export const SignOut = async signer => {
  if (signer === SIGNERS.Google) {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      return Promise.resolve(signer);
    } catch (error) {
      return Promise.reject(error);
    }
  } else {
    return Promise.reject(ERRORS.NO_SIGNER);
  }
};

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signer: this.props.signer,

      onLogin: this.props.onLogin,
    };
  }

  componentDidMount() {
    const {signer} = this.state;

    if (signer === SIGNERS.Google) {
      ConfigureGoogleSigner();
    }
  }

  getSignedUser() {
    const {signer, onLogin} = this.state;

    IsSignedIn(signer)
      .then(user => {
        SyncStorage.set('user', user);

        if (onLogin) {
          onLogin(user);
        }
      })
      .catch(error => {
        if (error !== ERRORS.NO_SIGNED_USER) {
          console.error(error);
        }
      });
  }

  signUserIn() {
    const {signer} = this.state;

    SignIn(signer)
      .then(() => {
        this.getSignedUser();
      })
      .catch(error => {
        console.error('Erro de autenticação: ' + error);
      });
  }

  showGoogleSignInButton() {
    return (
      <Button
        title={' Login'}
        icon={<Icon name={'google'} size={22} color={'#fff'} />}
        type={'solid'}
        buttonStyle={{backgroundColor: '#404254'}}
        onPress={() => {
          this.signUserIn();
        }}
      />
    );
  }

  render() {
    const {signer} = this.state;

    if (signer === SIGNERS.Google) {
      return this.showGoogleSignInButton();
    } else {
      return null;
    }
  }
}

export class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signer: this.props.signer,

      onLogout: this.props.onLogout,
    };
  }

  componentDidMount() {
    const {signer} = this.state;

    if (signer === SIGNERS.Google) {
      ConfigureGoogleSigner();
    }
  }

  signUserOut() {
    const {signer, onLogout} = this.state;

    SignOut(signer)
      .then(() => {
        SyncStorage.remove('user');

        if (onLogout) {
          onLogout(signer);
        }
      })
      .catch(error => {
        console.error('Erro de autenticação. Error: ' + error);
      });
  }

  render() {
    return (
      <Button
        icon={<Icon name={'logout'} size={22} color={'#fff'} />}
        title={' Desconectar'}
        type={'solid'}
        buttonStyle={{backgroundColor: '#404254'}}
        onPress={() => {
          this.signUserOut();
        }}
      />
    );
  }
}

export class LoginOptionsMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {onLogin, onLogout} = this.props;
    const user = SyncStorage.get('user');

    if (user) {
      return (
        <View style={{padding: 5, backgroundColor: '#404254'}}>
          <Logout signer={user.signer} onLogout={onLogout} />
        </View>
      );
    } else {
      let key = 0;
      return Object.values(SIGNERS).map(signer => {
        if (signer !== 'None') {
          return (
            <View style={{padding: 5, backgroundColor: '#404254'}} key={++key}>
              <Login signer={signer} onLogin={onLogin} />
            </View>
          );
        }
      });
    }
  }
}
