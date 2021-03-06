import React, {Component} from 'react'
import MuteControl from './MuteUser';

export default class VolumeControl extends Component {
  constructor(props){
        super(props);
        this.state = ({volume: ""});
        this.handleChange = this.handleChange.bind(this);
        this.fetchVolumeData = this.fetchVolumeData.bind(this);
    }

  handleChange = (event) => {
          var ref = JSON.parse(JSON.parse(window.localStorage.getItem('persist:polls'))['auth'])['access']['token'];
          if(this.connection.OPEN){
            var data_format =  {
            'url': "",
            'volume': event.target.value,
            'duration': "",
            'seek': "",
            'play': "",
            'mute': "",
            'message': "",
            'dj': "",
            'title': "",
            'token': ref        }
            this.connection.send(JSON.stringify(data_format));
}}
  fetchVolumeData(){
        fetch('http://'+window.location.hostname+':8000/api/song/').then((result) => { 
            return result.json();
        }).then((jsonResult) => {
            this.setState({ volume: jsonResult['volume']});
        })
        }

  componentDidMount(){
        this.fetchVolumeData();
        this.connection = new WebSocket('ws://'+window.location.hostname+':8000/ws/stream/');
        this.connection.onopen = (e) => {console.log('Volume Socket connected Successfully')}

        this.connection.onmessage = (e) => {
        var data = JSON.parse(e.data); 
        var volume = data['volume'];
        (volume === "") ? void(0) : this.setState({ volume: volume })
    };
}
  
  componentWillUnmount() {
        this.connection.onclose  = function(e){
        console.error('Volume Socket Closed!!');
    };
    }

  render() {

    return (
       <span>
            <div><input type="range" min="0" max="100" value={this.state.volume} onChange={this.handleChange} id="mute-control"/></div>
            <div><MuteControl />{this.state.volume}</div>
       </span> 
    )
  }
}
