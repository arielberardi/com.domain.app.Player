/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metroconsoleical
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Utils, VideoPlayer } from '@lightningjs/sdk'
import Button from './components/Button'
import { hlsUnloader, hlsLoader } from './lib/hls'

export default class App extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0xff000000,
        MovieTile: {
          x: window.innerWidth / 2,
          y: 250,
          w: 300,
          h: 400,
          mount: 0.5,
          src: Utils.asset('images/big_buck_bunny_poster.jpg'),
        },
        PlayButton: {
          x: window.innerWidth / 2 - 200,
          y: window.innerHeight / 2,
          type: Button,
          label: 'Play',
        },
        ExitButton: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          type: Button,
          label: 'Exit',
        },
      },
    }
  }

  get Background() {
    return this.tag('Background')
  }

  _init() {
    this._setState('Menu')

    VideoPlayer.consumer(this)
    VideoPlayer.loader(hlsLoader)
    VideoPlayer.unloader(hlsUnloader)
  }

  _startVideo() {
    const playerSettings = { debug: true }

    VideoPlayer.area(0, 0, 100, 100)
    VideoPlayer.open(
      'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      playerSettings,
    )

    console.info('Video playing with HLS.js player')
  }

  $videoPlayerError(data) {
    console.error('Error playing video', data)
  }

  $videoPlayerEvent(event, eventData) {
    console.info({ event, eventData })
  }

  $videoPlayerPlaying() {
    this.Background.visible = false
  }

  $videoPlayerEnded() {
    this._setState('Menu')
  }

  static _states() {
    return [
      class Menu extends this {
        $enter() {
          this.Background.visible = true
          this._focusedElement = this.tag('PlayButton')
        }

        $exit() {
          this.Background.visible = false
        }

        _handleLeft() {
          this._focusedElement = this.tag('PlayButton')
        }

        _handleRight() {
          this._focusedElement = this.tag('ExitButton')
        }

        _getFocused() {
          return this._focusedElement
        }

        _handleEnter() {
          if (this._focusedElement === this.tag('PlayButton')) {
            this._setState('Video')
          } else {
            console.log('Exit button')
          }
        }
      },
      class Video extends this {
        $enter() {
          this._startVideo()
        }

        $exit() {
          VideoPlayer.clear()
        }

        _handleEnter() {
          VideoPlayer.playPause()
        }

        _handleRight() {
          VideoPlayer.skip(10)
        }

        _handleLeft() {
          VideoPlayer.skip(-10)
        }

        _handleBack() {
          this._setState('Menu')
        }
      },
    ]
  }
}
