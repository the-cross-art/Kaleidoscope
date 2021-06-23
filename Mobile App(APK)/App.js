import * as React from "react";
import { WebView } from "react-native-webview";

export default class App extends React.Component {
  render() {
    return (
      <WebView
        source={{ uri: "https://the-cross-art.github.io/Kaleidoscope/" }}
        style={{ marginTop: 20 }}
      />
    );
  }
}
