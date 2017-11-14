import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { addEntry, receiveEntries } from '../actions/index';
import { getDailyReminderValue, timeToString } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';
import { white } from '../utils/colors';
import { AppLoading } from 'expo';

import UdacifitnessCalendar from 'udacifitness-calendar';
import MetricCard from './MetricCard';

import DateHeader from './DateHeader';

class History extends Component {
  state = {
    ready: false
  };

  componentDidMount() {
    const {dispatch} = this.props;

    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({entries}) => {
        if (!entries[timeToString()]) {
          dispatch(addEntry({
            [timeToString()]: getDailyReminderValue()
          }))
        }
      })
      .then(() => this.setState(() => ({ready: true})))
      .then(() => this.setState(() => ({
        ready: true
      })));
  }

  renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View style={styles.item}>
      {today
        ? <View>
          <DateHeader date={formattedDate}/>
          <Text style={styles.noDataText}>
            {today}
          </Text>
        </View>
        : <TouchableOpacity onPress={() => this.props.navigation.navigate(
          'EntryDetail',
          { entryId: key}
        )}>
          <MetricCard metrics={metrics} date={formattedDate}/>
        </TouchableOpacity>
      }
    </View>
  );

  renderEmptyDate(formattedDate) {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate}/>
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    )
  }

  render() {
    const { ready } = this.state;
    const {entries} = this.props;

    if(ready === false) {
      return <AppLoading/>
    }

    return (
      <UdacifitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    }
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  }

});


function mapStateToProps(entries) {
  return {
    entries
  }
}

export default connect(mapStateToProps)(History);