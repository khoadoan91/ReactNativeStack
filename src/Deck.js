import React from 'react';
import { 
    View, 
    Animated, 
    PanResponder, 
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

export default class extends React.Component {
    static defaultProps = {
        onSwipeLeft: () => {},
        onSwipeRight: () => {}
    }

    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    // swipe right
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    // swipe left
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });
        this.state = { index: 0 };
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.position, {
            toValue: { x: x * 1.2, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;

        const item = data[this.state.index];
        direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
        this.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }

    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-80deg', '0deg', '80deg']
        });
        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    }

    renderCards() {
        const { data } = this.props;
        if (this.state.index >= data.length) {
            return this.props.renderNoMoreCards();
        }
        return data.map((item, i) => {
            if (i < this.state.index) return null;
            if (i === this.state.index) {
                return (
                    <Animated.View 
                        key={item.id}
                        style={[ this.getCardStyle(), styles.cardStyle ]}
                        { ...this.panResponder.panHandlers }>
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return (
                <Animated.View 
                    key={item.id} 
                    style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}
                >
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        }).reverse();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
}