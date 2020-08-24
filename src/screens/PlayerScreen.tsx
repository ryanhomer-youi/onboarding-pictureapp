import React, { Component, createRef, RefObject } from 'react';
import {
  InteractionManager,
  NativeEventEmitter,
  NativeEventSubscription,
  NativeModules,
  StyleSheet,
  View,
} from 'react-native';
import {
  ButtonRef,
  Composition,
  FocusManager,
  TextRef,
  TimelineRef,
  VideoRef,
  ViewRef,
} from '@youi/react-native-youi';
import { NavigationScreenProp } from 'react-navigation';
import { formatMsToHMS } from '../helpers';

interface Props {
  navigation: NavigationScreenProp<any>;
}

interface PlayerState {
  playbackState: 'ready' | 'buffering' | 'paused' | 'playing' | null;
  mediaState: 'ready' | 'preparing' | null;
}

interface State {
  playerState: PlayerState;
  currentTime: number;
  movieDuration: number;
}

interface NativePlayerStateChangedEvent {
  nativeEvent : PlayerState;
}

const UserInteractionEmitter = new NativeEventEmitter(NativeModules.InteractionModule);

const PLATFORM = NativeModules.PlatformConstants.platform;
console.log(PLATFORM);

const SOURCES = {
  android: {
    uri: 'https://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)',
    type: 'DASH',
  },
  osx: {
    uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'HLS',
  },
};

type Composition = typeof Composition;
type TimelineRef = typeof TimelineRef;
type Timeout = ReturnType<typeof setTimeout>;

class PlayerScreen extends Component<Props, State> {
  playerRef: RefObject<Composition>;
  controlsRef: RefObject<Composition>;
  scrubberTimelineInRef: RefObject<TimelineRef>;
  scrubberTimelineOutRef: RefObject<TimelineRef>;
  scrollBarTimelineRef: RefObject<TimelineRef>;
  playPauseTimelineInRef: RefObject<TimelineRef>;
  playPauseTimelineOutRef: RefObject<TimelineRef>;
  playPauseButtonToggleOnTimelineRef: RefObject<TimelineRef>;
  playPauseButtonToggleOffTimelineRef: RefObject<TimelineRef>;
  backBtnTimelineInRef: RefObject<TimelineRef>;
  backBtnTimelineOutRef: RefObject<TimelineRef>;
  mainControlsTimelineInRefs: RefObject<TimelineRef>[];
  mainControlsTimelineOutRefs: RefObject<TimelineRef>[];
  controlsTimer: Timeout | null;
  eventEmitter?: NativeEventSubscription;

  constructor(props: Props) {
    super(props);
    this.controlsTimer = null;

    this.playerRef = createRef();
    this.controlsRef = createRef();
    this.scrubberTimelineInRef = createRef();
    this.scrubberTimelineOutRef = createRef();
    this.scrollBarTimelineRef = createRef();
    this.playPauseTimelineInRef = createRef();
    this.playPauseTimelineOutRef = createRef();
    this.playPauseButtonToggleOnTimelineRef = createRef();
    this.playPauseButtonToggleOffTimelineRef = createRef();
    this.backBtnTimelineInRef = createRef();
    this.backBtnTimelineOutRef = createRef();

    this.mainControlsTimelineInRefs = [
      this.scrubberTimelineInRef,
      this.playPauseTimelineInRef,
      this.backBtnTimelineInRef,
    ];

    this.mainControlsTimelineOutRefs = [
      this.scrubberTimelineOutRef,
      this.playPauseTimelineOutRef,
      this.backBtnTimelineOutRef,
    ];

    this.state = {
      playerState: {
        playbackState: null,
        mediaState: null,
      },
      currentTime: 0,
      movieDuration: 0,
    };
  }

  showControls = () => {
    if (this.controlsTimer) {
      // reset timer
      clearTimeout(this.controlsTimer);
    } else {
      // show controls
      this.mainControlsTimelineInRefs.forEach(t => t.current.play());
    }
    this.controlsTimer = setTimeout(this.hideControls, 4000);
  };

  hideControls = () => {
    if (this.controlsTimer) {
      this.mainControlsTimelineOutRefs.forEach(t => t.current.play());
      this.controlsTimer = null;
    }
  };

  playPause = () => {
    const {
      state: {
        playerState: {
          playbackState,
          mediaState,
      } },
    } = this;

    if (!this.playerRef.current) return;

    if (mediaState === 'ready') {
      switch (playbackState) {
        case 'paused':
          this.playerRef.current.play();
          this.playPauseButtonToggleOnTimelineRef.current.play();
          break;
        case 'playing':
          this.playerRef.current.pause();
          this.playPauseButtonToggleOffTimelineRef.current.play();
          break;
      }
    }
  };

