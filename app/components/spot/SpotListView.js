import React from 'react'
import SpotListItem from './SpotListItem'
import Search from './components/Search'
import { connect } from 'react-redux'
import { getSpots } from '../../actions/spotActions'
import store from '../../store'

class SpotListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      spots: [],
      filteredSpots: []
    };
  }

  componentDidMount() {
    this.props.getSpots();
  }

  componentDidUpdate() {
    if(this.state.spots.length != this.props.spots.length){
      this.setState({
        spots: this.props.spots,
        filteredSpots: this.props.spots
      })
    }
  }

  doSearch(queryText) {
    let queryResult = []
    queryText = queryText.toLowerCase()
    this.state.spots.forEach(spot => {
      if(spot.name.toLowerCase().indexOf(queryText) != -1) {
        let found = queryResult.some(a => { return a.name === spot.name })
        if(!found) { queryResult.push(spot) }
      }
    })

    this.state.spots.forEach(spot => {
      spot.features.split(',').forEach(ft => {
        if(ft.toLowerCase().indexOf(queryText) != -1){
          let found = queryResult.some(a => { return a.name === spot.name })
          if(!found) { queryResult.push(spot) }
        }
      })
    })

    if(queryText == '') {
      queryResult = this.state.spots
    }

    this.setState({
      query: queryText,
      filteredSpots: queryResult
    })
  }
  render(){
    return(
      <div>
        <Search query={this.state.query} doSearch={this.doSearch.bind(this)} />
        <SpotListItem spots={this.state.filteredSpots}/>
      </div>
    );
  }
}

SpotListView.propTypes = {
  getSpots: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    spots: state.spots,
    filteredSpots: state.spots
  }
}

export default connect(mapStateToProps, { getSpots })(SpotListView);
