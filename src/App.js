import React from "react";
import Moment from "moment";
import "moment-timezone";
import tz from "zipcode-to-timezone";
import "./App.css";

const APP_KEY = "appid=0e715fd6e4dd427ee64eeda6aab95586";

class App extends React.Component {
  state = {};

  getTime = () => {
    let timeZone = tz.lookup(this.state.zip);
    let time = Moment().tz(timeZone).format("dddd, MMMM Do YYYY, h:mm:ss a");

    this.setState({
      currentTime: time,
    });
  };

  weather = () => {
    let zip = document.getElementById("zipcode").value;

    fetch(
      "http://api.openweathermap.org/data/2.5/weather?zip=" +
        zip +
        ",us" +
        "&units=imperial&" +
        APP_KEY
    )
      .then((response) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        // Examine the text in the response
        response.json().then((data) => {
          console.log(data);
          this.setState({
            zip: zip,
            city: data.name,
            forecast: data.weather[0].main,
            temp: data.main.temp,
            feelsLike: data.main.feels_like,
            iconUrl:
              "http://openweathermap.org/img/w/" +
              data.weather[0].icon +
              ".png",
          });

          this.refs.clear.value = "";

          this.getTime();
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container header">
          <div className="row headerRow">
            <h1>What's My Weather?</h1>
          </div>

          <div className="row headerRow">
            <input type="text" id="zipcode" ref="clear" />
            <button onClick={this.weather}>Get Weather by Zipcode</button>
          </div>
          <div className="row headerRow">
            <input type="text" id="city" ref="clear" />
            <button onClick={this.cityWeather}>Get Weather by City</button>
          </div>
          <div className="row headerRow">
            <h3>{this.state.currentTime}</h3>
          </div>
        </div>

        <div className="container weather">
          <div className="row">
            <div className="card">
              <div>
                <span>City: {this.state.city}</span>
                <br />
                <img src={this.state.iconUrl} />
                <br />
                <span>Forecast: {this.state.forecast}</span>
                <br />
                <span>Temperature: {Math.round(this.state.temp)} </span>
                <br />
                <span>
                  What it actually feels like:{" "}
                  {Math.round(this.state.feelsLike)}
                </span>
                <br />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
