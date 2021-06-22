import React from 'react';
import { asset, VrButton, Image, Animated } from 'react-vr';
import { GazeButton } from '../.';

import styles from './styles';

class LabelButton extends React.Component {

    constructor() {
        super();
        this.state = { scale: new Animated.Value(1) };
    }

    mouseIn() {
        Animated.timing(
            this.state.scale,
            {
                toValue: 1.5,
                duration: 100
            }
        ).start();
    }

    mouseOut() {
        Animated.timing(
            this.state.scale,
            {
                toValue: 1,
                duration: 500
            }
        ).start();
    }

    render() {
        const { style, icon, onClick } = this.props;

        return (
            <Animated.View
                onEnter={() => this.mouseIn()}
                onExit={() => this.mouseOut()}
                style={[
                    style,
                    { transform: [{ scale: this.state.scale }] }
                ]}
            >
                <GazeButton
                    style={styles.btn}
                    onClick={() => onClick()}
                    onEnterSound={asset('audio/hover-1.wav')}
                >
                    <Image
                        source={asset(icon)}
                        style={styles.icon}
                    />
                </GazeButton>
            </Animated.View>
        );
    }
}

export default LabelButton;