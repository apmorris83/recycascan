import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {},
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      centres: []
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('userDetails', (err, result) => {
      let val = JSON.parse(result);
      this.setState({
        userDetails: val
      }, () => {
        axios
          .get(`http://postcodes.io/postcodes/${this.state.userDetails.postcode}`)
          .then((res) => {
            this.setState({
              region: {
                latitude: res.data.result.latitude,
                longitude: res.data.result.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }
            })
          })
          .catch((err) => {
            console.log(err)
          });
      });
    });
    axios
      .get('https://vast-eyrie-43528.herokuapp.com/api/recyclingcentres')
      .then((res) => {
        this.setState ({
          centres: res.data.recyclingcentres
        })
      })
      .catch((err) => {
        console.log(err)
      });

  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
        >
          {this.state.centres.map((centre, i) => {
            return (
              <MapView.Marker
                key={i}
                coordinate={{ latitude: centre.latitude, longitude: centre.longitude }}
                title={centre.title}
              />
            );
          })}

        </MapView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});