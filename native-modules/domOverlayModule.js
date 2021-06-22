import React from 'react';
import ReactDOM from 'react-dom';
import { Module } from 'react-vr-web';

import WebInformation from '../components/Information/WebInformation';
import WebLoading from '../components/Loading/WebLoading';

class DomOverlayModule extends Module {

    constructor(overlayContainer) {
        super('DomOverlayModule');
        this._overlayContainer = overlayContainer;
    }

    openInformation(props) {
        window._rayCastersController.turnOffRayCasters();

        ReactDOM.render(
            <WebInformation {...props} onClose={() => this.closeOverlay()} />,
            this._overlayContainer,
        );
    }

    loading(props = {}) {
        ReactDOM.render(
            <WebLoading {...props} />,
            this._overlayContainer,
        );
    }

    closeOverlay() {
        window._rayCastersController.turnOnRayCasters();

        ReactDOM.unmountComponentAtNode(this._overlayContainer);
    }

}

export default DomOverlayModule;
