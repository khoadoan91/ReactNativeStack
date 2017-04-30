import Expo from 'expo';
import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';

import Deck from './src/Deck';
import { fetchData } from './src/actions';


class App extends React.Component {
  state = { data: [] };

  renderCard(item) {
    return (
      <Card
        key={item.id}
        title={item.text}
        image={{ uri: item.uri }}
      >
        <Text style={{marginBottom: 10}}>I can customize the card further</Text>
        <Button 
          icon={{ name: 'code' }} 
          backgroundColor="#03A9F4"
          title="View Now!"
        />
      </Card>
    );
  }

  renderNoMoreCards() {
    return (
      <Card title="All Done!">
        <Text style={{marginBottom: 10}}>There is no more content here!</Text>
        <Button 
          backgroundColor="#03A9F4"
          title="Get More!"
        />
      </Card>
    )
  }

  componentWillMount() {
    this.setState({ data: fetchData() });
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck 
          data={this.state.data} 
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
          onSwipeRight={() => {}}
          onSwipeLeft={() => {}} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
};

Expo.registerRootComponent(App);