  onCurrentTimeUpdated = (currentTime: number) => {
    this.setState({ currentTime });
    if (this.state.movieDuration) {
      this.scrollBarTimelineRef.current.seek(currentTime / this.state.movieDuration);
    }
  };

  shouldDisablePlayPauseButton = () => {
    return this.state.playerState.mediaState !== 'ready';
  };

  setUpEventHandlers = () => {
    console.log('setUpEventHandlers');

    // start listening for events emitted from native layer
    this.eventEmitter = UserInteractionEmitter.addListener('USER_INTERACTION', this.showControls);

    // start listening for events
    NativeModules.InteractionModule.startListening();
  }

  tearDownEventHandlers = () => {
    console.log('tearDownEventHandlers');

    // stop listening for events
    NativeModules.InteractionModule.stopListening();

    // shutdown our event emitter listener
    if (this.eventEmitter) {
      this.eventEmitter.remove();
    }
  };

  onPlayerStateChanged = (event: NativePlayerStateChangedEvent) => {
    const { nativeEvent: playerState } = event;
    console.log(playerState);
    this.setState({ playerState });
  };

  onDurationChanged = (duration: number) => {
    this.setState({ movieDuration: duration });
  };

  onReady = () => {
    this.playPause();
  };

  onErrorOccurred = (error: any) => {
    console.log({
      errorCode: error.nativeEvent.errorCode,
      nativePlayerErrorCode: error.nativeEvent.nativePlayerErrorCode,
      errorMessage: error.nativeEvent.message,
    });
  };

  onPlayPauseButtonCompositionDidLoad = (ref: RefObject<typeof ButtonRef>) => {
    FocusManager.focus(ref);
  };

  onBackButtonPress = () => {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.setUpEventHandlers();
    InteractionManager.runAfterInteractions(() => {
      FocusManager.setFocusRoot(this.controlsRef.current, true);
    });
  }

  componentWillUnmount() {
    this.playerRef.current.stop();
    this.hideControls();
    this.tearDownEventHandlers();
  }

  render() {
    const formattedTime = formatMsToHMS(this.state.currentTime);

    return (
      <View style={styles.container}>
        <Composition source="Player_VideoRef">
          <VideoRef
            ref={this.playerRef}
            name="Video-Surface-View"
            source={SOURCES[PLATFORM]}
            onReady={this.onReady}
            onStateChanged={this.onPlayerStateChanged}
            onDurationChanged={this.onDurationChanged}
            onCurrentTimeUpdated={this.onCurrentTimeUpdated}
            onErrorOccurred={this.onErrorOccurred}
          />
        </Composition>
        <Composition
          ref={this.controlsRef}
          source="Player_Playback-Controls"
          style={styles.controls}
        >
          <TimelineRef
            ref={this.scrubberTimelineInRef}
            name="In"
          />
          <TimelineRef
            ref={this.scrubberTimelineOutRef}
            name="Out"
          />
          <ViewRef name="Player-Scrubber">
            <ViewRef name="Player-ScrollBar">
              <TimelineRef
                ref={this.scrollBarTimelineRef}
                name="ScrollStart"
              />
            </ViewRef>
          </ViewRef>
          <TextRef name="Placeholder-Time" text={formattedTime} />
          <ViewRef name="PlayPause-Container">
            <TimelineRef
              ref={this.playPauseTimelineInRef}
              name="In"
            />
            <TimelineRef
              ref={this.playPauseTimelineOutRef}
              name="Out"
            />
            <ButtonRef
              name="Btn-PlayPause"
              onPress={this.playPause}
              // disabled={this.shouldDisablePlayPauseButton()}
              onCompositionDidLoad={this.onPlayPauseButtonCompositionDidLoad}
            >
              <TimelineRef
                ref={this.playPauseButtonToggleOnTimelineRef}
                name="Toggle-On"
              />
              <TimelineRef
                ref={this.playPauseButtonToggleOffTimelineRef}
                name="Toggle-Off"
              />
            </ButtonRef>
          </ViewRef>
          <ViewRef name="Btn-Back-Container">
            <TimelineRef
              ref={this.backBtnTimelineInRef}
              name="In"
            />
            <TimelineRef
              ref={this.backBtnTimelineOutRef}
              name="Out"
            />
            <ButtonRef
              name="Btn-Back"
              onPress={this.onBackButtonPress}
            />
          </ViewRef>
        </Composition>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
  },
});

export default PlayerScreen;
